// vampjam — R2 upload Worker
// Accepts a POST with a recorded audio body and stores it in the vampjam-audio
// R2 bucket, returning the public URL so a session can point at it.
//
// ONE-TIME SETUP (Cloudflare dashboard → Workers & Pages → Create Worker,
// paste this in, then):
//   1. Settings → Bindings → add an R2 bucket binding:
//        Variable name: BUCKET      Bucket: vampjam-audio
//   2. Settings → Variables & Secrets, add:
//        PUBLIC_BASE   = https://pub-33cfd8558d314eb58642c8550608850b.r2.dev
//        UPLOAD_SECRET = (any long random string you make up)
//   3. Deploy. Copy the worker URL (…workers.dev).
//   4. In admin.html set WORKER_UPLOAD_URL to that URL and UPLOAD_SECRET to the
//      same string you chose above.
//
// The client (record.html / admin.html recorder) POSTs the audio blob with:
//   Content-Type: audio/mp4 | audio/webm
//   X-File-Name:  desired file name
//   X-Upload-Secret: the shared secret
//
// part_upload — a long take is bigger than one request is allowed to be. A
// 2h41m recording is ~150 MB; Cloudflare stops a request body at 100 MB, and
// this worker used to read the whole body into memory in a 128 MB box, which
// is the same wall from the inside. So there is a second way in, in pieces:
//   POST ?op=init                 headers as above         -> { uploadId, key }
//   POST ?op=part&key=&id=&n=     body = piece n (8 MB)    -> { partNumber, etag }
//   POST ?op=done&key=&id=        body = { parts:[{partNumber, etag}] } -> { ok, url }
//   POST ?op=abort&key=&id=
// The plain POST with no ?op still works exactly as before, for small files
// and for any client that has not been updated.

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Upload-Secret, X-File-Name',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors);

    if (env.UPLOAD_SECRET && request.headers.get('X-Upload-Secret') !== env.UPLOAD_SECRET) {
      return json({ error: 'unauthorized' }, 401, cors);
    }

    const url = new URL(request.url);
    const op = url.searchParams.get('op');
    const base = (env.PUBLIC_BASE || '').replace(/\/+$/, '');
    const ctype = request.headers.get('Content-Type') || 'audio/mp4';

    function clean_name() {
      let name = (request.headers.get('X-File-Name') || ('rec_' + Date.now()))
        .replace(/[^A-Za-z0-9._-]/g, '_');
      if (!/\.[A-Za-z0-9]+$/.test(name)) name += ctype.includes('webm') ? '.webm' : '.m4a';
      return name;
    }
    function key_of() {
      const k = url.searchParams.get('key') || '';
      return /^[A-Za-z0-9._-]+$/.test(k) ? k : null;
    }

    try {
      if (op === 'init') {
        const name = clean_name();
        const mpu = await env.BUCKET.createMultipartUpload(name, { httpMetadata: { contentType: ctype } });
        return json({ ok: true, uploadId: mpu.uploadId, key: mpu.key }, 200, cors);
      }

      if (op === 'part') {
        const key = key_of(), id = url.searchParams.get('id');
        const n = parseInt(url.searchParams.get('n') || '', 10);
        if (!key || !id || !(n >= 1 && n <= 10000)) return json({ error: 'part needs key, id, n' }, 400, cors);
        const body = await request.arrayBuffer();
        if (!body || body.byteLength === 0) return json({ error: 'empty part' }, 400, cors);
        const mpu = env.BUCKET.resumeMultipartUpload(key, id);
        const part = await mpu.uploadPart(n, body);
        return json({ ok: true, partNumber: part.partNumber, etag: part.etag, size: body.byteLength }, 200, cors);
      }

      if (op === 'done') {
        const key = key_of(), id = url.searchParams.get('id');
        if (!key || !id) return json({ error: 'done needs key, id' }, 400, cors);
        let parts = [];
        try { parts = (await request.json()).parts || []; } catch (e) {}
        if (!parts.length) return json({ error: 'done needs parts' }, 400, cors);
        const mpu = env.BUCKET.resumeMultipartUpload(key, id);
        const obj = await mpu.complete(parts.map(p => ({ partNumber: p.partNumber, etag: p.etag })));
        return json({ ok: true, name: key, size: obj.size, url: base ? base + '/' + key : null }, 200, cors);
      }

      if (op === 'abort') {
        const key = key_of(), id = url.searchParams.get('id');
        if (key && id) { try { await env.BUCKET.resumeMultipartUpload(key, id).abort(); } catch (e) {} }
        return json({ ok: true }, 200, cors);
      }

      // ---- the original one-shot path, unchanged ----
      const name = clean_name();
      const body = await request.arrayBuffer();
      if (!body || body.byteLength === 0) return json({ error: 'empty body' }, 400, cors);
      await env.BUCKET.put(name, body, { httpMetadata: { contentType: ctype } });
      return json({ ok: true, name, size: body.byteLength, url: base ? base + '/' + name : null }, 200, cors);
    } catch (err) {
      return json({ error: String(err && err.message || err) }, 500, cors);
    }
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

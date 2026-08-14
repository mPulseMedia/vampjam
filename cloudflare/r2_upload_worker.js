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
// The client (admin.html recorder) POSTs the audio blob with headers:
//   Content-Type: audio/mp4 | audio/webm
//   X-File-Name:  desired file name
//   X-Upload-Secret: the shared secret

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

    let name = (request.headers.get('X-File-Name') || ('rec_' + Date.now()))
      .replace(/[^A-Za-z0-9._-]/g, '_');
    const ctype = request.headers.get('Content-Type') || 'audio/mp4';
    if (!/\.[A-Za-z0-9]+$/.test(name)) name += ctype.includes('webm') ? '.webm' : '.m4a';

    const body = await request.arrayBuffer();
    if (!body || body.byteLength === 0) return json({ error: 'empty body' }, 400, cors);

    await env.BUCKET.put(name, body, { httpMetadata: { contentType: ctype } });

    const base = (env.PUBLIC_BASE || '').replace(/\/+$/, '');
    return json({ ok: true, name, size: body.byteLength, url: base ? base + '/' + name : null }, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

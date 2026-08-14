// vampjam — Cloudflare Pages Function: POST audio -> vampjam-audio R2 -> URL.
// Because the file is functions/upload.js, it serves at  <your-project>.pages.dev/upload
// once the Pages app deploys from the repo.
//
// ONE-TIME SETUP in the Pages project (dash.cloudflare.com -> Workers & Pages ->
// your vampjam project -> Settings):
//   Functions -> R2 bucket bindings:  variable BUCKET  ->  bucket vampjam-audio
//   Environment variables:
//       PUBLIC_BASE   = https://pub-33cfd8558d314eb58642c8550608850b.r2.dev
//       UPLOAD_SECRET = (a long random string you make up)
// Then set admin.html's WORKER_UPLOAD_URL to  <your-project>.pages.dev/upload
// and UPLOAD_SECRET to the same string.

export async function onRequestOptions() {
  return new Response(null, { headers: cors() });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (env.UPLOAD_SECRET && request.headers.get('X-Upload-Secret') !== env.UPLOAD_SECRET) {
    return json({ error: 'unauthorized' }, 401);
  }

  let name = (request.headers.get('X-File-Name') || ('rec_' + Date.now()))
    .replace(/[^A-Za-z0-9._-]/g, '_');
  const ctype = request.headers.get('Content-Type') || 'audio/mp4';
  if (!/\.[A-Za-z0-9]+$/.test(name)) name += ctype.includes('webm') ? '.webm' : '.m4a';

  const body = await request.arrayBuffer();
  if (!body || body.byteLength === 0) return json({ error: 'empty body' }, 400);

  await env.BUCKET.put(name, body, { httpMetadata: { contentType: ctype } });

  const base = (env.PUBLIC_BASE || '').replace(/\/+$/, '');
  return json({ ok: true, name, size: body.byteLength, url: base ? base + '/' + name : null }, 200);
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Upload-Secret, X-File-Name',
  };
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}

// vampjam_visit_worker.js — the play log.
//
// WHAT IT KEEPS: a random id the browser invented for itself, which recording,
// what happened (opened / played / how long it was heard), and when.
//
// Nobody is asked who they are and nothing stored here says who they are. The
// id is a coin flip made in the visitor's own browser; it never travels to
// another device, and clearing the browser turns that person into a new
// stranger. It is enough to say "these four plays were one person, not four",
// and it is not enough to say which person. That is the whole of what
// "separated" means here. No phone number, no name, no IP, no sign-in.
//
// SETUP (one time, dash.cloudflare.com — about five minutes):
//   1. Storage & Databases → KV → Create a namespace, call it  vampjam_visit
//   2. Workers & Pages → Create → Start from Hello World, name it  vampjam-visit
//   3. Edit code → select all → paste this whole file → Deploy
//   4. That worker → Settings → Bindings → Add → KV namespace
//        Variable name:  VISIT        KV namespace:  vampjam_visit
//      → Deploy again
//   5. Send me the worker URL (https://vampjam-visit.<subdomain>.workers.dev)
//
// Until step 4 is done the worker answers "no_store" and the site simply does
// not log; nothing on the site breaks while it waits.

const ORIGINS = [
  'https://vampsf.com',
  'https://www.vampsf.com',
  'https://mpulsemedia.github.io',
  'http://localhost',
  'null',
];
const DAY_CAP = 3000;        // events kept per day; beyond that the day stops growing
const KEEP_DAYS = 400;

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}
function json(obj, status, h) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { ...h, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
function day_of(ms) { return new Date(ms).toISOString().slice(0, 10); }
function clean(s, max) { return String(s == null ? '' : s).slice(0, max); }

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const h = cors(origin);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });

    const url = new URL(request.url);
    const op = url.searchParams.get('op') || '';

    if (!env.VISIT)
      return json({ ok: false, error: 'no_store',
                    why: 'the worker has no KV binding yet — finish step 4 of the setup' }, 503, h);

    // ---- one thing happened ----
    if (op === 'put') {
      if (request.method !== 'POST') return json({ error: 'POST only' }, 405, h);
      if (!ORIGINS.includes(origin)) return json({ error: 'forbidden origin' }, 403, h);
      const b = await request.json().catch(() => ({}));
      const e = clean(b.e, 8);
      if (['open', 'play', 'heard'].indexOf(e) < 0) return json({ error: 'unknown event' }, 400, h);
      const now = Date.now();
      const key = 'd:' + day_of(now);
      // one row: when, who (the coin flip), which recording, what, seconds
      const row = [now, clean(b.v, 24), clean(b.p, 80), e,
                   Math.max(0, Math.min(86400, Math.round(Number(b.s) || 0))),
                   b.mine ? 1 : 0];
      let list = [];
      try { list = JSON.parse(await env.VISIT.get(key) || '[]'); } catch (e2) {}
      if (!Array.isArray(list)) list = [];
      if (list.length < DAY_CAP) {
        list.push(row);
        await env.VISIT.put(key, JSON.stringify(list),
                            { expirationTtl: 60 * 60 * 24 * KEEP_DAYS });
      }
      return json({ ok: true }, 200, h);
    }

    // ---- show me the log ----
    if (op === 'get') {
      const days = Math.max(1, Math.min(400, parseInt(url.searchParams.get('days') || '60', 10)));
      const keys = [];
      const t0 = Date.now();
      for (let i = 0; i < days; i++) keys.push('d:' + day_of(t0 - i * 86400000));
      const got = await Promise.all(keys.map((k) => env.VISIT.get(k)));
      let rows = [];
      got.forEach((v) => {
        if (!v) return;
        try { const a = JSON.parse(v); if (Array.isArray(a)) rows = rows.concat(a); } catch (e3) {}
      });
      rows.sort((a, b) => b[0] - a[0]);          // newest first
      return json({ ok: true, rows }, 200, h);
    }

    if (op === 'status') return json({ ok: true, store: true }, 200, h);
    return json({ error: 'unknown op' }, 400, h);
  },
};

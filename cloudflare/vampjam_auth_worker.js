// vampjam — sign-in Worker
//
// Someone types their phone number, gets a text with a link, taps it, and is
// signed in on that phone. Which recordings they can then open is decided by
// access.json in the repo, which the admin page writes.
//
// ONE-TIME SETUP (Cloudflare dashboard → Workers & Pages → Create Worker,
// paste this in, then Settings → Variables & Secrets):
//   AUTH_SECRET      = a long random string you make up (32+ chars)
//   TWILIO_SID       = your Twilio Account SID   (starts AC...)
//   TWILIO_TOKEN     = your Twilio Auth Token
//   TWILIO_FROM      = your Twilio phone number, e.g. +14155551212
//   SITE             = https://vampsf.com
// Deploy, then put the worker URL in signin.html / drawer.js as AUTH_URL.
//
// There is NO database. A token is the payload plus an HMAC of it, so the
// worker can check its own tokens without storing anything. Two consequences,
// stated rather than hidden:
//   · a sign-in link works until it expires (10 minutes), not just once
//   · signing someone out everywhere means changing AUTH_SECRET
//
// And no phone number is ever written to the repo. access.json holds an opaque
// id — an HMAC of the number under AUTH_SECRET — plus a label and the last four
// digits, which is enough to administer and useless to anyone who reads it.

const LINK_TTL = 10 * 60;              // a sign-in link is good for ten minutes
const SESS_TTL = 60 * 60 * 24 * 60;    // a signed-in phone stays signed in ~2 months
const RAW = 'https://raw.githubusercontent.com/mPulseMedia/vampjam/main/access.json';

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const url = new URL(request.url);
    const op = url.searchParams.get('op') || '';
    const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {};
    const q = (k) => (body[k] !== undefined ? body[k] : url.searchParams.get(k)) || '';

    try {
      if (!env.AUTH_SECRET) return json({ error: 'worker not configured' }, 500, cors);

      // ---- who is this? ----
      if (op === 'me') {
        const who = await read_session(q('t'), env);
        if (!who) return json({ ok: true, signed_in: false }, 200, cors);
        const acc = await access();
        return json({ ok: true, signed_in: true, id: who.i, label: label_of(acc, who.i),
                      admin: is_admin(acc, who.i), allow: allowed_pages(acc, who.i) }, 200, cors);
      }

      // ---- send me a link ----
      if (op === 'start') {
        const phone = e164(q('phone'));
        if (!phone) return json({ error: 'that does not look like a phone number' }, 400, cors);
        const id = await hmac(env.AUTH_SECRET, 'p:' + phone);
        const acc = await access();
        // the list is small and private and everyone on it was invited by name,
        // so "you are not on the list" is the useful answer, not a leak
        if (!known(acc, id)) return json({ error: 'not_listed' }, 403, cors);
        const token = await sign(env.AUTH_SECRET, { i: id, k: 'link' }, LINK_TTL);
        const site = (env.SITE || 'https://vampsf.com').replace(/\/+$/, '');
        const link = site + '/signin.html?t=' + encodeURIComponent(token);
        const sent = await twilio(env, phone, 'vampSF sign-in: ' + link + '\n(good for 10 minutes)');
        if (!sent.ok) return json({ error: 'could not send the text: ' + sent.why }, 502, cors);
        return json({ ok: true, sent_to: mask(phone) }, 200, cors);
      }

      // ---- I tapped the link ----
      if (op === 'check') {
        const p = await verify(env.AUTH_SECRET, q('t'));
        if (!p || p.k !== 'link') return json({ error: 'that link has expired — ask for a new one' }, 400, cors);
        const acc = await access();
        if (!known(acc, p.i)) return json({ error: 'not_listed' }, 403, cors);
        const sess = await sign(env.AUTH_SECRET, { i: p.i, k: 'sess' }, SESS_TTL);
        return json({ ok: true, session: sess, label: label_of(acc, p.i),
                      admin: is_admin(acc, p.i), allow: allowed_pages(acc, p.i) }, 200, cors);
      }

      // ---- admin: turn a phone number into the opaque id access.json stores ----
      if (op === 'grant_id') {
        const who = await read_session(q('t'), env);
        const acc = await access();
        if (!who || !is_admin(acc, who.i)) return json({ error: 'admins only' }, 403, cors);
        const phone = e164(q('phone'));
        if (!phone) return json({ error: 'that does not look like a phone number' }, 400, cors);
        return json({ ok: true, id: await hmac(env.AUTH_SECRET, 'p:' + phone),
                      last4: phone.slice(-4) }, 200, cors);
      }

      // ---- bootstrap: the very first admin, once, while access.json has none ----
      if (op === 'claim_admin') {
        const acc = await access();
        if ((acc.admins || []).length) return json({ error: 'there is already an admin' }, 403, cors);
        const phone = e164(q('phone'));
        if (!phone) return json({ error: 'that does not look like a phone number' }, 400, cors);
        return json({ ok: true, id: await hmac(env.AUTH_SECRET, 'p:' + phone),
                      last4: phone.slice(-4) }, 200, cors);
      }

      return json({ error: 'unknown op' }, 400, cors);
    } catch (err) {
      return json({ error: String((err && err.message) || err) }, 500, cors);
    }

    // ---------- helpers ----------
    async function access() {
      const r = await fetch(RAW + '?v=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) return { admins: [], people: [], sessions: {} };
      const j = await r.json().catch(() => null);
      return (j && typeof j === 'object') ? j : { admins: [], people: [], sessions: {} };
    }
    async function read_session(t, e) {
      const p = await verify(e.AUTH_SECRET, t);
      return (p && p.k === 'sess') ? p : null;
    }
  },
};

function known(acc, id) {
  if ((acc.admins || []).indexOf(id) >= 0) return true;
  return (acc.people || []).some((p) => p && p.id === id);
}
function is_admin(acc, id) { return (acc.admins || []).indexOf(id) >= 0; }
function label_of(acc, id) {
  const p = (acc.people || []).find((x) => x && x.id === id);
  return (p && p.label) || 'you';
}
// which pages this id may open. A session nobody has restricted is open to
// everyone — the gate is opt-in, so nothing that worked yesterday stops working.
function allowed_pages(acc, id) {
  if (is_admin(acc, id)) return '*';
  const out = [];
  const s = acc.sessions || {};
  Object.keys(s).forEach((page) => {
    const rule = s[page] || {};
    if (rule.mode !== 'list' || (rule.allow || []).indexOf(id) >= 0) out.push(page);
  });
  return out;
}

// ---------- tokens: payload.signature, no storage ----------
function b64u(buf) {
  const s = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64u(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}
async function key_of(secret) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}
async function hmac(secret, msg) {
  return b64u(await crypto.subtle.sign('HMAC', await key_of(secret), new TextEncoder().encode(msg)));
}
async function sign(secret, payload, ttl) {
  const p = Object.assign({}, payload, { e: Math.floor(Date.now() / 1000) + ttl });
  const body = b64u(new TextEncoder().encode(JSON.stringify(p)));
  return body + '.' + (await hmac(secret, body));
}
async function verify(secret, token) {
  if (!token || token.indexOf('.') < 0) return null;
  const [body, sig] = token.split('.');
  const want = await hmac(secret, body);
  // constant-time-ish: compare every character, no early return
  if (sig.length !== want.length) return null;
  let bad = 0;
  for (let i = 0; i < sig.length; i++) bad |= sig.charCodeAt(i) ^ want.charCodeAt(i);
  if (bad) return null;
  let p = null;
  try { p = JSON.parse(new TextDecoder().decode(unb64u(body))); } catch (e) { return null; }
  if (!p || !p.e || p.e < Math.floor(Date.now() / 1000)) return null;
  return p;
}

// ---------- phone ----------
// US-shaped by default, because that is who is on the list; a number already
// written +<country><number> is taken as given.
function e164(raw) {
  let s = String(raw || '').trim();
  if (/^\+[1-9]\d{7,14}$/.test(s)) return s;
  s = s.replace(/\D/g, '');
  if (s.length === 10) return '+1' + s;
  if (s.length === 11 && s[0] === '1') return '+' + s;
  return null;
}
function mask(p) { return '(•••) •••-' + p.slice(-4); }

async function twilio(env, to, text) {
  if (!env.TWILIO_SID || !env.TWILIO_TOKEN || !env.TWILIO_FROM) {
    return { ok: false, why: 'Twilio is not configured on the worker' };
  }
  const form = new URLSearchParams({ To: to, From: env.TWILIO_FROM, Body: text });
  const r = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + env.TWILIO_SID + '/Messages.json', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(env.TWILIO_SID + ':' + env.TWILIO_TOKEN),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });
  if (r.ok) return { ok: true };
  const t = await r.text();
  let why = r.status + '';
  try { const j = JSON.parse(t); why = (j.message || why) + (j.code ? ' (' + j.code + ')' : ''); } catch (e) {}
  return { ok: false, why };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status, headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

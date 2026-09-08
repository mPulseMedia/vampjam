// vampjam — sign-in Worker
//
// One rule: a phone number gets you in, and you see the recordings your number
// is on. Nothing else. No text message, no link, no password, no waiting.
//
//   · nobody signed in yet → the first number to sign in becomes the
//     administrator, and sees everything
//   · after that → your number must be on a recording's list, and you see only
//     the recordings it is on
//   · the administrator adds numbers at the bottom of each recording
//
// Say the tradeoff out loud rather than implying a strength this does not have:
// anyone who knows a number on the list can sign in as that person. This keeps
// recordings away from strangers and search engines. It is not proof of who is
// holding the phone, and it is not a password.
//
// ONE SETTING (Cloudflare → Settings → Variables and Secrets):
//   AUTH_SECRET = a long random string you make up (32+ chars)
//
// No database. A token is the payload plus an HMAC of it. Changing AUTH_SECRET
// signs everybody out.
//
// And no phone number is ever written to the repo. access.json holds an opaque
// id — an HMAC of the number under AUTH_SECRET — plus a name and the last four
// digits, which is enough to administer and useless to anyone who reads it.

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
      // ---- how far along is this? ----
      // Answers even when nothing is configured, because "nothing is configured"
      // is exactly what the site needs to be able to say out loud. Booleans and
      // a masked number only — never a secret, never a token.
      if (op === 'status') {
        var acc0 = { admins: [], people: [], sessions: {} };
        try { acc0 = await access(); } catch (e0) {}
        var priv = Object.keys(acc0.sessions || {})
          .filter(function (k) { return ((acc0.sessions[k] || {}).allow || []).length; }).length;
        return json({
          ok: true, worker: true,
          secret: !!env.AUTH_SECRET,
          admins: (acc0.admins || []).length,
          people: (acc0.people || []).length,
          private: priv
        }, 200, cors);
      }

      // the commonest state of all while he is still setting up, and the one
      // that used to look like "it just does not stick": say which step it is.
      if (!env.AUTH_SECRET)
        return json({ error: 'no_secret',
                      why: 'the worker has no AUTH_SECRET yet — finish step C on the sign-in steps page' },
                    503, cors);

      // ---- who is this? ----
      // which recordings are private at all — no token needed, and no secret in
      // it. A page has to know whether IT is gated before it knows who is asking.
      if (op === 'shut') {
        const acc = await access();
        return json({ ok: true, shut: shut_pages(acc) }, 200, cors);
      }

      if (op === 'me') {
        const who = await read_session(q('t'), env);
        if (!who) return json({ ok: true, signed_in: false }, 200, cors);
        const acc = await access();
        return json({ ok: true, signed_in: true, id: who.i, label: label_of(acc, who.i),
                      admin: is_admin(acc, who.i), allow: allowed_pages(acc, who.i) }, 200, cors);
      }

      // ---- the whole sign-in: a number that is on a list is signed in ----
      // No round trip through a phone. If the number is recognised anywhere -
      // an admin, a named person, or on any one recording's list - it gets a
      // session. Unrecognised numbers are told so plainly rather than being
      // left to wonder whether a text is coming.
      if (op === 'enter') {
        const cand = await ids_for(env.AUTH_SECRET, q('phone'));
        if (!cand) return json({ ok: false, why: 'that does not look like a phone number' }, 200, cors);
        const acc = await access();
        const nobody = !(acc.admins || []).length;
        // the first number to sign in owns the place. The page writes it down;
        // the worker only says that it may, because the worker cannot write.
        if (nobody) {
          const sess0 = await sign(env.AUTH_SECRET, { i: cand.id, k: 'sess' }, SESS_TTL);
          return json({ ok: true, first: true, session: sess0, id: cand.id, id7: cand.id7,
                        last4: cand.last4, label: '', admin: true, allow: '*' }, 200, cors);
        }
        const id = settle(acc, cand);
        if (!id) return json({ ok: false, unknown: true,
                              why: 'that number is not on any recording yet' }, 200, cors);
        const sess = await sign(env.AUTH_SECRET, { i: id, k: 'sess' }, SESS_TTL);
        return json({ ok: true, session: sess, label: label_of(acc, id),
                      admin: is_admin(acc, id), allow: allowed_pages(acc, id) }, 200, cors);
      }

      // ---- the list itself, from the one origin that is definitely reachable ----
      // The page used to read access.json off vampsf.com directly. In his browser
      // that one fetch failed — "Failed to fetch" on a same-origin file, while
      // this worker answered fine from the same page. A content blocker, most
      // likely, on a file called access.json. Rather than guess at the rule, the
      // page can ask the worker, which already reads the same file and is
      // already talking to it. One origin, one failure mode.
      if (op === 'list') {
        const acc = await access();
        return json({ ok: true, admins: acc.admins || [], people: acc.people || [],
                      sessions: acc.sessions || {} }, 200, cors);
      }

      // ---- admin: many numbers at once, because he pastes them in a block ----
      // One call for a whole paste. Each line comes back with its id and last
      // four, or a note that it was not a number, so the page can show him what
      // it understood before anything is written.
      if (op === 'ids') {
        const acc = await access();
        const who = await read_session(q('t'), env);
        // "not really started" is the same test the page uses, and it has to be
        // here too or the page offers a start-over the worker then refuses. That
        // is what happened: one mistyped admin, no way to sign in as them, and
        // every add answered "admins only" — a locked door with a handle drawn
        // on it. In this state nothing is protected, so nothing is given away.
        const first = !(acc.admins || []).length;
        if (!first && !(who && is_admin(acc, who.i)))
          return json({ error: 'admins only' }, 403, cors);
        let list = body.phones;
        if (!Array.isArray(list)) list = String(q('phones') || '').split(/[\n,;]+/);
        if (list.length > 200) list = list.slice(0, 200);
        const out = [];
        for (const raw of list) {
          const line = String(raw || '').trim();
          if (!line) continue;
          const c = await ids_for(env.AUTH_SECRET, line);
          if (!c) { out.push({ line, ok: false }); continue; }
          out.push({ line, ok: true, phone_last4: c.last4,
                     label: label_from(line, c.last4),
                     id: c.id, id7: c.id7 });
        }
        return json({ ok: true, first, people: out }, 200, cors);
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
// known to the site at all: an admin, a named person, or on any one
// recording's list. The last is what makes "paste a number at the bottom of a
// session" enough on its own - he should not have to add someone twice.
// Turn what was typed into the id this site knows them by. A person is stored
// under one id; this finds them by either form, so an area code is optional at
// the door even though the list holds the full number's id.
function settle(acc, cand) {
  const want = [cand.id, cand.id7].filter(Boolean);
  const hit = (acc.people || []).find((p) => p && (want.indexOf(p.id) >= 0
                                               || (p.id7 && want.indexOf(p.id7) >= 0)));
  if (hit) return hit.id;
  const adm = (acc.admins || []).find((a) => want.indexOf(a) >= 0);
  if (adm) return adm;
  const s = acc.sessions || {};
  let found = null;
  Object.keys(s).forEach((page) => {
    ((s[page] || {}).allow || []).forEach((a) => { if (want.indexOf(a) >= 0) found = a; });
  });
  return found;
}
// a pasted line is often "Dave 415-555-1212" or "Dave <415 555 1212>": whatever
// is left when the number comes out is what he meant to call them.
function label_from(line, last4) {
  const rest = String(line || '')
    .replace(/[+()\-.\s]/g, ' ')
    .replace(/\d/g, ' ')
    .replace(/[<>,;:"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return rest || ('•••' + last4);
}
function label_of(acc, id) {
  const p = (acc.people || []).find((x) => x && x.id === id);
  return (p && p.label) || 'you';
}
// which recordings this id may open. The administrator sees everything. For
// anyone else: a recording becomes private the moment a number is added to it,
// and until then it is open to whoever has the link. So this returns the ones
// they were added to; everything with an empty list needs no permission at all
// and is not listed here.
function allowed_pages(acc, id) {
  if (is_admin(acc, id)) return '*';
  const out = [];
  const s = acc.sessions || {};
  Object.keys(s).forEach((page) => {
    if (((s[page] || {}).allow || []).indexOf(id) >= 0) out.push(page);
  });
  return out;
}
// the recordings that need permission at all: the ones with somebody on them.
// Everything else is open, so the page can decide without knowing who is asking.
function shut_pages(acc) {
  const s = acc.sessions || {};
  return Object.keys(s).filter((page) => ((s[page] || {}).allow || []).length);
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
// He types numbers the way people actually have them written down. Everything
// that is not a digit is punctuation as far as this is concerned: +1, spaces,
// dashes, dots, underscores, brackets, slashes. And a number stored with an
// area code has to be findable when it is typed WITHOUT one, so every number
// yields two forms and a match on either is a match.
//   full  — +1 415 555 1212, the number as it would be dialled
//   local — 5551212, the last seven digits, area code dropped
function phone_forms(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  if (!d) return null;
  let full = null;
  if (d.length === 11 && d[0] === '1') full = '+1' + d.slice(1);
  else if (d.length === 10) full = '+1' + d;
  else if (d.length > 11) full = '+' + d;                 // already international
  const local = d.length >= 7 ? d.slice(-7) : null;
  if (!full && !local) return null;
  return { full, local, last4: d.slice(-4) };
}
// the old name, kept because grant_id and claim_admin still speak it
function e164(raw) { const f = phone_forms(raw); return f && f.full; }

// the ids a typed number could be stored under. Two, so that a number added
// with its area code still answers to the seven digits on their own.
async function ids_for(secret, raw) {
  const f = phone_forms(raw);
  if (!f) return null;
  const out = { last4: f.last4, id: null, id7: null };
  if (f.full)  out.id  = await hmac(secret, 'p:' + f.full);
  if (f.local) out.id7 = await hmac(secret, 'l:' + f.local);
  if (!out.id) out.id = out.id7;         // seven digits alone: that IS the identity
  return out;
}

// ---------- the one reply shape ----------
function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status, headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

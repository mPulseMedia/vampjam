// gate_all_test — the whole thing, restated as he asked for it:
//   land on a page → sign in · first number in becomes the administrator ·
//   the administrator adds numbers at the bottom of a recording · everyone else
//   sees only the recordings their number is on.
// One rule instead of three, so this suite is the definition of the rule.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const SECRET = 'test_secret_long_enough_for_a_secret_0123456789';
let ACCESS = { admins: [], people: [], sessions: {} };
async function worker(op, body) {
  const src = fs.readFileSync(path.join(DIR, 'cloudflare/vampjam_auth_worker.js'), 'utf8');
  const real = global.fetch;
  global.fetch = async (u) => String(u).indexOf('access.json') >= 0
    ? { ok: true, json: async () => ACCESS } : real(u);
  try {
    const mod = await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));
    const res = await mod.default.fetch(
      { method: 'POST', url: 'https://w.example/?op=' + op, json: async () => body || {} },
      { AUTH_SECRET: SECRET });
    return await res.json();
  } finally { global.fetch = real; }
}

(async () => {
  // ---------- the rule, in the worker ----------
  ACCESS = { admins: [], people: [], sessions: {} };
  const first = await worker('enter', { phone: '917-693-0105' });
  ok('with nobody signed in, the first number is let in', first.ok === true, JSON.stringify(first).slice(0, 90));
  ok('and told it is the first',                first.first === true, first.first);
  ok('and given the administrator’s view',      first.admin === true && first.allow === '*', first.allow);
  ok('and handed the ids the page must write',  !!first.id && !!first.id7 && first.last4 === '0105',
     JSON.stringify({ id: !!first.id, id7: !!first.id7, l: first.last4 }));
  ok('and no phone number comes back with them',
     !JSON.stringify(first).includes('9176930105') && !JSON.stringify(first).includes('693'), 0);

  // the page writes it down; from then on there IS an administrator
  ACCESS = { admins: [first.id],
             people: [{ id: first.id, id7: first.id7, label: 'you', last4: '0105' }],
             sessions: {} };
  const again = await worker('enter', { phone: '(917) 693.0105' });
  ok('he signs in again, any spelling',         again.ok === true && again.admin === true, JSON.stringify(again.allow));
  ok('and is no longer "first"',                !again.first, again.first);

  const other = await worker('enter', { phone: '415-555-1212' });
  ok('a second number is refused, not made admin',
     other.ok === false && other.unknown === true, JSON.stringify(other));

  // the admin puts that number on ONE recording
  const made = await worker('ids', { t: again.session, phones: ['Dave 415-555-1212'] });
  ok('the administrator can turn numbers into ids', made.ok === true, JSON.stringify(made).slice(0, 80));
  const dave = made.people[0];
  ACCESS.people.push({ id: dave.id, id7: dave.id7, label: dave.label, last4: dave.phone_last4 });
  ACCESS.sessions['2026_08_14_sound_union.html'] = { allow: [dave.id] };
  const shut = await worker('shut', {});
  ok('only recordings with somebody on them count as private',
     shut.ok && shut.shut.length === 1 && shut.shut[0] === '2026_08_14_sound_union.html',
     JSON.stringify(shut));

  const din = await worker('enter', { phone: '4155551212' });
  ok('now that number gets in',                 din.ok === true, JSON.stringify(din).slice(0, 70));
  ok('and sees exactly the one recording',
     Array.isArray(din.allow) && din.allow.length === 1
     && din.allow[0] === '2026_08_14_sound_union.html', JSON.stringify(din.allow));
  ok('and is not an administrator',             din.admin === false, din.admin);
  const paul = await worker('enter', { phone: '9176930105' });
  ok('while the administrator still sees everything', paul.allow === '*', paul.allow);
  const nope = await worker('ids', { t: din.session, phones: ['212-555-0000'] });
  ok('a guest cannot add anyone',               nope.ok !== true, JSON.stringify(nope));

  // ---------- the rule, in the pages ----------
  const b = await chromium.launch();
  let ME = { ok: true, signed_in: false, allow: [] };
  let WROTE = null;
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route('**/*', async (r) => {
    const u = r.request().url();
    const J = (o) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
    if (/vampjam-sync/.test(u)) { WROTE = JSON.parse(r.request().postData() || '{}'); return J({ ok: true }); }
    if (/op=status/.test(u)) return J({ ok: true, worker: true, secret: true, admins: 1, people: 1, private: 1 });
    if (/op=list/.test(u)) return J(Object.assign({ ok: true }, ACCESS));
    if (/op=shut/.test(u)) return J({ ok: true, shut: Object.keys(ACCESS.sessions || {})
      .filter(k => ((ACCESS.sessions[k] || {}).allow || []).length) });
    if (/op=enter/.test(u)) return J({ ok: true, first: true, session: 'S', id: 'NEW', id7: 'NEW7',
                                       last4: '0105', admin: true, allow: '*' });
    if (/vampjam-auth/.test(u)) return J(ME);
    if (/access\.json/.test(u)) return J(ACCESS);
    if (u.startsWith('https://vampsf.com/')) {
      const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      const p = path.join(DIR, rel);
      if (fs.existsSync(p)) {
        const t = rel.endsWith('.css') ? 'text/css' : rel.endsWith('.js') ? 'application/javascript'
                : rel.endsWith('.json') ? 'application/json' : 'text/html';
        return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p) });
      }
      return r.fulfill({ status: 404, body: '' });
    }
    return r.fulfill({ status: 204, body: '' });
  });

  // ONLY a recording somebody was added to asks anything. He was explicit:
  // "only make recordings where I've added some number be private".
  ACCESS = { admins: ['A'], people: [{ id: 'A', label: 'you', last4: '0105' }],
             sessions: { '2026_08_14_sound_union.html': { allow: ['DAVE'] } } };
  let p = await ctx.newPage();
  await p.goto('https://vampsf.com/2026_07_31_sound_union.html');
  await p.waitForTimeout(1600);
  ok('a recording with nobody on it opens, signed out',
     /2026_07_31_sound_union\.html$/.test(p.url()), p.url());
  ok('and nothing is gated on it',
     await p.evaluate(() => !document.body.classList.contains('gated')));
  await p.close();

  p = await ctx.newPage();
  await p.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await p.waitForTimeout(1600);
  // It used to throw him at signin.html. Being bounced to another address when
  // you followed a link to a recording is a door slamming; the sign-in comes to
  // the page instead.
  const sent = p.url();
  ok('one with somebody on it keeps you where you were going',
     /2026_08_14_sound_union\.html$/.test(sent), sent);
  ok('and brings the sign-in to you, one field',
     await p.evaluate(() => {
       const el = document.getElementById('hello');
       return !!el && el.querySelectorAll('input').length === 1;
     }), await p.evaluate(() => !!document.getElementById('hello')));
  ok('with the player and the moments put away behind it',
     await p.evaluate(() => document.body.classList.contains('gated')));
  await p.close();

  p = await ctx.newPage();
  await p.goto('https://vampsf.com/signin.html');
  await p.waitForTimeout(900);
  ok('the sign-in page itself is not gated',    /signin\.html$/.test(p.url()), p.url());
  ok('and asks for one thing',                  await p.evaluate(() => !!document.getElementById('phone')));
  ok('and says that is the whole sign-in',
     /That is the whole sign-in/.test(await p.textContent('#lede')), await p.textContent('#lede'));
  await p.close();

  // the first sign-in writes the administrator down
  ACCESS = { admins: [], people: [], sessions: {} };
  p = await ctx.newPage();
  await p.goto('https://vampsf.com/signin.html');
  await p.waitForTimeout(700);
  await p.fill('#phone', '9176930105');
  await p.click('#go');
  await p.waitForTimeout(1200);
  const w = WROTE && JSON.parse(WROTE.content);
  ok('the first sign-in writes the list',       !!w && WROTE.path === 'access.json', WROTE && WROTE.path);
  ok('with that person as the administrator',   w.admins.length === 1 && w.admins[0] === 'NEW', JSON.stringify(w.admins));
  ok('and nothing shared with anyone yet',      Object.keys(w.sessions).length === 0, JSON.stringify(w.sessions));
  ok('and no phone number in it',               !JSON.stringify(w).includes('9176930105'), 0);
  await p.close();

  // signed in as a guest: the list holds only what is yours
  ACCESS = { admins: ['A'], people: [{ id: 'A', label: 'you', last4: '0105' }],
             sessions: { '2026_08_14_sound_union.html': { allow: ['G'] },
                         '2026_07_17_sound_union.html': { allow: ['OTHER'] } } };
  ME = { ok: true, signed_in: true, admin: false, allow: ['2026_08_14_sound_union.html'] };
  p = await ctx.newPage();
  await p.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await p.waitForTimeout(1800);
  await p.click('#page_sessions');
  await p.waitForTimeout(1800);
  const seen = await p.evaluate(() => [...document.querySelectorAll('.jam_item .jam_link')]
    .map(a => a.getAttribute('href')).filter(h => /^2026_/.test(h || '')));
  ok('a guest sees the open recordings and his own', seen.length > 1, seen.length);
  ok('and the private one he IS on',
     seen.some(h => /2026_08_14_sound_union/.test(h)), JSON.stringify(seen).slice(0, 90));
  ok('but not the private one he is NOT on',
     !seen.some(h => /2026_07_17_sound_union/.test(h)), JSON.stringify(seen).slice(0, 90));
  // The box no longer hides itself from a guest — hiding is how "nothing
  // happens" looked, and it looked the same to the owner. It is there, and it
  // says whose job this is.
  const gbox = await p.evaluate(() => {
    const el = document.getElementById('who_box');
    if (!el) return { box: false };
    const inp = document.getElementById('who_in');
    return { box: true, hidden: el.hidden, canType: !!inp && !inp.hidden,
             note: document.getElementById('who_note').textContent };
  });
  ok('the box is still on the page for a guest',
     gbox.box === true && gbox.hidden === false, JSON.stringify(gbox).slice(0, 120));
  ok('but there is nothing to add anyone with',
     gbox.canType === false, gbox.canType);
  ok('and it says whose job that is',
     /Only the administrator adds numbers/.test(gbox.note), gbox.note);
  await p.close();

  // signed in as the administrator: everything, and the box
  ME = { ok: true, signed_in: true, admin: true, allow: '*' };
  p = await ctx.newPage();
  await p.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await p.waitForTimeout(1800);
  await p.click('#page_sessions');
  await p.waitForTimeout(1800);
  const all = await p.evaluate(() => [...document.querySelectorAll('.jam_item .jam_link')]
    .map(a => a.getAttribute('href')).filter(h => /^2026_/.test(h || '')));
  ok('the administrator sees them all',         all.length > 3, all.length);
  ok('and gets the box at the bottom',
     await p.evaluate(() => { const el = document.getElementById('who_box'); return !!el && !el.hidden; }));
  ok('which no longer talks about open or private modes',
     !/anyone with the link/.test(await p.textContent('#who_box')), await p.textContent('#who_state'));
  await p.close();

  await b.close();
  console.log('\ngate_all: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

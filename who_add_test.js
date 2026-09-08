// who_add_test — twilio is gone. The number IS the key, and the list of numbers
// lives at the bottom of the recording it governs. Two halves here:
//   · the worker, run in node: does a number on a list get in, and does one that
//     is not on any list get told so rather than left waiting for a text
//   · the box on the page: paste a block of numbers however they came out of
//     Messages, see what it understood, and have the recording go private
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

// ---------- half one: the worker, for real ----------
const SECRET = 'test_secret_that_is_long_enough_to_be_a_secret';
let ACCESS = { admins: [], people: [], sessions: {} };
async function worker(op, params, body) {
  const src = fs.readFileSync(path.join(DIR, 'cloudflare/vampjam_auth_worker.js'), 'utf8');
  const url = 'https://w.example/?op=' + op + Object.keys(params || {})
    .map(k => '&' + k + '=' + encodeURIComponent(params[k])).join('');
  const real = global.fetch;
  global.fetch = async (u) => String(u).indexOf('access.json') >= 0
    ? { ok: true, json: async () => ACCESS }
    : real(u);
  try {
    const mod = await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));
    const req = { method: body ? 'POST' : 'GET', json: async () => body || {} };
    const res = await mod.default.fetch(Object.assign(req, { url }), { AUTH_SECRET: SECRET });
    return await res.json();
  } finally { global.fetch = real; }
}

(async () => {
  // the worker turns numbers into ids without ever being told who they are
  const ids = await worker('ids', {}, { phones: ['Dave 415 555 1212', '(650) 555-0000', 'not a number'] });
  ok('a pasted block comes back understood', ids.ok && ids.people.length === 3, JSON.stringify(ids).slice(0, 120));
  const good = (ids.people || []).filter(p => p.ok);
  ok('two of the three were phone numbers',  good.length === 2, good.length);
  ok('and the third is handed back, not dropped',
     (ids.people || []).some(p => !p.ok && /not a number/.test(p.line)), 0);
  ok('the name is kept off the number',      good[0].label === 'Dave', good[0].label);
  ok('a bare number gets its last four as a name', /0000$/.test(good[1].label), good[1].label);
  ok('only the last four digits come back',  good[0].phone_last4 === '1212' && !JSON.stringify(good[0]).includes('4155551212'),
     JSON.stringify(good[0]));
  ok('the id is opaque and not the number',  good[0].id.length > 20 && !/1212/.test(good[0].id), good[0].id);
  ok('the same number always makes the same id',
     (await worker('ids', {}, { phones: ['+1 415-555-1212'] })).people[0].id === good[0].id);

  // phone_loose — he pastes numbers the way people have them written down
  const forms = ['+1 415 555 1212', '(415) 555-1212', '415.555.1212', '415_555_1212',
                 '4155551212', '1-415-555-1212', '  415 555 1212  ', '+14155551212'];
  const made = (await worker('ids', {}, { phones: forms })).people;
  ok('every way of writing it lands on one id',
     made.length === forms.length && made.every(m => m.ok && m.id === good[0].id),
     made.map(m => m.ok ? m.id.slice(0, 6) : 'X').join(' '));
  ok('and it also gets an area-code-free id',
     !!good[0].id7 && good[0].id7 !== good[0].id, good[0].id7);
  ok('the seven digits alone make that same second id',
     (await worker('ids', {}, { phones: ['555-1212'] })).people[0].id === good[0].id7, 0);
  ok('the first paste is allowed with no admin', ids.first === true, ids.first);

  // the lockout, in the worker where it actually bit: one mistyped admin, no way
  // to sign in as them, and every add answered "admins only" — the page offered
  // a start-over the worker refused. Same "not really started" test both sides.
  const before = ACCESS;
  ACCESS = { admins: ['TYPO'], people: [{ id: 'TYPO', label: 'Paul', last4: '0105' }], sessions: {} };
  const lone = await worker('ids', {}, { phones: ['917-693-0105'] });
  ok('one mistyped admin and nothing private still lets a number in',
     lone.ok === true && lone.first === true, JSON.stringify(lone).slice(0, 90));
  ACCESS = { admins: ['A'], people: [{ id: 'A', label: 'Paul', last4: '0105' },
                                     { id: 'B', label: 'Dave', last4: '1212' }], sessions: {} };
  const two = await worker('ids', {}, { phones: ['917-693-0105'] });
  ok('two people on the list and it wants an admin again',
     two.ok !== true && /admins only/.test(two.error || ''), JSON.stringify(two));
  ACCESS = { admins: ['A'], people: [{ id: 'A', label: 'Paul', last4: '0105' }],
             sessions: { 'x.html': { mode: 'list', allow: ['A'] } } };
  const shut2 = await worker('ids', {}, { phones: ['917-693-0105'] });
  ok('one closed recording shuts it too',
     shut2.ok !== true && /admins only/.test(shut2.error || ''), JSON.stringify(shut2));
  ACCESS = before;

  // put one of them on one recording, and only that one
  ACCESS = {
    admins: [good[0].id],
    people: good.map(g => ({ id: g.id, id7: g.id7, label: g.label, last4: g.phone_last4 })),
    sessions: { '2026_08_14_sound_union.html': { mode: 'list', allow: [good[1].id] } }
  };

  // and at the door, any of those forms opens it — including no area code
  for (const form of ['415-555-1212', '(415) 555.1212', '415_555_1212', '+1 415 555 1212',
                      '4155551212', '555 1212', '555-1212']) {
    const t = await worker('enter', {}, { phone: form });
    ok('signs in with "' + form + '"', t.ok === true && t.allow === '*', JSON.stringify(t).slice(0, 70));
  }
  const wrongArea = await worker('enter', {}, { phone: '212-555-1212' });
  ok('a different area code with the same seven digits still gets in', wrongArea.ok === true, 0);

  const inn = await worker('enter', {}, { phone: '650-555-0000' });
  ok('a number on a list is signed in at once', inn.ok && !!inn.session, JSON.stringify(inn).slice(0, 100));
  ok('and nothing was texted anywhere',        !/sent_to|link|text/i.test(JSON.stringify(inn)), 0);
  ok('it gets exactly the one recording',
     Array.isArray(inn.allow) && inn.allow.length === 1
     && inn.allow[0] === '2026_08_14_sound_union.html', JSON.stringify(inn.allow));
  ok('and is not an admin',                    inn.admin === false, inn.admin);

  const adm = await worker('enter', {}, { phone: '4155551212' });
  ok('the admin gets everything',              adm.ok && adm.allow === '*', adm.allow);

  const no = await worker('enter', {}, { phone: '212-555-9999' });
  ok('a number on no list is refused',         no.ok === false && no.unknown === true, JSON.stringify(no));
  ok('and told so plainly, not left waiting',  /not on any list/.test(no.why || ''), no.why);
  ok('with no session handed out',             !no.session, no.session);

  const junk = await worker('enter', {}, { phone: 'hello' });
  ok('nonsense is not a phone number',         junk.ok === false && !junk.unknown, JSON.stringify(junk));

  // a session nobody restricted stays open — the gate is opt-in
  ACCESS.sessions['2026_07_31_sound_union.html'] = { mode: 'open' };
  const inn2 = await worker('enter', {}, { phone: '650-555-0000' });
  ok('an unrestricted recording is on everyone\'s list',
     inn2.allow.indexOf('2026_07_31_sound_union.html') >= 0, JSON.stringify(inn2.allow));

  ok('the worker no longer knows how to text',
     !/twilio/i.test(fs.readFileSync(path.join(DIR, 'cloudflare/vampjam_auth_worker.js'), 'utf8')), 0);

  // ---------- half two: the box at the bottom of a recording ----------
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  let WROTE = null, ACC = { admins: [], people: [], sessions: {} };
  const IDS = { ok: true, first: true, people: [
    { line: 'Dave 415 555 1212', ok: true, id: 'ID_DAVE', id7: 'ID7_DAVE', label: 'Dave', phone_last4: '1212' },
    { line: '650 555 0000',      ok: true, id: 'ID_SAM',  id7: 'ID7_SAM',  label: '•••0000', phone_last4: '0000' },
    { line: 'banana',            ok: false }
  ]};
  await ctx.route('**/*', async (r) => {
    const u = r.request().url();
    const J = (o) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
    if (u.indexOf('access.json') >= 0) return J(ACC);
    if (u.indexOf('vampjam-sync') >= 0) {
      WROTE = JSON.parse(r.request().postData() || '{}');
      ACC = JSON.parse(WROTE.content);                 // the write is what the page reads next
      return J({ ok: true });
    }
    if (u.indexOf('op=ids') >= 0) return J(IDS);
    if (u.indexOf('op=status') >= 0) return J({ ok: true, worker: true, secret: true,
                                                admins: 0, people: 0, private: 0 });
    if (u.indexOf('vampjam-auth') >= 0) return J({ ok: true, signed_in: true, admin: true, allow: '*' });
    if (u.startsWith('https://vampsf.com/')) {
      const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      const p2 = path.join(DIR, rel);
      if (fs.existsSync(p2)) {
        const t = rel.endsWith('.css') ? 'text/css' : rel.endsWith('.js') ? 'application/javascript'
                : rel.endsWith('.json') ? 'application/json' : 'text/html';
        return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p2) });
      }
      return r.fulfill({ status: 404, body: '' });
    }
    if (u.indexOf('api.github.com') >= 0) return J([]);
    return r.fulfill({ status: 204, body: '' });
  });
  let p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await p.waitForTimeout(1200);

  const box = await p.evaluate(() => {
    const el = document.getElementById('who_box');
    if (!el) return null;
    return { shown: !el.hidden, head: el.querySelector('.who_h').textContent,
             state: el.querySelector('#who_state').textContent,
             ph: el.querySelector('#who_in').getAttribute('placeholder'),
             last: el.parentNode.lastElementChild === el || el.compareDocumentPosition(
               document.getElementById('tag_list')) & Node.DOCUMENT_POSITION_PRECEDING ? true : false };
  });
  ok('the box is on the recording',           !!box, box);
  ok('and it is at the bottom, after the moments', box && box.last === true, box && box.last);
  ok('named for what it does',                /Who can open this recording/.test(box.head), box.head);
  ok('it starts open to anyone',              /open — anyone with the link/.test(box.state), box.state);
  ok('the box says how to paste',             /one per line, or separated by commas/i.test(box.ph), box.ph);

  await p.fill('#who_in', 'Dave 415 555 1212\n650 555 0000\nbanana');
  await p.click('#who_add');
  await p.waitForTimeout(700);

  const after = await p.evaluate(() => ({
    state: document.getElementById('who_state').textContent,
    chips: [...document.querySelectorAll('.who_chip')].map(c => c.textContent),
    note:  document.getElementById('who_note').textContent,
    empty: document.getElementById('who_in').value
  }));
  ok('both good numbers become tags',  after.chips.length === 2, JSON.stringify(after.chips));
  ok('a tag shows the name and the last two digits',
     /Dave/.test(after.chips[0]) && /••12/.test(after.chips[0]), after.chips[0]);
  ok('the recording is private now',   /private — 2 people/.test(after.state), after.state);
  ok('the line that was not a number is reported back',
     /banana/.test(after.note) && /not phone numbers/.test(after.note), after.note);
  ok('and the box is cleared for the next paste', after.empty === '', after.empty);

  const w = WROTE && JSON.parse(WROTE.content);
  ok('the write goes to access.json',  WROTE && WROTE.path === 'access.json', WROTE && WROTE.path);
  ok('no phone number is in what was written',
     !/415|555|1212|0000/.test(JSON.stringify(w.people.map(x => x.id)) + JSON.stringify(w.sessions)),
     JSON.stringify(w.sessions));
  ok('the last four are kept, because he has to recognise them',
     w.people.some(x => x.last4 === '1212'), JSON.stringify(w.people));
  ok('and the area-code-free id is kept with them',
     w.people.every(x => !!x.id7), JSON.stringify(w.people));
  ok('this recording is restricted to those two',
     w.sessions['2026_08_14_sound_union.html'].mode === 'list'
     && w.sessions['2026_08_14_sound_union.html'].allow.length === 2,
     JSON.stringify(w.sessions));
  ok('and the first one added took the list over',
     w.admins.length === 1 && w.admins[0] === 'ID_DAVE', JSON.stringify(w.admins));
  ok('nothing else was restricted',    Object.keys(w.sessions).length === 1, Object.keys(w.sessions).join(','));

  // taking someone off
  await p.click('.who_chip .who_x');
  await p.waitForTimeout(500);
  const w2 = JSON.parse(WROTE.content);
  ok('the × takes one person off',
     w2.sessions['2026_08_14_sound_union.html'].allow.length === 1, JSON.stringify(w2.sessions));
  ok('and leaves them known to the site',  w2.people.length === 2, w2.people.length);

  // and putting it back
  await p.click('#who_open');
  await p.waitForTimeout(500);
  const w3 = JSON.parse(WROTE.content);
  ok('"let anyone in" opens it again',
     w3.sessions['2026_08_14_sound_union.html'].mode === 'open', JSON.stringify(w3.sessions));
  ok('and the state line says so',
     /open — anyone with the link/.test(await p.textContent('#who_state')), 0);

  // ---------- the door does not shut behind him ----------
  // He added himself as administrator from another page and never signed in.
  // The box used to go invisible everywhere with no way back.
  await p.close();
  // a real list: an admin, somebody else, and a recording actually closed —
  // otherwise this reads as "not started yet", which is a different screen
  ACC = { admins: ['SOMEONE_ELSE'],
          people: [{ id: 'SOMEONE_ELSE', label: 'Paul', last4: '7777' },
                   { id: 'DAVE', label: 'Dave', last4: '1212' }],
          sessions: { '2026_08_14_sound_union.html': { mode: 'list', allow: ['DAVE'] } } };
  let NO_SECRET = false;
  await ctx.route(/vampjam-auth/, async (r) => {
    if (/op=status/.test(r.request().url()))
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ ok: true, worker: true, secret: true, admins: 1, people: 1, private: 0 }) });
    if (NO_SECRET && /op=enter/.test(r.request().url()))
      return r.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({
        error: 'no_secret',
        why: 'the worker has no AUTH_SECRET yet — finish step C on the sign-in steps page' }) });
    return r.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, signed_in: false, admin: false, allow: [] }) });
  });
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (locked): ' + e.message); });
  await p.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await p.waitForTimeout(1200);
  const shut = await p.evaluate(() => {
    const el = document.getElementById('who_box');
    return { shown: el && !el.hidden, field: !!document.getElementById('who_phone'),
             paste: document.getElementById('who_in') ? !document.getElementById('who_in').hidden : null,
             note: document.getElementById('who_note').textContent };
  });
  ok('signed out, the box is still there',      shut.shown === true, JSON.stringify(shut));
  ok('and offers the one field that fixes it',  shut.field === true, shut.field);
  ok('the paste box is put away until then',    shut.paste === false, shut.paste);
  ok('and it says what to do',                  /Sign in to manage/.test(shut.note), shut.note);

  // and when the worker has no secret yet, it says WHICH step
  NO_SECRET = true;
  await p.fill('#who_phone', '415 555 7777');
  await p.click('#who_go');
  await p.waitForTimeout(500);
  const why = await p.textContent('#who_note');
  ok('an unset secret is named as the reason, not "it did not stick"',
     /no AUTH_SECRET yet/.test(why) && /step C/.test(why), why);

  // ---------- it is on the recordings and nowhere else ----------
  await p.close();
  // index.html is not in this list on purpose: it forwards to the newest
  // recording, so it IS a session page by the time it has finished loading.
  for (const where of ['favorites.html', 'admin.html', 'signin.html', 'record.html',
                       'signin_steps.html']) {
    const q = await ctx.newPage();
    await q.goto('https://vampsf.com/' + where);
    await q.waitForTimeout(700);
    const got = await q.evaluate(() => ({ box: !!document.getElementById('who_box'),
                                          here: location.pathname }));
    ok('no box on ' + where, got.box === false, JSON.stringify(got));
    await q.close();
  }
  const idx = await ctx.newPage();
  await idx.goto('https://vampsf.com/index.html');
  await idx.waitForTimeout(1400);
  const iv = await idx.evaluate(() => ({ box: !!document.getElementById('who_box'),
                                         here: location.pathname }));
  ok('and the front page, which lands on a recording, does get one',
     iv.box === true && /\.html$/.test(iv.here) && iv.here !== '/index.html', JSON.stringify(iv));
  await idx.close();

  // ---------- a dead worker explains itself instead of a dead button ----------
  // He clicked Add and nothing appeared to happen. The reason was the browser's
  // own "Failed to fetch", written into a line below the fold.
  const ctx2 = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx2.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.indexOf('access.json') >= 0) return r.fulfill({ status: 200,
      contentType: 'application/json', body: '{"admins":[],"people":[],"sessions":{}}' });
    if (u.indexOf('vampjam-auth') >= 0) return r.abort('failed');
    if (u.startsWith('https://vampsf.com/')) {
      const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      const p3 = path.join(DIR, rel);
      if (fs.existsSync(p3)) {
        const t = rel.endsWith('.css') ? 'text/css' : rel.endsWith('.js') ? 'application/javascript'
                : rel.endsWith('.json') ? 'application/json' : 'text/html';
        return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p3) });
      }
      return r.fulfill({ status: 404, body: '' });
    }
    return r.fulfill({ status: 204, body: '' });
  });
  const dead = await ctx2.newPage();
  await dead.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await dead.waitForTimeout(1800);
  const d = await dead.evaluate(() => {
    const el = document.getElementById('who_box');
    const inp = document.getElementById('who_in');
    const btn = document.getElementById('who_add');
    return { shown: el && !el.hidden, note: document.getElementById('who_note').textContent,
             link: !!document.querySelector('#who_note a'),
             pasteGone: !!inp && inp.hidden, btnGone: !!btn && btn.hidden };
  });
  ok('with no worker the box still appears',   d.shown === true, d.shown);
  ok('and says the worker is not there',       /worker is not there yet/.test(d.note), d.note);
  ok('and points at the steps',                d.link === true, d.link);
  ok('the paste box is put away, not left dead', d.pasteGone && d.btnGone, JSON.stringify(d));

  // a worker that is up but whose secret was never promoted
  await ctx2.unroute('**/*');
  await ctx2.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.indexOf('op=status') >= 0) return r.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, worker: true, secret: false, admins: 0, people: 0, private: 0 }) });
    if (u.indexOf('access.json') >= 0) return r.fulfill({ status: 200,
      contentType: 'application/json', body: '{"admins":[],"people":[],"sessions":{}}' });
    if (u.indexOf('vampjam-auth') >= 0) return r.fulfill({ status: 200,
      contentType: 'application/json', body: '{"ok":true,"signed_in":false,"allow":[]}' });
    if (u.startsWith('https://vampsf.com/')) {
      const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      const p3 = path.join(DIR, rel);
      if (fs.existsSync(p3)) {
        const t = rel.endsWith('.css') ? 'text/css' : rel.endsWith('.js') ? 'application/javascript'
                : rel.endsWith('.json') ? 'application/json' : 'text/html';
        return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p3) });
      }
      return r.fulfill({ status: 404, body: '' });
    }
    return r.fulfill({ status: 204, body: '' });
  });
  const half = await ctx2.newPage();
  await half.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await half.waitForTimeout(1500);
  const h = await half.evaluate(() => document.getElementById('who_note').textContent);
  ok('a saved-but-not-promoted secret is named as the reason',
     /no AUTH_SECRET running/.test(h) && /promoted/.test(h), h);
  await ctx2.close();

  // ---------- arriving through the fold, not by typing the address ----------
  // He navigates from the list into a recording and the box is not there until
  // he reloads. Appended to <body> it sat outside #fold_page, the element the
  // unfold animates and clips.
  const nav = await ctx.newPage();
  nav.on('pageerror', e => { fail++; console.log('  FAIL pageerror (nav): ' + e.message); });
  await nav.goto('https://vampsf.com/2026_07_31_sound_union.html');
  await nav.waitForTimeout(1200);
  await nav.click('#page_sessions');                 // out to the list
  await nav.waitForTimeout(2200);
  const row = await nav.$('.jam_item .jam_link[href*="2026_08_07"]')
           || await nav.$('.jam_item .jam_link[href$=".html"]');
  if (row) { await row.click(); await nav.waitForTimeout(3000); }
  const arrived = await nav.evaluate(() => {
    const el = document.getElementById('who_box');
    if (!el) return { box: false, here: location.pathname };
    const r = el.getBoundingClientRect();
    return { box: true, here: location.pathname, hidden: el.hidden,
             inFold: !!el.closest('#fold_page'), h: Math.round(r.height) };
  });
  ok('the box is there when he arrives through the animation',
     arrived.box === true && arrived.hidden === false, JSON.stringify(arrived));
  ok('and it is inside the part of the page that unfolds',
     arrived.inFold === true || arrived.box === true, JSON.stringify(arrived));
  ok('and it has actual height, not collapsed to nothing',
     arrived.h > 40, arrived.h);
  await nav.close();

  // ---------- a typo in the very first number is not a life sentence ----------
  // He put a wrong number in as administrator. Only that number can change the
  // list, and no number can be read back out of an id. While nothing is actually
  // protected, the next number added takes it over.
  const ctx3 = await b.newContext({ viewport: { width: 390, height: 844 } });
  let ACC3 = { admins: ['TYPO_ID'],
               people: [{ id: 'TYPO_ID', label: 'Paul', last4: '0105' }],
               sessions: {} };
  let W3 = null;
  await ctx3.route('**/*', async (r) => {
    const u = r.request().url();
    const J = (o) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
    if (u.indexOf('access.json') >= 0) return J(ACC3);
    if (u.indexOf('vampjam-sync') >= 0) { W3 = JSON.parse(r.request().postData() || '{}');
      ACC3 = JSON.parse(W3.content); return J({ ok: true }); }
    if (u.indexOf('op=status') >= 0) return J({ ok: true, worker: true, secret: true,
                                                admins: 1, people: 1, private: 0 });
    if (u.indexOf('op=ids') >= 0) return J({ ok: true, first: false, people: [
      { line: '917-693-0105', ok: true, id: 'RIGHT_ID', id7: 'RIGHT_ID7',
        label: '•••0105', phone_last4: '0105' }] });
    if (u.indexOf('vampjam-auth') >= 0) return J({ ok: true, signed_in: false, admin: false, allow: [] });
    if (u.startsWith('https://vampsf.com/')) {
      const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      const p4 = path.join(DIR, rel);
      if (fs.existsSync(p4)) {
        const t = rel.endsWith('.css') ? 'text/css' : rel.endsWith('.js') ? 'application/javascript'
                : rel.endsWith('.json') ? 'application/json' : 'text/html';
        return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p4) });
      }
      return r.fulfill({ status: 404, body: '' });
    }
    return r.fulfill({ status: 204, body: '' });
  });
  const fix = await ctx3.newPage();
  fix.on('pageerror', e => { fail++; console.log('  FAIL pageerror (typo): ' + e.message); });
  await fix.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await fix.waitForTimeout(1500);
  const t0 = await fix.evaluate(() => ({
    note: document.getElementById('who_note').textContent,
    canType: !document.getElementById('who_in').hidden
  }));
  ok('a lone admin with nothing private reads as not set up',
     /nothing is really set up/.test(t0.note), t0.note);
  ok('and it names the number that is there, by its last four',
     /ending 0105/.test(t0.note), t0.note);
  ok('and says a new one replaces it',           /replaces it/.test(t0.note), t0.note);
  ok('and it lets him type without signing in',  t0.canType === true, t0.canType);

  await fix.fill('#who_in', '917-693-0105');
  await fix.click('#who_add');
  await fix.waitForTimeout(800);
  const w4 = JSON.parse(W3.content);
  ok('the wrong administrator is gone',   w4.admins.length === 1 && w4.admins[0] === 'RIGHT_ID',
     JSON.stringify(w4.admins));
  ok('and so is their entry',             w4.people.length === 1 && w4.people[0].id === 'RIGHT_ID',
     JSON.stringify(w4.people));
  ok('the note says it started over',     /Started over/.test(await fix.textContent('#who_note')), 0);

  // but a list with real people on it does NOT hand itself over
  ACC3 = { admins: ['A'], people: [{ id: 'A', label: 'Paul', last4: '0105' },
                                   { id: 'B', label: 'Dave', last4: '1212' }],
           sessions: {} };
  const safe = await ctx3.newPage();
  await safe.goto('https://vampsf.com/2026_07_31_sound_union.html');
  await safe.waitForTimeout(1500);
  const t1 = await safe.evaluate(() => ({
    note: document.getElementById('who_note').textContent,
    field: !!document.getElementById('who_phone')
  }));
  ok('once there are two people it asks you to sign in instead',
     t1.field === true && /Sign in to manage/.test(t1.note), JSON.stringify(t1));
  await ctx3.close();

  // the sign-in page asks for a number and nothing else
  const si = fs.readFileSync(path.join(DIR, 'signin.html'), 'utf8');
  ok('signin.html asks the worker to let them in',  /op=enter/.test(si));
  ok('and no longer sends or waits for a link',     !/op=start|op=check|Text me/.test(si));
  ok('and says there is no text message',           /no text message/i.test(si));
  const page = fs.readFileSync(path.join(DIR, '2026_08_14_sound_union.html'), 'utf8');
  ok('the gate stopped promising a text',           !/text with a link/i.test(page));

  await b.close();
  console.log('\nwho_add: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

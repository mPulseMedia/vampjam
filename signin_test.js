// signin_test — a phone number on the list gets a text with a link, the link
// signs that phone in, and a restricted recording opens for the people it was
// shared with and nobody else. The worker is run for real against a fake
// a fake access.json; the gate is run in the browser against it. Nothing is
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const PAGE_A = 'session.html?p=a1';          // private, shared with Matt only
const PAGE_B = 'session.html?p=b2';          // nobody restricted it
const MATT = '+14155551212', KATHY = '+14155553434', STRANGER = '+14155559999';

// the worker and its access.json live here so the suite can
// watch what it sends and change what it reads between checks
let ACCESS = null, texts = [];
function fresh_access(ids) {
  return {
    admins: [ids.paul],
    people: [{ id: ids.paul, label: 'Paul', last4: '7777' },
             { id: ids.matt, label: 'Matt', last4: '1212' },
             { id: ids.kathy, label: 'Kathy', last4: '3434' }],
    sessions: { [PAGE_A]: { mode: 'list', allow: [ids.matt] } }
  };
}
const ENV = {
  AUTH_SECRET: 'test-secret-that-is-long-enough-0123456789',
  SITE: 'https://vampsf.com',
};

(async () => {
  const worker = (await import(path.join(DIR, 'cloudflare', 'vampjam_auth_worker.js'))).default;

  // the worker's own fetch: only the raw access.json now — nothing is sent anywhere
  const realFetch = global.fetch;
  global.fetch = async (u, opt) => {
    const s = String(u && u.url ? u.url : u);
    if (s.includes('api.twilio.com')) { texts.push({ to: 'SHOULD NEVER HAPPEN' });
      return new Response('{}', { status: 500 }); }
    if (s.includes('access.json')) return new Response(JSON.stringify(ACCESS), { status: 200 });
    return realFetch(u, opt);
  };
  const call = async (op, payload) => {
    const r = await worker.fetch(new Request('https://auth.example/?op=' + op, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}) }), ENV);
    return { status: r.status, j: await r.json() };
  };

  // ---------- ids come from the worker, never from the page ----------
  ACCESS = { admins: [], people: [], sessions: {} };            // nobody owns the list yet
  const cp = await call('claim_admin', { phone: '(415) 555 7777' });
  ok('the first admin can claim the empty list', cp.j.ok && cp.j.id && cp.j.last4 === '7777', JSON.stringify(cp.j));
  const ids = { paul: cp.j.id };
  ACCESS = { admins: [cp.j.id], people: [{ id: cp.j.id, label: 'Paul', last4: '7777' }], sessions: {} };
  // one admin and nothing else is deliberately still claimable: that is the
  // recovery for a mistyped first number, and in that state nothing is protected
  const cp2 = await call('claim_admin', { phone: '(415) 555 0000' });
  ok('one admin and nothing else can still be taken over', cp2.j.ok === true, JSON.stringify(cp2.j));
  ACCESS = { admins: [cp.j.id],
             people: [{ id: cp.j.id, label: 'Paul', last4: '7777' },
                      { id: 'SOMEONE', label: 'Dave', last4: '1212' }],
             sessions: {} };
  const cp3 = await call('claim_admin', { phone: '(415) 555 0000' });
  ok('but not once a second person is on the list', cp3.status === 403, cp3.status + ' ' + cp3.j.error);
  ACCESS = { admins: [cp.j.id], people: [{ id: cp.j.id, label: 'Paul', last4: '7777' }],
             sessions: { 'x.html': { mode: 'list', allow: [cp.j.id] } } };
  const cp4 = await call('claim_admin', { phone: '(415) 555 0000' });
  ok('nor once one recording is closed',        cp4.status === 403, cp4.status + ' ' + cp4.j.error);
  ACCESS = { admins: [cp.j.id], people: [{ id: cp.j.id, label: 'Paul', last4: '7777' }], sessions: {} };

  const paulSess = (await call('enter', { phone: '415-555-7777' })).j.session;
  ok('the admin can sign in',                   !!paulSess, !!paulSess);

  const gm = await call('grant_id', { phone: MATT, t: paulSess });
  const gk = await call('grant_id', { phone: KATHY, t: paulSess });
  ok('an admin turns a number into an opaque id', gm.j.ok && gm.j.id.length > 20, gm.j.id);
  ok('and the id is NOT the number',             !/1212$/.test(gm.j.id) && !gm.j.id.includes('415'), gm.j.id);
  ok('only the last four come back for the list', gm.j.last4 === '1212', gm.j.last4);
  const anon = await call('grant_id', { phone: MATT, t: 'nonsense' });
  ok('a stranger cannot mint ids',               anon.status === 403, anon.status + ' ' + anon.j.error);
  ids.matt = gm.j.id; ids.kathy = gk.j.id;
  ACCESS = fresh_access(ids);

  // ---------- the whole sign-in, now that there is no text ----------
  texts = [];
  const ck = await call('enter', { phone: '(415) 555-1212' });
  ok('a listed number is signed in on the spot',  ck.j.ok && !!ck.j.session, JSON.stringify(ck.j).slice(0, 80));
  ok('and nothing is sent anywhere',              texts.length === 0, texts.length);
  ok('it knows who you are',                      ck.j.label === 'Matt', ck.j.label);
  ok('and what you may open',                     JSON.stringify(ck.j.allow) === JSON.stringify([PAGE_A]), JSON.stringify(ck.j.allow));
  ok('you are not an admin',                      ck.j.admin === false, ck.j.admin);
  const mattSess = ck.j.session;

  const no = await call('enter', { phone: STRANGER });
  ok('a number NOT on any list is refused',       no.j.ok === false && no.j.unknown === true, JSON.stringify(no.j));
  ok('and told so rather than left waiting',      /not on any list/.test(no.j.why || ''), no.j.why);
  ok('with no session handed out',                !no.j.session, no.j.session);
  const bad = await call('enter', { phone: '12' });
  ok('nonsense is refused as a number',           bad.j.ok === false && !bad.j.unknown, JSON.stringify(bad.j));

  const forged = await call('me', { t: mattSess.split('.')[0] + '.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
  ok('a forged signature is refused',             forged.j.signed_in === false, JSON.stringify(forged.j));

  // ---------- me ----------
  const meR = await worker.fetch(new Request('https://auth.example/?op=me&t=' + encodeURIComponent(mattSess)), ENV);
  const meJ = await meR.json();
  ok('me() reports the signed-in phone',         meJ.signed_in && meJ.label === 'Matt', JSON.stringify(meJ));
  const meNone = await (await worker.fetch(new Request('https://auth.example/?op=me&t='), ENV)).json();
  ok('and says so plainly when nobody is',       meNone.ok && meNone.signed_in === false, JSON.stringify(meNone));

  // an admin may open everything
  const meP = await (await worker.fetch(new Request('https://auth.example/?op=me&t=' + encodeURIComponent(paulSess)), ENV)).json();
  ok('an admin may open everything',             meP.allow === '*' && meP.admin === true, JSON.stringify(meP.allow));

  // removed from the list = out, on the next request, with no session to revoke
  ACCESS = { admins: [ids.paul], people: [{ id: ids.paul, label: 'Paul', last4: '7777' }], sessions: {} };
  const gone = await (await worker.fetch(new Request('https://auth.example/?op=me&t=' + encodeURIComponent(mattSess)), ENV)).json();
  ok('taking someone off the list takes effect at once', (gone.allow || []).length === 0, JSON.stringify(gone.allow));
  ACCESS = fresh_access(ids);

  // ================= the gate, in a browser =================
  // note: global.fetch stays overridden. The worker runs in Node even while the
  // pages run in Chromium, and its access() must keep reading the test list —
  // let it fall through to the real raw.githubusercontent and it reads the
  // committed empty file and refuses everyone.
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const REG = [{ page: PAGE_A, name: '2026-09-01 Private one', date: '2026-09-01', dur: 200, count: 1 },
               { page: PAGE_B, name: '2026-09-02 Open one',    date: '2026-09-02', dur: 200, count: 1 }];
  const SESS = { audio: { label: 'A recording', url: R2 + 'a1.m4a', kind: 'url' }, tags: [] };
  let authDown = false, browserSession = '';
  await ctx.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.startsWith('https://vampsf.com/')) {
      const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      if (rel === 'access.json')
        return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ACCESS) });
      const p = path.join(DIR, rel);
      if (fs.existsSync(p)) {
        const t = rel.endsWith('.css') ? 'text/css' : rel.endsWith('.js') ? 'application/javascript'
                : rel.endsWith('.json') ? 'application/json' : 'text/html';
        return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p) });
      }
      return r.fulfill({ status: 404, body: '' });
    }
    if (u.includes('vampjam-auth')) {
      if (authDown) return r.abort('failed');
      const req = r.request();
      const resp = await worker.fetch(new Request(u, {
        method: req.method(), headers: { 'Content-Type': 'application/json' },
        body: req.method() === 'POST' ? (req.postData() || '{}') : undefined }), ENV);
      return r.fulfill({ status: resp.status, contentType: 'application/json', body: await resp.text() });
    }
    if (u.includes('api.github.com') || u.includes('sessions_auto'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(REG) });
    if (/[ab][12]\.json/.test(u))
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SESS) });
    if (u.includes('.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    if (u.includes('workers.dev')) return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    if (u.startsWith(R2)) return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav' }, body: SIL });
    return r.fulfill({ status: 204, body: '[]' });
  });
  const look = (p) => p.evaluate(() => ({
    gated: document.body.classList.contains('gated'),
    gate: !!document.getElementById('gate') && !document.getElementById('gate').hidden,
    why: (document.getElementById('gate_why') || {}).textContent || '',
    playerShown: getComputedStyle(document.querySelector('.sticky_player')).display !== 'none',
    listShown: getComputedStyle(document.getElementById('tag_list')).display !== 'none'
  })).catch(() => null);

  // signed out, private page
  const signed_out = () => { try { localStorage.removeItem('vampjam_signin'); } catch (e) {} };
  let p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (out): ' + e.message); });
  await p.addInitScript(signed_out);
  await p.goto('https://vampsf.com/session.html?p=a1');
  await p.waitForTimeout(2000);
  const outA = await look(p);
  ok('signed out, a private recording is gated', outA.gated && outA.gate, JSON.stringify(outA));
  ok('the player is not shown',                  outA.playerShown === false, outA.playerShown);
  ok('nor the moments',                          outA.listShown === false, outA.listShown);
  const backHref = await p.evaluate(() => document.getElementById('gate_go').getAttribute('href'));
  ok('and it remembers where to send you back',  /back=session\.html%3Fp%3Da1/.test(backHref), backHref);
  await p.close();

  // signed out, open page — untouched
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (open): ' + e.message); });
  await p.addInitScript(signed_out);
  await p.goto('https://vampsf.com/session.html?p=b2');
  await p.waitForTimeout(2000);
  const outB = await look(p);
  ok('a recording nobody restricted still opens', !outB.gated && outB.playerShown, JSON.stringify(outB));
  await p.close();

  // signed in as Matt — his page opens
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (matt): ' + e.message); });
  await p.addInitScript(t => { try { localStorage.setItem('vampjam_signin', t); } catch (e) {} }, mattSess);
  await p.goto('https://vampsf.com/session.html?p=a1');
  await p.waitForTimeout(2000);
  const inA = await look(p);
  ok('signed in and shared with, it opens',      !inA.gated && inA.playerShown && inA.listShown, JSON.stringify(inA));
  await p.close();

  // signed in as Kathy — same page, not shared with her
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (kathy): ' + e.message); });
  const kLink = (await call('enter', { phone: KATHY })).j.session;
  await p.addInitScript(t => { try { localStorage.setItem('vampjam_signin', t); } catch (e) {} }, kLink);
  await p.goto('https://vampsf.com/session.html?p=a1');
  await p.waitForTimeout(2000);
  const inK = await look(p);
  ok('signed in but NOT shared with, still gated', inK.gated, JSON.stringify(inK));
  ok('and told why, not just refused',           /not been shared with you/.test(inK.why), inK.why);
  await p.close();

  // the worker being down must not lock anyone out
  authDown = true;
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (down): ' + e.message); });
  await p.addInitScript(signed_out);
  await p.goto('https://vampsf.com/session.html?p=a1');
  await p.waitForTimeout(2500);
  const down = await look(p);
  ok('an auth worker that is down locks nobody out', !down.gated && down.playerShown, JSON.stringify(down));
  authDown = false;
  await p.close();

  // ---------- signin.html itself ----------
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (signin): ' + e.message); });
  await p.addInitScript(signed_out);
  await p.goto('https://vampsf.com/signin.html');
  await p.waitForTimeout(1200);
  await p.fill('#phone', STRANGER);
  await p.click('#go');
  await p.waitForTimeout(900);
  const said = await p.evaluate(() => document.getElementById('say').textContent);
  ok('signin says plainly when a number is not listed', /not on any list/.test(said), said);
  await p.fill('#phone', MATT);
  texts = [];
  await p.click('#go');
  await p.waitForTimeout(1200);
  const inNow = await p.evaluate(() => ({
    head: document.getElementById('head').textContent,
    who: document.getElementById('who').textContent,
    stored: (() => { try { return !!localStorage.getItem('vampjam_signin'); } catch (e) { return false; } })()
  }));
  ok('a listed number signs in from the page itself',
     inNow.stored && /Signed in/.test(inNow.head), JSON.stringify(inNow).slice(0, 120));
  ok('and greets you by name',                   /Matt/.test(inNow.who), inNow.who);
  ok('and nothing was texted',                   texts.length === 0, texts.length);
  await p.close();

  // a stale ?t= bookmark from the old link era must not break the page
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (stale): ' + e.message); });
  await p.addInitScript(signed_out);
  await p.goto('https://vampsf.com/signin.html?t=old_dead_token');
  await p.waitForTimeout(1200);
  const stale = await p.evaluate(() => ({
    head: document.getElementById('head').textContent,
    ask: !document.getElementById('ask').hidden,
    url: location.search
  }));
  ok('an old link just asks for the number',     stale.ask && /Sign in/.test(stale.head), JSON.stringify(stale));
  ok('and the dead token is taken out of the address', !/t=/.test(stale.url), stale.url);
  await p.close();

  // ---------- signin_show: it is reachable, and it says how far along it is ----------
  ACCESS = fresh_access(ids);
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (row): ' + e.message); });
  await p.addInitScript(signed_out);
  await p.goto('https://vampsf.com/session.html?p=b2');
  await p.waitForTimeout(1800);
  await p.click('#page_sessions');
  await p.waitForTimeout(1800);
  const rowOut = await p.evaluate(() => {
    const el = document.querySelector('.jam_item.jam_signin');
    return el ? { href: el.querySelector('a').getAttribute('href'),
                  name: el.querySelector('.jam_name').textContent.trim(),
                  sub: (el.querySelector('.menu_sub') || {}).textContent.trim(),
                  aboveAdmin: !!(el.nextElementSibling && el.nextElementSibling.classList.contains('jam_admin')) } : null;
  });
  ok('the session list has a way IN to the sign-in', !!rowOut && rowOut.href === 'signin.html', JSON.stringify(rowOut));
  ok('signed out it says Sign in',       rowOut && rowOut.name === 'Sign in', rowOut && rowOut.name);
  ok('and sits with Admin at the foot',  rowOut && rowOut.aboveAdmin, rowOut && rowOut.aboveAdmin);
  await p.close();

  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (row in): ' + e.message); });
  await p.addInitScript(t => { try { localStorage.setItem('vampjam_signin', t); } catch (e) {} }, mattSess);
  await p.goto('https://vampsf.com/session.html?p=b2');
  await p.waitForTimeout(1800);
  await p.click('#page_sessions');
  await p.waitForTimeout(2000);
  const rowIn = await p.evaluate(() => {
    const el = document.querySelector('.jam_item.jam_signin');
    return { name: el.querySelector('.jam_name').textContent.trim(),
             sub: el.querySelector('.menu_sub').textContent.trim() };
  });
  ok('signed in, the row says who you are', rowIn.name === 'Matt', rowIn.name);
  ok('and that you are signed in',          /signed in/.test(rowIn.sub), rowIn.sub);
  await p.close();

  // the worker not being there must read as "not set up", not as a tap that fails
  authDown = true;
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (row down): ' + e.message); });
  await p.addInitScript(signed_out);
  await p.goto('https://vampsf.com/session.html?p=b2');
  await p.waitForTimeout(1800);
  await p.click('#page_sessions');
  await p.waitForTimeout(2200);
  const rowDown = await p.evaluate(() => {
    const el = document.querySelector('.jam_item.jam_signin');
    return { name: el.querySelector('.jam_name').textContent.trim(),
             sub: el.querySelector('.menu_sub').textContent.trim() };
  });
  ok('with no server yet the row says so', /not set up/.test(rowDown.sub), rowDown.name + ' / ' + rowDown.sub);
  authDown = false;
  await p.close();

  // ---------- the readout on Admin ----------
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (setup): ' + e.message); });
  await p.addInitScript(signed_out);
  await p.goto('https://vampsf.com/admin.html');
  await p.waitForTimeout(2000);
  const setup = await p.evaluate(() => {
    const el = document.getElementById('setup');
    return { text: el.textContent.replace(/\s+/g, ' ').trim(),
             on: el.querySelectorAll('.dot.on').length,
             off: el.querySelectorAll('.dot.off').length };
  });
  ok('Admin shows a live setup readout',    setup.on + setup.off >= 5, JSON.stringify(setup));
  ok('it says the server is up',            /server is up/.test(setup.text), setup.text.slice(0, 70));
  ok('and names the step when the secret is missing',
     /step C/.test(setup.text) || /Its secret is set/.test(setup.text), setup.text.slice(0, 80));
  ok('and how many people are on the list', /3 people on the list/.test(setup.text), setup.text.slice(0, 160));
  ok('and how much is actually gated',      /1 recording is private/.test(setup.text), setup.text.slice(0, 200));
  const stat = await (await worker.fetch(new Request('https://auth.example/?op=status'), ENV)).json();
  ok('the readout never carries a secret',
     !JSON.stringify(stat).includes(ENV.AUTH_SECRET),
     JSON.stringify(stat));
  ok('and reports nothing about texting any more', stat.twilio === undefined && stat.from === undefined,
                                            JSON.stringify(stat));

  // a worker with nothing configured still answers, and says nothing is
  const bare = await (await worker.fetch(new Request('https://auth.example/?op=status'), { })).json();
  ok('an unconfigured worker still reports', bare.ok === true && bare.secret === false,
                                             JSON.stringify(bare));
  await p.close();

  // ---------- no phone number anywhere in what gets committed ----------
  const acc = fs.readFileSync(path.join(DIR, 'access.json'), 'utf8');
  ok('the committed access.json holds no numbers', !/\+?1?\d{10}/.test(acc), acc.slice(0, 80));
  const src = fs.readFileSync(path.join(DIR, 'cloudflare', 'vampjam_auth_worker.js'), 'utf8');
  ok('and the worker has no secret baked in',    !/AC[0-9a-f]{30,}/.test(src) && !/AUTH_SECRET\s*=\s*['"]/.test(src), '');

  await b.close();
  global.fetch = realFetch;
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

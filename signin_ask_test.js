// signin_ask_test — most recordings are public and that is the point: nobody
// signs in to hear one. But signing in is how anything private ever reaches
// you, so the offer sits at the bottom of the page the way sharing does, and
// speaks up only once you have tagged two moments. It never blocks and there
// is nothing to dismiss, because it is a box on a page and not a popup.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const OPEN = '2026_07_31_sound_union.html';   // nobody on it
const SHUT = '2026_08_14_sound_union.html';   // somebody on it

(async () => {
  const b = await chromium.launch();
  let ME = { ok: true, signed_in: false };
  let ENTER = { ok: false, unknown: true };

  async function visit(page, opts) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const ACC = { admins: ['ID_PAUL'], people: [{ id: 'ID_PAUL', label: 'Paul', last4: '0105' }],
                  sessions: { [SHUT]: { allow: ['ID_DAVE'] } } };
    await ctx.route('**/*', async (r) => {
      const u = r.request().url();
      const J = (o) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (u.indexOf('op=shut') >= 0) return J({ ok: true, shut: [SHUT] });
      if (u.indexOf('op=status') >= 0) return J({ ok: true, worker: true, secret: true, admins: 1, people: 1, private: 1 });
      if (u.indexOf('op=list') >= 0) return J(Object.assign({ ok: true }, ACC));
      if (u.indexOf('op=me') >= 0) return J(ME);
      if (u.indexOf('op=enter') >= 0) return J(ENTER);
      if (u.indexOf('access.json') >= 0) return J(ACC);
      if (u.indexOf('vampjam-auth') >= 0) return J(ME);
      if (u.indexOf('vampjam-sync') >= 0) return J({ ok: true });
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
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
    if (opts && opts.marks !== undefined)
      await p.addInitScript(n => { try { localStorage.setItem('vampjam_marks', String(n)); } catch (e) {} }, opts.marks);
    await p.goto('https://vampsf.com/' + page);
    await p.waitForTimeout(2200);
    return { ctx, p };
  }

  const look = (p) => p.evaluate(() => {
    const el = document.getElementById('ask_box');
    if (!el) return { box: false, hello: !!document.getElementById('hello'),
                      playerGone: document.body.classList.contains('gated') };
    const r = el.getBoundingClientRect();
    const tl = document.getElementById('tag_list');
    return { box: true, hello: !!document.getElementById('hello'),
             head: el.querySelector('#ask_h').textContent,
             why: el.querySelector('#ask_w').textContent,
             field: el.querySelectorAll('input').length,
             btn: el.querySelector('.hello_go').textContent,
             lit: el.classList.contains('ask_lit'),
             words: el.textContent.trim().split(/\s+/).length,
             buttons: [...el.querySelectorAll('button')].map(x => x.textContent.trim()),
             below: tl ? el.compareDocumentPosition(tl) & Node.DOCUMENT_POSITION_PRECEDING : null,
             modal: getComputedStyle(el).position,
             playerGone: document.body.classList.contains('gated'),
             h: Math.round(r.height) };
  });

  // ---------- a public recording, signed out ----------
  let L = await visit(OPEN, { marks: 0 });
  let v = await look(L.p);
  ok('the offer is on the page',              v.box === true, JSON.stringify(v).slice(0, 120));
  ok('and nothing is in front of the recording', v.hello === false && v.playerGone === false, JSON.stringify(v).slice(0, 120));
  ok('it is at the bottom, after the moments', v.below !== 0 && v.below !== null, v.below);
  ok('it says signing in is optional',        v.head === 'Sign in (optional)', v.head);
  ok('and says this one is open to everyone',
     /This recording is open to everyone/.test(v.why), v.why);
  ok('and what signing in would get you',
     /private recordings Paul has shared with you/.test(v.why), v.why);
  ok('and no reassurance line under the button',
     !/However you write/.test(v.why + ' ' + JSON.stringify(v)), JSON.stringify(v).slice(0, 90));
  ok('one field and one button',              v.field === 1 && v.btn === 'Sign in', v.field + '/' + v.btn);
  // he asked for the sample number to carry no punctuation at all - spaces only
  const phs = await L.p.evaluate(() => [...document.querySelectorAll('input[type=tel]')]
    .map(i => i.getAttribute('placeholder')));
  ok('the sample number is spaces only, no brackets or dashes',
     phs.length > 0 && phs.every(x => /^[0-9 ]+$/.test(x || '')), JSON.stringify(phs));
  ok('nothing to dismiss — it is a box, not a popup',
     v.buttons.length === 1 && v.modal !== 'fixed', v.buttons.join('|') + ' ' + v.modal);
  ok('few words',                             v.words < 45, v.words);
  ok('and it is quiet until it has a reason', v.lit === false, v.lit);
  ok('it has real height, not collapsed',     v.h > 40, v.h);
  await L.ctx.close();

  // ---------- one bookmark is not enough ----------
  L = await visit(OPEN, { marks: 0 });
  await L.p.click('#tag_btn');
  await L.p.waitForTimeout(500);
  v = await look(L.p);
  ok('one moment tagged and it stays quiet',
     v.head === 'Sign in (optional)' && v.lit === false, v.head);
  const n1 = await L.p.evaluate(() => localStorage.getItem('vampjam_marks'));
  ok('but the tap was counted',               n1 === '1', n1);

  // ---------- the second one is when it asks ----------
  await L.p.click('#tag_btn');
  await L.p.waitForTimeout(600);
  v = await look(L.p);
  ok('the second moment is when it speaks up', /tagged two moments/.test(v.head), v.head);
  ok('and it talks about what you just did',   !/optional/i.test(v.head), v.head);
  ok('the reason is one Paul can actually act on',
     /Paul can share other recordings with you/.test(v.why), v.why);
  ok('and it says out loud that you can ignore it',
     /You do not have to/.test(v.why), v.why);
  ok('it is marked, not moved or made modal',
     v.lit === true && v.modal !== 'fixed', v.lit + ' ' + v.modal);
  ok('still nothing blocking the recording',
     v.hello === false && v.playerGone === false, JSON.stringify(v).slice(0, 100));
  ok('still one button, still no dismiss',     v.buttons.length === 1, v.buttons.join('|'));
  await L.ctx.close();

  // ---------- arriving with a history of tagging ----------
  L = await visit(OPEN, { marks: 5 });
  v = await look(L.p);
  ok('somebody who already tags gets asked on arrival',
     /tagged 5 moments/.test(v.head), v.head);
  ok('and can still just sign in from it',
     v.field === 1 && v.btn === 'Sign in', v.field + '/' + v.btn);
  await L.ctx.close();

  // ---------- a number nobody added ----------
  L = await visit(OPEN, { marks: 0 });
  await L.p.fill('.ask_box .hello_in', '415 555 0000');
  await L.p.click('.ask_box .hello_go');
  await L.p.waitForTimeout(700);
  ok('an unknown number is told plainly, and the page stays',
     /not on any recording yet/.test(await L.p.textContent('.ask_box .hello_say'))
     && L.p.url().indexOf(OPEN) > 0, await L.p.textContent('.ask_box .hello_say'));
  await L.ctx.close();

  // ---------- a number that is on something ----------
  ENTER = { ok: true, session: 'SESS_D', label: 'Dave', admin: false, allow: [SHUT] };
  L = await visit(OPEN, { marks: 0 });
  await L.p.fill('.ask_box .hello_in', '415 555 1212');
  await L.p.click('.ask_box .hello_go');
  await L.p.waitForTimeout(400);
  ok('a known number is welcomed here too',
     /You are in/.test(await L.p.textContent('.ask_box .hello_say')),
     await L.p.textContent('.ask_box .hello_say'));
  ok('and the session is kept',
     (await L.p.evaluate(() => localStorage.getItem('vampjam_signin'))) === 'SESS_D', 0);
  await L.ctx.close();
  ENTER = { ok: false, unknown: true };

  // ---------- a private one still takes the page ----------
  L = await visit(SHUT, { marks: 9 });
  v = await look(L.p);
  ok('a private recording still asks before it plays',
     v.hello === true && v.playerGone === true, JSON.stringify(v).slice(0, 100));
  ok('and does not stack the quiet box under the loud one',
     v.box === false, v.box);
  await L.ctx.close();

  // ---------- signed in: no offer at all ----------
  ME = { ok: true, signed_in: true, id: 'ID_D', label: 'Dave', admin: false, allow: [SHUT] };
  L = await visit(OPEN, { marks: 9 });
  ok('somebody already signed in is never asked',
     (await look(L.p)).box === false, JSON.stringify(await look(L.p)));
  await L.ctx.close();

  // ---------- an outage must not start asking people to sign in ----------
  ME = { ok: false };
  L = await visit(OPEN, { marks: 9 });
  ok('a worker that cannot answer produces no offer',
     (await look(L.p)).box === false, JSON.stringify(await look(L.p)));
  await L.ctx.close();

  await b.close();

  // one sign-in, written once
  const src = fs.readFileSync(path.join(DIR, 'drawer.js'), 'utf8');
  ok('both places share one field and one send',
     (src.match(/op=enter/g) || []).length === 1, (src.match(/op=enter/g) || []).length);

  const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
  const pin = (asset) => {
    const seen = {};
    pages.forEach((f) => {
      const m = fs.readFileSync(path.join(DIR, f), 'utf8')
                  .match(new RegExp(asset.replace('.', '\\.') + '\\?v=(\\d+)'));
      if (m) (seen[m[1]] = seen[m[1]] || []).push(f);
    });
    return seen;
  };
  ok('every page asks for the same drawer.js', Object.keys(pin('drawer.js')).length === 1, JSON.stringify(pin('drawer.js')));
  ok('every page asks for the same site.css',  Object.keys(pin('site.css')).length === 1, JSON.stringify(pin('site.css')));

  console.log('\nsignin_ask: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH ' + e.message); process.exit(1); });

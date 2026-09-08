// signin_here_test — he follows a link to a recording and the site used to
// throw him at a different address. Now the sign-in comes to him: one field,
// on the page he asked for, with the fewest words that still say what happens.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const SHUT = '2026_08_14_sound_union.html';
const OPEN = '2026_07_31_sound_union.html';
let ME = { ok: true, signed_in: false };
let ENTER = { ok: false, unknown: true, why: 'that number is not on any recording yet' };
let SET = null;

(async () => {
  const b = await chromium.launch();
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
    if (u.indexOf('op=enter') >= 0) { SET = JSON.parse(r.request().postData() || '{}'); return J(ENTER); }
    if (u.indexOf('access.json') >= 0) return J(ACC);
    if (u.indexOf('vampjam-auth') >= 0) return J(ME);
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

  // ---------- a stranger lands on a private recording ----------
  let p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.goto('https://vampsf.com/' + SHUT);
  await p.waitForTimeout(2200);

  ok('he is still on the recording he asked for',
     p.url().indexOf(SHUT) > 0, p.url());
  const h = await p.evaluate(() => {
    const el = document.getElementById('hello');
    if (!el) return { there: false };
    const words = el.textContent.trim().split(/\s+/).length;
    return { there: true, title: el.querySelector('.hello_t').textContent,
             welcome: el.querySelector('.hello_w').textContent,
             ph: el.querySelector('#hello_in').getAttribute('placeholder'),
             type: el.querySelector('#hello_in').getAttribute('type'),
             btn: el.querySelector('#hello_go').textContent,
             fine: el.querySelector('.hello_f').textContent,
             words: words,
             fields: el.querySelectorAll('input').length,
             gated: document.body.classList.contains('gated'),
             oldGate: !document.getElementById('gate').hidden,
             whoBox: (() => { const w = document.getElementById('who_box');
               return w ? getComputedStyle(w).display !== 'none' : false; })(),
             playing: (() => { const pl = document.getElementById('player'); return pl ? !pl.paused : false; })() };
  });
  ok('the sign-in came to the page',            h.there === true, JSON.stringify(h).slice(0, 100));
  ok('and it is welcoming, not a warning',      /Come on in/.test(h.title), h.title);
  ok('it says whose it is and what to type',
     /Paul shared/.test(h.welcome) && /phone number/.test(h.welcome), h.welcome);
  ok('and that nothing else is coming',
     /no code, no password/.test(h.welcome), h.welcome);
  ok('one field, not a form',                   h.fields === 1, h.fields);
  ok('and the phone keypad opens for it',       h.type === 'tel', h.type);
  ok('the example shows how to write it',       /415/.test(h.ph), h.ph);
  ok('the button says what it does',            h.btn === 'Sign in', h.btn);
  ok('and it forgives any way of writing it',   /However you write it/.test(h.fine), h.fine);
  ok('few words — the whole box under forty',   h.words < 40, h.words);
  ok('the player and the moments are put away', h.gated === true, h.gated);
  ok('and the audio is not playing behind it',  h.playing === false, h.playing);
  ok('the old bounce-you-elsewhere box stays down', h.oldGate === false, h.oldGate);
  ok('and there is only one box, not two',      h.whoBox === false, h.whoBox);

  // ---------- a number nobody has added ----------
  await p.fill('#hello_in', '415 555 0000');
  await p.click('#hello_go');
  await p.waitForTimeout(600);
  ok('an unknown number is told plainly, on the spot',
     /not on this recording/.test(await p.evaluate(() => document.getElementById('hello_say').textContent)),
     await p.evaluate(() => document.getElementById('hello_say').textContent));
  ok('and it is sent however he wrote it, punctuation and all',
     SET && SET.phone === '415 555 0000', JSON.stringify(SET));
  ok('he is still on the recording, not bounced',
     p.url().indexOf(SHUT) > 0, p.url());
  ok('and the field keeps what he typed, to fix rather than retype',
     (await p.inputValue('#hello_in')) === '415 555 0000', await p.inputValue('#hello_in'));

  // ---------- the number that is on it ----------
  ENTER = { ok: true, session: 'SESS_DAVE', label: 'Dave', admin: false, allow: [SHUT] };
  await p.fill('#hello_in', '(415) 555-1212');
  await p.click('#hello_go');
  await p.waitForTimeout(400);
  ok('a number that is on it is welcomed',
     /You are in/.test(await p.evaluate(() => document.getElementById('hello_say').textContent)),
     await p.evaluate(() => document.getElementById('hello_say').textContent));
  ok('and the session is kept on this browser',
     (await p.evaluate(() => localStorage.getItem('vampjam_signin'))) === 'SESS_DAVE',
     await p.evaluate(() => localStorage.getItem('vampjam_signin')));
  await p.close();

  // ---------- an open recording is untouched ----------
  ME = { ok: true, signed_in: false };
  p = await ctx.newPage();
  await p.goto('https://vampsf.com/' + OPEN);
  await p.waitForTimeout(2000);
  ok('nobody signs in for a recording nobody restricted',
     await p.evaluate(() => !document.getElementById('hello')
                         && !document.body.classList.contains('gated')), 0);
  await p.close();

  // ---------- signed in, but not this one ----------
  ME = { ok: true, signed_in: true, id: 'ID_X', label: 'Sam', admin: false, allow: [] };
  p = await ctx.newPage();
  await p.goto('https://vampsf.com/' + SHUT);
  await p.waitForTimeout(2000);
  const already = await p.evaluate(() => ({
    hello: !!document.getElementById('hello'),
    gate: !document.getElementById('gate').hidden,
    why: document.getElementById('gate_why').textContent
  }));
  ok('somebody already signed in is not asked again', already.hello === false, already.hello);
  ok('they are told it was not shared with them',
     already.gate === true && /has not been shared with you/.test(already.why), already.why);
  await p.close();

  // ---------- the first number in still goes where the name is asked ----------
  ME = { ok: true, signed_in: false };
  ENTER = { ok: true, first: true, session: 'S', id: 'ID_P', id7: 'ID7_P', last4: '0105', admin: true, allow: '*' };
  p = await ctx.newPage();
  await p.goto('https://vampsf.com/' + SHUT);
  await p.waitForTimeout(2000);
  await p.fill('#hello_in', '917 693 0105');
  await p.click('#hello_go');
  await p.waitForTimeout(1500);
  ok('the very first sign-in is handed to the page that asks a name',
     /signin\.html/.test(p.url()) && p.url().indexOf(encodeURIComponent(SHUT)) > 0, p.url());
  await p.close();

  await ctx.close();
  await b.close();

  // ---------- one door, and the cache-buster ----------
  const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html') && !/claude_trash/.test(f));
  const dead = pages.filter(f => /rule\.mode/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));
  ok('no page carries its own private second gate any more', dead.length === 0, dead.join(' '));
  const drawn = pages.filter(f => /drawer\.js\?v=/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));
  const badD = drawn.filter(f => !/drawer\.js\?v=183/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));
  const styled = pages.filter(f => /site\.css\?v=/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));
  const badC = styled.filter(f => !/site\.css\?v=25/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));
  ok('every page asks for this build of drawer.js', badD.length === 0, badD.join(' '));
  ok('every page asks for this build of site.css',  badC.length === 0, badC.join(' '));

  // the redirect it replaced must not creep back into the gate
  const src = fs.readFileSync(path.join(DIR, 'drawer.js'), 'utf8');
  const g = src.slice(src.indexOf('function gate_shut'), src.indexOf('function signin_here'));
  ok('the gate no longer throws anyone at another address',
     !/location\.replace/.test(g), (g.match(/location\.replace[^;]*/g) || []).join(' | '));

  console.log('\nsignin_here: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH ' + e.message); process.exit(1); });

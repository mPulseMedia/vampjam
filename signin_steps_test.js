// signin_steps_test — the runbook is a two-sitting job done on a phone, and it
// now wears share_howto's clothes: dark navy sheet, cream panels, a coloured
// number column, and a drawn picture of every screen with a red ring around the
// one thing to click. So this suite asserts BOTH halves — that the steps still
// work (tick, persist, clear; the code button handing over exactly what is
// committed; the readout telling the truth) and that the look is really there
// and not just intended.
//
// NOTE on one_size: the old suite required exactly one computed font-size on
// this page. That rule is deliberately retired HERE and only here — the
// reference design is built out of Archivo at several sizes, and a runbook is
// not a vampjam app screen. Everything else on the site still gets one_size.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const WORKER = fs.readFileSync(path.join(DIR, 'cloudflare/vampjam_auth_worker.js'), 'utf8');

let STATUS = null;           // null = the worker is not there at all
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'https://vampsf.com' }).catch(() => {});
  await ctx.route('**/*', async (r) => {
    const u = r.request().url();
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
    if (u.includes('vampjam-auth')) {
      if (!STATUS) return r.abort('failed');
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(STATUS) });
    }
    if (u.includes('fonts.g')) return r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    if (u.includes('sessions_auto') || u.includes('api.github.com'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    if (u.includes('.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    return r.fulfill({ status: 204, body: '[]' });
  });

  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.goto('https://vampsf.com/signin_steps.html');
  await p.waitForTimeout(900);

  // ---------- the shape of it ----------
  const shape = await p.evaluate(() => ({
    steps:  document.querySelectorAll('li[data-k]').length,
    ticked: document.querySelectorAll('li[data-k] .tick').length,
    parts:  [...document.querySelectorAll('.panel[data-part]')].map(e => e.getAttribute('data-part')),
    heads:  [...document.querySelectorAll('.panel[data-part] h2')].map(e => e.textContent.trim()).filter(Boolean).length,
    keys:   [...document.querySelectorAll('li[data-k]')].map(e => e.getAttribute('data-k'))
  }));
  ok('twenty steps, each its own tickable thing', shape.steps === 20, shape.steps);
  ok('every step carries a tick',                 shape.ticked === shape.steps, shape.ticked);
  ok('grouped a through g',                       shape.parts.join('') === 'abcdefg', shape.parts.join(''));
  ok('every part says what it is for',            shape.heads === 7, shape.heads);
  ok('the keys are unique',                       new Set(shape.keys).size === shape.keys.length, shape.keys.join(','));

  // ---------- it looks like share_howto ----------
  const look = await p.evaluate(() => {
    const li = document.querySelector('ol.steps li[data-k]');
    const pn = document.querySelector('.panel[data-part]');
    return {
      sheet:   getComputedStyle(document.body).backgroundColor,
      card:    getComputedStyle(pn).backgroundColor,
      col:     getComputedStyle(pn).gridTemplateColumns.split(' ')[0],
      h1:      getComputedStyle(document.querySelector('h1')).fontWeight,
      h1fam:   getComputedStyle(document.querySelector('h1')).fontFamily,
      kick:    getComputedStyle(document.querySelector('.kicker')).textTransform,
      kickfam: getComputedStyle(document.querySelector('.kicker')).fontFamily,
      count:   getComputedStyle(li, '::before').color,
      hi:      getComputedStyle(document.querySelector('ol.steps b')).backgroundColor,
      line:    getComputedStyle(document.querySelector('.line')).backgroundColor,
      lab:     getComputedStyle(document.querySelector('.line small')).textTransform
    };
  });
  ok('dark navy sheet',            look.sheet === 'rgb(14, 42, 63)', look.sheet);
  ok('cream panels on it',         look.card === 'rgb(247, 245, 240)', look.card);
  ok('a 74px number column',       look.col === '74px', look.col);
  ok('archivo 800 for the title',  look.h1 === '800' && /Archivo/.test(look.h1fam), look.h1 + ' ' + look.h1fam);
  ok('narrow uppercase kicker',    look.kick === 'uppercase' && /Narrow/.test(look.kickfam), look.kick + ' ' + look.kickfam);
  ok('amber step counters',        look.count === 'rgb(163, 90, 0)', look.count);
  ok('the key words highlighted',  look.hi === 'rgb(255, 243, 214)', look.hi);
  ok('dark tap-to-copy bars',      look.line === 'rgb(16, 24, 32)' && look.lab === 'uppercase', look.line + ' ' + look.lab);

  // ---------- the drawn screens, and the ring ----------
  const draw = await p.evaluate(() => {
    const svgs = [...document.querySelectorAll('svg.mini')];
    return {
      n:      svgs.length,
      instep: svgs.filter(s => s.closest('li[data-k]')).length,
      ringed: svgs.filter(s => [...s.querySelectorAll('*')]
                .some(e => (e.getAttribute('stroke') || '').toLowerCase() === '#d7263d')).length,
      honest: svgs.filter(s => {
                const li = s.closest('li[data-k]');
                return li && /not yours/.test((li.textContent || ''));
              }).length,
      wide:   svgs.every(s => s.getBoundingClientRect().width > 230)
    };
  });
  ok('six screens drawn out',           draw.n === 6, draw.n);
  ok('each one sits inside its step',   draw.instep === draw.n, draw.instep);
  ok('each has the red ring on it',     draw.ringed === draw.n, draw.ringed);
  ok('and admits it is not his screen', draw.honest === draw.n, draw.honest);
  ok('they render at a readable size',  draw.wide === true, draw.wide);

  // ---------- ticks, and ticks that survive ----------
  await p.click('li[data-k="a1"] .tick');
  await p.click('li[data-k="a2"] .tick');
  const t1 = await p.evaluate(() => ({
    lit:  document.querySelector('li[data-k="a1"] .tick').classList.contains('on'),
    dim:  document.querySelector('li[data-k="a1"]').classList.contains('done'),
    said: document.querySelector('li[data-k="a1"] .tick').getAttribute('aria-pressed'),
    off:  document.querySelector('li[data-k="a3"] .tick').classList.contains('on')
  }));
  ok('a tap ticks it',              t1.lit && t1.dim && t1.said === 'true', JSON.stringify(t1));
  ok('and leaves the others alone', t1.off === false, t1.off);

  await p.reload(); await p.waitForTimeout(500);
  const t2 = await p.evaluate(() =>
    [...document.querySelectorAll('li[data-k] .tick')].filter(e => e.classList.contains('on')).length);
  ok('the ticks are still there after a reload', t2 === 2, t2);

  await p.click('li[data-k="a1"] .tick');
  const t3 = await p.evaluate(() => document.querySelector('li[data-k="a1"] .tick').classList.contains('on'));
  ok('tapping again un-ticks it', t3 === false, t3);

  // ---------- the collars ----------
  await p.evaluate(() => {
    [...document.querySelectorAll('.panel[data-part="a"] li[data-k] .tick')]
      .forEach(t => { if (!t.classList.contains('on')) t.click(); });
  });
  const c1 = await p.evaluate(() => ({
    a:    document.querySelector('.panel[data-part="a"]').className,
    b:    document.querySelector('.panel[data-part="b"]').className,
    nbg:  getComputedStyle(document.querySelector('.panel[data-part="a"] .n')).backgroundColor,
    tag:  getComputedStyle(document.querySelector('.panel[data-part="a"] .n'), '::after').content,
    next: getComputedStyle(document.querySelector('.panel[data-part="b"] .n'), '::after').content
  }));
  ok('a finished part wears the green collar', /\bdone\b/.test(c1.a) && c1.nbg === 'rgb(47, 143, 91)', c1.a + ' ' + c1.nbg);
  ok('and says so under its letter',           /done/.test(c1.tag), c1.tag);
  ok('the first unfinished part is "next"',    /\bnext\b/.test(c1.b) && /next/.test(c1.next), c1.b + ' ' + c1.next);

  await p.click('.panel[data-part="a"] li[data-k="a1"] .tick');
  const c2 = await p.evaluate(() => ({
    a: document.querySelector('.panel[data-part="a"]').className,
    b: document.querySelector('.panel[data-part="b"]').className
  }));
  ok('undoing one step takes the collar back', !/\bdone\b/.test(c2.a) && /\bnext\b/.test(c2.a) && !/\bnext\b/.test(c2.b),
     c2.a + ' | ' + c2.b);

  // ---------- clearing ----------
  await p.click('#reset');
  await p.reload(); await p.waitForTimeout(500);
  const t4 = await p.evaluate(() => ({
    on:   [...document.querySelectorAll('li[data-k] .tick')].filter(e => e.classList.contains('on')).length,
    next: document.querySelector('.panel[data-part="a"]').classList.contains('next')
  }));
  ok('clear all really clears, and stays cleared', t4.on === 0, t4.on);
  ok('and part a is next again',                   t4.next === true, t4.next);

  // ---------- the readout, in its three real states ----------
  const s0 = (await p.textContent('#state')).replace(/\s+/g, ' ').trim();
  ok('with no worker it says so and points at a',
     /not there yet/.test(s0) && /start at A/i.test(s0), s0);

  STATUS = { ok: true, worker: true, secret: true, twilio: false, from: null,
             admins: 0, people: 0, private: 0 };
  await p.click('#recheck'); await p.waitForTimeout(400);
  const s1 = (await p.textContent('#state')).replace(/\s+/g, ' ').trim();
  ok('half done, it names the steps still to do',
     /worker is up/.test(s1) && /AUTH_SECRET is set/.test(s1)
     && /D2, D3, D4/.test(s1) && /step F1/.test(s1) && /step G1/.test(s1), s1);

  STATUS = { ok: true, worker: true, secret: true, twilio: true, from: '•••4417',
             admins: 1, people: 3, private: 2 };
  await p.click('#recheck'); await p.waitForTimeout(400);
  const s2 = await p.evaluate(() => ({
    t: document.getElementById('state').textContent.replace(/\s+/g, ' ').trim(),
    c: document.getElementById('now_panel').className,
    dots: [...document.querySelectorAll('#state .dot')].map(d => d.className)
  }));
  ok('finished, it counts what is actually set up',
     /from •••4417/.test(s2.t) && /you are the administrator/.test(s2.t)
     && /3 people on the list/.test(s2.t) && /2 recordings are private/.test(s2.t), s2.t);
  ok('and the now panel goes green',      /\bdone\b/.test(s2.c), s2.c);
  ok('every line lit, none left waiting', s2.dots.length === 6 && s2.dots.every(c => /dot on/.test(c)), s2.dots.join(' | '));

  // singular, because "1 people" is how a page loses trust
  STATUS = { ok: true, worker: true, secret: true, twilio: true, from: '•••4417',
             admins: 1, people: 1, private: 1 };
  await p.click('#recheck'); await p.waitForTimeout(400);
  const s3 = (await p.textContent('#state')).replace(/\s+/g, ' ').trim();
  ok('one of a thing reads as one', /1 person on the list/.test(s3) && /1 recording is private/.test(s3), s3);

  // ---------- the program it hands over ----------
  await p.click('#copy_code'); await p.waitForTimeout(700);
  const cc = await p.evaluate(async () => ({
    clip: await navigator.clipboard.readText().catch(() => ''),
    lab:  document.querySelector('#copy_code small').textContent
  }));
  ok('the copy button hands over the committed worker, byte for byte', cc.clip === WORKER,
     cc.clip.length + ' vs ' + WORKER.length);
  ok('and says what it just did',  /copied/.test(cc.lab) && /KB/.test(cc.lab) && /Edit code/.test(cc.lab), cc.lab);
  await p.waitForTimeout(6400);
  const cc2 = await p.textContent('#copy_code small');
  ok('then goes back to inviting a tap', /tap to copy/.test(cc2), cc2);

  // ---------- the secret ----------
  const shown = () => p.evaluate(() =>
    (document.getElementById('make_secret').childNodes[1].nodeValue || '').trim());
  await p.click('#make_secret'); await p.waitForTimeout(250);
  const k1 = await shown();
  await p.click('#make_secret'); await p.waitForTimeout(250);
  const k2 = await shown();
  ok('the secret is 48 characters',        k1.length === 48, k1.length + ' "' + k1 + '"');
  ok('letters and numbers only',           /^[A-Za-z0-9]+$/.test(k1), k1);
  ok('a different one every tap',          k1 !== k2, k1 + ' / ' + k2);
  ok('and it is printed where he can see it',
     (await p.textContent('#make_secret')).indexOf(k2) >= 0 && k2.length === 48, k2);
  const clip2 = await p.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  ok('and copied for him',                 clip2 === k2, clip2);
  const many = [];
  for (let i = 0; i < 10; i++) { await p.click('#make_secret'); await p.waitForTimeout(90); many.push(await shown()); }
  ok('never comes up short, ten draws running',
     many.every(k => k.length === 48 && /^[A-Za-z0-9]+$/.test(k)), many.map(k => k.length).join(','));
  ok('and never repeats itself',           new Set(many).size === many.length, many.length);

  // ---------- honest about what it is not ----------
  const say = await p.evaluate(() => ({
    warn:  !!document.querySelector('.panel.warn'),
    text:  document.body.textContent.replace(/\s+/g, ' '),
    self:  [...document.querySelectorAll('a')].filter(a => /signin_steps/.test(a.getAttribute('href') || '')).length,
    out:   [...document.querySelectorAll('a')].map(a => a.getAttribute('href'))
  }));
  ok('it still admits the audio is not locked',
     say.warn && /public address/.test(say.text) && /lock/.test(say.text), say.warn);
  ok('the token is called a password and kept out of chat',
     /password/i.test(say.text) && /(not paste|do not.*chat|never.*chat)/i.test(say.text));
  // twilio runs two consoles and he has landed on both. the runbook has to name
  // the one it draws AND route him from the other, or the pictures lie again.
  ok('it names the console it draws',
     /Get started with Twilio/.test(say.text) && /Account Info/.test(say.text)
     && /Scroll to the bottom/i.test(say.text), 0);
  ok('and routes him back from the other one',
     /two<\/b> consoles|two consoles/.test(say.text) && /Let's get building/.test(say.text)
     && /Twilio Home/.test(say.text), 0);
  ok('the trial number limit is said where the number is picked',
     /trial number/i.test(say.text) && /verified/.test(say.text), 0);
  ok('it links out to both companies',
     say.out.some(h => /console\.twilio/.test(h)) && say.out.some(h => /dash\.cloudflare/.test(h)));
  ok('and never at itself',                 say.self === 0, say.self);

  // ---------- and the two pages that should point here ----------
  const adm = fs.readFileSync(path.join(DIR, 'admin.html'), 'utf8');
  const nxt = fs.readFileSync(path.join(DIR, 'vampjam_do_this_next.html'), 'utf8');
  ok('admin points at the runbook',        /signin_steps\.html/.test(adm));
  ok('do-this-next points at it too',      /signin_steps\.html/.test(nxt));

  await b.close();
  console.log('\nsignin_steps: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

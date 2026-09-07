// signin_steps_test — the runbook has to be usable across two sittings on a
// phone: every step tickable, the ticks surviving a reload, the code button
// handing over exactly what is committed, and the readout at the top telling
// the truth about where he actually is.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

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
    if (u.includes('sessions_auto') || u.includes('api.github.com'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    if (u.includes('.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    return r.fulfill({ status: 204, body: '[]' });
  });

  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.goto('https://vampsf.com/signin_steps.html');
  await p.waitForTimeout(1500);

  // ---------- the shape of it ----------
  const shape = await p.evaluate(() => ({
    steps: document.querySelectorAll('.step[data-k]').length,
    parts: [...document.querySelectorAll('.part_t')].map(e => e.textContent.trim()[0]),
    sizes: [...new Set([...document.querySelectorAll('.step_t, .part_t, li, .said, h1')]
      .map(e => getComputedStyle(e).fontSize))],
    keys: [...document.querySelectorAll('.step[data-k]')].map(e => e.getAttribute('data-k'))
  }));
  ok('every step is its own tickable thing',   shape.steps >= 18, shape.steps);
  ok('grouped A through G',                    shape.parts.join('') === 'ABCDEFG', shape.parts.join(''));
  ok('the keys are unique',                    new Set(shape.keys).size === shape.keys.length, shape.keys.join(','));
  ok('one type size on a page he reads from',  shape.sizes.length === 1 && shape.sizes[0] === '17px', shape.sizes.join(', '));

  // ---------- ticks, and ticks that survive ----------
  await p.click('.step[data-k="a1"] .tick');
  await p.click('.step[data-k="a2"] .tick');
  await p.click('.step[data-k="d1"] .tick');
  await p.waitForTimeout(200);
  const ticked = await p.evaluate(() => ({
    on: [...document.querySelectorAll('.step.done')].map(e => e.getAttribute('data-k')),
    pressed: document.querySelector('.step[data-k="a1"] .tick').getAttribute('aria-pressed')
  }));
  ok('ticking marks the step',                 ticked.on.join(',') === 'a1,a2,d1', ticked.on.join(','));
  ok('and says so to a screen reader',         ticked.pressed === 'true', ticked.pressed);

  await p.reload();
  await p.waitForTimeout(1200);
  const kept = await p.evaluate(() => [...document.querySelectorAll('.step.done')].map(e => e.getAttribute('data-k')));
  ok('the ticks survive closing the page',     kept.join(',') === 'a1,a2,d1', kept.join(','));

  await p.click('.step[data-k="a1"] .tick');
  await p.waitForTimeout(150);
  const off = await p.evaluate(() => [...document.querySelectorAll('.step.done')].map(e => e.getAttribute('data-k')));
  ok('and a tick can be taken back',           off.join(',') === 'a2,d1', off.join(','));

  await p.click('#reset');
  await p.waitForTimeout(150);
  const cleared = await p.evaluate(() => document.querySelectorAll('.step.done').length);
  ok('and all of them cleared at once',        cleared === 0, cleared);

  // ---------- the readout, in the state he is actually in ----------
  const none = await p.evaluate(() => document.getElementById('now').textContent.replace(/\s+/g, ' '));
  ok('with no worker it says start at A',      /not there yet/.test(none) && /start at A/.test(none), none.slice(0, 80));

  STATUS = { ok: true, worker: true, secret: true, twilio: false, from: null,
             admins: 0, people: 0, private: 0 };
  await p.click('#recheck');
  await p.waitForTimeout(600);
  const half = await p.evaluate(() => ({
    text: document.getElementById('now').textContent.replace(/\s+/g, ' '),
    on: document.querySelectorAll('#now .dot.on').length,
    off: document.querySelectorAll('#now .dot.off').length
  }));
  ok('half done, it says which steps are left',
     /Twilio can send — steps D2, D3, D4/.test(half.text), half.text.slice(0, 200));
  ok('and lights only what is actually done',  half.on === 2 && half.off === 4, half.on + ' on, ' + half.off + ' off');

  STATUS = { ok: true, worker: true, secret: true, twilio: true, from: '•••1212',
             admins: 1, people: 3, private: 1 };
  await p.click('#recheck');
  await p.waitForTimeout(600);
  const all = await p.evaluate(() => ({
    text: document.getElementById('now').textContent.replace(/\s+/g, ' '),
    on: document.querySelectorAll('#now .dot.on').length,
    off: document.querySelectorAll('#now .dot.off').length
  }));
  ok('finished, everything is lit',            all.on === 6 && all.off === 0, all.on + ' on, ' + all.off + ' off');
  ok('and it names the sending number',        /from •••1212/.test(all.text), all.text.slice(0, 120));
  ok('with the counts, not just ticks',        /3 people on the list/.test(all.text) && /1 recording is private/.test(all.text),
                                               all.text.slice(0, 220));

  // ---------- the code button hands over what is committed ----------
  await p.click('#copy_auth');
  await p.waitForTimeout(900);
  const clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
  const real = fs.readFileSync(path.join(DIR, 'cloudflare', 'vampjam_auth_worker.js'), 'utf8');
  ok('the copy button gives the committed worker, byte for byte', clip === real, clip.length + ' vs ' + real.length);
  const lbl = await p.evaluate(() => document.getElementById('copy_auth').textContent);
  ok('and says so',                            /copied/.test(lbl), lbl);

  // ---------- the secret it offers is worth using ----------
  await p.click('#make_secret');
  await p.waitForTimeout(200);
  const s1 = await p.evaluate(() => document.getElementById('secret_out').textContent.trim());
  await p.click('#make_secret');
  await p.waitForTimeout(200);
  const s2 = await p.evaluate(() => document.getElementById('secret_out').textContent.trim());
  ok('it can invent a secret',                 s1.length >= 40, s1.length + ' chars');
  ok('a different one every time',             s1 !== s2, s1.slice(0, 8) + ' / ' + s2.slice(0, 8));
  ok('with nothing but letters and digits in it', /^[A-Za-z0-9]+$/.test(s1), s1.slice(0, 20));

  // ---------- it is reachable, and it does not send him in circles ----------
  const links = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
  ok('it points at Admin and at Sign in',      links.includes('admin.html') && links.includes('signin.html'), '');
  ok('and never back at itself',               !links.includes('signin_steps.html'), '');
  const from = ['admin.html', 'vampjam_do_this_next.html'].filter(
    f => /signin_steps\.html/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));
  ok('and both other pages point AT it',       from.length === 2, from.join(','));

  // ---------- it does not overstate what this buys ----------
  const body = await p.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
  ok('it still says the audio is not locked',
     /public address/.test(body) && /does not lock the file/.test(body), '');
  ok('and never asks for a password in the chat',
     /do not paste it into a chat/i.test(body), '');

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

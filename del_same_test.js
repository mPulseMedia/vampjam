// del_same_test — the X on a recording row is the session row's X, and the
// delete prompt is short and does not print the code.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const REGISTRY = JSON.stringify([
  { page: 'session.html?p=short_one', name: '2026-09-01 Short', date: '2026-09-01', dur: 240,  count: 1 },
  { page: 'session.html?p=long_one',  name: '2026-09-02 Long',  date: '2026-09-02', dur: 3000, count: 4 }
]);

// the declarations that decide whether two buttons are the same button
const LOOK = ['fontSize', 'padding', 'borderRadius', 'opacity', 'color',
              'backgroundColor', 'minHeight', 'lineHeight', 'borderStyle'];

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });

  await ctx.addInitScript(() => {
    const blob = new Blob([new Uint8Array(64)], { type: 'audio/mp4' });
    class F { constructor() { this.state = 'inactive'; this.ondataavailable = null; this.onstop = null; }
      start() { this.state = 'recording'; } stop() { this.state = 'inactive'; }
      requestData() {} pause() {} resume() {} }
    F.isTypeSupported = () => true;
    window.MediaRecorder = F;
    if (!navigator.mediaDevices) Object.defineProperty(navigator, 'mediaDevices', { value: {} });
    navigator.mediaDevices.getUserMedia = () => Promise.resolve({ getTracks: () => [{ stop() {} }] });
  });

  await ctx.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.startsWith('https://vampsf.com/')) {
      const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      const p = path.join(DIR, rel);
      if (fs.existsSync(p)) {
        const t = rel.endsWith('.css') ? 'text/css'
                : rel.endsWith('.js')  ? 'application/javascript'
                : rel.endsWith('.json')? 'application/json' : 'text/html';
        return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p) });
      }
      return r.fulfill({ status: 404, body: '' });
    }
    if (u.includes('sessions_auto'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: REGISTRY });
    if (u.includes('bazaar_cafe.json'))
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json')) });
    if (u.includes('.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    if (u.startsWith(R2))
      return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
    return r.fulfill({ status: 204, body: '[]' });
  });

  const PROBE = `(sel, keys) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const c = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    const row = e.closest('.tag_row, .mom_row').getBoundingClientRect();
    const s = e.querySelector('svg');
    const rs = s ? s.getBoundingClientRect() : null;
    const o = {
      box: [Math.round(r.width), Math.round(r.height)],
      svg: rs ? [Math.round(rs.width), Math.round(rs.height)] : null,
      rightInset: Math.round(row.right - r.right),
      midOff: Math.round((r.top + r.bottom) / 2 - (row.top + row.bottom) / 2),
      last: e === e.parentElement.querySelector(':scope > *:last-child'),
      d: s && s.querySelector('path') ? s.querySelector('path').getAttribute('d') : null,
      strokeW: s ? s.getAttribute('stroke-width') : null
    };
    keys.forEach(k => { o[k] = c[k]; });
    return o;
  }`;

  // ---- the session row's X ----
  const s = await ctx.newPage();
  s.on('pageerror', e => { fail++; console.log('  FAIL pageerror (session): ' + e.message); });
  await s.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await s.waitForFunction(() => document.querySelectorAll('.tag_row').length > 0, { timeout: 15000 }).catch(() => {});
  await s.waitForTimeout(700);
  const S = await s.evaluate(([src, keys]) => eval(src)('.tag_row .tag_del', keys), [PROBE, LOOK]);
  await s.close();

  // ---- the recording row's X ----
  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (record): ' + e.message); });
  await p.goto('https://vampsf.com/record.html');
  await p.waitForTimeout(800);
  await p.click('#rec_btn'); await p.waitForTimeout(400);
  await p.click('#tag_btn'); await p.waitForTimeout(400);
  const R = await p.evaluate(([src, keys]) => eval(src)('.mom_row .mom_del', keys), [PROBE, LOOK]);

  ok('both rows have an X',            !!S && !!R, JSON.stringify([!!S, !!R]));
  ok('the same drawing',               S.d === R.d && S.strokeW === R.strokeW, S.d + ' vs ' + R.d);
  ok('the same drawn size',            S.svg[0] === R.svg[0] && S.svg[1] === R.svg[1],
                                       JSON.stringify([S.svg, R.svg]));
  ok('the same target',                S.box[0] === R.box[0] && S.box[1] === R.box[1],
                                       JSON.stringify([S.box, R.box]));
  const diff = LOOK.filter(k => S[k] !== R[k]).map(k => k + ': ' + S[k] + ' vs ' + R[k]);
  ok('identical, declaration for declaration', diff.length === 0, diff.join(' | '));
  ok('the same distance from the row edge', S.rightInset === R.rightInset,
                                       S.rightInset + ' vs ' + R.rightInset);
  ok('centred in the row on both',     S.midOff === R.midOff && Math.abs(R.midOff) <= 1,
                                       S.midOff + ' vs ' + R.midOff);
  ok('and last in the row on both',    S.last === true && R.last === true,
                                       JSON.stringify([S.last, R.last]));
  await p.close();

  // ---- the prompt ----
  const f = await ctx.newPage();
  f.on('pageerror', e => { fail++; console.log('  FAIL pageerror (favorites): ' + e.message); });
  await f.goto('https://vampsf.com/favorites.html');
  await f.waitForTimeout(1200);
  await f.evaluate(() => document.getElementById('page_sessions').click());
  await f.waitForTimeout(600);

  const openIt = (key) => f.evaluate((k) => {
    const bt = [...document.querySelectorAll('.jam_del')].find(x => x.getAttribute('data-page') === k);
    bt.click();
    const ov = document.querySelector('.jamc_overlay');
    const inp = ov.querySelector('.jamc_code');
    return { msg: ov.querySelector('.jamc_msg').textContent,
             placeholder: inp ? inp.placeholder : null,
             aria: inp ? inp.getAttribute('aria-label') : null,
             title: inp ? inp.title : null,
             all: ov.textContent + ' ' + ov.innerHTML };
  }, key);
  const close = () => f.evaluate(() => { const o = document.querySelector('.jamc_overlay'); if (o) o.remove(); });

  const shortC = await openIt('session.html?p=short_one');
  ok('a short recording just asks the question',
     shortC.msg === 'Delete "2026-09-01 Short"?', JSON.stringify(shortC.msg));
  ok('with no code field',            shortC.placeholder === null, shortC.placeholder);
  await close();

  const longC = await openIt('session.html?p=long_one');
  ok('a long one adds only its length and the ask',
     longC.msg === 'Delete "2026-09-02 Long"?\n\n50 min. Enter the code.', JSON.stringify(longC.msg));
  ok('the message is short — under 60 characters',
     longC.msg.length < 60, longC.msg.length);
  ok('no paragraph about what deleting means',
     !/removes it|only exists|is final|go with it/.test(longC.msg), longC.msg);

  // code_hush — the number must appear NOWHERE the user can see or read
  ok('the placeholder does not print the code', !/8764/.test(longC.placeholder || ''), longC.placeholder);
  ok('nor the aria-label',                      !/8764/.test(longC.aria || ''), longC.aria);
  ok('nor the title',                           !/8764/.test(longC.title || ''), longC.title);
  ok('nor anything else in the pop-up',         !/8764/.test(longC.all), 'found it in the overlay');

  // and it still works
  const armed = await f.evaluate(() => {
    const inp = document.querySelector('.jamc_code');
    const yes = document.querySelector('.jamc_yes');
    const before = yes.disabled;
    inp.value = '8764'; inp.dispatchEvent(new Event('input', { bubbles: true }));
    return { before: before, after: yes.disabled };
  });
  ok('the gate still starts locked', armed.before === true, armed.before);
  ok('and the code still opens it',  armed.after === false, armed.after);
  await close();

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

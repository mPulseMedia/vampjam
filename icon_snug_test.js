// icon_snug_test — the right-hand controls on a highlight row sit 20% closer,
// with their tap targets intact; and REC is back on the centre line.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

// What the eye actually measures: the edge of one DRAWING to the edge of the
// next. Padding is the wrong proxy — the cassette link has none and centres a
// 24px svg in a 34px box by flex, and the heart's glyph is smaller than its
// content box — so both pages under-report if you go by padding. Measure the
// svg itself and the number means the same thing everywhere.
const GLYPH_GAPS = `(els) => {
  const draw = (e) => (e.querySelector('svg') || e).getBoundingClientRect();
  const out = [];
  for (let i = 1; i < els.length; i++) {
    out.push(Math.round(draw(els[i]).left - draw(els[i - 1]).right));
  }
  return out;
}`;
// The ask was "20% closer". The pull is a negative margin, so
//   before = after + |margin|,  and  after / before must be 0.8
// which pins |margin| at a fifth of the original spacing. Asserting the RATIO
// keeps the test honest without hard-coding a number measured once by hand.
const closer = (after, margin) => after / (after + margin);

const SESSION_JSON = JSON.stringify({
  audio: { label: 'x', url: R2 + 'x.m4a', kind: 'url' },
  tags: [{ id: 't1', t: 10, label: 'Pretty piano song', fav: true },
         { id: 't2', t: 60, label: 'Even slower but strong', fav: true },
         { id: 't3', t: 120, label: 'Musical: See where I go', fav: true }]
});

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
    if (u.includes('fav_order'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"order":[]}' });
    if (u.includes('bazaar_cafe.json'))
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json')) });
    if (u.includes('.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: SESSION_JSON });
    if (u.startsWith(R2))
      return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
    return r.fulfill({ status: 204, body: '[]' });
  });

  // ---------- the session row ----------
  const s = await ctx.newPage();
  s.on('pageerror', e => { fail++; console.log('  FAIL pageerror (session): ' + e.message); });
  await s.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await s.waitForFunction(() => document.querySelectorAll('.tag_row').length > 0, { timeout: 15000 }).catch(() => {});
  await s.waitForTimeout(700);
  const S = await s.evaluate((src) => {
    const gaps = eval(src);
    const row = document.querySelector('.tag_row');
    const els = [...row.querySelectorAll('button.ghost')].filter(e => e.offsetParent !== null);
    return { n: els.length, gaps: gaps(els),
             widths: els.map(e => Math.round(e.getBoundingClientRect().width)),
             heights: els.map(e => Math.round(e.getBoundingClientRect().height)),
             pad: getComputedStyle(els[0]).padding };
  }, GLYPH_GAPS);
  await s.close();

  ok('the session row still has its three controls', S.n === 3, S.n);
  ok('its two gaps are even',
     S.gaps.length === 2 && S.gaps[0] === S.gaps[1], JSON.stringify(S.gaps));
  ok('and 20% closer than they were (ratio, -4px pull)',
     S.gaps.every(g => Math.abs(closer(g, 4) - 0.8) <= 0.035),
     JSON.stringify(S.gaps) + ' -> ' + S.gaps.map(g => closer(g, 4).toFixed(2)));
  ok('and the tap targets did NOT shrink',
     S.widths.every(w => w >= 40) && S.heights.every(h => h >= 32),
     JSON.stringify([S.widths, S.heights]));
  ok('because the padding is untouched', S.pad === '5px 7px', S.pad);

  // ---------- the favourites row ----------
  const f = await ctx.newPage();
  f.on('pageerror', e => { fail++; console.log('  FAIL pageerror (favorites): ' + e.message); });
  await f.goto('https://vampsf.com/favorites.html');
  await f.waitForFunction(() => document.querySelectorAll('.fav_row').length > 0, { timeout: 15000 }).catch(() => {});
  await f.waitForTimeout(700);
  const F = await f.evaluate((src) => {
    const gaps = eval(src);
    const row = document.querySelector('.fav_row');
    const els = [...row.querySelectorAll('a.fav_sess, button.fav_heart')].filter(e => e.offsetParent !== null);
    return { n: els.length, gaps: gaps(els),
             widths: els.map(e => Math.round(e.getBoundingClientRect().width)),
             heights: els.map(e => Math.round(e.getBoundingClientRect().height)) };
  }, GLYPH_GAPS);
  await f.close();

  ok('the favourites row still has its three controls', F.n === 3, F.n);
  ok('cassette to share is 20% closer',
     Math.abs(closer(F.gaps[0], 3) - 0.8) <= 0.035,
     F.gaps[0] + ' -> ' + closer(F.gaps[0], 3).toFixed(2));
  ok('share to heart is too',
     Math.abs(closer(F.gaps[1], 3) - 0.8) <= 0.035,
     F.gaps[1] + ' -> ' + closer(F.gaps[1], 3).toFixed(2));
  ok('and their tap targets did NOT shrink',
     F.widths.every(w => w >= 34) && F.heights.every(h => h >= 34),
     JSON.stringify([F.widths, F.heights]));

  // ---------- rec_centre ----------
  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (record): ' + e.message); });
  await p.goto('https://vampsf.com/record.html');
  await p.waitForTimeout(800);
  const R = await p.evaluate(() => {
    const btn = document.querySelector('.rec_btn').getBoundingClientRect();
    const row = document.querySelector('.ctrl_row').getBoundingClientRect();
    return { btnMid: Math.round(btn.left + btn.width / 2),
             rowMid: Math.round(row.left + row.width / 2),
             pageMid: Math.round(document.documentElement.clientWidth / 2),
             justify: getComputedStyle(document.querySelector('.ctrl_row')).justifyContent };
  });
  ok('REC is on the centre line, not the left',
     Math.abs(R.btnMid - R.pageMid) <= 2, JSON.stringify(R));
  ok('and centred within its row',  Math.abs(R.btnMid - R.rowMid) <= 2, JSON.stringify(R));
  ok('space-between is gone from this row — six of its seven children are hidden',
     R.justify === 'center', R.justify);

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

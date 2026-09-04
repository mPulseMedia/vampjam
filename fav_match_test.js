// fav_match_test — favourites wears the session page's header and transport row,
// the circles actually seek, and nothing else about the page moved.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };
const near = (a, b, tol) => a !== null && b !== null && Math.abs(a - b) <= (tol || 2);

const SESSION = JSON.stringify({
  audio: { label: 'x', url: R2 + 'x.m4a', kind: 'url' },
  tags: [{ id: 't1', t: 10, label: 'Pretty piano song', fav: true },
         { id: 't2', t: 60, label: 'Even slower but strong', fav: true },
         { id: 't3', t: 120, label: 'Musical: See where I go', fav: true }]
});

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
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
    if (u.includes('.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: SESSION });
    if (u.startsWith(R2)) {
      const rng = r.request().headers()['range'];
      const m = rng && /bytes=(\d+)-(\d*)/.exec(rng);
      if (m) { const a = +m[1], z = m[2] ? +m[2] : SIL.length - 1;
        return r.fulfill({ status: 206, headers: {
          'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes',
          'Content-Range': 'bytes ' + a + '-' + z + '/' + SIL.length,
          'Content-Length': String(z - a + 1) }, body: SIL.subarray(a, z + 1) });
      }
      return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
    }
    return r.fulfill({ status: 204, body: '[]' });
  });

  const band = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom),
             h: Math.round(r.height), w: Math.round(r.width) };
  };

  // ---- the session page, as the reference ----
  const s = await ctx.newPage();
  s.on('pageerror', e => { fail++; console.log('  FAIL pageerror (session): ' + e.message); });
  await s.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await s.waitForTimeout(1200);
  const S = await s.evaluate((src) => {
    const band = eval('(' + src + ')');
    const cs = q => getComputedStyle(document.querySelector(q));
    return { title: band('h1'), ctrl: band('.ctrl_row'), big: band('.play_btn'),
             btn: band('#back_15'), gap: cs('.ctrl_row').gap,
             btnBg: cs('#back_15').backgroundColor, btnColor: cs('#back_15').color,
             btnRadius: cs('#back_15').borderRadius, btnWeight: cs('#back_15 .cn').fontWeight,
             bigShadow: cs('.play_btn').boxShadow };
  }, band.toString());
  await s.close();

  // ---- favourites ----
  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (favorites): ' + e.message); });
  await p.goto('https://vampsf.com/favorites.html');
  await p.waitForFunction(() => document.querySelectorAll('.fav_row').length > 0, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(800);
  const F = await p.evaluate((src) => {
    const band = eval('(' + src + ')');
    const cs = q => getComputedStyle(document.querySelector(q));
    return { title: band('h1'), ctrl: band('.ctrl_row'), big: band('.fav_play'),
             btn: band('#back_15'), gap: cs('.ctrl_row').gap,
             btnBg: cs('#back_15').backgroundColor, btnColor: cs('#back_15').color,
             btnRadius: cs('#back_15').borderRadius, btnWeight: cs('#back_15 .cn').fontWeight,
             bigShadow: cs('.fav_play').boxShadow,
             circles: document.querySelectorAll('.ctrl_btn').length,
             labels: [...document.querySelectorAll('.ctrl_btn')].map(e => e.textContent.replace(/\s+/g, '')),
             listPad: cs('.fav_list').paddingBottom, listMar: cs('.fav_list').marginBottom,
             rows: document.querySelectorAll('.fav_row').length,
             scrollW: document.documentElement.scrollWidth,
             vw: document.documentElement.clientWidth,
             // the RULE, not the word: a comment explaining why the row carries
             // the sticky player's old padding is not the dead rule coming back
             deadCss: document.documentElement.innerHTML.indexOf('.sticky_player {') };
  }, band.toString());

  ok('the title sits on the same line',   near(S.title.top, F.title.top), S.title.top + ' vs ' + F.title.top);
  ok('and takes the same box',            near(S.title.h, F.title.h), S.title.h + ' vs ' + F.title.h);
  ok('the control row starts on the same line', near(S.ctrl.top, F.ctrl.top), S.ctrl.top + ' vs ' + F.ctrl.top);
  ok('and ends on it',                    near(S.ctrl.bottom, F.ctrl.bottom), S.ctrl.bottom + ' vs ' + F.ctrl.bottom);
  ok('the play circle is the same size',  near(S.big.h, F.big.h) && near(S.big.w, F.big.w),
                                          JSON.stringify([S.big, F.big]));
  ok('and carries no haze either',        F.bigShadow === 'none' && S.bigShadow === 'none',
                                          S.bigShadow + ' / ' + F.bigShadow);
  ok('there are six seek circles',        F.circles === 6, F.circles);
  ok('reading -2m -15s -5s +5s +15s +2m',
     F.labels.join('|') === '−2m|−15s|−5s|+5s|+15s|+2m', F.labels.join('|'));
  ok('a circle is the same size',         near(S.btn.h, F.btn.h) && near(S.btn.w, F.btn.w),
                                          JSON.stringify([S.btn, F.btn]));
  ok('the same ground',                   S.btnBg === F.btnBg, S.btnBg + ' vs ' + F.btnBg);
  ok('the same ink',                      S.btnColor === F.btnColor, S.btnColor + ' vs ' + F.btnColor);
  ok('the same corner',                   S.btnRadius === F.btnRadius, S.btnRadius + ' vs ' + F.btnRadius);
  ok('and unbolded, like over there',     S.btnWeight === F.btnWeight && F.btnWeight === '400',
                                          S.btnWeight + ' vs ' + F.btnWeight);
  ok('the row still fits the screen',     F.scrollW <= F.vw, F.scrollW + ' > ' + F.vw);
  ok('the list has no padding under its last row', F.listPad === '0px', F.listPad);
  ok('and no dangling margin',            parseFloat(F.listMar) <= 12, F.listMar);
  ok('the dead sticky_player css is gone', F.deadCss === -1, F.deadCss);

  // ---- and the circles actually seek ----
  ok('there are favourites to play',      F.rows > 0, F.rows);
  await p.click('.fav_row .fav_play_sm').catch(() => {});
  await p.waitForFunction(() => {
    const a = document.getElementById('player');
    return a && a.src && isFinite(a.duration) && a.duration > 0;
  }, { timeout: 12000 }).catch(() => {});
  await p.evaluate(() => { document.getElementById('player').currentTime = 100; });
  await p.waitForTimeout(300);
  const t0 = await p.evaluate(() => document.getElementById('player').currentTime);
  ok('the player is somewhere to seek from', t0 > 90, t0);

  await p.click('#back_15'); await p.waitForTimeout(250);
  const t1 = await p.evaluate(() => document.getElementById('player').currentTime);
  ok('-15s goes back fifteen seconds',    near(t1, t0 - 15, 1.5), t0 + ' -> ' + t1);

  await p.click('#fwd_5'); await p.waitForTimeout(250);
  const t2 = await p.evaluate(() => document.getElementById('player').currentTime);
  ok('+5s goes forward five',             near(t2, t1 + 5, 1.5), t1 + ' -> ' + t2);

  // clamped at both ends
  await p.evaluate(() => { document.getElementById('player').currentTime = 3; });
  await p.waitForTimeout(200);
  await p.click('#back_120'); await p.waitForTimeout(250);
  const t3 = await p.evaluate(() => document.getElementById('player').currentTime);
  ok('-2m near the start lands on the start, not before it', t3 >= 0 && t3 < 1, t3);

  const dur = await p.evaluate(() => document.getElementById('player').duration);
  await p.evaluate((d) => { document.getElementById('player').currentTime = d - 3; }, dur);
  await p.waitForTimeout(200);
  await p.click('#fwd_120'); await p.waitForTimeout(250);
  const t4 = await p.evaluate(() => document.getElementById('player').currentTime);
  ok('+2m near the end lands on the end, not past it', t4 <= dur + 0.1, t4 + ' / ' + dur);

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

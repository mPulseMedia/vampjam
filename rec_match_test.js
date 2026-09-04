// rec_match_test — the record screen and the session screen are the same screen
// with different verbs. Every band lands on the same line; only the parts that
// genuinely differ differ.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };
const near = (a, b, tol) => a !== null && b !== null && Math.abs(a - b) <= (tol || 2);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });

  // a fake microphone, so the record screen can actually be recording
  await ctx.addInitScript(() => {
    const blob = new Blob([new Uint8Array(64)], { type: 'audio/mp4' });
    class F { constructor() { this.state = 'inactive'; this.ondataavailable = null; this.onstop = null; }
      start() { this.state = 'recording'; }
      stop() { this.state = 'inactive';
               if (this.ondataavailable) this.ondataavailable({ data: blob });
               if (this.onstop) this.onstop(); }
      requestData() { if (this.ondataavailable) this.ondataavailable({ data: blob }); }
      pause() {} resume() {} }
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
    if (u.includes('raw.githubusercontent.com') && u.includes('bazaar_cafe.json'))
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json')) });
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

  const geo = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom),
             h: Math.round(r.height), w: Math.round(r.width),
             left: Math.round(r.left) };
  };

  // ---------- the session screen ----------
  const s = await ctx.newPage();
  s.on('pageerror', e => { fail++; console.log('  FAIL pageerror (session): ' + e.message); });
  await s.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await s.waitForFunction(() => document.querySelectorAll('.tag_row').length > 0, { timeout: 15000 }).catch(() => {});
  await s.waitForTimeout(700);
  const S = await s.evaluate((src) => {
    const geo = eval('(' + src + ')');
    const cs = q => getComputedStyle(document.querySelector(q));
    return {
      title: geo('h1'), ctrl: geo('.ctrl_row'), big: geo('.play_btn'),
      tag: geo('.tag_btn_big'), time: geo('.time_row'), bar: geo('.seek_bar'),
      nums: geo('.tag_numbers'), list: geo('.tag_list'), row: geo('.tag_row'),
      listPad: cs('.tag_list').paddingBottom, listMar: cs('.tag_list').marginBottom,
      listBg: cs('.tag_list').backgroundColor, listShadow: cs('.tag_list').boxShadow,
      listRadius: cs('.tag_list').borderRadius,
      rowPad: cs('.tag_row').padding, rowGap: cs('.tag_row').gap,
      rule: getComputedStyle(document.querySelectorAll('.tag_row')[1]).borderTopWidth,
      titleWeight: cs('h1').fontWeight, titleColor: cs('h1').color, titleSize: cs('h1').fontSize
    };
  }, geo.toString());
  await s.close();

  // ---------- the record screen, mid-take, with two moments ----------
  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (record): ' + e.message); });
  await p.goto('https://vampsf.com/record.html');
  await p.waitForTimeout(800);
  await p.click('#rec_btn');
  await p.waitForTimeout(500);
  await p.click('#tag_btn'); await p.waitForTimeout(200);
  await p.click('#tag_btn'); await p.waitForTimeout(400);
  const R = await p.evaluate((src) => {
    const geo = eval('(' + src + ')');
    const cs = q => getComputedStyle(document.querySelector(q));
    return {
      title: geo('.name_row'), ctrl: geo('.ctrl_row'), big: geo('.rec_btn'),
      tag: geo('.tag_btn'), time: geo('.time_row'), bar: geo('.rec_bar'),
      nums: geo('.num_strip'), list: geo('.mom_list'), row: geo('.mom_row'),
      listPad: cs('.mom_list').paddingBottom, listMar: cs('.mom_list').marginBottom,
      listBg: cs('.mom_list').backgroundColor, listShadow: cs('.mom_list').boxShadow,
      listRadius: cs('.mom_list').borderRadius,
      rowPad: cs('.mom_row').padding, rowGap: cs('.mom_row').gap,
      rule: getComputedStyle(document.querySelectorAll('.mom_row')[1]).borderTopWidth,
      titleWeight: cs('#name_in').fontWeight, titleColor: cs('#name_in').color, titleSize: cs('#name_in').fontSize,
      rows: document.querySelectorAll('.mom_row').length,
      dels: document.querySelectorAll('.mom_del').length,
      hasPlay: !!document.querySelector('.mom_row .play_tag'),
      hasHeart: !!document.querySelector('.mom_row .tag_fav'),
      hasShare: !!document.querySelector('.mom_row .tag_share')
    };
  }, geo.toString());

  // ---------- the bands ----------
  ok('the big button is the same circle',
     near(S.big.h, R.big.h) && near(S.big.w, R.big.w), JSON.stringify([S.big, R.big]));
  ok('the control row starts on the same line', near(S.ctrl.top, R.ctrl.top), S.ctrl.top + ' vs ' + R.ctrl.top);
  ok('and ends on it',                          near(S.ctrl.bottom, R.ctrl.bottom), S.ctrl.bottom + ' vs ' + R.ctrl.bottom);
  ok('Tag the Moment is on the same line',      near(S.tag.top, R.tag.top), S.tag.top + ' vs ' + R.tag.top);
  ok('and is the same size',                    near(S.tag.h, R.tag.h) && near(S.tag.w, R.tag.w),
                                                JSON.stringify([S.tag, R.tag]));
  ok('the clock is on the same line',           near(S.time.top, R.time.top), S.time.top + ' vs ' + R.time.top);
  ok('the timeline is on the same line',        near(S.bar.top, R.bar.top), S.bar.top + ' vs ' + R.bar.top);
  ok('and the same thickness',                  near(S.bar.h, R.bar.h), S.bar.h + ' vs ' + R.bar.h);
  ok('the moment numbers are on the same line', near(S.nums.top, R.nums.top), S.nums.top + ' vs ' + R.nums.top);
  ok('and the same width',                      near(S.nums.w, R.nums.w), S.nums.w + ' vs ' + R.nums.w);
  ok('the list starts on the same line',        near(S.list.top, R.list.top), S.list.top + ' vs ' + R.list.top);

  // ---------- the rows ----------
  ok('a row is the same height',   near(S.row.h, R.row.h, 1), S.row.h + ' vs ' + R.row.h);
  ok('with the same padding',      S.rowPad === R.rowPad, S.rowPad + ' vs ' + R.rowPad);
  ok('the same gap',               S.rowGap === R.rowGap, S.rowGap + ' vs ' + R.rowGap);
  ok('and the same hairline between rows', S.rule === R.rule, S.rule + ' vs ' + R.rule);
  ok('the panel has the same ground',  S.listBg === R.listBg, S.listBg + ' vs ' + R.listBg);
  ok('the same inner shadow',          S.listShadow === R.listShadow, S.listShadow + ' vs ' + R.listShadow);
  ok('the same corner',                S.listRadius === R.listRadius, S.listRadius + ' vs ' + R.listRadius);

  // ---------- the title ----------
  ok('the title is the same weight', S.titleWeight === R.titleWeight, S.titleWeight + ' vs ' + R.titleWeight);
  ok('the same colour',              S.titleColor === R.titleColor, S.titleColor + ' vs ' + R.titleColor);
  ok('the same size',                S.titleSize === R.titleSize, S.titleSize + ' vs ' + R.titleSize);

  // ---------- list_tight: nothing dangling under the last row ----------
  ok('the session list has no padding under its last row', S.listPad === '0px', S.listPad);
  ok('and no more margin than a normal gap',
     parseFloat(S.listMar) <= 12, S.listMar);

  // ---------- the differences that pertain ----------
  ok('a recording row carries a delete',   R.dels === R.rows && R.rows === 2, R.dels + '/' + R.rows);
  ok('and nothing else',                   !R.hasPlay && !R.hasHeart && !R.hasShare,
                                           JSON.stringify([R.hasPlay, R.hasHeart, R.hasShare]));

  // and the delete works
  await p.click('.mom_row .mom_del');
  await p.waitForTimeout(300);
  const after = await p.evaluate(() => ({
    rows: document.querySelectorAll('.mom_row').length,
    firstNum: document.querySelector('.mom_num') && document.querySelector('.mom_num').textContent,
    barNums: document.querySelectorAll('.mom_no').length
  }));
  ok('deleting a moment removes its row',  after.rows === 1, JSON.stringify(after));
  ok('the rows renumber from 1',           after.firstNum === '1', JSON.stringify(after));
  ok('and the bar loses its number too',   after.barNums === 1, JSON.stringify(after));

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

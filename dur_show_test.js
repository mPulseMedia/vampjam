// dur_show_test — a session row shows how long the recording is, in h:mm, at
// full strength, and the name dissolves under it rather than ending in an
// ellipsis. One shape for every row: 0:05, not 5m.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const REG = [
  { page: 'session.html?p=long',  name: '2026-09-04 A name far too long to fit in the room a phone gives it', date: '2026-09-04', dur: 9676, count: 3 },
  { page: 'session.html?p=short', name: '2026-09-03 Short', date: '2026-09-03', dur: 298,   count: 0 },
  { page: 'session.html?p=hour',  name: '2026-09-02 Hour',  date: '2026-09-02', dur: 3600,  count: 1 },
  { page: 'session.html?p=zero',  name: '2026-09-01 Zero',  date: '2026-09-01', dur: 0,     count: 0 }
];

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
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
    if (u.includes('fav_order')) return r.fulfill({ status: 200, contentType: 'application/json', body: '{"order":[]}' });
    if (u.includes('sessions_auto') || u.includes('api.github.com'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(REG) });
    if (u.includes('bazaar_cafe.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json')) });
    if (u.includes('.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    if (u.startsWith(R2)) return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav' }, body: SIL });
    return r.fulfill({ status: 204, body: '[]' });
  });

  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.addInitScript(() => {
    try { localStorage.setItem('vampjam_fav_seen', '1'); localStorage.clear(); } catch (e) {}
  });
  await p.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await p.waitForTimeout(1800);
  await p.click('#page_sessions');
  await p.waitForTimeout(1600);

  const row = (k) => p.evaluate((key) => {
    const el = document.querySelector('.jam_item:has(a[href="session.html?p=' + key + '"])');
    if (!el) return null;
    const d = el.querySelector('.jam_dur'), n = el.querySelector('.jam_name');
    const dr = d.getBoundingClientRect(), nr = n.getBoundingClientRect(), rr = el.getBoundingClientRect();
    const cs = getComputedStyle(d), ns = getComputedStyle(n);
    return {
      dur: d.textContent, color: cs.color, nums: cs.fontVariantNumeric,
      fades: n.classList.contains('fade'),
      mask: ns.maskImage || ns.webkitMaskImage || 'none',
      ellipsis: ns.textOverflow,
      clipped: n.scrollWidth > n.clientWidth + 1,
      order: Math.round(nr.right) <= Math.round(dr.left) + 1,
      inRow: Math.round(dr.right) <= Math.round(rr.right)
    };
  }, k);

  // ---------- h:mm, one shape ----------
  const L = await row('long'), S = await row('short'), H = await row('hour'), Z = await row('zero');
  ok('2h41m reads 2:41',                  L && L.dur === '2:41', L && L.dur);
  ok('and five minutes reads 0:05, not 5m', S && S.dur === '0:05', S && S.dur);
  ok('an exact hour reads 1:00',          H && H.dur === '1:00', H && H.dur);
  ok('a length nobody knows shows nothing', Z && Z.dur === '', JSON.stringify(Z && Z.dur));

  // ---------- black, and lined up ----------
  const fg = await p.evaluate(() => getComputedStyle(document.body).color);
  ok('the duration is the page’s own text colour', L.color === fg, L.color + ' vs ' + fg);
  const muted = await p.evaluate(() => {
    const el = document.querySelector('.jam_item .menu_sub'); return el ? getComputedStyle(el).color : '';
  });
  ok('not the muted grey the count wears', L.color !== muted, L.color + ' vs ' + muted);
  ok('and tabular, so the column lines up', /tabular-nums/.test(L.nums), L.nums);
  ok('it sits to the right of the name',   L.order === true, L.order);
  ok('inside the row',                     L.inRow === true, L.inRow);

  // ---------- the name fades under it ----------
  ok('a name too long to fit is clipped',  L.clipped === true, L.clipped);
  ok('and fades rather than ending in an ellipsis',
     L.fades === true && /gradient/.test(L.mask) && L.ellipsis === 'clip', L.fades + ' ' + L.ellipsis + ' ' + L.mask.slice(0, 40));
  ok('a name that FITS is not faded',      S.fades === false && S.ellipsis === 'ellipsis', S.fades + ' ' + S.ellipsis);
  ok('and carries no mask at all',         S.mask === 'none', S.mask);

  // ---------- the duration never gives up its room ----------
  const wide = await p.evaluate(() => {
    const el = document.querySelector('.jam_item:has(a[href="session.html?p=long"])');
    return Math.round(el.querySelector('.jam_dur').getBoundingClientRect().width);
  });
  await p.setViewportSize({ width: 320, height: 844 });
  await p.waitForTimeout(400);
  const narrow = await row('long');
  const wide2 = await p.evaluate(() => {
    const el = document.querySelector('.jam_item:has(a[href="session.html?p=long"])');
    return Math.round(el.querySelector('.jam_dur').getBoundingClientRect().width);
  });
  ok('on a narrower phone the duration keeps its width', Math.abs(wide2 - wide) <= 1, wide + ' -> ' + wide2);
  ok('and the name is still what yields',  narrow.dur === '2:41' && narrow.fades === true, narrow.dur + ' ' + narrow.fades);
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(400);

  // ---------- the count stays behind the dots ----------
  const before = await p.evaluate(() => {
    const el = document.querySelector('.jam_item:has(a[href="session.html?p=long"])');
    return getComputedStyle(el.querySelector('.menu_sub')).display;
  });
  ok('the moment count is still behind the dots', before === 'none', before);
  await p.click('.jam_item:has(a[href="session.html?p=long"]) .jam_more');
  await p.waitForTimeout(200);
  const opened = await p.evaluate(() => {
    const el = document.querySelector('.jam_item:has(a[href="session.html?p=long"])');
    const vis = [...el.querySelectorAll('.jam_dur, .menu_sub, .jam_share, .jam_del')]
      .filter(x => getComputedStyle(x).display !== 'none' && x.getBoundingClientRect().width > 0)
      .map(x => x.className);
    return { vis, count: el.querySelector('.menu_sub').textContent.trim(),
             durStill: !!el.querySelector('.jam_dur').getBoundingClientRect().width };
  });
  ok('opening the dots reveals the count', /3/.test(opened.count), opened.count);
  ok('and the duration stays put alongside', opened.durStill === true, opened.durStill);
  ok('share is still the rightmost thing',  /jam_share/.test(opened.vis[opened.vis.length - 1] || ''), opened.vis.join(' | '));

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

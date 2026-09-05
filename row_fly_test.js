// row_fly_test — the lit row and the page's <h1> are the same name in two
// places, so the transition is that name travelling between them. This suite
// samples the flight rather than checking that a class was set: where it starts,
// where it lands, and that it is slow off the mark and quicker later.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const REG = JSON.stringify([
  { page: 'session.html?p=a1', name: '2026-09-01 One',   date: '2026-09-01', dur: 200, count: 2 },
  { page: 'session.html?p=a2', name: '2026-09-02 Two',   date: '2026-09-02', dur: 200, count: 3 }
]);

async function mount(ctx) {
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
    if (u.includes('sessions_auto'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: REG });
    if (u.includes('bazaar_cafe.json'))
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json')) });
    if (u.includes('.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
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
}

// a frame-by-frame recorder that survives a navigation, so the same sampler
// works for the fold and for the arrival on the other side of a page load
const SAMPLER = () => {
  window.__fly = [];
  window.__low = [];
  window.__menu = [];
  const t0 = performance.now();
  (function tick() {
    const f = document.querySelector('.fold_fly');
    if (f) { const r = f.getBoundingClientRect();
      window.__fly.push([Math.round(performance.now() - t0), Math.round(r.top), Math.round(r.left)]); }
    const lo = document.getElementById('session_low');
    if (lo && document.body.classList.contains('fold_run')) {
      const r = lo.getBoundingClientRect();
      window.__low.push([Math.round(r.top), Math.round(r.height)]);
      const tm = document.querySelector('#session_drawer .jam_menu');
      window.__menu.push(tm ? (tm.style.transform || '') : '');
    }
    requestAnimationFrame(tick);
  })();
};
const grab = (p, fn) => p.evaluate(fn).catch(() => null);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await mount(ctx);
  await ctx.addInitScript(SAMPLER);
  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });

  // ---------- shutting: the title flies down into its row ----------
  await p.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await p.waitForTimeout(1800);
  const h1 = await p.evaluate(() => {
    const h = document.querySelector('#fold_page h1');
    const rg = document.createRange(); rg.selectNodeContents(h.firstChild);
    const t = rg.getBoundingClientRect(), o = h.getBoundingClientRect();
    return { top: Math.round(o.top), left: Math.round(t.left), text: h.textContent.trim() };
  });
  await p.click('#page_sessions');
  await p.waitForTimeout(120);
  const inflight = await grab(p, () => {
    const f = document.querySelector('.fold_fly');
    return f ? { text: f.textContent,
                 h1op: getComputedStyle(document.querySelector('#fold_page h1')).opacity,
                 nmop: getComputedStyle(document.querySelector('.jam_item.current .jam_name')).opacity } : null;
  });
  ok('a clone is actually in the air',   !!inflight, inflight);
  ok('carrying the session name',        !!inflight && /2026-01-17/.test(inflight.text), inflight && inflight.text);
  ok('the title it left is not drawn',   !!inflight && inflight.h1op === '0', inflight && inflight.h1op);
  ok('nor the row it is heading for',    !!inflight && inflight.nmop === '0', inflight && inflight.nmop);

  await p.waitForTimeout(900);
  const shut = await p.evaluate(() => {
    const nm = document.querySelector('.jam_item.current .jam_name');
    const r = nm.getBoundingClientRect();
    return { fly: !!document.querySelector('.fold_fly'),
             land: { top: Math.round(r.top), left: Math.round(r.left) },
             nmop: getComputedStyle(nm).opacity,
             h1op: getComputedStyle(document.querySelector('#fold_page h1')).opacity,
             fly_path: window.__fly, low: window.__low, menu: window.__menu };
  });
  ok('the clone is cleared up afterwards',  shut.fly === false, shut.fly);
  ok('the row shows its own name again',    shut.nmop === '1', shut.nmop);
  ok('and the title is drawn again',        shut.h1op === '1', shut.h1op);

  const path0 = shut.fly_path;
  ok('the flight was sampled',              path0.length > 6, path0.length);
  const first = path0[0], last = path0[path0.length - 1];
  ok('it started at the title',             Math.abs(first[1] - h1.top) < 24, first[1] + ' vs ' + h1.top);
  ok('and it started at the title TEXT, not the centred box',
     Math.abs(first[2] - h1.left) < 24, first[2] + ' vs ' + h1.left);
  ok('and it finished on the row',          Math.abs(last[1] - shut.land.top) < 40, last[1] + ' vs ' + shut.land.top);
  ok('lined up with the row name',          Math.abs(last[2] - shut.land.left) < 12, last[2] + ' vs ' + shut.land.left);

  // fold_ease — slow away, quicker later. Measured, not asserted from the CSS.
  const total = Math.abs(last[1] - first[1]);
  const third = path0[Math.floor(path0.length / 3)];
  const twoThird = path0[Math.floor(path0.length * 2 / 3)];
  const leg1 = Math.abs(third[1] - first[1]);
  const leg2 = Math.abs(twoThird[1] - third[1]);
  ok('it moves further in its second third than its first',
     leg2 > leg1 * 1.3, 'first ' + leg1 + ' then ' + leg2 + ' of ' + total);
  ok('and it barely moves at all to begin with',
     leg1 < total * 0.25, leg1 + ' of ' + total);

  // fold_anchor — the rows above ride up out of the way rather than the lit
  // row being clipped off the bottom
  const neg = shut.menu.filter(t => /translateY\(-\d/.test(t)).length;
  ok('the rows above are slid up, not clipped away', neg > 3, shut.menu.slice(0, 3).join(' | '));

  // fold_push — the low half keeps its real height and is displaced
  const hs = shut.low.map(v => v[1]);
  ok('the rows below keep their height throughout',
     hs.length > 3 && Math.max(...hs) - Math.min(...hs) < 6, hs.slice(0, 6).join(','));
  const tops = shut.low.map(v => v[0]);
  ok('and they ride up as the page lets them',
     tops[tops.length - 1] < tops[0] - 40, tops[0] + ' -> ' + tops[tops.length - 1]);
  await p.close();

  // ---------- arriving: the row flies up into the title ----------
  const p2 = await ctx.newPage();
  p2.on('pageerror', e => { fail++; console.log('  FAIL pageerror (in): ' + e.message); });
  await p2.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await p2.waitForTimeout(1700);
  await p2.click('#page_sessions');
  await p2.waitForTimeout(800);
  await p2.evaluate(() => {
    const rows = [...document.querySelectorAll('.jam_item')];
    const t = rows.find(r => /2026-01-17/.test(r.textContent));
    t.scrollIntoView({ block: 'center' });
    t.querySelector('a').click();
  });
  await p2.waitForTimeout(2600);
  const arr = await grab(p2, () => {
    const h = document.querySelector('#fold_page h1');
    const rg = document.createRange(); rg.selectNodeContents(h.firstChild);
    const t = rg.getBoundingClientRect(), o = h.getBoundingClientRect();
    return { url: location.pathname, path: window.__fly,
             h1: { top: Math.round(o.top), left: Math.round(t.left) },
             h1op: getComputedStyle(h).opacity };
  });
  ok('the tap opened that page',            !!arr && /2026_01_17/.test(arr.url), arr && arr.url);
  ok('the name flew on the way in too',     !!arr && arr.path.length > 6, arr && arr.path.length);
  if (arr && arr.path.length) {
    const f0 = arr.path[0], f1 = arr.path[arr.path.length - 1];
    ok('it started down in the list',       f0[1] > arr.h1.top + 60, f0[1] + ' vs h1 ' + arr.h1.top);
    ok('and landed on the page title',      Math.abs(f1[1] - arr.h1.top) < 30, f1[1] + ' vs ' + arr.h1.top);
    ok('lined up with the title text',      Math.abs(f1[2] - arr.h1.left) < 24, f1[2] + ' vs ' + arr.h1.left);
    const t3 = arr.path[Math.floor(arr.path.length / 3)];
    const t6 = arr.path[Math.floor(arr.path.length * 2 / 3)];
    ok('slow away on this side as well',
       Math.abs(t6[1] - t3[1]) > Math.abs(t3[1] - f0[1]) * 1.3,
       Math.abs(t3[1] - f0[1]) + ' then ' + Math.abs(t6[1] - t3[1]));
  } else { fail += 4; console.log('  FAIL no arrival flight to measure'); }
  ok('and the real title is visible at the end', !!arr && arr.h1op === '1', arr && arr.h1op);
  await p2.close();

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

// fold_in_test — the collapse, run backwards. Tapping a row hands the next page
// a note; that page comes up shut at the same scroll and unfolds out from under
// its own row. The claim is that the swap itself is invisible.
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
  { page: 'session.html?p=a2', name: '2026-09-02 Two',   date: '2026-09-02', dur: 200, count: 3 },
  { page: 'session.html?p=a3', name: '2026-09-03 Three', date: '2026-09-03', dur: 200, count: 4 }
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
const grab = (p, fn) => p.evaluate(fn).catch(() => null);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await mount(ctx);
  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.addInitScript(() => { try { localStorage.setItem('vampjam_fav_seen', '1'); } catch (e) {} });

  // ---------- open the list on favourites, then tap another row ----------
  await p.goto('https://vampsf.com/favorites.html');
  await p.waitForTimeout(1600);
  await p.click('#page_sessions');
  await p.waitForTimeout(700);

  // where the row we are about to tap sits on the screen right now
  const before = await p.evaluate(() => {
    const rows = [...document.querySelectorAll('.jam_item')];
    const target = rows.find(r => /2026-01-17/.test(r.textContent));
    target.scrollIntoView({ block: 'center' });
    const r = target.getBoundingClientRect();
    return { top: Math.round(r.top), y: Math.round(window.scrollY),
             href: target.querySelector('a').getAttribute('href') };
  });
  await p.waitForTimeout(120);
  ok('the row we tap is on screen', before.top > 0 && before.top < 844, before.top);

  // the note is written before the navigation, not after it
  await p.evaluate(() => {
    const rows = [...document.querySelectorAll('.jam_item')];
    rows.find(r => /2026-01-17/.test(r.textContent)).querySelector('a').click();
  });
  await p.waitForTimeout(60);
  const note = await grab(p, () => {
    try { return sessionStorage.getItem('vampjam_fold_in'); } catch (e) { return null; }
  });
  // it may already have been consumed by the new page — either is correct,
  // what must NOT happen is that it was never written
  await p.waitForTimeout(2200);
  const url = p.url();
  ok('the tap navigates to that row', /2026_01_17/.test(url), url);

  const land = await p.evaluate(() => ({
    fold_on: document.body.classList.contains('fold_on'),
    pageH: Math.round(document.getElementById('fold_page').getBoundingClientRect().height),
    note: (function () { try { return sessionStorage.getItem('vampjam_fold_in'); } catch (e) { return 'x'; } })(),
    y: Math.round(window.scrollY),
    open: document.getElementById('session_drawer').classList.contains('open')
  }));
  ok('it lands unfolded, on the page',   land.fold_on === false, land.fold_on);
  ok('with the page at full height',     land.pageH > 300, land.pageH);
  ok('the list is shut behind it',       land.open === false, land.open);
  ok('and the note is consumed, not left lying about', land.note === null, land.note);
  ok('fold_ride landed at the top of the page', land.y <= 2, land.y);

  // ---------- the swap is invisible: mid-flight it is still the list --------
  // reload the same trip and look 120ms after the new document starts
  await p.goto('https://vampsf.com/favorites.html');
  await p.waitForTimeout(1600);
  await p.click('#page_sessions');
  await p.waitForTimeout(700);
  await p.evaluate(() => {
    const rows = [...document.querySelectorAll('.jam_item')];
    const t = rows.find(r => /2026-09-02/.test(r.textContent));
    t.scrollIntoView({ block: 'center' });
    t.querySelector('a').click();
  });
  await p.waitForTimeout(1500);
  const mid = await grab(p, () => ({
    url: location.href,
    onSession: !!document.getElementById('player'),
    curName: (document.querySelector('.jam_item.current .jam_name') || {}).textContent || null
  }));
  ok('a second row opens the same way', !!mid && /p=a2/.test(mid.url), mid && mid.url);
  ok('and the lit row followed you to the new page',
     !!mid && /2026-09-02/.test(mid.curName || ''), mid && mid.curName);

  // ---------- your own row still unfolds in place, no navigation ----------
  await p.goto('https://vampsf.com/favorites.html');
  await p.waitForTimeout(1600);
  await p.click('#page_sessions');
  await p.waitForTimeout(700);
  await p.click('.jam_item.current .jam_link');
  await p.waitForTimeout(700);
  const own = await p.evaluate(() => ({
    url: location.pathname,
    fold_on: document.body.classList.contains('fold_on'),
    note: (function () { try { return sessionStorage.getItem('vampjam_fold_in'); } catch (e) { return 'x'; } })()
  }));
  ok('your own row unfolds without leaving',  /favorites/.test(own.url) && own.fold_on === false,
                                              JSON.stringify(own));
  ok('and writes no note, because nothing is loading', own.note === null, own.note);
  await p.close();

  // ---------- the record page grows the way it shrank ----------
  const p2 = await ctx.newPage();
  p2.on('pageerror', e => { fail++; console.log('  FAIL pageerror (rec): ' + e.message); });
  await p2.goto('https://vampsf.com/favorites.html');
  await p2.waitForTimeout(1600);
  await p2.click('#page_sessions');
  await p2.waitForTimeout(700);
  await p2.evaluate(() => {
    document.querySelector('.jam_item.jam_new a').click();
  });
  await p2.waitForTimeout(2000);
  const rec = await grab(p2, () => ({
    url: location.pathname,
    cls: document.body.className,
    tf: getComputedStyle(document.body).transform,
    op: getComputedStyle(document.body).opacity
  }));
  ok('the New recording row opens the recorder', !!rec && /record/.test(rec.url), rec && rec.url);
  ok('and it has finished growing',
     !!rec && !/fold_in/.test(rec.cls) && rec.op === '1', rec && (rec.cls + ' ' + rec.op));
  await p2.close();

  // ---------- a plain visit is untouched ----------
  const p3 = await ctx.newPage();
  p3.on('pageerror', e => { fail++; console.log('  FAIL pageerror (plain): ' + e.message); });
  await p3.goto('https://vampsf.com/2026_08_14_sound_union.html');
  await p3.waitForTimeout(1600);
  const plain = await p3.evaluate(() => ({
    fold_on: document.body.classList.contains('fold_on'),
    open: document.getElementById('session_drawer').classList.contains('open'),
    pageH: Math.round(document.getElementById('fold_page').getBoundingClientRect().height)
  }));
  ok('typing a URL in opens the page, not the list',
     plain.fold_on === false && plain.open === false && plain.pageH > 300, JSON.stringify(plain));
  await p3.close();

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

// list_fold_test — opening the list folds the page shut under its own row.
// The proof is geometric, not class-based: the row that names this page has to
// still be on screen when the fold has finished, with rows above AND below it.
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

// what the screen actually shows: the lit row's box, and how many rows sit
// above and below it in the two halves of the list.
const SHOT = () => {
  const cur = document.querySelector('.jam_item.current');
  const top = document.querySelector('#session_drawer .jam_menu');
  const lowM = document.querySelector('#session_low .jam_menu');
  const fp = document.getElementById('fold_page');
  const r = cur ? cur.getBoundingClientRect() : null;
  return {
    fold_on: document.body.classList.contains('fold_on'),
    split:   document.body.classList.contains('fold_split'),
    pageH:   fp ? Math.round(fp.getBoundingClientRect().height) : null,
    above:   top  ? top.querySelectorAll('.jam_item').length : 0,
    below:   lowM ? lowM.querySelectorAll('.jam_item').length : 0,
    curTop:  r ? Math.round(r.top) : null,
    curBot:  r ? Math.round(r.bottom) : null,
    curH:    r ? Math.round(r.height) : null,
    vh:      window.innerHeight
  };
};

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await mount(ctx);

  // ---------- favourites: the page folds under the Favorites row ----------
  let p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (fav): ' + e.message); });
  await p.addInitScript(() => { try { localStorage.setItem('vampjam_fav_seen', '1'); } catch (e) {} });
  await p.goto('https://vampsf.com/favorites.html');
  await p.waitForTimeout(1600);

  const shut = await p.evaluate(SHOT);
  ok('the wrapper exists and the page is at full height', shut.pageH > 300, shut.pageH);
  ok('shut, nothing is folded',      shut.fold_on === false, shut.fold_on);
  ok('the list splits at the lit row', shut.split === true, JSON.stringify(shut));
  ok('with rows above it',           shut.above >= 3, shut.above);
  ok('and rows below it',            shut.below >= 3, shut.below);

  await p.click('#page_sessions');
  await p.waitForTimeout(1500);
  const open = await p.evaluate(SHOT);
  ok('open, the page has folded to nothing', open.pageH === 0, open.pageH);
  ok('and the fold is marked done',          open.fold_on === true, open.fold_on);
  ok('the lit row is still on the screen',
     open.curTop >= 0 && open.curBot <= open.vh, JSON.stringify(open));
  ok('with rows visible above it',           open.curTop > 40, open.curTop);
  ok('and the row keeps its full height',    open.curH >= 50, open.curH);

  // the row below the lit one has to sit directly under it — that is the whole
  // claim: the page collapsed out from between them.
  const seam = await p.evaluate(() => {
    const cur = document.querySelector('.jam_item.current');
    const next = document.querySelector('#session_low .jam_menu .jam_item');
    if (!cur || !next) return null;
    return Math.round(next.getBoundingClientRect().top - cur.getBoundingClientRect().bottom);
  });
  ok('the next row closes right up under it', seam !== null && Math.abs(seam) <= 2, seam);

  // ---------- and it opens back up ----------
  await p.click('.jam_item.current .jam_link');
  await p.waitForTimeout(1500);
  const back = await p.evaluate(() => ({
    fold_on: document.body.classList.contains('fold_on'),
    pageH: Math.round(document.getElementById('fold_page').getBoundingClientRect().height),
    url: location.pathname
  }));
  ok('tapping your own row unfolds instead of reloading',
     back.fold_on === false && /favorites/.test(back.url), JSON.stringify(back));
  ok('and the page comes back to full height', back.pageH > 300, back.pageH);
  await p.close();

  // ---------- a session page folds under its own row too ----------
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (session): ' + e.message); });
  await p.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await p.waitForTimeout(1800);
  await p.click('#page_sessions');
  await p.waitForTimeout(1500);
  const sess = await p.evaluate(SHOT);
  ok('a session page folds the same way', sess.pageH === 0 && sess.fold_on === true, JSON.stringify(sess));
  ok('its own row is on screen',
     sess.curTop !== null && sess.curTop >= 0 && sess.curBot <= sess.vh, JSON.stringify(sess));
  ok('with the newer sessions above it', sess.above >= 4, sess.above);
  ok('and Admin below it',               sess.below >= 1, sess.below);

  // the audio element survived being folded shut
  const alive = await p.evaluate(() => !!document.getElementById('player'));
  ok('the player is still in the document', alive === true, alive);
  await p.close();

  // ---------- landscape split keeps the old sheet ----------
  const land = await b.newContext({ viewport: { width: 844, height: 390 },
                                    hasTouch: true, isMobile: true });
  await mount(land);
  p = await land.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (land): ' + e.message); });
  await p.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await p.waitForTimeout(1800);
  await p.click('#page_sessions');
  await p.waitForTimeout(1500);
  const L = await p.evaluate(() => ({
    fold_on: document.body.classList.contains('fold_on'),
    disp: getComputedStyle(document.getElementById('fold_page')).display,
    lowDisp: getComputedStyle(document.getElementById('session_low')).display,
    open: document.getElementById('session_drawer').classList.contains('open')
  }));
  ok('landscape does not fold',            L.fold_on === false, L.fold_on);
  ok('the wrapper steps out of the grid',  L.disp === 'contents', L.disp);
  ok('and the low half is not drawn',      L.lowDisp === 'none', L.lowDisp);
  ok('the old sheet still opens',          L.open === true, L.open);
  await p.close();

  // ---------- the record page leaves by collapsing ----------
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (rec): ' + e.message); });
  await p.goto('https://vampsf.com/record.html');
  await p.waitForTimeout(900);
  await p.evaluate(() => document.getElementById('back_btn').click());
  await p.waitForTimeout(120);
  const R = await p.evaluate(() => ({
    cls: document.body.className,
    tf: getComputedStyle(document.body).transform
  })).catch(() => null);
  ok('the record page collapses before it leaves',
     !!R && /fold_out/.test(R.cls), R && R.cls);
  ok('and it is really scaling, not just a class',
     !!R && R.tf !== 'none', R && R.tf);
  await p.close();

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

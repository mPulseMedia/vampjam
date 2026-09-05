// nav_pair_test — the header is cassette · favourites, wordmark, record · share,
// and Favorites / New recording are reachable from BOTH the header and the list.
// (grew with both_ways, which put the two rows back and gave the record page a
// real share button; and with here_lit, which shows the current page's icon in
// the accent instead of blanking it.)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const REG = JSON.stringify([
  { page: 'session.html?p=one', name: '2026-09-01 One', date: '2026-09-01', dur: 200, count: 2 }
]);

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
    if (u.includes('sessions_auto'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: REG });
    if (u.includes('bazaar_cafe.json'))
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json')) });
    if (u.includes('.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    if (u.startsWith(R2))
      return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
    return r.fulfill({ status: 204, body: '[]' });
  });

  const HEAD = `() => {
    const h = document.querySelector('.brand');
    if (!h) return null;
    const kids = [...h.children]
      .map(e => ({ e: e, r: e.getBoundingClientRect() }))
      .sort((a, b) => a.r.left - b.r.left)
      .map(x => ({
        cls: x.e.className,
        left: Math.round(x.r.left), width: Math.round(x.r.width),
        color: getComputedStyle(x.e).color,
        vis: getComputedStyle(x.e).visibility,
        href: x.e.getAttribute('href') || null,
        cur: x.e.getAttribute('aria-current') || null,
        svg: !!x.e.querySelector('svg')
      }));
    const w = h.querySelector('.wordmark').getBoundingClientRect();
    return {
      kids: kids,
      wordMid: Math.round((w.left + w.right) / 2),
      pageMid: Math.round(document.documentElement.clientWidth / 2),
      scrollW: document.documentElement.scrollWidth,
      vw: document.documentElement.clientWidth
    };
  }`;

  const look = {};
  for (const f of ['2026_01_17_bazaar_cafe.html', 'favorites.html', 'record.html']) {
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (' + f + '): ' + e.message); });
    await p.goto('https://vampsf.com/' + f);
    await p.waitForTimeout(1300);
    look[f] = await p.evaluate((src) => eval(src)(), HEAD);

    const m = look[f];
    ok(f + ' — the header is there', !!m, JSON.stringify(m));
    if (!m) { await p.close(); continue; }
    ok(f + ' — five slots, two a side',  m.kids.length === 5, m.kids.length);
    ok(f + ' — the wordmark is on the page centre line',
       Math.abs(m.wordMid - m.pageMid) <= 2, m.wordMid + ' vs ' + m.pageMid);
    ok(f + ' — nothing overflows',       m.scrollW <= m.vw, m.scrollW + ' > ' + m.vw);
    // here_lit: every icon shares one grey EXCEPT the lit one, if this page has one
    const inks = m.kids.filter(k => k.svg && !/nav_on/.test(k.cls)).map(k => k.color);
    ok(f + ' — every unlit icon is the same grey',
       inks.length > 0 && new Set(inks).size === 1, JSON.stringify([...new Set(inks)]));
    await p.close();
  }

  // ---- the icons themselves ----
  const S = look['2026_01_17_bazaar_cafe.html'];
  ok('order is cassette, favourites, wordmark, record, share',
     /nav_cass(?!.*nav_fav)/.test(S.kids[0].cls) && /nav_fav/.test(S.kids[1].cls) &&
     /wordmark/.test(S.kids[2].cls) && /nav_rec/.test(S.kids[3].cls) &&
     /nav_share/.test(S.kids[4].cls) && !/nav_rec/.test(S.kids[4].cls),
     S.kids.map(k => k.cls).join(' | '));
  ok('the favourites icon goes to favourites', S.kids[1].href === 'favorites.html', S.kids[1].href);
  ok('the record icon goes to record',         S.kids[3].href === 'record.html', S.kids[3].href);
  ok('the favourites icon matches the cassette grey exactly',
     S.kids[1].color === S.kids[0].color, S.kids[0].color + ' vs ' + S.kids[1].color);
  ok('and so does the record icon — no red up here',
     S.kids[3].color === S.kids[0].color && !/215, 0, 21/.test(S.kids[3].color), S.kids[3].color);

  // here_lit — a page does not link to itself; its icon is SHOWN and lit instead
  const F = look['favorites.html'], R = look['record.html'];
  const ACCENT = 'rgb(0, 113, 227)';
  ok('on favourites, the favourites icon is lit',
     /nav_on/.test(F.kids[1].cls) && F.kids[1].color === ACCENT,
     F.kids[1].cls + ' ' + F.kids[1].color);
  ok('and visible, not blanked',       F.kids[1].vis === 'visible', F.kids[1].vis);
  ok('still holding its slot',         F.kids[1].width === 40, F.kids[1].width);
  ok('and no longer a link',           F.kids[1].href === null, F.kids[1].href);
  ok('on record, the record icon is lit',
     /nav_on/.test(R.kids[3].cls) && R.kids[3].color === ACCENT,
     R.kids[3].cls + ' ' + R.kids[3].color);
  ok('and it is drawn, not an empty box', R.kids[3].svg === true, R.kids[3].svg);
  ok('nothing is hidden in either header any more',
     F.kids.every(k => k.vis === 'visible') && R.kids.every(k => k.vis === 'visible'),
     JSON.stringify([F.kids.map(k => k.vis), R.kids.map(k => k.vis)]));
  // exactly one lit icon per page, and none on a page that is neither
  ok('a session page lights nothing',
     S.kids.every(k => k.color !== ACCENT || /wordmark/.test(k.cls)),
     JSON.stringify(S.kids.map(k => k.color)));
  ok('favourites lights exactly one',
     F.kids.filter(k => /nav_on/.test(k.cls)).length === 1,
     JSON.stringify(F.kids.map(k => k.cls)));
  ok('record lights exactly one',
     R.kids.filter(k => /nav_on/.test(k.cls)).length === 1,
     JSON.stringify(R.kids.map(k => k.cls)));

  // ---- the list is only recordings now ----
  const p = await ctx.newPage();
  await p.goto('https://vampsf.com/favorites.html');
  await p.waitForTimeout(1300);
  await p.evaluate(() => document.getElementById('page_sessions').click());
  await p.waitForTimeout(600);
  const list = await p.evaluate(() => ({
    heading: document.querySelector('.jam_title .jam_name').textContent.trim(),
    fav: !!document.querySelector('.jam_item a[href="favorites.html"]'),
    nu:  !!document.querySelector('.jam_item.jam_new'),
    newRed: (function () { var i = document.querySelector('.jam_item.jam_new .jam_ico');
                           return i ? getComputedStyle(i).color : null; })(),
    rows: [...document.querySelectorAll('.jam_item')].length
  }));
  ok('the list still says Recordings',        list.heading === 'Recordings', list.heading);
  // both_ways — the header icons are the fast route; the rows are how you find
  // them before you know the icons. Both, not either.
  ok('the Favorites row is in the list too',  list.fav === true, list.fav);
  ok('and so is New recording',               list.nu === true, list.nu);
  ok('the row keeps its red disc',            list.newRed === 'rgb(215, 0, 21)', list.newRed);
  ok('while the header icon stays grey',      S.kids[3].color !== 'rgb(215, 0, 21)', S.kids[3].color);

  await p.close();

  // and the header buttons actually go somewhere. Not from favourites: the
  // button is blanked there on purpose, so tap it from a session page.
  const q = await ctx.newPage();
  q.on('pageerror', e => { fail++; console.log('  FAIL pageerror (nav): ' + e.message); });
  await q.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await q.waitForTimeout(1300);
  await q.click('.nav_fav');
  await q.waitForTimeout(700);
  ok('tapping the favourites icon lands on favourites',
     /favorites\.html/.test(q.url()), q.url());

  await q.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await q.waitForTimeout(1300);
  await q.click('.nav_rec');
  await q.waitForTimeout(700);
  ok('and the record icon lands on the record screen',
     /record\.html/.test(q.url()), q.url());

  // share_here — the record page carries its own share, because it does not
  // load drawer.js, which is where every other page's is wired.
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'],
                             { origin: 'https://vampsf.com' }).catch(() => {});
  await q.waitForTimeout(400);
  const sh = await q.evaluate(() => {
    const b2 = document.getElementById('page_share');
    return b2 ? { there: true, top: Math.round(b2.getBoundingClientRect().top),
                  right: Math.round(document.documentElement.clientWidth - b2.getBoundingClientRect().right),
                  svg: !!b2.querySelector('svg'),
                  color: getComputedStyle(b2).color } : { there: false };
  });
  ok('the record page has a share button',   sh.there === true, JSON.stringify(sh));
  ok('in the top right corner',              sh.there && sh.right <= 20 && sh.top < 80, JSON.stringify(sh));
  ok('drawn like the others',                sh.svg === true, JSON.stringify(sh));
  ok('and in the same grey',                 sh.color === S.kids[0].color, sh.color + ' vs ' + S.kids[0].color);
  await q.click('#page_share');
  await q.waitForTimeout(400);
  const copied = await q.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  ok('and it copies this page’s address',
     /record\.html$/.test(copied) && !/\?/.test(copied), copied);

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

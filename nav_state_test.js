// nav_state_test — the header speaks in three colours and nothing else:
//   blue = you are here, red = the recorder, green = that just happened,
// plus a filled cassette while something is playing.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const BLUE  = 'rgb(0, 113, 227)';
const RED   = 'rgb(215, 0, 21)';
const GREEN = 'rgb(15, 107, 61)';
const GREY  = 'rgb(134, 134, 139)';
const REG = JSON.stringify([
  { page: 'session.html?p=one', name: '2026-09-01 One', date: '2026-09-01', dur: 200, count: 2 }
]);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'],
                             { origin: 'https://vampsf.com' }).catch(() => {});
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

  // ---------- blue, and FILLED: the heart on favourites ----------
  let p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (fav): ' + e.message); });
  await p.goto('https://vampsf.com/favorites.html');
  await p.waitForTimeout(1400);
  const heart = await p.evaluate(() => {
    const a = document.querySelector('.brand .nav_fav');
    const paths = [...a.querySelectorAll('svg path')];
    return { color: getComputedStyle(a).color,
             heartFill: getComputedStyle(paths[0]).fill,
             linesFill: getComputedStyle(paths[1]).fill,
             linesStroke: getComputedStyle(paths[1]).stroke };
  });
  ok('the heart is blue when you are on favourites', heart.color === BLUE, heart.color);
  ok('and it is FILLED, not outlined',    heart.heartFill === BLUE, heart.heartFill);
  ok('while the three lines stay lines',  heart.linesFill === 'none' && heart.linesStroke === BLUE,
                                          heart.linesFill + ' / ' + heart.linesStroke);
  await p.close();

  // ---------- red: the recorder on the record page ----------
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (rec): ' + e.message); });
  await p.goto('https://vampsf.com/record.html');
  await p.waitForTimeout(1000);
  const rec = await p.evaluate(() => ({
    color: getComputedStyle(document.querySelector('.brand .nav_rec')).color,
    others: [...document.querySelectorAll('.brand .nav_cass, .brand #page_share')]
              .map(e => getComputedStyle(e).color)
  }));
  ok('the recorder is red on the record page', rec.color === RED, rec.color);
  ok('and nothing else up there is',          rec.others.every(c => c !== RED), JSON.stringify(rec.others));

  // ---------- green: the share, just tapped ----------
  // park the pointer off the button first: .nav_share:hover is var(--fg), and a
  // click leaves the mouse sitting there, so a naive read after the green fades
  // returns the hover colour and looks like the class never came off.
  await p.mouse.move(5, 400);
  const before = await p.evaluate(() => getComputedStyle(document.getElementById('page_share')).color);
  ok('the share starts grey',                 before === GREY, before);
  await p.click('#page_share');
  await p.waitForTimeout(200);
  const hit = await p.evaluate(() => ({
    color: getComputedStyle(document.getElementById('page_share')).color,
    cls: document.getElementById('page_share').className
  }));
  ok('it goes dark green when tapped',        hit.color === GREEN, hit.color + ' ' + hit.cls);
  await p.waitForTimeout(1400);
  await p.mouse.move(5, 400);
  const after = await p.evaluate(() => ({
    color: getComputedStyle(document.getElementById('page_share')).color,
    cls: document.getElementById('page_share').className
  }));
  ok('and comes back on its own',             after.color === GREY && !/nav_hit/.test(after.cls),
                                              after.color + ' ' + after.cls);
  await p.close();

  // ---------- the same green on a page whose share drawer.js wires ----------
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (session): ' + e.message); });
  await p.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await p.waitForTimeout(1600);
  await p.click('#page_share');
  await p.waitForTimeout(200);
  const hit2 = await p.evaluate(() => getComputedStyle(document.getElementById('page_share')).color);
  ok('a session page share goes the same green', hit2 === GREEN, hit2);
  await p.waitForTimeout(1400);

  // ---------- filled cassette while playing ----------
  const idle = await p.evaluate(() => {
    const c = document.querySelector('.brand .nav_cass');
    return { color: getComputedStyle(c).color,
             live: c.classList.contains('cass_live'),
             fill: (c.querySelector('svg') || {}).getAttribute
                   ? c.querySelector('svg').getAttribute('fill') : null };
  });
  ok('the cassette is grey and outlined while stopped',
     idle.color === GREY && idle.live === false && idle.fill === 'none', JSON.stringify(idle));

  await p.evaluate(() => { const a = document.getElementById('player'); a.currentTime = 5; return a.play().catch(() => {}); });
  await p.waitForTimeout(800);
  const live = await p.evaluate(() => {
    const c = document.querySelector('.brand .nav_cass');
    const svg = c.querySelector('svg');
    return { paused: document.getElementById('player').paused,
             color: getComputedStyle(c).color,
             live: c.classList.contains('cass_live'),
             fill: svg.getAttribute('fill'),
             // the reels are knocked out in the page background, or it is a blob
             knock: [...svg.querySelectorAll('circle')].map(e => e.getAttribute('fill')) };
  });
  ok('it is playing',                       live.paused === false, live.paused);
  ok('the cassette fills while it plays',   live.fill === 'currentColor', JSON.stringify(live));
  ok('and turns blue with it',              live.color === BLUE, live.color);
  ok('with the reels knocked out, not a blob',
     live.knock.length === 2 && live.knock.every(f => f === 'var(--bg)'), JSON.stringify(live.knock));

  await p.evaluate(() => document.getElementById('player').pause());
  await p.waitForTimeout(500);
  const stopped = await p.evaluate(() => {
    const c = document.querySelector('.brand .nav_cass');
    return { color: getComputedStyle(c).color, live: c.classList.contains('cass_live'),
             fill: c.querySelector('svg').getAttribute('fill') };
  });
  ok('and it goes back to an outline when you stop',
     stopped.fill === 'none' && stopped.live === false && stopped.color === GREY,
     JSON.stringify(stopped));

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

// audio_grade_test — the light file is the default, the pill swaps to hi-fi,
// and a rendition that will not load falls back to the original.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DIR  = process.env.VJ_DIR || '/tmp/vj';   // point at a checkout to run this anywhere
const PAGE = 'https://vampsf.com/2026_01_17_bazaar_cafe.html';
const R2   = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL  = fs.readFileSync(path.join(DIR, 'silence_long.wav'));  // headless chromium has no AAC decoder

let pass = 0, fail = 0;
function ok(name, cond, got) {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (got !== undefined ? '  got: ' + got : '')); }
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });

  let liteDead = false;          // flip to make the light file 404
  let bare     = false;          // flip to serve a session with no renditions
  const posted = [];             // bodies sent to the worker

  await ctx.route('**/*', async (route) => {
    const url = route.request().url();

    // the page itself and its assets come off disk
    if (url.startsWith('https://vampsf.com/')) {
      const rel = url.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      const p = path.join(DIR, rel);
      if (fs.existsSync(p)) {
        const type = rel.endsWith('.css') ? 'text/css'
                   : rel.endsWith('.js')  ? 'application/javascript'
                   : rel.endsWith('.json')? 'application/json' : 'text/html';
        return route.fulfill({ status: 200, contentType: type, body: fs.readFileSync(p) });
      }
      return route.fulfill({ status: 404, body: '' });
    }

    // the repo copy of the session data
    if (url.includes('raw.githubusercontent.com')) {
      const d = JSON.parse(fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json'), 'utf8'));
      if (bare) { delete d.audio.lite; delete d.audio.hifi; }
      return route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify(d) });
    }

    // the audio. Range matters: without a 206 the element reports nothing
    // seekable and every currentTime assignment silently snaps back to 0 —
    // which would make the seek-on-swap test look like a product bug.
    if (url.startsWith(R2)) {
      if (liteDead && url.includes('_64k')) return route.fulfill({ status: 404, body: '' });
      const rng = route.request().headers()['range'];
      const m = rng && /bytes=(\d+)-(\d*)/.exec(rng);
      if (m) {
        const a = parseInt(m[1], 10);
        const b = m[2] ? parseInt(m[2], 10) : SIL.length - 1;
        return route.fulfill({
          status: 206,
          headers: {
            'Content-Type': 'audio/wav',
            'Accept-Ranges': 'bytes',
            'Content-Range': 'bytes ' + a + '-' + b + '/' + SIL.length,
            'Content-Length': String(b - a + 1)
          },
          body: SIL.subarray(a, b + 1)
        });
      }
      return route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes',
                   'Content-Length': String(SIL.length) },
        body: SIL
      });
    }

    // the worker
    if (url.includes('workers.dev')) {
      posted.push(route.request().postData());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    }

    return route.fulfill({ status: 204, body: '' });
  });

  const page = await ctx.newPage();
  page.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });

  // ---- 1. default is the light file ----
  await page.goto(PAGE);
  await page.waitForFunction(() => {
    const p = document.getElementById('player');
    return p && p.src && p.src.indexOf('.m4a') > -1;
  }, { timeout: 15000 });

  let src = await page.evaluate(() => document.getElementById('player').src);
  ok('default src is the 64k cut', /_64k\.m4a$/.test(src), src);

  const pillSeen = await page.evaluate(() => {
    const b = document.getElementById('grade_pill');
    return b ? { hidden: b.hidden, text: b.textContent.trim(),
                 size: getComputedStyle(b).fontSize,
                 on: b.classList.contains('on') } : null;
  });
  ok('pill exists and is visible', pillSeen && pillSeen.hidden === false, JSON.stringify(pillSeen));
  ok('pill escaped one_size (11px, not 17px)', pillSeen && pillSeen.size === '11px', pillSeen && pillSeen.size);
  ok('pill starts unlit', pillSeen && pillSeen.on === false, pillSeen && pillSeen.on);

  // the pill must not sit on top of the clock
  const lay = await page.evaluate(() => {
    const b = document.getElementById('grade_pill'), d = document.getElementById('dur_time');
    const rb = b.getBoundingClientRect(), rd = d.getBoundingClientRect();
    return { clear: rb.left >= rd.right, rb: [rb.left, rb.width], rd: [rd.left, rd.right] };
  });
  ok('pill clears the duration readout', lay.clear, JSON.stringify(lay));

  // ---- 2. tap swaps to hi-fi and holds position ----
  await page.evaluate(() => { const p = document.getElementById('player'); p.currentTime = 120; });
  await page.waitForTimeout(150);
  await page.click('#grade_pill');
  await page.waitForFunction(() => /_hifi\.m4a$/.test(document.getElementById('player').src), { timeout: 8000 });
  // the seek lands on loadedmetadata, which is a tick or two after the src changes
  await page.waitForFunction(() => document.getElementById('player').readyState >= 1, { timeout: 8000 });
  await page.waitForTimeout(400);
  src = await page.evaluate(() => document.getElementById('player').src);
  ok('tap swaps to the hi-fi cut', /_hifi\.m4a$/.test(src), src);

  const after = await page.evaluate(() => ({
    on: document.getElementById('grade_pill').classList.contains('on'),
    store: localStorage.getItem('vampjam_hifi'),
    t: document.getElementById('player').currentTime
  }));
  ok('pill lights up', after.on === true, after.on);
  ok('choice is remembered', after.store === '1', after.store);
  ok('position survives the swap', Math.abs(after.t - 120) < 2, after.t);

  // ---- 3. the choice sticks across a reload ----
  await page.reload();
  await page.waitForFunction(() => {
    const p = document.getElementById('player');
    return p && p.src && p.src.indexOf('.m4a') > -1;
  }, { timeout: 15000 });
  src = await page.evaluate(() => document.getElementById('player').src);
  ok('reload keeps hi-fi', /_hifi\.m4a$/.test(src), src);

  // ---- 4. a rendition that 404s falls back to the original ----
  await page.evaluate(() => localStorage.setItem('vampjam_hifi', '0'));
  liteDead = true;
  await page.reload();
  await page.waitForFunction(() => {
    const p = document.getElementById('player');
    return p && p.src && p.src.indexOf('r2.dev') === -1 && p.src.indexOf('.m4a') > -1;
  }, { timeout: 15000 }).catch(() => {});
  const fell = await page.evaluate(() => ({
    src: document.getElementById('player').src,
    pillHidden: document.getElementById('grade_pill').hidden
  }));
  ok('a dead light file falls back to the original',
     fell.src.indexOf('2026-01-17_bazaar_cafe.m4a') > -1 && fell.src.indexOf('_64k') === -1, fell.src);
  ok('pill hides once we have fallen back', fell.pillHidden === true, fell.pillHidden);
  liteDead = false;

  // ---- 5. a tag edit must not strip the renditions from the repo file ----
  await page.reload();
  await page.waitForFunction(() => {
    const p = document.getElementById('player');
    return p && p.src && p.src.indexOf('.m4a') > -1;
  }, { timeout: 15000 });
  posted.length = 0;
  await page.evaluate(() => { document.getElementById('player').currentTime = 300; });
  await page.click('#tag_btn');
  await page.waitForTimeout(4500);
  const body = posted.length ? JSON.parse(JSON.parse(posted[posted.length - 1]).content) : null;
  ok('a save actually went out', !!body, posted.length);
  ok('save keeps audio.lite', !!(body && body.audio && body.audio.lite), body && JSON.stringify(body.audio));
  ok('save keeps audio.hifi', !!(body && body.audio && body.audio.hifi), body && JSON.stringify(body.audio));
  ok('save keeps audio.url untouched',
     !!(body && body.audio && body.audio.url.indexOf('2026-01-17_bazaar_cafe.m4a') > -1),
     body && body.audio && body.audio.url);

  // ---- 6. a session with only one file shows no pill at all ----
  bare = true;
  await page.evaluate(() => localStorage.removeItem('vampjam_hifi'));
  await page.reload();
  await page.waitForFunction(() => {
    const p = document.getElementById('player');
    return p && p.src && p.src.indexOf('.m4a') > -1;
  }, { timeout: 15000 });
  const one = await page.evaluate(() => ({
    src: document.getElementById('player').src,
    hidden: document.getElementById('grade_pill').hidden
  }));
  ok('one-file session plays its only file', /bazaar_cafe\.m4a$/.test(one.src), one.src);
  ok('one-file session shows no pill', one.hidden === true, one.hidden);
  bare = false;

  await browser.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

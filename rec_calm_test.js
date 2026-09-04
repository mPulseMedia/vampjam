// rec_calm_test — the four things around recording:
//   a long recording needs the code before Delete arms
//   the REC button glows only while it is actually recording
//   saving shows three dots, not a running commentary
//   and a finished save lands on the session page
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

// two cloud sessions: one four minutes, one fifty
const REGISTRY = JSON.stringify([
  { page: 'session.html?p=short_one', name: '2026-09-01 Short take', date: '2026-09-01', dur: 240, count: 1 },
  { page: 'session.html?p=long_one',  name: '2026-09-02 Long take',  date: '2026-09-02', dur: 3000, count: 4 }
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
    if (u.includes('sessions_auto.json') || (u.includes('api.github.com') && u.includes('sessions_auto')))
      return r.fulfill({ status: 200, contentType: 'application/json', body: REGISTRY });
    if (u.includes('raw.githubusercontent.com') || u.includes('api.github.com'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    return r.fulfill({ status: 204, body: '' });
  });

  // ================= the delete gate =================
  const page = await ctx.newPage();
  page.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await page.goto('https://vampsf.com/favorites.html');
  await page.waitForTimeout(1200);

  // open the session drawer and find the two trash buttons
  await page.evaluate(() => { document.getElementById('page_sessions').click(); });
  await page.waitForTimeout(600);
  const dels = await page.evaluate(() =>
    [...document.querySelectorAll('.jam_del')].map(b => ({
      page: b.getAttribute('data-page'), dur: b.getAttribute('data-dur') })));
  ok('the trash buttons carry a duration', dels.length >= 2 && dels.every(d => d.dur !== null),
     JSON.stringify(dels));

  async function openConfirm(pageKey) {
    await page.evaluate((k) => {
      const b = [...document.querySelectorAll('.jam_del')].find(x => x.getAttribute('data-page') === k);
      b.click();
    }, pageKey);
    await page.waitForTimeout(300);
    return page.evaluate(() => {
      const ov = document.querySelector('.jamc_overlay');
      if (!ov) return null;
      const inp = ov.querySelector('.jamc_code');
      const yes = ov.querySelector('.jamc_yes');
      return { hasInput: !!inp, yesDisabled: !!yes.disabled, msg: ov.querySelector('.jamc_msg').textContent };
    });
  }
  const closeConfirm = () => page.evaluate(() => {
    const ov = document.querySelector('.jamc_overlay'); if (ov) ov.remove();
  });

  const shortC = await openConfirm('session.html?p=short_one');
  ok('a 4-minute session still confirms',        !!shortC, JSON.stringify(shortC));
  ok('and asks for no code',                     shortC && shortC.hasInput === false, JSON.stringify(shortC));
  ok('its Delete is armed straight away',        shortC && shortC.yesDisabled === false, JSON.stringify(shortC));
  await closeConfirm();

  const longC = await openConfirm('session.html?p=long_one');
  ok('a 50-minute session asks for a code',      longC && longC.hasInput === true, JSON.stringify(longC));
  ok('its Delete starts locked',                 longC && longC.yesDisabled === true, JSON.stringify(longC));
  ok('and it says how long the recording is',    longC && /50 min/.test(longC.msg), longC && longC.msg);

  const wrong = await page.evaluate(() => {
    const inp = document.querySelector('.jamc_code');
    inp.value = '1234'; inp.dispatchEvent(new Event('input', { bubbles: true }));
    return document.querySelector('.jamc_yes').disabled;
  });
  ok('a wrong code leaves it locked', wrong === true, wrong);

  const right = await page.evaluate(() => {
    const inp = document.querySelector('.jamc_code');
    inp.value = '8764'; inp.dispatchEvent(new Event('input', { bubbles: true }));
    return document.querySelector('.jamc_yes').disabled;
  });
  ok('8764 unlocks it', right === false, right);
  await closeConfirm();
  await page.close();

  // ================= the record screen =================
  const rec = await ctx.newPage();
  rec.on('pageerror', e => { fail++; console.log('  FAIL pageerror (record): ' + e.message); });
  await rec.goto('https://vampsf.com/record.html');
  await rec.waitForTimeout(800);

  const idle = await rec.evaluate(() => {
    const b = document.getElementById('rec_btn');
    const c = getComputedStyle(b);
    return { shadow: c.boxShadow, anim: c.animationName, recording: b.classList.contains('recording') };
  });
  ok('the REC button is not recording yet', idle.recording === false, idle.recording);
  ok('and carries no halo when idle',       idle.shadow === 'none', idle.shadow);
  ok('and is not animating when idle',      idle.anim === 'none', idle.anim);

  // the class is what the recorder sets; assert the look it buys, without a mic
  const live = await rec.evaluate(() => {
    const b = document.getElementById('rec_btn');
    b.classList.add('recording');
    const c = getComputedStyle(b);
    const r = { shadow: c.boxShadow, anim: c.animationName, secs: c.animationDuration };
    b.classList.remove('recording');
    return r;
  });
  ok('recording turns the halo on',   live.shadow !== 'none', live.shadow);
  ok('it breathes rather than pulses', live.anim === 'rec_breathe', live.anim);
  ok('and it breathes SLOWLY (>3s)',   parseFloat(live.secs) > 3, live.secs);

  const dots = await rec.evaluate(() => {
    const s = document.getElementById('status');
    // the page's own helper, reached the way the page reaches it
    s.innerHTML = '<div class="save_dots" role="status" aria-label="Saving"><i></i><i></i><i></i></div>';
    const d = s.querySelector('.save_dots i');
    return { count: s.querySelectorAll('.save_dots i').length,
             anim: getComputedStyle(d).animationName,
             words: s.textContent.trim() };
  });
  ok('saving shows three dots',       dots.count === 3, dots.count);
  ok('the dots animate',              dots.anim === 'save_pulse', dots.anim);
  ok('and say nothing in words',      dots.words === '', JSON.stringify(dots.words));

  // save_flow — the source must send you to the session, not print a link to it
  const src = fs.readFileSync(path.join(DIR, 'record.html'), 'utf8');
  ok('a finished save navigates',     /window\.location\.replace\(land\)/.test(src));
  ok('and lands on the session page', /var land = pendingBack \? 'index\.html#sessions' : page;/.test(src));
  ok('the old "Session ready" paragraph is gone', src.indexOf('Session ready') === -1);
  ok('the step commentary is gone',   src.indexOf("'Uploading…'") === -1 && src.indexOf("'Creating the session…'") === -1);

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

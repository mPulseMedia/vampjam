// grip_only_test — in reorder mode only the hamburger moves a row. A drag that
// starts anywhere else on the row must leave the order exactly as it was.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

// a favourites page needs sessions with hearted tags; two sessions, three each.
function sessionJson(day, ids) {
  return JSON.stringify({
    audio: { label: 'stub ' + day, url: 'https://example.invalid/' + day + '.m4a', kind: 'url' },
    tags: ids.map(function (id, i) {
      return { id: id, t: 100 + i * 300, label: 'moment ' + id, fav: true };
    })
  });
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  let ordersPosted = [];

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
    if (u.includes('raw.githubusercontent.com')) {
      if (u.includes('2026_01_17_bazaar_cafe.json'))
        return r.fulfill({ status: 200, contentType: 'application/json',
                           body: sessionJson('a', ['t_a1', 't_a2', 't_a3']) });
      if (u.includes('fav_order.json'))
        return r.fulfill({ status: 200, contentType: 'application/json', body: '{"order":[]}' });
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    }
    if (u.includes('workers.dev')) {
      try { const p = JSON.parse(r.request().postData()); if (/fav_order/.test(p.path)) ordersPosted.push(p); } catch (e) {}
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    }
    return r.fulfill({ status: 204, body: '' });
  });

  const page = await ctx.newPage();
  page.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await page.goto('https://vampsf.com/favorites.html');
  await page.waitForFunction(() => document.querySelectorAll('.fav_row').length >= 3, { timeout: 20000 })
            .catch(() => {});

  const rows = await page.$$('.fav_row');
  ok('the list has rows to drag', rows.length >= 3, rows.length);
  if (rows.length < 3) { await b.close(); console.log('\n' + pass + ' pass, ' + fail + ' fail'); process.exit(1); }

  const ids = () => page.evaluate(() =>
    [...document.querySelectorAll('.fav_row')].map(r => r.dataset.favId).join(','));
  const before = await ids();

  // ---- reorder mode ----
  await page.click('#sort_btn');
  await page.waitForTimeout(300);
  const mode = await page.evaluate(() => ({
    sorting: document.querySelector('.fav_list').classList.contains('sorting'),
    grips:   document.querySelectorAll('.fav_grip').length,
    plays:   document.querySelectorAll('.fav_play_sm').length,
    rowTouch: getComputedStyle(document.querySelector('.fav_row')).touchAction,
    gripTouch: getComputedStyle(document.querySelector('.fav_grip')).touchAction,
    gripPE:  getComputedStyle(document.querySelector('.fav_grip')).pointerEvents
  }));
  ok('reorder mode is on',                  mode.sorting, JSON.stringify(mode));
  ok('every row shows a grip',              mode.grips >= 3, mode.grips);
  ok('the acting buttons are gone',         mode.plays === 0, mode.plays);
  ok('the grip claims its own gesture',     mode.gripTouch === 'none', mode.gripTouch);
  ok('the grip is the live element',        mode.gripPE === 'auto', mode.gripPE);
  ok('the ROW no longer claims the gesture — the list can still scroll',
                                            mode.rowTouch !== 'none', mode.rowTouch);

  // drag() — pointer events by hand; the page listens for pointerdown/move/up.
  async function drag(sel, index, dy) {
    const box = await page.evaluate(([s, i]) => {
      const e = document.querySelectorAll(s)[i];
      const r = e.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }, [sel, index]);
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    for (let k = 1; k <= 8; k++) { await page.mouse.move(box.x, box.y + dy * k / 8); await page.waitForTimeout(20); }
    await page.mouse.up();
    await page.waitForTimeout(250);
  }

  // ---- a drag that starts on the row body must do nothing ----
  const rowH = await page.evaluate(() => document.querySelector('.fav_row').getBoundingClientRect().height);
  await drag('.fav_name', 0, rowH * 1.6);
  ok('dragging the row body does NOT reorder', (await ids()) === before, await ids());
  ok('and writes nothing',                     ordersPosted.length === 0, ordersPosted.length);

  // ---- a drag from the grip must reorder ----
  await drag('.fav_grip', 0, rowH * 1.6);
  const after = await ids();
  ok('dragging the grip DOES reorder', after !== before, before + ' -> ' + after);
  ok('the first row moved down by one',
     after.split(',')[1] === before.split(',')[0], before + ' -> ' + after);

  // ---- leaving the mode restores the row's buttons ----
  await page.click('#sort_btn');
  await page.waitForTimeout(300);
  const back = await page.evaluate(() => ({
    grips: document.querySelectorAll('.fav_grip').length,
    plays: document.querySelectorAll('.fav_play_sm').length
  }));
  ok('leaving reorder mode drops the grips', back.grips === 0, back.grips);
  ok('and brings the buttons back',          back.plays >= 3, back.plays);

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

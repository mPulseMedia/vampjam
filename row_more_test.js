// row_more_test — a row shows its title and three dots; the dots open into the
// row's actions with share at the far right; one row at a time; a tap
// anywhere else closes it. Session rows in the list, highlight rows on a page.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };
const REG = JSON.stringify([
  { page: 'session.html?p=a1', name: '2026-09-01 A very long session name that wants the room', date: '2026-09-01', dur: 200, count: 2 },
  { page: 'session.html?p=a2', name: '2026-09-02 Two', date: '2026-09-02', dur: 200, count: 3 }
]);
async function mount(ctx) {
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
    if (u.includes('sessions_auto')) return r.fulfill({ status: 200, contentType: 'application/json', body: REG });
    if (u.includes('bazaar_cafe.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json')) });
    if (u.includes('.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    if (u.startsWith(R2)) return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
    if (u.includes('workers.dev')) return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    return r.fulfill({ status: 204, body: '[]' });
  });
}
// what a row visibly shows, left to right, and where its right edge is
const ROW = (sel) => (selector) => {
  const row = document.querySelector(selector);
  if (!row) return null;
  const vis = [...row.querySelectorAll('button, .menu_sub, .jam_name, .tag_label, .tag_time')]
    .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && getComputedStyle(el).display !== 'none'; })
    .map(el => ({ cls: el.className || el.tagName, right: Math.round(el.getBoundingClientRect().right),
                  left: Math.round(el.getBoundingClientRect().left) }));
  const rr = row.getBoundingClientRect();
  return { vis, rowRight: Math.round(rr.right), open: row.classList.contains('acts_open') };
};

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await mount(ctx);
  await ctx.addInitScript(() => { try { localStorage.setItem('vampjam_fav_seen', '1'); } catch (e) {} });

  // ================= session rows, in the list =================
  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (list): ' + e.message); });
  await p.goto('https://vampsf.com/favorites.html');
  await p.waitForTimeout(1500);
  await p.click('#page_sessions');
  await p.waitForTimeout(1500);

  const rowSel = '.jam_item:has(a[href="session.html?p=a1"])';
  const shut = await p.evaluate(ROW(), rowSel);
  ok('a session row shows its name and the dots, nothing else',
     !!shut && shut.vis.length === 2 && /jam_name/.test(shut.vis[0].cls) && /jam_more/.test(shut.vis[1].cls),
     shut && shut.vis.map(v => v.cls).join(' | '));
  ok('and the dots are at the far right',      !!shut && shut.rowRight - shut.vis[1].right < 16, shut && (shut.rowRight - shut.vis[1].right));
  const nameShut = shut && (shut.vis[0].right - shut.vis[0].left);

  await p.click(rowSel + ' .jam_more');
  await p.waitForTimeout(150);
  const open = await p.evaluate(ROW(), rowSel);
  const cls = open ? open.vis.map(v => v.cls) : [];
  ok('tapping the dots opens the actions',      !!open && open.open, open && open.open);
  ok('the dots themselves go away',             !cls.some(c => /jam_more/.test(c)), cls.join(' | '));
  ok('share is the rightmost thing on the row', /jam_share/.test(cls[cls.length - 1] || ''), cls.join(' | '));
  ok('the count sits just left of share',       /menu_sub/.test(cls[cls.length - 2] || ''), cls.join(' | '));
  ok('and delete left of that',                 /jam_del/.test(cls[cls.length - 3] || ''), cls.join(' | '));
  const nameOpen = open && (open.vis[0].right - open.vis[0].left);
  ok('shut, the name had more room than open', nameShut > nameOpen + 40, nameShut + ' vs ' + nameOpen);

  // one at a time
  const row2 = '.jam_item:has(a[href="session.html?p=a2"])';
  await p.click(row2 + ' .jam_more');
  await p.waitForTimeout(150);
  const both = await p.evaluate(() => document.querySelectorAll('.jam_item.acts_open').length);
  ok('opening a second row closes the first',   both === 1, both);
  // outside tap closes
  await p.click('.jam_item.jam_title');
  await p.waitForTimeout(150);
  const none = await p.evaluate(() => document.querySelectorAll('.jam_item.acts_open').length);
  ok('a tap anywhere else closes it',           none === 0, none);
  // the favourites row too
  const favRow = await p.evaluate(ROW(), '.jam_item:has(a[href="favorites.html"])');
  ok('the Favorites row follows the same rule', !!favRow && favRow.vis.some(v => /jam_more/.test(v.cls)) && !favRow.vis.some(v => /jam_share/.test(v.cls)),
                                                favRow && favRow.vis.map(v => v.cls).join(' | '));
  // rows with nothing behind them have no dots
  const dotsOnNew = await p.evaluate(() => !!document.querySelector('.jam_item.jam_new .jam_more'));
  ok('a row with no actions has no dots',       dotsOnNew === false, dotsOnNew);
  await p.close();

  // ================= highlight rows, on a session page =================
  const p2 = await ctx.newPage();
  p2.on('pageerror', e => { fail++; console.log('  FAIL pageerror (session): ' + e.message); });
  await p2.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
  await p2.waitForTimeout(1800);
  const first = '.tag_row:first-child';
  const hShut = await p2.evaluate(ROW(), first);
  const hc = hShut ? hShut.vis.map(v => v.cls) : [];
  ok('a highlight row shows number, play, title, time and the dots',
     hc.length === 5 && /tag_more/.test(hc[4]) && /tag_label/.test(hc[2]), hc.join(' | '));
  ok('and no heart, share or delete yet',       !hc.some(c => /tag_fav|tag_share|tag_del/.test(c)), hc.join(' | '));
  ok('dots at the far right',                   !!hShut && hShut.rowRight - hShut.vis[4].right < 16, hShut && (hShut.rowRight - hShut.vis[4].right));
  const labelShut = hShut && (hShut.vis[2].right - hShut.vis[2].left);

  await p2.click(first + ' .tag_more');
  await p2.waitForTimeout(150);
  const hOpen = await p2.evaluate(ROW(), first);
  const ho = hOpen ? hOpen.vis.map(v => v.cls) : [];
  ok('the dots open into heart, delete, share — share rightmost',
     /tag_share/.test(ho[ho.length - 1] || '') && /tag_del/.test(ho[ho.length - 2] || '') && /tag_fav/.test(ho[ho.length - 3] || ''), ho.join(' | '));
  ok('and the dots are gone while open',        !ho.some(c => /tag_more/.test(c)), ho.join(' | '));
  const labelOpen = hOpen && (hOpen.vis[2].right - hOpen.vis[2].left);
  ok('the title had more room shut',            labelShut > labelOpen + 40, labelShut + ' vs ' + labelOpen);

  // the open state survives the re-render a heart tap causes
  await p2.click(first + ' .tag_fav');
  await p2.waitForTimeout(300);
  const stillOpen = await p2.evaluate(() => {
    const r = document.querySelector('.tag_row:first-child');
    return r.classList.contains('acts_open') && getComputedStyle(r.querySelector('.tag_acts')).display !== 'none';
  });
  ok('tapping the heart re-renders and the row stays open', stillOpen, stillOpen);
  // and closes from outside
  await p2.click('h1');
  await p2.waitForTimeout(150);
  const hNone = await p2.evaluate(() => document.querySelectorAll('.tag_row.acts_open').length);
  ok('a tap elsewhere on the page closes it',   hNone === 0, hNone);
  // share still works from inside the group
  await p2.click(first + ' .tag_more');
  await p2.waitForTimeout(100);
  await p2.click(first + ' .tag_share');
  await p2.waitForTimeout(200);
  const toast = await p2.evaluate(() => (document.getElementById('toast') || {}).textContent || '');
  ok('share still copies from inside the group', /Link copied/.test(toast), toast);
  await p2.close();

  // ================= every session page carries it =================
  const pages = fs.readdirSync(DIR).filter(f => /^2026_\d\d_\d\d_.*\.html$/.test(f) && fs.statSync(path.join(DIR, f)).size > 5000);
  const missing = pages.concat(['session.html']).filter(f => !/tag_more/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));
  ok('every session page has the dots',         missing.length === 0, missing.join(','));

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

// list_title_test — the session drawer's heading reads "Recordings" and is
// centred on the list, on every page that carries the drawer.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const REGISTRY = JSON.stringify([
  { page: 'session.html?p=one', name: '2026-09-01 One', date: '2026-09-01', dur: 200, count: 2 },
  { page: 'session.html?p=two', name: '2026-09-02 Two', date: '2026-09-02', dur: 300, count: 3 }
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
    if (u.includes('sessions_auto'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: REGISTRY });
    if (u.includes('.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    return r.fulfill({ status: 204, body: '[]' });
  });

  // every page that carries the drawer should agree
  for (const page of ['favorites.html', '2026_01_17_bazaar_cafe.html', 'record.html', 'admin.html']) {
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (' + page + '): ' + e.message); });
    await p.goto('https://vampsf.com/' + page);
    await p.waitForTimeout(1000);
    // open the list
    await p.evaluate(() => {
      const b2 = document.getElementById('page_sessions') || document.getElementById('back_btn');
      if (b2) b2.click(); else if (window.vampjamDrawer) window.vampjamDrawer.toggle();
    }).catch(() => {});
    await p.waitForTimeout(500);

    const m = await p.evaluate(() => {
      const t = document.querySelector('.jam_title');
      if (!t) return null;
      const menu = document.querySelector('.session_drawer .jam_menu');
      const name = t.querySelector('.jam_name');
      const rt = name.getBoundingClientRect(), rm = menu.getBoundingClientRect();
      const rows = [...document.querySelectorAll('.jam_item:not(.jam_title) .jam_name')];
      return {
        text: name.textContent.trim(),
        off: Math.round(((rt.left + rt.right) / 2) - ((rm.left + rm.right) / 2)),
        justify: getComputedStyle(t).justifyContent,
        weight: getComputedStyle(t).fontWeight,
        // the rows below must NOT have moved
        rowsLeftAligned: rows.length ? rows.every(n2 => {
          const r2 = n2.getBoundingClientRect();
          return ((r2.left + r2.right) / 2) < ((rm.left + rm.right) / 2) - 10;
        }) : null,
        rows: rows.length
      };
    });

    ok(page + ' — the heading exists',        !!m, JSON.stringify(m));
    if (!m) { await p.close(); continue; }
    ok(page + ' — it reads "Recordings"',     m.text === 'Recordings', m.text);
    ok(page + ' — centred on the list',       Math.abs(m.off) <= 2, m.off + 'px off centre');
    ok(page + ' — still a heading, not a row', m.weight === '700', m.weight);
    if (m.rows) ok(page + ' — the rows below did not move', m.rowsLeftAligned === true, m.rows);
    await p.close();
  }

  // and nothing anywhere still says "Sessions" as the list's heading
  const src = fs.readFileSync(path.join(DIR, 'drawer.js'), 'utf8');
  ok('the old heading text is gone from the source',
     src.indexOf('jam_name">Sessions<') === -1);
  ok('but the cassette button keeps its Sessions label — it is a different thing',
     /aria-label="Sessions"|Sessions'/.test(fs.readFileSync(path.join(DIR, 'favorites.html'), 'utf8')));

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

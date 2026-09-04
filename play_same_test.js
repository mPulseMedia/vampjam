// play_same_test — every big play button on the site holds the SAME drawing at
// the SAME size, from the moment the page loads and not only after you press it.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const SESSION = JSON.stringify({
  audio: { label: 'x', url: R2 + 'x.m4a', kind: 'url' },
  tags: [{ id: 't1', t: 10, label: 'A', fav: true }, { id: 't2', t: 60, label: 'B', fav: true }]
});

// the two big buttons: the session player's, and favourites'
const PAGES = [
  { file: '2026_01_17_bazaar_cafe.html', sel: '.play_btn' },
  { file: 'favorites.html',              sel: '.fav_play' }
];

(async () => {
  const b = await chromium.launch();
  const seen = {};

  for (const vp of [{ width: 390, height: 844, tag: 'phone' },
                    { width: 900, height: 900, tag: 'wide' }]) {
    const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height } });
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
      if (u.includes('bazaar_cafe.json'))
        return r.fulfill({ status: 200, contentType: 'application/json',
          body: fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json')) });
      if (u.includes('.json'))
        return r.fulfill({ status: 200, contentType: 'application/json', body: SESSION });
      if (u.startsWith(R2))
        return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
      return r.fulfill({ status: 204, body: '[]' });
    });

    for (const spec of PAGES) {
      const p = await ctx.newPage();
      p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (' + spec.file + '): ' + e.message); });
      await p.goto('https://vampsf.com/' + spec.file);
      await p.waitForTimeout(1600);
      const m = await p.evaluate((sel) => {
        const e = document.querySelector(sel);
        if (!e) return null;
        const r = e.getBoundingClientRect();
        const s = e.querySelector('svg');
        const rs = s ? s.getBoundingClientRect() : null;
        return {
          btn: [Math.round(r.width), Math.round(r.height)],
          svg: rs ? [Math.round(rs.width), Math.round(rs.height)] : null,
          d: s ? (s.querySelector('path') || {}).getAttribute && s.querySelector('path').getAttribute('d') : null,
          // no text left in the button: a font glyph at the same em is far more
          // ink than the drawing, which is exactly how this went wrong
          text: e.textContent.trim()
        };
      }, spec.sel);

      const key = vp.tag + ' ' + spec.file;
      ok(key + ' — the button is there',        !!m, JSON.stringify(m));
      if (!m) { await p.close(); continue; }
      ok(key + ' — it holds a drawing, not a character',
         m.svg !== null && m.text === '', JSON.stringify(m));
      seen[key] = m;
      await p.close();
    }
    await ctx.close();
  }

  // ---- and the two agree, at both widths ----
  for (const tag of ['phone', 'wide']) {
    const a = seen[tag + ' 2026_01_17_bazaar_cafe.html'];
    const c = seen[tag + ' favorites.html'];
    if (!a || !c) { fail++; console.log('  FAIL ' + tag + ' — missing a measurement'); continue; }
    ok(tag + ' — the buttons are the same size',
       a.btn[0] === c.btn[0] && a.btn[1] === c.btn[1], JSON.stringify([a.btn, c.btn]));
    ok(tag + ' — the triangles are the same size',
       a.svg[0] === c.svg[0] && a.svg[1] === c.svg[1], JSON.stringify([a.svg, c.svg]));
    ok(tag + ' — and it is literally the same triangle',
       a.d === c.d && !!a.d, a.d + ' vs ' + c.d);
  }

  // the drawing must be there BEFORE anything plays — that was the whole bug
  const src = fs.readFileSync(path.join(DIR, 'favorites.html'), 'utf8');
  ok('the markup no longer ships a text triangle', src.indexOf('&#9654;') === -1);
  ok('and the drawing goes in at boot',            /playBtn\.innerHTML = ICON_PLAY;/.test(src));

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

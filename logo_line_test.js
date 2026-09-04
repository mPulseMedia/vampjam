// logo_line_test — cassette, wordmark and share on one row, in that order,
// with the wordmark on the page's true centre line.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

(async () => {
  const b = await chromium.launch();
  const VIEWS = [ { width: 390, height: 844, tag: 'phone' },
                  { width: 844, height: 390, tag: 'landscape' },
                  { width: 1200, height: 900, tag: 'desktop' } ];

  for (const vp of VIEWS) {
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
      if (u.includes('raw.githubusercontent.com') && u.includes('bazaar_cafe.json'))
        return r.fulfill({ status: 200, contentType: 'application/json',
          body: fs.readFileSync(path.join(DIR, '2026_01_17_bazaar_cafe.json')) });
      if (u.startsWith(R2))
        return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
      return r.fulfill({ status: 204, body: '' });
    });

    for (const f of ['2026_01_17_bazaar_cafe.html', 'favorites.html']) {
      const p = await ctx.newPage();
      p.on('pageerror', e => { fail++; console.log('  FAIL pageerror ' + f + ' ' + e.message); });
      await p.goto('https://vampsf.com/' + f);
      await p.waitForTimeout(700);
      const m = await p.evaluate(() => {
        const h = document.querySelector('.brand');
        const w = h.querySelector('.wordmark'), c = h.querySelector('.nav_cass'), s = h.querySelector('.nav_share');
        const r = e => e.getBoundingClientRect();
        const mid = e => (r(e).top + r(e).bottom) / 2;
        const hit = e => { const b = r(e); const t = document.elementFromPoint((b.left + b.right) / 2, (b.top + b.bottom) / 2);
                           return t === e || e.contains(t); };
        return {
          oneRow:  Math.abs(mid(c) - mid(w)) < 3 && Math.abs(mid(s) - mid(w)) < 3,
          order:   r(c).right <= r(w).left && r(w).right <= r(s).left,
          centred: Math.abs((r(w).left + r(w).right) / 2 - document.documentElement.clientWidth / 2) < 3,
          hits:    hit(c) && hit(s),
          headH:   Math.round(r(h).height),
          scrollW: document.documentElement.scrollWidth,
          vw:      document.documentElement.clientWidth
        };
      });
      const tag = vp.tag + ' ' + f.replace('.html', '');
      ok(tag + ' — one row',                      m.oneRow,  JSON.stringify(m));
      ok(tag + ' — cassette, logo, share, in that order', m.order, JSON.stringify(m));
      ok(tag + ' — logo on the true centre line',  m.centred, JSON.stringify(m));
      ok(tag + ' — both icons still hittable',     m.hits,    JSON.stringify(m));
      ok(tag + ' — no sideways scroll',            m.scrollW <= m.vw, m.scrollW + '>' + m.vw);
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

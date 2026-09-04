// time_flip_test — everything around the session timeline, in order:
//   Tag the Moment / clock + hi-fi / 1h 2h / the line / highlight numbers
// plus the loudness that was taken back out of it.
// (grew with clock_up; it is one layout, so it is one suite.)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
// a 2h20m stub: anything shorter never draws an hour mark, so the whole
// point of the change would go unasserted.
const SIL = fs.readFileSync(path.join(DIR, 'silence_hours.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

(async () => {
  const b = await chromium.launch();
  for (const vp of [ { width: 390, height: 844, tag: 'phone' },
                     { width: 844, height: 390, tag: 'landscape' } ]) {
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
      if (u.startsWith(R2)) {
        const rng = r.request().headers()['range'];
        const m = rng && /bytes=(\d+)-(\d*)/.exec(rng);
        if (m) {
          const a = parseInt(m[1], 10), z = m[2] ? parseInt(m[2], 10) : SIL.length - 1;
          return r.fulfill({ status: 206, headers: {
            'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes',
            'Content-Range': 'bytes ' + a + '-' + z + '/' + SIL.length,
            'Content-Length': String(z - a + 1) }, body: SIL.subarray(a, z + 1) });
        }
        return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
      }
      return r.fulfill({ status: 204, body: '' });
    });

    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror ' + e.message); });
    await p.goto('https://vampsf.com/2026_01_17_bazaar_cafe.html');
    await p.waitForFunction(() => document.querySelectorAll('.hour_lbl').length >= 2, { timeout: 20000 })
           .catch(() => {});
    await p.waitForTimeout(500);

    const m = await p.evaluate(() => {
      const r = s => { const e = document.querySelector(s); return e && e.getBoundingClientRect(); };
      const all = s => [...document.querySelectorAll(s)];
      const bar = r('.seek_bar'), btn = r('.tag_btn_big'), row = r('.time_row');
      const lbls = all('.hour_lbl').map(e => e.getBoundingClientRect());
      const nums = all('.tag_num_lbl').filter(e => getComputedStyle(e).visibility !== 'hidden')
                     .map(e => e.getBoundingClientRect());
      const cs = s => getComputedStyle(document.querySelector(s));
      return {
        // clock_up — the clock and the hi-fi word live between the button and
        // the hour numbers now, not under the whole timeline.
        clockBelowButton: row.top >= btn.bottom,
        clockAboveHours:  lbls.length > 0 && lbls.every(l => l.top >= row.bottom),
        clockAboveBar:    row.bottom <= bar.top,
        pillOnTheRow:     (() => { const g = r('.grade_pill');
                                   return g.top >= row.top - 1 && g.bottom <= row.bottom + 1; })(),
        label: document.getElementById('tag_btn').textContent,
        hourCount: lbls.length,
        numCount:  nums.length,
        hoursAbove: lbls.length > 0 && lbls.every(l => l.bottom <= bar.top),
        numsBelow:  nums.length  > 0 && nums.every(n => n.top    >= bar.bottom),
        hoursClearButton: lbls.length > 0 && lbls.every(l => l.top >= btn.bottom),
        // the number strip and the marker strip must share one box, or a number
        // would not sit under the thing it names
        sameBox: (() => { const a = r('.tag_numbers'), c = r('.tag_markers');
                          return Math.abs(a.left - c.left) < 1 && Math.abs(a.right - c.right) < 1; })(),
        btnShadow: cs('.tag_btn_big').boxShadow,
        btnImage:  cs('.tag_btn_big').backgroundImage,
        playShadow: cs('.play_btn').boxShadow,
        ctrlWeight: cs('#back_15 .cn').fontWeight,
        unitWeight: cs('#back_15 .cu').fontWeight,
        nowWeight:  cs('#now_time').fontWeight,
        scrollW: document.documentElement.scrollWidth,
        vw: document.documentElement.clientWidth
      };
    });

    const t = vp.tag;
    ok(t + ' — the button reads Tag the Moment',  m.label === 'Tag the Moment', m.label);
    ok(t + ' — clock sits under the button',      m.clockBelowButton, JSON.stringify(m));
    ok(t + ' — clock sits above 1h / 2h',         m.clockAboveHours, JSON.stringify(m));
    ok(t + ' — clock sits above the line',        m.clockAboveBar, JSON.stringify(m));
    ok(t + ' — hi-fi rides the clock row',        m.pillOnTheRow, JSON.stringify(m));
    ok(t + ' — hour marks are drawn at all',      m.hourCount >= 2, m.hourCount);
    ok(t + ' — 1h / 2h sit above the line',       m.hoursAbove, JSON.stringify(m));
    ok(t + ' — they clear the Tag button',        m.hoursClearButton, JSON.stringify(m));
    ok(t + ' — highlight numbers sit below it',   m.numsBelow, JSON.stringify(m));
    ok(t + ' — numbers share the marker box',     m.sameBox, JSON.stringify(m));
    ok(t + ' — no haze on Tag the Moment',        m.btnShadow === 'none', m.btnShadow);
    ok(t + ' — no gradient on Tag the Moment',    m.btnImage === 'none', m.btnImage);
    ok(t + ' — no haze under play',               m.playShadow === 'none', m.playShadow);
    ok(t + ' — transport numbers unbolded',       m.ctrlWeight === '400' && m.unitWeight === '400',
                                                  m.ctrlWeight + '/' + m.unitWeight);
    ok(t + ' — running time unbolded',            m.nowWeight === '400', m.nowWeight);
    ok(t + ' — no sideways scroll',               m.scrollW <= m.vw, m.scrollW + '>' + m.vw);
    await p.close();
    await ctx.close();
  }
  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

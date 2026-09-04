// new_dot_test — the New recording row wears a solid red disc, the same red as
// the REC button, and nothing else in the list changed colour or size.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const REGISTRY = JSON.stringify([
  { page: 'session.html?p=one', name: '2026-09-01 One', date: '2026-09-01', dur: 200, count: 2 }
]);
const RED = 'rgb(215, 0, 21)';   // #d70015, the REC button's red

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

  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.goto('https://vampsf.com/favorites.html');
  await p.waitForTimeout(1200);
  await p.evaluate(() => document.getElementById('page_sessions').click());
  await p.waitForTimeout(600);

  const m = await p.evaluate(() => {
    const row = document.querySelector('.jam_item.jam_new');
    if (!row) return null;
    const ico = row.querySelector('.jam_ico');
    const svg = ico.querySelector('svg');
    const circle = svg && svg.querySelector('circle');
    const others = [...document.querySelectorAll('.jam_item:not(.jam_new):not(.jam_title) .jam_ico')];
    const r = svg.getBoundingClientRect();
    return {
      color: getComputedStyle(ico).color,
      fill: svg.getAttribute('fill'),
      stroke: svg.getAttribute('stroke'),
      shapes: [...svg.children].map(c => c.tagName.toLowerCase()),
      radius: circle ? circle.getAttribute('r') : null,
      size: [Math.round(r.width), Math.round(r.height)],
      // the rest of the list must be untouched
      otherSizes: others.map(o => {
        const s2 = o.querySelector('svg');
        const rb = s2.getBoundingClientRect();
        return [Math.round(rb.width), Math.round(rb.height)];
      }),
      otherColors: [...new Set(others.map(o => getComputedStyle(o).color))],
      label: row.querySelector('.jam_name').textContent.trim()
    };
  });

  ok('the New recording row is there',   !!m, JSON.stringify(m));
  if (!m) { await b.close(); console.log('\n' + pass + ' pass, ' + fail + ' fail'); process.exit(1); }
  ok('it still says "New recording"',    m.label === 'New recording', m.label);
  ok('its icon is red',                  m.color === RED, m.color);
  ok('and it is the REC button red exactly', m.color === RED, m.color);
  ok('the disc is filled, not outlined',
     m.fill === 'currentColor' && m.stroke === null, m.fill + ' / ' + m.stroke);
  ok('and it is only a circle — the plus is gone',
     m.shapes.length === 1 && m.shapes[0] === 'circle', JSON.stringify(m.shapes));
  ok('it kept the outline drawing’s radius',  m.radius === '9', m.radius);
  ok('and the row’s icon footprint',
     m.size[0] === 29 && m.size[1] === 29, JSON.stringify(m.size));

  ok('the other rows kept their size',
     m.otherSizes.length > 0 && m.otherSizes.every(s2 => s2[0] === 29 && s2[1] === 29),
     JSON.stringify(m.otherSizes));
  ok('and none of them turned red',
     m.otherColors.every(c => c !== RED), JSON.stringify(m.otherColors));

  // the red is the same one the record screen paints its button with
  const rec = await ctx.newPage();
  await rec.goto('https://vampsf.com/record.html');
  await rec.waitForTimeout(700);
  const recRed = await rec.evaluate(() => getComputedStyle(document.querySelector('.rec_btn')).backgroundColor);
  ok('and it matches the REC button on the record screen', recRed === m.color, recRed + ' vs ' + m.color);

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

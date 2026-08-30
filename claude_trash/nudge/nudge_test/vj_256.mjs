import { chromium } from 'playwright';
import { NUDGE_URL } from './nudge_open.mjs';
const B = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const ctx = await B.newContext({ viewport: { width: 390, height: 780 } });
await ctx.route('**workers.dev/**', r => r.fulfill({ json: { ok: true } }));
const errs = []; const pg = await ctx.newPage();
pg.on('pageerror', e => errs.push(String(e)));
await pg.goto(NUDGE_URL); await pg.waitForTimeout(600);
await pg.evaluate(() => { window.__lab.pose(0,0,0); window.__lab.steady(); window.__lab.pose(0,0,0); });
async function reset(){ await pg.evaluate(()=>{window.__lab.reset(); for(let i=0;i<60;i++) window.__lab.shove(0,0,0,0,1);}); await pg.waitForTimeout(280);}
await reset();
const b = await pg.evaluate(() => [...document.querySelectorAll('.flips button')].map(x => ({ t: x.textContent, tip: x.title, w: Math.round(x.getBoundingClientRect().width), h: Math.round(x.getBoundingClientRect().height) })));
console.log('  --- five reverse switches ---');
b.forEach(x => console.log('    "' + x.t + '"  ' + x.w + 'x' + x.h + 'px   ' + x.tip));

async function nudge(v, sp) { await pg.evaluate(async o => { const [u,s]=o;
  for (let i=0;i<8;i++) window.__lab.shove(u[0],u[1],u[2],0,1,s);
  for (let i=0;i<48;i++) window.__lab.shove(0,0,0,0,1);
  const t0=Date.now(); while(Date.now()-t0<300){ window.__lab.shove(0,0,0,0,1); await new Promise(r=>requestAnimationFrame(r)); } }, [v, sp||{a:0,b:0,g:0}]);
  return pg.evaluate(() => { const st = getComputedStyle(document.documentElement);
    return { card: window.__lab.state().card, deep: window.__lab.state().deep,
             cx: parseFloat(st.getPropertyValue('--cx')), cy: parseFloat(st.getPropertyValue('--cy')) }; }); }
async function press(i) { await pg.evaluate(n => document.querySelectorAll('.flips button')[n].click(), i); }

console.log('  --- each switch reverses its own vector and nothing else ---');
for (const [i, v, sp, name, read] of [
  [0, [0.9,0,0], null, 'right', r => r.cx],
  [1, [0,0.9,0], null, 'up',    r => r.cy],
  [2, [0,0,0.9], null, 'closer',r => r.deep] ]) {
  await reset(); const off = read(await nudge(v, sp));
  await press(i); await reset(); const on = read(await nudge(v, sp));
  await press(i);
  console.log('    ' + name.padEnd(7) + ' normal ' + String(off).padStart(7) + '   reversed ' + String(on).padStart(7) +
              '   ' + (off !== 0 && on === -off ? 'exactly opposite' : (off !== on ? 'changed' : 'NO CHANGE')));
}
for (const [i, pose, name, read] of [
  // pose is (alpha, beta, gamma): alpha is the swirl in the screen's own plane,
  // gamma is the side rotation that pushes one edge away
  [3, [40,0,0], 'clockwise', 'roll'],
  [4, [0,0,-30], 'edge away', 'turn'] ]) {
  await reset();
  const grab = async () => pg.evaluate(k => { const s = window.__lab.state(); return +s[k].toFixed(2); }, read);
  await pg.evaluate(p => window.__lab.pose(p[0], p[1], p[2]), pose);
  await pg.waitForTimeout(250); const off = await grab();
  await press(i); await pg.waitForTimeout(250); const on = await grab();
  await press(i);
  console.log('    ' + name.padEnd(9) + ' normal ' + String(off).padStart(8) + '   reversed ' + String(on).padStart(8) +
              '   ' + (off !== 0 && Math.abs(on + off) < 0.02 ? 'exactly opposite' : (off !== on ? 'changed' : 'NO CHANGE')));
}
console.log('  --- and they are remembered across a reload ---');
await press(0); await press(3);
const saved = await pg.evaluate(() => localStorage.getItem('vampjam_lab_flip'));
await pg.reload(); await pg.waitForTimeout(900);
const after = await pg.evaluate(() => [...document.querySelectorAll('.flips button')].map(x => x.classList.contains('on')));
console.log('    stored ' + saved + '   -> after reload, lit: ' + JSON.stringify(after));
console.log('  --- panel_half ---');
const sz = await pg.evaluate(() => {
  const p = document.getElementById('pose'), t = document.getElementById('trace');
  p.removeAttribute('hidden'); t.hidden = false;   // svg_hidden: an SVG ignores .hidden
  const r = e => Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height);
  return { pose: r(p), trace: r(t), buf: t.width + 'x' + t.height,
           // panel_low: they sit side by side now, so overlap is a rectangle test
           overlap: (() => { const a=p.getBoundingClientRect(), b=t.getBoundingClientRect();
             return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; })() }; });
console.log('    diagram ' + sz.pose + ' (was 178x178), chart ' + sz.trace + ' (was 178x168)');
console.log('    the chart still draws at ' + sz.buf + ' internally, so a small wobble keeps its resolution');
console.log('    do they overlap? ' + (sz.overlap ? 'YES' : 'no'));
console.log('errors: ' + (errs.length ? errs.join(' | ') : 'none'));
await B.close();

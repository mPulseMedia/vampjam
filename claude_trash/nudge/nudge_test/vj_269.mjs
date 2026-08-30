import { chromium } from 'playwright';
import { NUDGE_URL } from './nudge_open.mjs';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const pg = await (await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2})).newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.goto(NUDGE_URL+'?cb='+Date.now());
await pg.evaluate(()=>localStorage.clear());
await pg.goto(NUDGE_URL+'?cb='+Date.now());
await pg.waitForTimeout(1400);
console.log('  --- open_draw: what is on the glass before anything is pressed ---');
const cold = await pg.evaluate(()=>{
  const cs=[...document.querySelectorAll('.card')];
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  cs.forEach(c=>{const b=c.getBoundingClientRect();x0=Math.min(x0,b.left);y0=Math.min(y0,b.top);x1=Math.max(x1,b.right);y1=Math.max(y1,b.bottom);});
  const h=document.querySelector('.card.here');
  return { days:cs.length, bars:document.querySelectorAll('.cal_bar').length,
    month:[Math.round(x1-x0),Math.round(y1-y0)],
    centre:[Math.round((x0+x1)/2),Math.round((y0+y1)/2)],
    here: h? h.querySelector('.cal_num').textContent : null,
    sc: getComputedStyle(document.documentElement).getPropertyValue('--sc').trim() }; });
console.log('    ' + JSON.stringify(cold));
await pg.screenshot({ path:'/tmp/open_cold.png' });

console.log('  --- flip_hide: closed by default, opens and remembers ---');
const f0 = await pg.evaluate(()=>({ hidden: document.getElementById('flips').hidden,
  btn: !!document.getElementById('flip_pop') }));
console.log('    on load: switches hidden ' + f0.hidden + ', button present ' + f0.btn);
await pg.evaluate(()=>document.getElementById('flip_pop').click());
await pg.waitForTimeout(150);
console.log('    after a press: hidden ' + await pg.evaluate(()=>document.getElementById('flips').hidden) +
            ', rows showing ' + await pg.evaluate(()=>document.querySelectorAll('.flip_row').length));
await pg.reload(); await pg.waitForTimeout(1300);
console.log('    after a reload it is still open: ' + !(await pg.evaluate(()=>document.getElementById('flips').hidden)));
await pg.evaluate(()=>document.getElementById('flip_pop').click()); await pg.waitForTimeout(150);

console.log('  --- bar_low: everything on one band along the bottom ---');
console.log('    ' + JSON.stringify(await pg.evaluate(()=>{
  const r=document.querySelector('.rig').getBoundingClientRect();
  return { x:Math.round(r.x), w:Math.round(r.width), top:Math.round(r.top),
           bottom:Math.round(r.bottom), vh:innerHeight, vw:innerWidth }; })));

console.log('  --- stay_mid: the selected day is centred (this replaced hold_still) ---');
await pg.evaluate(()=>{ window.__lab.steady(); window.__lab.pose(0,0,0); window.__lab.reset(); });
await pg.waitForTimeout(400);
const where = t => pg.evaluate(d=>{
  const c=[...document.querySelectorAll('.card')].find(x=>x.querySelector('.cal_num').textContent.replace(/[A-Za-z]/g,'')===d);
  const b=c.getBoundingClientRect();
  return { at:[Math.round(b.x),Math.round(b.y)], here:c.classList.contains('here') }; }, t);
const hit = (x,y,z) => pg.evaluate(async u=>{ for(let i=0;i<8;i++) window.__lab.shove(u[0],u[1],u[2],0,1);
  for(let i=0;i<48;i++) window.__lab.shove(0,0,0,0,1);
  const t0=Date.now(); while(Date.now()-t0<380){ window.__lab.shove(0,0,0,0,1); await new Promise(r=>requestAnimationFrame(r)); } },[x,y,z]);
const G=0.6;
for (const d of ['16','15','9']) {
  const a = await where(d);
  await hit(G,0,0);
  const b = await where(d);
  const mid = await pg.evaluate(()=>{ const h=document.querySelector('.card.here').getBoundingClientRect();
    return [Math.round(h.x+h.width/2-innerWidth/2), Math.round(h.y+h.height/2-innerHeight/2)]; });
  console.log(`    Sep ${d.padStart(2)}: ${JSON.stringify(a.at)} -> ${JSON.stringify(b.at)}   the selected day sits ${JSON.stringify(mid)} off the centre of the glass`);
}
console.log('  --- zoomed in, it scrolls only when the day would leave the glass ---');
await pg.evaluate(()=>window.__lab.reset()); await pg.waitForTimeout(350);
for (let i=0;i<3;i++) await hit(0,0,-G);
const deep = await pg.evaluate(()=>window.__lab.state().deep);
let moves = 0, offscreen = 0;
for (let i=0;i<4;i++) {
  const a = await pg.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--cx').trim());
  await hit(G,0,0);
  const b = await pg.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--cx').trim());
  if (a!==b) moves++;
  const on = await pg.evaluate(()=>{ const h=document.querySelector('.card.here').getBoundingClientRect();
    return h.right>0 && h.left<innerWidth && h.bottom>0 && h.top<innerHeight; });
  if (!on) offscreen++;
}
console.log(`    at depth ${deep}: the month moved on ${moves} of 4 nudges, and the selected day was off the glass ${offscreen} times`);
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await pg.screenshot({ path:'/tmp/open_deep.png' });
await B.close();

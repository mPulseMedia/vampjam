import { chromium } from 'playwright';
import { NUDGE_URL } from './nudge_open.mjs';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const pg = await (await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2})).newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.goto(NUDGE_URL+'?cb='+Date.now());
await pg.evaluate(()=>localStorage.clear());
await pg.goto(NUDGE_URL+'?cb='+Date.now()); await pg.waitForTimeout(1400);
await pg.evaluate(()=>{ window.__lab.steady(); window.__lab.pose(0,0,0); window.__lab.reset(); });
await pg.waitForTimeout(450);
const now = () => pg.evaluate(()=>{ const s=window.__lab.state();
  const h=document.querySelector('.card.here').getBoundingClientRect();
  return { card:s.card, deep:s.deep, say:s.say,
    mid:[Math.round(h.x+h.width/2), Math.round(h.y+h.height/2)],
    size:[Math.round(h.width), Math.round(h.height)],
    ofW:+(h.width/innerWidth).toFixed(3), ofH:+(h.height/innerHeight).toFixed(3),
    screen:[innerWidth, innerHeight] }; });
const hit = (x,y,z) => pg.evaluate(async u=>{ for(let i=0;i<8;i++) window.__lab.shove(u[0],u[1],u[2],0,1);
  for(let i=0;i<48;i++) window.__lab.shove(0,0,0,0,1);
  const t0=Date.now(); while(Date.now()-t0<400){ window.__lab.shove(0,0,0,0,1); await new Promise(r=>requestAnimationFrame(r)); } },[x,y,z]);
const G=0.6;
console.log('  --- the selected day is centred, wherever you go ---');
const c0 = await now();
console.log(`    screen ${c0.screen[0]}x${c0.screen[1]}, centre (${c0.screen[0]/2}, ${c0.screen[1]/2})`);
for (const [v,l] of [[[0,0,0],'at rest'],[[G,0,0],'one across'],[[G,0,0],'two across'],
                     [[0,G,0],'and one up'],[[0,-G,0],'back down'],[[-G,0,0],'and back across']]) {
  if (v[0]||v[1]||v[2]) await hit(...v);
  const n = await now();
  const dx = n.mid[0]-c0.screen[0]/2, dy = n.mid[1]-c0.screen[1]/2;
  console.log(`    ${l.padEnd(16)} ${n.card.padEnd(11)} centre of the day at (${n.mid[0]}, ${n.mid[1]})  off by (${dx}, ${dy})`);
}
console.log('  --- and at the full-day notch it is 90% of the viewport ---');
await pg.evaluate(()=>window.__lab.reset()); await pg.waitForTimeout(400);
for (let i=0;i<6;i++) {
  const n = await now();
  console.log(`    depth ${String(n.deep).padStart(2)} "${n.say.padEnd(12)}" day ${String(n.size[0]).padStart(4)}x${String(n.size[1]).padStart(4)}  = ${(n.ofW*100).toFixed(1)}% of the width, ${(n.ofH*100).toFixed(1)}% of the height`);
  if (i<5) await hit(0,0,-G);
}
await pg.evaluate(()=>window.__lab.reset()); await pg.waitForTimeout(400);
await pg.screenshot({ path:'/tmp/mid_home.png' });
for (let i=0;i<3;i++) await hit(0,0,-G);
await pg.waitForTimeout(300);
await pg.screenshot({ path:'/tmp/mid_full.png' });
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

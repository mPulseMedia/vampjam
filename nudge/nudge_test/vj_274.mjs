// vj_274 — zoom_deep: the zoom-in range now reaches +6, and the chrome
// inside the deck stays a constant thickness on the glass at every notch.
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

const hit = (x,y,z) => pg.evaluate(async u=>{ for(let i=0;i<8;i++) window.__lab.shove(u[0],u[1],u[2],0,1);
  for(let i=0;i<48;i++) window.__lab.shove(0,0,0,0,1);
  const t0=Date.now(); while(Date.now()-t0<400){ window.__lab.shove(0,0,0,0,1); await new Promise(r=>requestAnimationFrame(r)); } },[x,y,z]);

const look = () => pg.evaluate(()=>{ const s=window.__lab.state();
  const el=document.querySelector('.card.here'), r=el.getBoundingClientRect();
  const cs=getComputedStyle(el);
  const z=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dz'));
  const ring=[...cs.boxShadow.matchAll(/0px 0px 0px ([\d.]+)px/g)].map(m=>+(m[1]*z).toFixed(2));
  const line=document.querySelector('.card.here .cal_ev');
  const lh = line ? +(parseFloat(getComputedStyle(line).fontSize)*z).toFixed(1) : null;
  return { deep:s.deep, w:Math.round(r.width), h:Math.round(r.height), ring, lh };
});

console.log('  --- zoom_deep: how far in you can now push ---');
for (let i=0;i<9;i++) {
  const n = await look();
  console.log(`    depth ${String(n.deep).padStart(2)}   the day is ${String(n.w).padStart(5)}x${String(n.h).padStart(5)}px`
    + `   ${n.lh?('one line of text is '+String(n.lh).padStart(6)+'px'):'text too small to set'}`);
  if (n.deep === 6) { console.log('    it stops at +6'); break; }
  await hit(0,0,-0.6);
}

console.log('  --- ring_flat: the selection ring measured on the GLASS ---');
for (let i=0;i<9;i++) {
  const n = await look();
  console.log(`    depth ${String(n.deep).padStart(2)}   the rings measure ${n.ring.join('px, ')}px`);
  if (n.deep === -2) break;
  await hit(0,0,0.6);
}

console.log('  --- and it still runs at speed when the day is bigger than the glass ---');
for (let i=0;i<8;i++) await hit(0,0,-0.6);
const fps = await pg.evaluate(async ()=>{ let n=0; const t0=performance.now();
  await new Promise(res=>{ const tick=()=>{ n++; window.__lab.shove(0.02,0,0,0,1);
    if (performance.now()-t0 > 1200) res(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  return Math.round(n / ((performance.now()-t0)/1000)); });
console.log(`    at depth +6, ${fps} frames a second`);
await pg.screenshot({ path:'/tmp/vj274_deep.png' });
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

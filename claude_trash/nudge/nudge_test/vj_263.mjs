import { chromium } from 'playwright';
import { NUDGE_URL } from './nudge_open.mjs';
import fs from 'fs';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const pg = await (await B.newContext({viewport:{width:390,height:820}})).newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.goto(NUDGE_URL); await pg.waitForTimeout(1300);
await pg.evaluate(()=>{ window.__lab.steady(); window.__lab.pose(0,0,0); });
await pg.waitForTimeout(300);

console.log('  --- the six directions still work, on the real page ---');
async function hit(v,label,n){
  await pg.evaluate(()=>{ window.__lab.reset(); for(let i=0;i<40;i++) window.__lab.shove(0,0,0,0,1); });
  await pg.waitForTimeout(280);
  const a=await pg.evaluate(()=>{const s=window.__lab.state();return{x:s.cell.x,y:s.cell.y,z:s.deep};});
  await pg.evaluate(async u=>{ for(let i=0;i<(u[3]||8);i++) window.__lab.shove(u[0],u[1],u[2],0,1);
    for(let i=0;i<48;i++) window.__lab.shove(0,0,0,0,1);
    const t0=Date.now(); while(Date.now()-t0<280){ window.__lab.shove(0,0,0,0,1); await new Promise(r=>requestAnimationFrame(r)); } },[...v,n]);
  const b=await pg.evaluate(()=>{const s=window.__lab.state();return{x:s.cell.x,y:s.cell.y,z:s.deep,say:s.bump};});
  const m=(b.x-a.x)||(b.y-a.y)||(b.z-a.z);
  console.log(`    ${label.padEnd(34)} ${m? 'moved '+(b.x-a.x)+','+(b.y-a.y)+' depth '+(b.z-a.z)+'  "'+b.say+'"' : '— nothing'}`);
  return m;
}
const G=0.6;
await hit([G,0,0],'nudge right'); await hit([-G,0,0],'nudge left');
await hit([0,G,0],'nudge up');    await hit([0,-G,0],'nudge down');
await hit([0,0,G],'nudge toward, clean');  await hit([0,0,-G],'nudge away, clean');
console.log('  --- dead_z and orbit_both: near/far with sideways drive underneath it ---');
await hit([0.5,0,0.6],'toward WITH sideways drive');
await hit([0,0,0.10],'a very gentle toward (under the z floor)');
await hit([0,0.10,0],'a very gentle up (under the lateral floor)');
console.log('  --- big_fit: the new ceiling ---');
for (const g of [1.2,1.6,1.9,2.5]) await hit([g,0,0],'drive '+g.toFixed(1));

console.log('  --- and the same numbers replayed over his real recordings ---');
const takes = JSON.parse(fs.readFileSync('/tmp/gest.json','utf8'));
const list = Array.isArray(takes)?takes:(takes.takes||takes);
const res = await pg.evaluate(async (raw) => {
  const L=window.__lab; const fired=[];
  for (const idx of [11,16,18,19]) {
    const k = raw[idx]; if (!k || !k.samples) continue;
    L.reset(); await new Promise(r=>setTimeout(r,120));
    const before = fired.length;
    let last = null;
    for (const smp of k.samples) {
      const a = smp.acc || [0,0,0];
      L.shove(a[0]||0, a[1]||0, a[2]||0, 0, 1,
              { a: (smp.rot||[0,0,0])[0]||0, b: (smp.rot||[0,0,0])[1]||0, g: (smp.rot||[0,0,0])[2]||0 });
      const s = L.state();
      if (s.bump && s.bump !== last) { fired.push({take: idx, way: s.bump}); last = s.bump; }
    }
    fired.push({take: idx, way: '__end__', n: fired.length - before});
  }
  return fired;
}, list);
const byTake = {};
for (const f of res) { if (f.way==='__end__') continue; (byTake[f.take] ||= []).push(f.way.split(' ')[0]); }
for (const [k,v] of Object.entries(byTake)) {
  const c = {}; v.forEach(w=>c[w]=(c[w]||0)+1);
  console.log(`    take index ${k}: ${v.length} nudges read — ` + Object.entries(c).map(([a,b])=>a+' '+b).join(', '));
}
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

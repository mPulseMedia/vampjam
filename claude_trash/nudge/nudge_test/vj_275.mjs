// vj_275 — room_swap: three rooms behind one button, each answering to its own
// subset of the six directions.
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
const R = () => pg.evaluate(()=>window.__lab.rooms());
const bump = () => pg.evaluate(()=>window.__lab.state().bump);

console.log('  --- one button, cycling the three ---');
console.log('    on load: ' + JSON.stringify((await R()).shown) + '  label "' + (await R()).label + '"');
for (let i=0;i<3;i++) {
  await pg.click('#room_btn'); await pg.waitForTimeout(220);
  const r = await R();
  console.log(`    press ${i+1}: now "${r.room}" (${r.label})   showing ${Object.entries(r.shown).filter(([,v])=>v).map(([k])=>k).join(',')||'nothing'}`);
}

console.log('  --- room_read: five pages, and only up and down ---');
await pg.evaluate(()=>window.__lab.room('read')); await pg.waitForTimeout(250);
let r = await R();
console.log(`    the column is ${r.read.tall}px tall over an ${r.read.ph} page = ${(r.read.tall/parseFloat(r.read.ph)).toFixed(2)} pages, text fills ${r.read.used}px`);
for (const [lbl,v] of [['up',[0,0.6,0]],['up',[0,0.6,0]],['right',[0.6,0,0]],['toward',[0,0,-0.6]],['up',[0,0.6,0]],['down',[0,-0.6,0]]]) {
  await hit(...v); r = await R();
  console.log(`    nudge ${lbl.padEnd(7)} page ${r.read.page+1}/5  offset ${r.read.y.padStart(9)}  tab "${r.read.tab}"   ${await bump()}`);
}
console.log('    walk to the end:');
for (let i=0;i<5;i++) await hit(0,0.6,0);
r = await R(); console.log(`    ${'after five more ups'.padEnd(20)} page ${r.read.page+1}/5   ${await bump()}`);

console.log('  --- room_solid: walking, and up is the way out ---');
await pg.evaluate(()=>window.__lab.room('solid')); await pg.waitForTimeout(300);
let sd = await pg.evaluate(()=>window.__lab.solid());
console.log(`    ${sd.faces} faces projected, ${sd.onGlass} near the glass, painted furthest-first: ${sd.sorted}`);
for (const [lbl,v] of [['forward',[0,0,-0.6]],['forward',[0,0,-0.6]],['right',[0.6,0,0]],['left',[-0.6,0,0]],['back',[0,0,0.6]]]) {
  await hit(...v); r = await R(); sd = await pg.evaluate(()=>window.__lab.solid());
  console.log(`    nudge ${lbl.padEnd(8)} at x${String(r.solid.x).padStart(2)} z${String(r.solid.z).padStart(2)}  eye (${sd.eye.cx}, ${sd.eye.cz})  ${sd.onGlass} shapes in view   ${await bump()}`);
}
await hit(0,-0.6,0); console.log(`    nudge down     ${await R().then(x=>x.room)}   ${await bump()}`);
await hit(0,0.6,0); r = await R();
console.log(`    nudge up       ${r.room}   ${await bump()}`);
console.log('  --- and each room kept its own place while you were away ---');
await pg.evaluate(()=>window.__lab.room('read')); r = await R();
console.log(`    the article is still on page ${r.read.page+1}`);
await pg.evaluate(()=>window.__lab.room('solid')); r = await R();
console.log(`    the space is still at ${r.solid.x},${r.solid.z}`);
await pg.evaluate(()=>window.__lab.room('cal')); r = await R();
console.log(`    the calendar is still on ${await pg.evaluate(()=>window.__lab.state().card)}`);
console.log('  --- remembered across a reload ---');
await pg.evaluate(()=>window.__lab.room('read'));
await pg.goto(NUDGE_URL+'?cb='+Date.now()); await pg.waitForTimeout(1200);
console.log(`    reopened in: ${(await R()).room}`);
console.log('  --- and all three run at speed ---');
for (const rm of ['cal','read','solid']) {
  await pg.evaluate(x=>window.__lab.room(x), rm); await pg.waitForTimeout(400);
  const f = await pg.evaluate(async ()=>{ let n=0; const t0=performance.now();
    await new Promise(res=>{ const tick=()=>{ n++; window.__lab.shove(0.02,0,0,0,1);
      if (performance.now()-t0>1200) res(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    return Math.round(n/((performance.now()-t0)/1000)); });
  console.log(`    ${rm.padEnd(6)} ${f} frames a second`);
}
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

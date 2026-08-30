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
console.log('  --- cal_head: the heading is ON the paper ---');
const h = await pg.evaluate(()=>{
  const t=document.querySelector('.cal_title'), d=document.querySelector('.cal_dow');
  const r=e=>{const b=e.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)];};
  const cards=[...document.querySelectorAll('.card')];
  let x0=1e9,y0=1e9,x1=-1e9;
  cards.forEach(c=>{const b=c.getBoundingClientRect();x0=Math.min(x0,b.left);y0=Math.min(y0,b.top);x1=Math.max(x1,b.right);});
  return { title:t.textContent, titleBox:r(t), dow:[...d.querySelectorAll('span')].map(s=>s.textContent),
    dowBox:r(d), gridTop:Math.round(y0), gridLeft:Math.round(x0), gridRight:Math.round(x1),
    inDeck: !!t.closest('.deck') && !!d.closest('.deck') }; });
console.log('    title "' + h.title + '" at ' + JSON.stringify(h.titleBox) + ', weekdays ' + h.dow.join(' '));
console.log('    both inside the deck: ' + h.inDeck);
console.log('    the paper spans x ' + h.gridLeft + '-' + h.gridRight + ', week one starts at y ' + h.gridTop);
console.log('    the heading sits above it: ' + (h.titleBox[1]+h.titleBox[3] <= h.gridTop && h.dowBox[1]+h.dowBox[3] <= h.gridTop) +
            ', and spans the same width: ' + (Math.abs(h.titleBox[0]-h.gridLeft)<2 && Math.abs(h.titleBox[0]+h.titleBox[2]-h.gridRight)<2));
const hit = (x,y,z) => pg.evaluate(async u=>{ for(let i=0;i<8;i++) window.__lab.shove(u[0],u[1],u[2],0,1);
  for(let i=0;i<48;i++) window.__lab.shove(0,0,0,0,1);
  const t0=Date.now(); while(Date.now()-t0<400){ window.__lab.shove(0,0,0,0,1); await new Promise(r=>requestAnimationFrame(r)); } },[x,y,z]);
console.log('  --- and it scales and pans with the paper, as printing does ---');
for (const [v,l] of [[[0,0,0],'at home'],[[0.6,0,0],'one day across'],[[0,0,0.6],'one notch out'],[[0,0,-0.6],'and back in']]) {
  if (v[0]||v[1]||v[2]) await hit(...v);
  const n = await pg.evaluate(()=>{ const t=document.querySelector('.cal_title').getBoundingClientRect();
    return { say:window.__lab.state().say, at:[Math.round(t.x),Math.round(t.y)], w:Math.round(t.width),
             fs:getComputedStyle(document.querySelector('.cal_title')).fontSize }; });
  console.log(`    ${l.padEnd(16)} "${n.say.padEnd(12)}" title at ${JSON.stringify(n.at)} ${n.w}px wide, set ${n.fs}`);
}
console.log('  --- zoom_room: how far back you can now pull ---');
await pg.evaluate(()=>window.__lab.reset()); await pg.waitForTimeout(400);
let last=null;
for (let i=0;i<9;i++) {
  const n = await pg.evaluate(()=>{ const s=window.__lab.state();
    const cs=[...document.querySelectorAll('.card')];
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    cs.forEach(c=>{const b=c.getBoundingClientRect();x0=Math.min(x0,b.left);y0=Math.min(y0,b.top);x1=Math.max(x1,b.right);y1=Math.max(y1,b.bottom);});
    return { deep:s.deep, month:[Math.round(x1-x0),Math.round(y1-y0)] }; });
  if (n.deep === last) { console.log('    it stops at ' + n.deep); break; }
  console.log(`    depth ${String(n.deep).padStart(3)}  the whole month is ${String(n.month[0]).padStart(4)}x${String(n.month[1]).padStart(4)}px`);
  last = n.deep;
  await hit(0,0,0.6);
}
console.log('  --- day_dim ---');
console.log('    ' + JSON.stringify(await pg.evaluate(()=>{ const o=document.querySelector('.card:not(.here)'), h=document.querySelector('.card.here');
  return { others:getComputedStyle(o).opacity+' / '+getComputedStyle(o).filter, focus:getComputedStyle(h).opacity }; })));
await pg.evaluate(()=>window.__lab.reset()); await pg.waitForTimeout(450);
await pg.screenshot({ path:'/tmp/head_home.png' });
for (let i=0;i<3;i++) await hit(0,0,0.6);
await pg.waitForTimeout(300);
await pg.screenshot({ path:'/tmp/head_far.png' });
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

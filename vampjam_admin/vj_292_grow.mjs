// vj_292 — row_grow + name_under.
import { chromium } from 'playwright';
const ROOT = process.env.SITE_URL || 'http://localhost:8905';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const ctx = await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2, hasTouch:true});
const pg = await ctx.newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.route('**/api.github.com/**', r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
await pg.route('**/raw.githubusercontent.com/**', r=>r.fulfill({status:200,contentType:'application/json',
  body: JSON.stringify({audio:{url:ROOT+'/silence.m4a'}, tags:[{id:'t1',t:10,label:'one',fav:true},{id:'t2',t:20,label:'two',fav:true}]})}));
await pg.route('**vampjam-sync**', r=>r.fulfill({status:200,contentType:'application/json',body:'{}'}));

console.log('  --- favorites: the clock is gone and the name is under the bar ---');
await pg.goto(ROOT+'/favorites.html?cb='+Date.now()); await pg.waitForTimeout(2200);
const fav = await pg.evaluate(()=>{
  const bar=document.getElementById('fav_bar').getBoundingClientRect();
  const nm=document.getElementById('now_name').getBoundingClientRect();
  return { clock: !!document.querySelector('.time_row, #now_time, #dur_time'),
           barTop:Math.round(bar.top), nameTop:Math.round(nm.top),
           order: nm.top > bar.top ? 'name below bar' : 'name ABOVE bar' };});
console.log(`    a clock anywhere on the page: ${fav.clock}`);
console.log(`    bar at ${fav.barTop}, name at ${fav.nameTop} — ${fav.order}`);
await pg.evaluate(()=>{ const r=document.querySelectorAll('.fav_row')[0]; r.querySelector('.fav_play_sm').click(); });
await pg.waitForTimeout(900);
console.log(`    playing a favourite still fills the name: "${await pg.evaluate(()=>document.getElementById('now_name').textContent)}"`);

console.log('  --- sessions: a new highlight opens over half a second ---');
await pg.goto(ROOT+'/2026_08_07_sound_union.html?cb='+Date.now()); await pg.waitForTimeout(2400);
const trace = await pg.evaluate(async ()=>{
  const before = document.querySelectorAll('.tag_row').length;
  document.getElementById('tag_btn').click();
  const seen = [];
  const t0 = performance.now();
  await new Promise(res=>{
    const tick = () => {
      const r = document.querySelector('.tag_row.tag_new');
      if (r) seen.push({ t: Math.round(performance.now()-t0), h: +r.getBoundingClientRect().height.toFixed(1),
                         op: +(getComputedStyle(r).opacity) });
      if (performance.now()-t0 > 640) return res();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const r = document.querySelector('.tag_row.tag_new');
  return { before, after: document.querySelectorAll('.tag_row').length, seen,
           classGone: !r,
           finalH: +document.querySelectorAll('.tag_row')[0].getBoundingClientRect().height.toFixed(1),
           inlineH: document.querySelectorAll('.tag_row')[0].style.height };
});
console.log(`    rows ${trace.before} -> ${trace.after}`);
const s = trace.seen;
if (s.length) {
  const pick = ms => s.reduce((a,b)=>Math.abs(b.t-ms)<Math.abs(a.t-ms)?b:a);
  for (const ms of [0, 125, 250, 375, 500]) { const p = pick(ms);
    console.log(`      ~${String(ms).padStart(3)}ms  height ${String(p.h).padStart(5)}px  opacity ${p.op.toFixed(2)}`); }
  console.log(`    grew from ${s[0].h}px to ${s[s.length-1].h}px over ${s[s.length-1].t}ms`);
} else console.log('    BUG — the row was never marked');
console.log(`    class cleaned up afterwards: ${trace.classGone}, inline height cleared: ${trace.inlineH===''}`);
console.log(`    settled height: ${trace.finalH}px`);
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

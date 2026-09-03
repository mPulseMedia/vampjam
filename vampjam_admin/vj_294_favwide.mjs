// vj_294 — edit_wide on the favourites row.
import { chromium } from 'playwright';
const ROOT = process.env.SITE_URL || 'http://localhost:8905';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const pg = await (await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2, hasTouch:true})).newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.route('**/api.github.com/**', r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
let k=0;
await pg.route('**/raw.githubusercontent.com/**', r=>{k++;r.fulfill({status:200,contentType:'application/json',
  body: JSON.stringify({audio:{url:ROOT+'/silence.m4a'}, tags:[{id:'f'+k,t:60,label:'a fairly long favourite title',fav:true}]})});});
await pg.route('**vampjam-sync**', r=>r.fulfill({status:200,contentType:'application/json',body:'{}'}));
await pg.goto(ROOT+'/favorites.html?cb='+Date.now()); await pg.waitForTimeout(2400);

const shape = () => pg.evaluate(()=>{
  const row = document.querySelector('.fav_row');
  const main = row.querySelector('.fav_main'), f = row.querySelector('.fav_name');
  const r = row.getBoundingClientRect(), l = f.getBoundingClientRect();
  const after = [...row.children].filter(c => c.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_PRECEDING);
  const shown = after.filter(c => getComputedStyle(c).display !== 'none');
  return { rowW:Math.round(r.width), fieldW:Math.round(l.width),
           gap:Math.round(r.right - l.right), after:after.length, shown:shown.length,
           pad:getComputedStyle(row).paddingRight };
});
console.log('  --- not editing ---');
const a = await shape();
console.log(`    field ${a.fieldW}px of a ${a.rowW}px row, ending ${a.gap}px short of the edge`);
console.log(`    controls after it: ${a.shown} of ${a.after} showing`);

console.log('  --- editing ---');
await pg.evaluate(()=>{ const f=document.querySelector('.fav_name'); f.readOnly=false; f.focus(); });
await pg.waitForTimeout(300);
const b = await shape();
console.log(`    field ${b.fieldW}px of a ${b.rowW}px row, ending ${b.gap}px short of the edge`);
console.log(`    controls after it: ${b.shown} of ${b.after} showing   (row padding ${b.pad})`);
console.log(`    gained ${b.fieldW - a.fieldW}px`);

console.log('  --- back on blur ---');
await pg.evaluate(()=>document.querySelector('.fav_name').blur()); await pg.waitForTimeout(300);
const c = await shape();
console.log(`    ${c.fieldW===a.fieldW && c.shown===a.shown ? 'restored exactly' : 'BUG — did not restore'}`);

console.log('  --- and reorder mode cannot collide with it ---');
await pg.click('#sort_btn'); await pg.waitForTimeout(350);
const rm = await pg.evaluate(()=>{ const f=document.querySelector('.fav_name');
  return { readOnly:f.readOnly, pe:getComputedStyle(f).pointerEvents,
           grips:document.querySelectorAll('.fav_grip').length }; });
console.log(`    in reorder: field readOnly ${rm.readOnly}, pointer-events ${rm.pe}, ${rm.grips} grips`);
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

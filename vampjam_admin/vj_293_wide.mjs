// vj_293 — edit_wide: the title field takes the row while you are typing in it.
import { chromium } from 'playwright';
const ROOT = process.env.SITE_URL || 'http://localhost:8905';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const pg = await (await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2, hasTouch:true})).newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.route('**/api.github.com/**', r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
await pg.route('**/raw.githubusercontent.com/**', r=>r.fulfill({status:200,contentType:'application/json',
  body: JSON.stringify({audio:{url:ROOT+'/silence.m4a'}, tags:[
    {id:'t1',t:10,label:'a fairly long highlight title',fav:true},{id:'t2',t:20,label:'two'}]})}));
await pg.route('**vampjam-sync**', r=>r.fulfill({status:200,contentType:'application/json',body:'{}'}));
await pg.goto(ROOT+'/2026_08_07_sound_union.html?cb='+Date.now()); await pg.waitForTimeout(2400);

const shape = () => pg.evaluate(()=>{
  const row = document.querySelector('.tag_row');
  const lab = row.querySelector('.tag_label');
  const r = row.getBoundingClientRect(), l = lab.getBoundingClientRect();
  const after = [...row.children].filter(c => c.compareDocumentPosition(lab) & Node.DOCUMENT_POSITION_PRECEDING);
  const shown = after.filter(c => getComputedStyle(c).display !== 'none');
  return { rowW:Math.round(r.width), rowRight:Math.round(r.right),
           labW:Math.round(l.width), labRight:Math.round(l.right),
           gap:Math.round(r.right - l.right), afterCount:after.length, shownAfter:shown.length,
           pad: getComputedStyle(row).paddingRight };
});

console.log('  --- not editing ---');
let a = await shape();
console.log(`    field ${a.labW}px of a ${a.rowW}px row, ending ${a.gap}px short of the right edge`);
console.log(`    controls after it: ${a.shownAfter} of ${a.afterCount} showing`);

console.log('  --- editing (the field focused) ---');
await pg.evaluate(()=>{ const l=document.querySelector('.tag_label'); l.readOnly=false; l.focus(); });
await pg.waitForTimeout(300);
let b = await shape();
console.log(`    field ${b.labW}px of a ${b.rowW}px row, ending ${b.gap}px short of the right edge`);
console.log(`    controls after it: ${b.shownAfter} of ${b.afterCount} showing`);
console.log(`    row's right padding is ${b.pad} — that is the "just shy"`);
console.log(`    gained ${b.labW - a.labW}px`);

console.log('  --- and it all comes back on blur ---');
await pg.evaluate(()=>document.querySelector('.tag_label').blur());
await pg.waitForTimeout(300);
let c = await shape();
console.log(`    field back to ${c.labW}px, controls after it: ${c.shownAfter} of ${c.afterCount}`);
console.log(`    ${c.labW===a.labW && c.shownAfter===a.shownAfter ? 'restored exactly' : 'BUG — did not restore'}`);
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

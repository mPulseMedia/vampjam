// vj_290 — fav_here: the share on a favourite links back to the favourites page,
// at that highlight, and arriving there selects it and puts it on screen.
import { chromium } from 'playwright';
const ROOT='http://localhost:8905';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const ctx = await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2, hasTouch:true,
  permissions:['clipboard-read','clipboard-write']});
const pg = await ctx.newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
let k=0;
const stub = async p => {
  await p.route('**/api.github.com/**', r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await p.route('**/raw.githubusercontent.com/**', r=>{k++;r.fulfill({status:200,contentType:'application/json',
    body: JSON.stringify({audio:{url:ROOT+'/silence.m4a'}, tags:[
      {id:'tag_'+k+'_a',t:60,label:'s'+k+' alpha',fav:true},
      {id:'tag_'+k+'_b',t:120,label:'s'+k+' bravo',fav:true}]})});});
  await p.route('**vampjam-sync**', r=>r.fulfill({status:200,contentType:'application/json',body:'{}'}));
};
await stub(pg);
await pg.goto(ROOT+'/favorites.html?cb='+Date.now()); await pg.waitForTimeout(2200);
console.log('  --- the share on a row ---');
const rows = await pg.evaluate(()=>Array.from(document.querySelectorAll('.fav_row')).map(r=>({id:r.dataset.favId, name:r.querySelector('.fav_name').value})));
console.log(`    ${rows.length} rows; the 6th is "${rows[5].name}" (${rows[5].id})`);
await pg.locator('.fav_row').nth(5).locator('.fav_share_btn').click();
await pg.waitForTimeout(400);
const copied = await pg.evaluate(()=>navigator.clipboard.readText());
console.log(`    copied: ${copied.replace(ROOT,'')}`);
console.log(`    points at the favourites page, not the session: ${/favorites\.html\?tag=/.test(copied)}`);
console.log('  --- following that link ---');
k = 0;   // the stub replays the same ids on the second load
await pg.goto(copied.replace(/(\?)/, '?cb='+Date.now()+'&')); await pg.waitForTimeout(2400);
const landed = await pg.evaluate(()=>{
  const cur = document.querySelector('.fav_row.playing');
  if (!cur) return {none:true};
  const b = cur.getBoundingClientRect();
  return { id:cur.dataset.favId, name:cur.querySelector('.fav_name').value,
           idx:Array.from(document.querySelectorAll('.fav_row')).indexOf(cur),
           onScreen: b.top > -1 && b.bottom < innerHeight+1, top:Math.round(b.top), vh:innerHeight };
});
console.log(`    selected row: "${landed.name}" (${landed.id}), index ${landed.idx}`);
console.log(`    scrolled onto the glass: ${landed.onScreen} (top ${landed.top} of ${landed.vh})`);
console.log('  --- a link to a moment that is no longer a favourite ---');
await pg.goto(ROOT+'/favorites.html?tag=tag_nope_x&cb='+Date.now()); await pg.waitForTimeout(2400);
const t = await pg.evaluate(()=>({ toast:(document.getElementById('toast')||{}).textContent,
  shown:(document.getElementById('toast')||{}).className, sel:!!document.querySelector('.fav_row.playing') }));
console.log(`    toast "${t.toast}" (${t.shown||'not shown'}), nothing selected: ${!t.sel}`);
console.log('  --- and the two controls on a row now say different things ---');
k=0; await pg.goto(ROOT+'/favorites.html?cb='+Date.now()); await pg.waitForTimeout(2200);
const two = await pg.evaluate(()=>{const r=document.querySelectorAll('.fav_row')[5];
  return { cassette:r.querySelector('.fav_sess').getAttribute('href'), id:r.dataset.favId };});
console.log(`    cassette -> ${two.cassette}`);
console.log(`    share    -> favorites.html?tag=${two.id}`);
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

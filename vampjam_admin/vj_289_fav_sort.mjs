import { chromium } from 'playwright';
const ROOT = 'http://localhost:8905';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const ctx = await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2, hasTouch:true});
const pg = await ctx.newPage();
const errs=[], posts=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.route('**/api.github.com/**', r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
let sess=0;
await pg.route('**/raw.githubusercontent.com/**', r=>{ const k=++sess;
  r.fulfill({status:200,contentType:'application/json',
  body: JSON.stringify({audio:{url:ROOT+'/silence.m4a'}, tags:[
    {id:'t'+k+'a',t:60,label:'s'+k+'-alpha',fav:true},{id:'t'+k+'b',t:120,label:'s'+k+'-bravo',fav:true}]})}); });
await pg.route('**vampjam-sync**', r=>{ posts.push(r.request().postData()||''); r.fulfill({status:200,contentType:'application/json',body:'{}'}); });
await pg.goto(ROOT+'/favorites.html?cb='+Date.now()); await pg.waitForTimeout(2200);
const names = () => pg.evaluate(()=>Array.from(document.querySelectorAll('.fav_row .fav_name')).map(i=>i.value).slice(0,4));
console.log('  --- the button ---');
console.log(`    label "${await pg.locator('#sort_btn').textContent()}", at the bottom of the list: ${await pg.evaluate(()=>document.querySelector('.sort_bar').getBoundingClientRect().top > document.querySelector('.fav_list').getBoundingClientRect().top)}`);
console.log(`    before: ${(await names()).join(' , ')}`);
await pg.click('#sort_btn'); await pg.waitForTimeout(400);
const mode = await pg.evaluate(()=>{ const r=document.querySelector('.fav_row');
  return { btn:document.getElementById('sort_btn').textContent, grips:document.querySelectorAll('.fav_grip').length,
    play:document.querySelectorAll('.fav_play_sm').length, heart:document.querySelectorAll('.fav_heart').length,
    share:document.querySelectorAll('.fav_share_btn').length, grip:r.querySelector('.fav_grip').textContent }; });
console.log('  --- in reorder mode ---');
console.log(`    button now "${mode.btn}"; ${mode.grips} grips ("${mode.grip}"), play ${mode.play}, heart ${mode.heart}, share ${mode.share}`);
console.log('  --- drag row 1 down past rows 2 and 3 ---');
const box = r => pg.evaluate(i=>{const b=document.querySelectorAll('.fav_row')[i].getBoundingClientRect();return {x:b.x+20,y:b.y+b.height/2,h:b.height};}, r);
await pg.evaluate(()=>document.querySelector('.fav_grip').scrollIntoView({block:'center'}));
await pg.waitForTimeout(300);
const g0 = await pg.evaluate(()=>{const b=document.querySelector('.fav_grip').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};});
const r1 = await box(1);
await pg.mouse.move(g0.x, g0.y); await pg.mouse.down();
for (let i=1;i<=12;i++){ await pg.mouse.move(g0.x, g0.y + (r1.h*2.4)*i/12); await pg.waitForTimeout(25); }
await pg.mouse.up(); await pg.waitForTimeout(500);
console.log(`    after:  ${(await names()).join(' , ')}`);
const saved = await pg.evaluate(()=>JSON.parse(localStorage.getItem('vampjam_fav_order')||'[]'));
console.log(`    localStorage order: ${saved.join(',')}`);
await pg.waitForTimeout(1200);
console.log(`    posted to the worker: ${posts.length} time(s)${posts.length?' — path '+JSON.parse(posts[posts.length-1]).path:''}`);
console.log('  --- navigate away WITHOUT pressing Done ---');
const wanted = (await pg.evaluate(()=>JSON.parse(localStorage.getItem('vampjam_fav_order')||'[]'))).join(',');
await pg.goto(ROOT+'/favorites.html?cb='+Date.now()); await pg.waitForTimeout(2200);
const back = await pg.evaluate(()=>JSON.parse(localStorage.getItem('vampjam_fav_order')||'[]')).then(a=>a.join(','));
console.log(`    order kept: ${back===wanted}`);
const order2 = await names();
console.log(`    and the list came back in it: ${order2.join(' , ')}`);
console.log(`    worker posts in total: ${posts.length}${posts.length?' (last path '+JSON.parse(posts[posts.length-1]).path+')':''}`);
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await pg.screenshot({path:'/tmp/fav_sort.png'});
await B.close();

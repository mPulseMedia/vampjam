// vj_288 — fav_row: the favourites row picks up the session rows' two-tap
// title, a narrow cycling date column, and the same 29px play triangle.
// Run it against a static server over the repo root:  python3 -m http.server 8905
import { chromium } from 'playwright';
const ROOT = process.env.SITE_URL || 'http://localhost:8905';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const pg = await (await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2, hasTouch:true})).newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
// stub the two network reads favorites does, with one session and two favourites
await pg.route('**/api.github.com/**', r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
await pg.route('**/raw.githubusercontent.com/**', r=>r.fulfill({status:200,contentType:'application/json',
  body: JSON.stringify({audio:{url:''+ROOT+'/silence.m4a'}, tags:[
    {id:'t1', t:120, label:'the good bit', fav:true},
    {id:'t2', t:900, label:'second one',  fav:true}]})}));
await pg.goto(ROOT+'/favorites.html?cb='+Date.now());
await pg.waitForTimeout(2200);
const rows = await pg.locator('.fav_row').count();
console.log(`  rows rendered: ${rows}`);
if (!rows) { console.log('  (no rows — the stub did not take; measuring CSS only)'); }
const m = await pg.evaluate(()=>{
  const r=document.querySelector('.fav_row'); if(!r) return null;
  const g=s=>{const e=r.querySelector(s); if(!e) return null; const b=e.getBoundingClientRect();
    return {w:Math.round(b.width), fs:getComputedStyle(e).fontSize, txt:e.textContent||e.value};};
  return { play:g('.fav_play_sm'), date:g('.fav_date'), sess:g('.fav_sess'), name:g('.fav_name'),
           readonly: r.querySelector('.fav_name').readOnly, rowW:Math.round(r.getBoundingClientRect().width) };
});
if (m) {
  console.log(`  play triangle  ${m.play.fs}  (session rows are 29px)`);
  console.log(`  date column    ${m.date ? m.date.w+'px' : 'gone (date_gone)'}`);
  console.log(`  session link   ${m.sess.w}px of ${m.rowW}  "${m.sess.txt}"`);
  console.log(`  title readOnly on an unselected row: ${m.readonly}`);
  console.log('  --- tapping the title: first selects and plays, second edits ---');
  await pg.locator('.fav_name').first().click();
  await pg.waitForTimeout(400);
  const a = await pg.evaluate(()=>({ ro:document.querySelector('.fav_name').readOnly,
    playing:document.querySelector('.fav_row').classList.contains('playing'),
    focused:document.activeElement && document.activeElement.className }));
  console.log(`    after tap 1: readOnly ${a.ro}, row playing ${a.playing}, focus on "${a.focused}"`);
  await pg.waitForTimeout(500);          // past the ghost-click guard, as a real second tap is
  await pg.locator('.fav_name').first().click();
  await pg.waitForTimeout(300);
  const b2 = await pg.evaluate(()=>({ ro:document.querySelector('.fav_name').readOnly,
    focused:document.activeElement && document.activeElement.className }));
  console.log(`    after tap 2: readOnly ${b2.ro}, focus on "${b2.focused}"`);
  const cass = await pg.evaluate(()=>{const a=document.querySelector('.fav_sess');
    return { svg:!!a.querySelector('svg'), text:a.textContent.trim(), href:a.getAttribute('href') };});
  console.log(`  cassette       svg ${cass.svg}, no text "${cass.text}", -> ${cass.href}`);
}
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await pg.screenshot({path:'/tmp/fav_row.png'});
await B.close();

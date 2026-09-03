// vj_295 — edit_plain: the highlight title edits like a favourite's does.
import { chromium } from 'playwright';
const ROOT = process.env.SITE_URL || 'http://localhost:8905';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const pg = await (await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2, hasTouch:true})).newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.route('**/api.github.com/**', r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
let k=0;
await pg.route('**/raw.githubusercontent.com/**', r=>{k++;r.fulfill({status:200,contentType:'application/json',
  body: JSON.stringify({audio:{url:ROOT+'/silence.m4a'}, tags:[{id:'x'+k,t:10,label:'a highlight worth naming',fav:true}]})});});
await pg.route('**vampjam-sync**', r=>r.fulfill({status:200,contentType:'application/json',body:'{}'}));

async function look(url, sel) {
  await pg.goto(url+'?cb='+Date.now()); await pg.waitForTimeout(2400);
  const off = await pg.evaluate(s=>{ const e=document.querySelector(s), c=getComputedStyle(e), r=e.getBoundingClientRect();
    return { bg:c.backgroundColor, shadow:c.boxShadow, border:c.borderBottom, radius:c.borderRadius,
             w:Math.round(r.width), h:Math.round(r.height) }; }, sel);
  await pg.evaluate(s=>{ const e=document.querySelector(s); e.readOnly=false; e.focus(); }, sel);
  await pg.waitForTimeout(250);
  const on = await pg.evaluate(s=>{ const e=document.querySelector(s), c=getComputedStyle(e), r=e.getBoundingClientRect();
    return { bg:c.backgroundColor, shadow:c.boxShadow, border:c.borderBottom, radius:c.borderRadius,
             w:Math.round(r.width), h:Math.round(r.height) }; }, sel);
  return { off, on };
}
const S = await look(ROOT+'/2026_08_07_sound_union.html', '.tag_label');
const F = await look(ROOT+'/favorites.html', '.fav_name');
const row = a => `bg ${a.bg}  shadow ${a.shadow==='none'?'none':'YES'}  under ${a.border}  radius ${a.radius}`;
console.log('  --- a session highlight, editing ---');
console.log(`    ${row(S.on)}`);
console.log('  --- a favourite, editing ---');
console.log(`    ${row(F.on)}`);
const same = S.on.bg===F.on.bg && S.on.shadow===F.on.shadow && S.on.border===F.on.border;
console.log(`    the two match: ${same}`);
console.log('  --- and nothing shifts when the line arrives ---');
console.log(`    session field ${S.off.h}px -> ${S.on.h}px tall, ${S.off.w} -> ${S.on.w} wide`);
console.log(`    ${S.off.h===S.on.h ? 'no jump' : 'BUG — the row moves'}   (it widens because of edit_wide, which is wanted)`);
console.log(`    no box before either: ${S.off.shadow==='none' && S.off.bg==='rgba(0, 0, 0, 0)'}`);
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

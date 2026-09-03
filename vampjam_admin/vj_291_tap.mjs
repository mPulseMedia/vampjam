// vj_291 — tap_only: a drag that starts on a control must not also press it.
// The two gestures are driven as real touch events and then the click the browser
// would synthesise, because the point under test is the GUARD's arithmetic, not
// Chromium's gesture recogniser (which headless does not run the same way).
import { chromium } from 'playwright';
const ROOT = process.env.SITE_URL || 'http://localhost:8905';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const pg = await (await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2, hasTouch:true, isMobile:true})).newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.route('**/api.github.com/**', r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
await pg.route('**/raw.githubusercontent.com/**', r=>r.fulfill({status:200,contentType:'application/json',
  body: JSON.stringify({audio:{url:ROOT+'/silence.m4a'}, tags:[{id:'t1',t:10,label:'one'}]})}));
await pg.route('**vampjam-sync**', r=>r.fulfill({status:200,contentType:'application/json',body:'{}'}));
await pg.goto(ROOT+'/2026_08_07_sound_union.html?cb='+Date.now()); await pg.waitForTimeout(2400);

const run = (dy, steps) => pg.evaluate(async d => {
  const el = document.getElementById('tag_btn');
  const r = el.getBoundingClientRect(), x = r.x + r.width/2, y = r.y + r.height/2;
  window.__h = 0;
  // the button acts on TOUCHEND, not click — so count what actually reaches it.
  // Bubble phase on the button itself: an event stopped at the window in capture
  // never gets here, which is exactly the thing under test.
  const on = () => { window.__h++; };
  el.addEventListener('touchend', on, false);
  const onc = e => { if (e.target.closest && e.target.closest('#tag_btn')) window.__h++; };
  document.addEventListener('click', onc, false);
  const mk = (t, cx, cy) => new TouchEvent(t, { bubbles:true, cancelable:true,
    touches: t==='touchend' ? [] : [new Touch({identifier:9, target:el, clientX:cx, clientY:cy})],
    changedTouches: [new Touch({identifier:9, target:el, clientX:cx, clientY:cy})] });
  el.dispatchEvent(mk('touchstart', x, y));
  for (let i=1;i<=d.steps;i++) { el.dispatchEvent(mk('touchmove', x, y + d.dy*i/d.steps));
    await new Promise(r2=>setTimeout(r2,16)); }
  el.dispatchEvent(mk('touchend', x, y + d.dy));
  el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, clientX:x, clientY:y }));
  await new Promise(r2=>setTimeout(r2,60));
  el.removeEventListener('touchend', on, false);
  document.removeEventListener('click', onc, false);
  return window.__h;
}, { dy, steps });

console.log('  --- the press that should still work ---');
const tap = await run(0, 0);
console.log(`    a tap (0px of travel):        ${tap} press through  ${tap>0?'works — the button hears it':'BUG — swallowed'}`);
console.log('      (a tap reaches it twice: its own touchend handler, then the click)');
console.log('  --- and the one that should not ---');
for (const px of [4, 12, 130]) {
  const n = await run(px, Math.max(1, Math.round(px/14)));
  const ok = px <= 10 ? n > 0 : n === 0;
  console.log(`    a ${String(px).padStart(3)}px drag from it:      ${n} press through  ${ok ? (px<=10?'still a tap':'swallowed, as it should be') : 'BUG'}`);
}
console.log('  --- and the drawer still answers the swipe ---');
const cdp = await pg.context().newCDPSession(pg);
const t=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,radiusX:12,radiusY:12,force:1}]});
const b = await pg.evaluate(()=>{const e=document.getElementById('tag_btn').getBoundingClientRect();
  return {x:Math.round(e.x+e.width/2), y:Math.round(e.y+e.height/2)};});
await pg.evaluate(()=>window.scrollTo(0,0)); await pg.waitForTimeout(200);
await t('touchStart', b.x, b.y);
for (let i=1;i<=9;i++){ await t('touchMove', b.x, b.y+130*i/9); await pg.waitForTimeout(18); }
await t('touchEnd', b.x, b.y+130); await pg.waitForTimeout(500);
console.log(`    drawer open after a pull from the button: ${await pg.evaluate(()=>document.getElementById('session_drawer').classList.contains('open'))}`);
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

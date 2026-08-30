// vj_276 — nudge_out: the experiment is a folder now, the old address still
// opens it, and the one seam to the host is a single file.
import { chromium } from 'playwright';
// vj_276 tests the SPLIT, so it addresses the site root rather than the page
const ROOT = process.env.SITE_URL || 'http://localhost:8901';
const B = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
const ctx = await B.newContext({viewport:{width:390,height:820}, deviceScaleFactor:2});
const pg = await ctx.newPage();
const errs=[], bad=[], got=[];
pg.on('pageerror',e=>errs.push(String(e)));
pg.on('response', r=>{ if (r.status()>=400) bad.push(r.status()+' '+r.url()); got.push(r.url()); });

console.log('  --- the old address still opens the lab ---');
await pg.goto(ROOT+'/lab.html?cb='+Date.now()); await pg.waitForTimeout(1400);
console.log(`    lab.html forwards to ${pg.url().replace(ROOT,'').replace(/\?.*/,'')}, title "${await pg.title()}"`);
console.log(`    and it REPLACES itself in history, so Back does not bounce: ${!(await pg.evaluate(()=>history.length>2))}`);

console.log('  --- four files, and they all arrive ---');
const files = ['nudge.html','nudge.css','nudge_host.js','nudge.js'];
for (const f of files) {
  const r = await ctx.request.get(`${ROOT}/nudge/${f}?cb=${Date.now()}`);
  const b = await r.body();
  console.log(`    nudge/${f.padEnd(14)} ${String(r.status())}  ${String(b.length).padStart(7)} bytes`);
}
console.log('    bad responses while loading the page: ' + (bad.length?bad.join(', '):'none'));

console.log('  --- and the whole of the host is in one of them ---');
for (const f of files.concat(['nudge_test/vj_275.mjs'])) {
  const t = await (await ctx.request.get(`${ROOT}/nudge/${f}?cb=${Date.now()}`)).text();
  const n = (t.match(/vampjam/g)||[]).length;
  console.log(`    ${('nudge/'+f).padEnd(28)} says "vampjam" ${n} time${n===1?'':'s'}`);
}

console.log('  --- what the page read out of it ---');
const h = await pg.evaluate(()=>({
  back: document.getElementById('back_btn').getAttribute('href'),
  label: document.getElementById('back_btn').textContent.trim(),
  stamp: document.getElementById('build_tag').textContent,
  keys: Object.keys(localStorage).filter(k=>/lab|gest/.test(k)),
  watching: !document.getElementById('watch').hidden }));
console.log(`    back "${h.label}" -> ${h.back}   stamp "${h.stamp}"   watcher on: ${h.watching}`);
console.log(`    stored settings still under their old names: ${JSON.stringify(h.keys)}`);

console.log('  --- the watcher asks about all four, not just the page ---');
const asked = got.filter(u=>/[?&]w=/.test(u)).map(u=>u.replace(ROOT+'/nudge/','').replace(/\?.*/,''));
await pg.waitForTimeout(5600);
const asked2 = got.filter(u=>/[?&]w=/.test(u)).map(u=>u.replace(ROOT+'/nudge/','').replace(/\?.*/,''));
console.log(`    polled: ${[...new Set(asked2)].sort().join(', ') || '(none yet)'}`);

console.log('  --- all three rooms still there after the split ---');
for (const r of ['cal','read','solid']) {
  await pg.evaluate(x=>window.__lab.room(x), r); await pg.waitForTimeout(260);
  const s = await pg.evaluate(()=>window.__lab.rooms());
  console.log(`    ${r.padEnd(6)} showing ${Object.entries(s.shown).filter(([,v])=>v).map(([k])=>k).join(',')}`);
}
console.log('errors: ' + (errs.length?errs.join(' | '):'none'));
await B.close();

// save_guard_test — a session page that has not read its file must never write
// it. This is the bug that silently destroyed a 1h35m recording's session file
// on 2026-09-05: the upload was fine, and a tap on Tag the Moment a few seconds
// later wrote { audio: null, tags: [one tag at 0:00] } over it.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const REAL = {
  audio: { label: '2026-09-05 4:09p San Francisco', url: R2 + 'a1.m4a', kind: 'url' },
  tags: [{ id: 't_real', t: 2214.1, label: 'the good one' }]
};

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  let holdData = false;          // keep the session file hanging, as a slow phone would
  let writes = [];
  await ctx.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.startsWith('https://vampsf.com/')) {
      const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      const p = path.join(DIR, rel);
      if (fs.existsSync(p)) {
        const t = rel.endsWith('.css') ? 'text/css' : rel.endsWith('.js') ? 'application/javascript'
                : rel.endsWith('.json') ? 'application/json' : 'text/html';
        return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p) });
      }
      return r.fulfill({ status: 404, body: '' });
    }
    // THE session file — the thing the page must read before it writes
    if (/raw\.githubusercontent\.com.*a1\.json/.test(u)) {
      if (holdData) { await new Promise(res => setTimeout(res, 20000)); }
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(REAL) });
    }
    // signin_show made every page ask the auth worker who is looking, and that
    // also lives on workers.dev. A lookup is not a save — count only the sync
    // worker, which is the one that writes files.
    if (u.includes('vampjam-auth'))
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: '{"ok":true,"signed_in":false,"allow":[]}' });
    if (u.includes('workers.dev')) {
      try { writes.push(JSON.parse(r.request().postData() || '{}')); } catch (e) {}
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    }
    if (u.includes('api.github.com') || u.includes('sessions_auto'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    if (u.includes('.json')) return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    if (u.startsWith(R2)) return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
    return r.fulfill({ status: 204, body: '[]' });
  });

  // ---------- the bug, reproduced: tap before the file has landed ----------
  holdData = true; writes = [];
  let p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (early): ' + e.message); });
  await p.goto('https://vampsf.com/session.html?p=a1');
  await p.waitForTimeout(1200);
  const notYet = await p.evaluate(() => window.__vampjamRepoRead && window.__vampjamRepoRead());
  ok('before the file lands, the page knows it has not read it', notYet === false, notYet);

  await p.click('#tag_btn');
  await p.waitForTimeout(600);
  await p.click('#tag_btn');
  await p.waitForTimeout(2500);
  ok('tapping Tag the Moment then writes NOTHING', writes.length === 0,
     writes.length + ' ' + JSON.stringify(writes.map(w => w.message)));
  const said = await p.evaluate(() => (document.getElementById('toast') || {}).textContent || '');
  ok('and says why, rather than looking broken', /still loading/i.test(said), said);

  // and the write path itself refuses even when called directly
  const refused = await p.evaluate(() => new Promise((res) => {
    try { window.save_data_to_repo ? window.save_data_to_repo('x').then(() => res('WROTE'), e => res(e.message))
                                   : res('not exposed'); } catch (e) { res(e.message); }
  }));
  ok('the save path refuses on its own too',
     refused === 'not exposed' || /not loaded yet|no audio/.test(refused), refused);
  await p.close();

  // ---------- the file lands: now saving is allowed, and keeps everything ----------
  holdData = false; writes = [];
  p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror (loaded): ' + e.message); });
  await p.goto('https://vampsf.com/session.html?p=a1');
  await p.waitForTimeout(2200);
  const read = await p.evaluate(() => window.__vampjamRepoRead && window.__vampjamRepoRead());
  ok('once the file has landed, the page says so', read === true, read);

  await p.evaluate(() => { document.getElementById('player').currentTime = 60; });
  await p.click('#tag_btn');
  await p.waitForTimeout(4500);
  const w = writes.filter(x => /a1\.json$/.test(x.path || '')).pop();
  ok('now a tap does write',                      !!w, writes.map(x => x.path).join(','));
  const d = w && JSON.parse(w.content);
  ok('and the audio survives the write',          d && d.audio && /a1\.m4a$/.test(d.audio.url), d && JSON.stringify(d.audio));
  ok('as does the moment that was already there', d && d.tags.some(t => t.id === 't_real' && t.label === 'the good one'),
                                                  d && JSON.stringify(d.tags.map(t => t.id)));
  ok('alongside the new one',                     d && d.tags.length === 2, d && d.tags.length);
  await p.close();

  // ---------- every session page carries the guard ----------
  const pages = fs.readdirSync(DIR)
    .filter(f => /^2026_\d\d_\d\d_.*\.html$/.test(f) && fs.statSync(path.join(DIR, f)).size > 5000)
    .concat(['session.html']);
  const missing = pages.filter(f => {
    const t = fs.readFileSync(path.join(DIR, f), 'utf8');
    return !/save_guard/.test(t) || !/repoRead = true/.test(t)
        || !/refusing to blank it/.test(t) || !/Still loading this recording/.test(t);
  });
  ok('all nine session pages are guarded',        missing.length === 0, missing.join(','));

  // ---------- and the file the bug destroyed is back ----------
  const hurt = JSON.parse(fs.readFileSync(path.join(DIR, '2026_09_05_san_francisco_5_44_14p.json'), 'utf8'));
  ok('the wrecked session has its audio again',   !!(hurt.audio && hurt.audio.url), JSON.stringify(hurt.audio));
  ok('and its real moment, not the 0:00 stub',    hurt.tags.length === 1 && hurt.tags[0].t > 2000,
                                                  JSON.stringify(hurt.tags));

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

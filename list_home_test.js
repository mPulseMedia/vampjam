// list_home_test — index only redirects when it has somewhere real to go, and
// deleting the loaded session lands you on a list, not in a bounce.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const A = 'session.html?p=aaa_one';
const B = 'session.html?p=bbb_two';
const SESSION = JSON.stringify({
  audio: { label: 'x', url: 'https://example.invalid/x.m4a', kind: 'url' },
  tags: [{ id: 't1', t: 10, label: 'one' }]
});

async function makeCtx(b, registry) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.startsWith('https://vampsf.com/')) {
      const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
      const p = path.join(DIR, rel);
      if (fs.existsSync(p)) {
        const t = rel.endsWith('.css') ? 'text/css'
                : rel.endsWith('.js')  ? 'application/javascript'
                : rel.endsWith('.json')? 'application/json' : 'text/html';
        return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p) });
      }
      return r.fulfill({ status: 404, body: '' });
    }
    if (u.includes('sessions_auto'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(registry) });
    if (u.includes('aaa_one.json') || u.includes('bbb_two.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: SESSION });
    if (u.includes('workers.dev'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    if (u.includes('raw.githubusercontent.com') || u.includes('api.github.com'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    return r.fulfill({ status: 204, body: '' });
  });
  return ctx;
}
const row = (page, name, date) => ({ page: page, name: name, date: date, dur: 120, count: 1 });
const urlWithin = async (p, re, ms) => {
  const until = Date.now() + ms;
  while (Date.now() < until) { if (re.test(p.url())) return true; await p.waitForTimeout(150); }
  return false;
};
const quiet = async (p, fn, arg) => { try { return await p.evaluate(fn, arg); } catch (e) { return null; } };

(async () => {
  const b = await chromium.launch();

  // ============ 1. the loop he hit ============
  // index reopens "the last session you were on". If that is the one you just
  // deleted, index sends you to it and del_gone sends you back — for ever.
  {
    const ctx = await makeCtx(b, [row(A, 'One', '2026-09-01'), row(B, 'Two', '2026-09-02')]);
    const p = await ctx.newPage();
    let bounces = 0;
    p.on('framenavigated', f => { if (f === p.mainFrame()) bounces++; });
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });

    await p.goto('https://vampsf.com/' + A).catch(() => {});
    await p.waitForTimeout(900);
    const wrote = await quiet(p, () => localStorage.getItem('vampjam_last_session'));
    ok('being on a session records it as the last one', wrote === A, wrote);

    // delete the page you are on
    await quiet(p, () => { const bb = document.getElementById('page_sessions'); if (bb) bb.click(); });
    await p.waitForTimeout(500);
    bounces = 0;
    await quiet(p, (k) => {
      const bt = [...document.querySelectorAll('.jam_del')].find(x => x.getAttribute('data-page') === k);
      bt.click();
      const ov = document.querySelector('.jamc_overlay');
      const inp = ov.querySelector('.jamc_code');
      if (inp) { inp.value = '8764'; inp.dispatchEvent(new Event('input', { bubbles: true })); }
      ov.querySelector('.jamc_yes').click();
    }, A);

    await urlWithin(p, /bbb_two/, 12000);
    await p.waitForTimeout(1500);
    ok('the deleted page stops being "the last one"',
       (await quiet(p, () => localStorage.getItem('vampjam_last_session'))) !== A,
       await quiet(p, () => localStorage.getItem('vampjam_last_session')));
    ok('and you land on the surviving session, not a bounce', /bbb_two/.test(p.url()), p.url());
    ok('with a handful of navigations, not a loop', bounces < 8, bounces);
    const st = await quiet(p, () => ({
      open: !!document.querySelector('.session_drawer.open'),
      pinned: document.body.classList.contains('list_pinned')
    }));
    ok('the list is open when you get there', st && st.open === true, JSON.stringify(st));
    ok('and it is not stuck open', st && st.pinned === false, JSON.stringify(st));
    await ctx.close();
  }

  // ============ 2. nothing left: index IS the list ============
  {
    const ctx = await makeCtx(b, []);
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
    await p.goto('https://vampsf.com/index.html');
    await p.evaluate(() => {
      localStorage.setItem('vampjam_deleted_pages',
        JSON.stringify([{ page: 'session.html?p=aaa_one', ts: Date.now() }]));
      localStorage.setItem('vampjam_last_session', 'session.html?p=aaa_one');
      localStorage.removeItem('vampjam_my_recs');
    });
    await p.goto('https://vampsf.com/index.html').catch(() => {});
    await p.waitForTimeout(1500);

    ok('with nothing to open, index stays put', /index\.html$/.test(p.url()), p.url());
    const home = await p.evaluate(() => ({
      isHome:  !!window.VAMPJAM_LIST_HOME,
      drawer:  !!document.querySelector('.session_drawer'),
      open:    !!document.querySelector('.session_drawer.open'),
      pinned:  document.body.classList.contains('list_pinned'),
      note:    document.getElementById('home_note').hidden === false,
      record:  !!document.querySelector('.home_act a[href="record.html"]')
    }));
    ok('and becomes the list home',        home.isHome && home.drawer, JSON.stringify(home));
    ok('with the list already open',       home.open === true, JSON.stringify(home));
    ok('pinned, because nothing is under it', home.pinned === true, JSON.stringify(home));
    ok('it says so in words',              home.note === true, JSON.stringify(home));
    ok('and offers the one thing to do',   home.record === true, JSON.stringify(home));

    // the pin must actually hold
    await quiet(p, () => window.vampjamDrawer.toggle());
    await p.waitForTimeout(250);
    ok('the list cannot be closed onto nothing',
       (await quiet(p, () => !!document.querySelector('.session_drawer.open'))) === true);
    await ctx.close();
  }

  // ============ 3. a first visit, sessions present, is unchanged ============
  {
    const ctx = await makeCtx(b, [row(A, 'One', '2026-09-01'), row(B, 'Two', '2026-09-02')]);
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
    await p.goto('https://vampsf.com/index.html').catch(() => {});
    const went = await urlWithin(p, /session\.html/, 8000);
    ok('a fresh visit still opens a session', went, p.url());
    ok('and it is not the list home',
       (await quiet(p, () => !!window.VAMPJAM_LIST_HOME)) !== true, p.url());
    await ctx.close();
  }

  // ============ 4. a tombstoned "last" is skipped, not obeyed ============
  {
    const ctx = await makeCtx(b, [row(A, 'One', '2026-09-01'), row(B, 'Two', '2026-09-02')]);
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
    await p.goto('https://vampsf.com/index.html').catch(() => {});
    await p.waitForTimeout(600);
    await quiet(p, () => {
      localStorage.setItem('vampjam_last_session', 'session.html?p=aaa_one');
      localStorage.setItem('vampjam_deleted_pages',
        JSON.stringify([{ page: 'session.html?p=aaa_one', ts: Date.now() }]));
    });
    await p.goto('https://vampsf.com/index.html').catch(() => {});
    const went = await urlWithin(p, /bbb_two/, 8000);
    ok('index skips a deleted "last" and opens the next one', went, p.url());
    await ctx.close();
  }

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

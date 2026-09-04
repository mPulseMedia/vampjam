// del_leave_test — deleting the session you are looking at must not leave you
// standing on it. While the delete runs the list cannot be closed; when it
// lands you are moved to the list; and the page cannot be reached again.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const HERE = 'session.html?p=here_one';
const REGISTRY = JSON.stringify([
  { page: HERE,                       name: '2026-09-03 The one I am on', date: '2026-09-03', dur: 120, count: 2 },
  { page: 'session.html?p=other_one', name: '2026-09-02 Another',         date: '2026-09-02', dur: 90,  count: 1 }
]);
const SESSION = JSON.stringify({
  audio: { label: 'here', url: 'https://example.invalid/here.m4a', kind: 'url' },
  tags: [{ id: 't1', t: 10, label: 'one' }, { id: 't2', t: 40, label: 'two' }]
});

async function makeCtx(b, opts) {
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
      return r.fulfill({ status: 200, contentType: 'application/json', body: REGISTRY });
    if (u.includes('here_one.json') || u.includes('other_one.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: SESSION });
    if (u.includes('workers.dev')) {
      // the write the delete depends on — slow on purpose, so the window in
      // which he could swipe back down to the dead page is a real window
      await new Promise(res => setTimeout(res, opts.writeMs));
      if (opts.writeFails) return r.fulfill({ status: 500, body: 'nope' });
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    }
    if (u.includes('raw.githubusercontent.com') || u.includes('api.github.com'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    return r.fulfill({ status: 204, body: '' });
  });
  return ctx;
}

const openList = (p) => p.evaluate(() => {
  const b = document.getElementById('page_sessions');
  if (b) b.click(); else window.vampjamDrawer.toggle();
});
const startDelete = (p, key) => p.evaluate((k) => {
  const b = [...document.querySelectorAll('.jam_del')].find(x => x.getAttribute('data-page') === k);
  b.click();
  const ov = document.querySelector('.jamc_overlay');
  const inp = ov.querySelector('.jamc_code');
  if (inp) { inp.value = '8764'; inp.dispatchEvent(new Event('input', { bubbles: true })); }
  ov.querySelector('.jamc_yes').click();
}, key);
// the page navigates out from under these, so an evaluate that races a teardown
// throws rather than answering. Every read is allowed to come back "gone".
const listState = async (p) => {
  try {
    return await p.evaluate(() => ({
      open:   !!document.querySelector('.session_drawer.open'),
      pinned: !!(document.body && document.body.classList.contains('list_pinned'))
    }));
  } catch (e) { return { open: null, pinned: null, gone: true }; }
};
const urlWithin = async (p, re, ms) => {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    if (re.test(p.url())) return true;
    await p.waitForTimeout(150);
  }
  return false;
};
const quiet = async (p, fn) => { try { await p.evaluate(fn); } catch (e) {} };

(async () => {
  const b = await chromium.launch();

  // ================= 1. the happy path =================
  {
    const ctx = await makeCtx(b, { writeMs: 900, writeFails: false });
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
    await p.goto('https://vampsf.com/' + HERE);
    await p.waitForTimeout(1000);
    await openList(p);
    await p.waitForTimeout(500);

    const before = await listState(p);
    ok('the list opens normally', before.open === true, JSON.stringify(before));
    ok('and is not pinned yet',   before.pinned === false, JSON.stringify(before));

    await startDelete(p, HERE);
    await p.waitForTimeout(250);

    const during = await listState(p);
    ok('deleting the page you are ON pins the list', during.pinned === true, JSON.stringify(during));
    ok('and the list is open',                       during.open === true, JSON.stringify(during));

    // every route back down to the dead page, tried
    await quiet(p, () => window.vampjamDrawer.toggle());
    await p.waitForTimeout(100);
    ok('the caret cannot close it',  (await listState(p)).open !== false);
    await quiet(p, () => { const c = document.querySelector('.jam_caret, .drawer_caret'); if (c) c.click(); });
    await p.waitForTimeout(100);
    ok('nor a tap on the caret',     (await listState(p)).open !== false);
    await quiet(p, () => document.body.click());
    await p.waitForTimeout(100);
    ok('nor a tap outside it',       (await listState(p)).open !== false);

    const left = await urlWithin(p, /index\.html/, 15000);
    ok('when the delete lands you are on the session list',
       left && /index\.html#sessions$/.test(p.url()), p.url());
    await ctx.close();
  }

  // ================= 2. it cannot be reached again =================
  {
    const ctx = await makeCtx(b, { writeMs: 50, writeFails: false });
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
    // this device already knows the page is gone
    await p.goto('https://vampsf.com/index.html');
    await p.evaluate((k) => localStorage.setItem('vampjam_deleted_pages',
      JSON.stringify([{ page: k, ts: Date.now() }])), HERE);
    // the page replaces itself while loading, so goto never sees 'load'
    await p.goto('https://vampsf.com/' + HERE).catch(() => {});
    const bounced = await urlWithin(p, /index\.html/, 8000);
    ok('a deleted session opened directly bounces to the list',
       bounced && /index\.html#sessions$/.test(p.url()), p.url());
    await ctx.close();
  }

  // ================= 3. a session you are NOT on is untouched =================
  {
    const ctx = await makeCtx(b, { writeMs: 50, writeFails: false });
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
    await p.goto('https://vampsf.com/' + HERE);
    await p.waitForTimeout(1000);
    await openList(p);
    await p.waitForTimeout(500);
    await startDelete(p, 'session.html?p=other_one');
    await p.waitForTimeout(1200);
    const st = await listState(p);
    ok('deleting some OTHER session does not pin', st.pinned === false, JSON.stringify(st));
    ok('and leaves you where you were',            /here_one/.test(p.url()), p.url());
    await quiet(p, () => window.vampjamDrawer.toggle());
    await p.waitForTimeout(300);
    ok('the list still closes normally',           (await listState(p)).open === false);
    await ctx.close();
  }

  // ================= 4. a delete that fails gives the page back =================
  {
    const ctx = await makeCtx(b, { writeMs: 200, writeFails: true });
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
    await p.goto('https://vampsf.com/' + HERE);
    await p.waitForTimeout(1000);
    await openList(p);
    await p.waitForTimeout(400);
    await startDelete(p, HERE);
    await p.waitForTimeout(2500);
    const st = await listState(p);
    ok('a failed delete unpins the list',   st.pinned === false, JSON.stringify(st));
    ok('and leaves you on the session',     /here_one/.test(p.url()), p.url());
    await quiet(p, () => window.vampjamDrawer.toggle());
    await p.waitForTimeout(300);
    ok('which you can get back down to',    (await listState(p)).open === false);
    await ctx.close();
  }

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

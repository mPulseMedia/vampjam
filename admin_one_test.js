// admin_one_test — the admin page was reading the list from a cached file while
// its own readout read it from the worker, so it said "nobody administers the
// list yet" directly above a row saying "Paul — admin". One page, two sources,
// two answers. It reads the worker now, with the file only as a fallback.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const EMPTY = { admins: [], people: [], sessions: {} };
const STALE = { admins: ['GHOST'], people: [{ id: 'GHOST', label: 'Paul', last4: '0105' }], sessions: {} };

async function open_admin(b, worker, file) {
  const ctx = await b.newContext({ viewport: { width: 900, height: 1100 } });
  await ctx.route('**/*', async (r) => {
    const u = r.request().url();
    const J = (o) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
    if (/op=list/.test(u)) return worker ? J(Object.assign({ ok: true }, worker)) : r.abort('failed');
    if (/op=status/.test(u)) return J({ ok: true, worker: true, secret: true,
      admins: (worker || file || EMPTY).admins.length,
      people: (worker || file || EMPTY).people.length, private: 0 });
    if (/access\.json/.test(u)) return J(file || EMPTY);
    if (/vampjam-auth/.test(u)) return J({ ok: true, signed_in: false, allow: [] });
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
    return r.fulfill({ status: 204, body: '' });
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.goto('https://vampsf.com/admin.html');
  await p.waitForTimeout(1400);
  return { ctx, p };
}

(async () => {
  const b = await chromium.launch();

  // the exact contradiction he photographed: worker empty, file stale
  let { ctx, p } = await open_admin(b, EMPTY, STALE);
  const g = await p.evaluate(() => ({
    setup: document.getElementById('setup').textContent.replace(/\s+/g, ' '),
    rows:  document.querySelectorAll('#acc_people .acc_row').length,
    body:  document.body.textContent.replace(/\s+/g, ' ')
  }));
  ok('the readout says nobody administers it',  /Nobody administers the list yet/.test(g.setup), g.setup.slice(0, 80));
  ok('and no ghost row contradicts it',         g.rows === 0, g.rows);
  ok('it says the empty list is why sign-in refuses',
     /cannot sign in before that/.test(g.body) && /always refuse while the list is empty/.test(g.body), 0);
  ok('and points at the box on this page',      /put your own number in the box below/i.test(g.body), 0);
  ok('the box is actually there',
     await p.evaluate(() => !!document.getElementById('acc_phone') && !!document.getElementById('acc_add_btn')));
  await ctx.close();

  // a real list still renders, from the worker
  ({ ctx, p } = await open_admin(b, STALE, EMPTY));
  const r = await p.evaluate(() => ({
    rows: [...document.querySelectorAll('#acc_people .acc_row')].map(e => e.textContent.replace(/\s+/g, ' ')),
    setup: document.getElementById('setup').textContent.replace(/\s+/g, ' ')
  }));
  ok('a person on the worker list is shown',    r.rows.length === 1 && /Paul/.test(r.rows[0]), JSON.stringify(r.rows));
  ok('marked as the administrator',             /admin/.test(r.rows[0]), r.rows[0]);
  ok('and the readout agrees with the row',     !/Nobody administers/.test(r.setup), r.setup.slice(0, 70));
  await ctx.close();

  // worker down: the file is the fallback, not a blank page
  ({ ctx, p } = await open_admin(b, null, STALE));
  const f = await p.evaluate(() => document.querySelectorAll('#acc_people .acc_row').length);
  ok('with the worker down it falls back to the file', f === 1, f);
  await ctx.close();

  await b.close();
  console.log('\nadmin_one: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

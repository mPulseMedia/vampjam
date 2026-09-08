// share_ready_test — he put our box beside Google Drive's share dialog and said
// which parts he wanted. Reading his sentence top to bottom, it is a frame:
//   instructions across the top · a text box · NOT a "people with access"
//   section · straight to the access line · a copy link, separately · a share
//   button · and no cancel, because it sits on the page rather than over it.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const PAGE = '2026_08_14_sound_union.html';
const ME = { ok: true, signed_in: true, id: 'ID_PAUL', label: 'Paul', admin: true, allow: '*' };

(async () => {
  const b = await chromium.launch();
  async function open(acc) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 },
                                     permissions: ['clipboard-read', 'clipboard-write'] });
    let ACC = acc, WROTE = null, IDS = { ok: true, first: false, people: [
      { line: 'Dave 415 555 1212', ok: true, id: 'ID_D', id7: 'ID7_D', label: 'Dave', phone_last4: '1212' }] };
    await ctx.route('**/*', async (r) => {
      const u = r.request().url();
      const J = (o) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (u.indexOf('op=shut') >= 0) return J({ ok: true, shut: Object.keys(ACC.sessions || {})
        .filter(k => ((ACC.sessions[k] || {}).allow || []).length) });
      if (u.indexOf('op=status') >= 0) return J({ ok: true, worker: true, secret: true, admins: 1, people: 1, private: 0 });
      if (u.indexOf('op=list') >= 0) return J(Object.assign({ ok: true }, ACC));
      if (u.indexOf('op=me') >= 0) return J(ME);
      if (u.indexOf('op=ids') >= 0) return J(IDS);
      if (u.indexOf('vampjam-sync') >= 0) { WROTE = JSON.parse(r.request().postData() || '{}');
                                            ACC = JSON.parse(WROTE.content); return J({ ok: true }); }
      if (u.indexOf('access.json') >= 0) return J(ACC);
      if (u.indexOf('vampjam-auth') >= 0) return J(ME);
      if (u.startsWith('https://vampsf.com/')) {
        const rel = u.replace('https://vampsf.com/', '').split('?')[0] || 'index.html';
        const p2 = path.join(DIR, rel);
        if (fs.existsSync(p2)) {
          const t = rel.endsWith('.css') ? 'text/css' : rel.endsWith('.js') ? 'application/javascript'
                  : rel.endsWith('.json') ? 'application/json' : 'text/html';
          return r.fulfill({ status: 200, contentType: t, body: fs.readFileSync(p2) });
        }
        return r.fulfill({ status: 404, body: '' });
      }
      if (u.indexOf('api.github.com') >= 0) return J([]);
      return r.fulfill({ status: 204, body: '' });
    });
    const p = await ctx.newPage();
    p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
    await p.goto('https://vampsf.com/' + PAGE);
    await p.waitForTimeout(2000);
    return { ctx, p, wrote: () => WROTE, acc: () => ACC };
  }

  // ---------- nobody on it yet ----------
  let L = await open({ admins: ['ID_PAUL'], people: [{ id: 'ID_PAUL', label: 'Paul', last4: '0105' }],
                       sessions: {} });
  const v = await L.p.evaluate(() => {
    const el = document.getElementById('who_box');
    // reading order, as it actually paints
    const order = [...el.querySelectorAll('.who_h,.who_hint,#who_in,#who_state,#who_list,.who_row,#who_me')]
      .map(n => n.id || n.className.split(' ')[0]);
    return { head: el.querySelector('.who_h').textContent,
             hint: el.querySelector('.who_hint').textContent,
             ph: el.querySelector('#who_in').getAttribute('placeholder'),
             state: el.querySelector('#who_state').textContent,
             share: el.querySelector('#who_add').textContent,
             copy: el.querySelector('#who_copy') ? el.querySelector('#who_copy').textContent : null,
             order: order,
             buttons: [...el.querySelectorAll('button')].map(x => x.textContent.trim()),
             modal: getComputedStyle(el).position };
  });
  ok('it is a share dialog now, and says so',   /^Share this recording$/.test(v.head), v.head);
  ok('the instruction is across the top',       /^Enter a name and a phone number\.$/.test(v.hint), v.hint);
  ok('and the box shows the shape he means',    /Dave 415 555 1212/.test(v.ph), v.ph);
  ok('the text box comes before anything else',
     v.order.indexOf('who_in') === 2, v.order.join(' > '));
  ok('there is no people-with-access section above it',
     v.order.indexOf('who_list') > v.order.indexOf('who_in'), v.order.join(' > '));
  ok('straight to the access line, in his words',
     v.state === 'Anyone with the link can open it.', v.state);
  ok('the button says Share',                   v.share === 'Share', v.share);
  ok('and Copy link is its own button beside it', v.copy === 'Copy link', v.copy);
  ok('two buttons in the row, and no cancel',
     v.buttons.filter(t => /cancel|done|close/i.test(t)).length === 0, v.buttons.join(' | '));
  ok('there is no Let anyone in button any more',
     v.buttons.indexOf('Let anyone in') < 0, v.buttons.join(' | '));
  ok('it sits on the page, not over it',        v.modal !== 'fixed' && v.modal !== 'absolute', v.modal);
  ok('and the name line is last, not second',
     v.order.indexOf('who_me') === v.order.length - 1, v.order.join(' > '));

  // ---------- copy link ----------
  await L.p.click('#who_copy');
  await L.p.waitForTimeout(300);
  ok('Copy link says it took',
     (await L.p.textContent('#who_copy')) === 'Copied', await L.p.textContent('#who_copy'));
  ok('and what it copied is this recording\'s address',
     (await L.p.evaluate(() => navigator.clipboard.readText()))
       === 'https://vampsf.com/' + PAGE,
     await L.p.evaluate(() => navigator.clipboard.readText()));

  // ---------- sharing with somebody ----------
  await L.p.fill('#who_in', 'Dave 415 555 1212');
  await L.p.click('#who_add');
  await L.p.waitForTimeout(900);
  const after = await L.p.evaluate(() => ({
    state: document.getElementById('who_state').textContent,
    chips: [...document.querySelectorAll('.who_chip')].map(c => c.textContent.trim()),
    btn: document.getElementById('who_add').textContent,
    empty: document.getElementById('who_in').value
  }));
  ok('the access line flips to the restricted one',
     after.state === 'Only these phone numbers can open it.', after.state);
  ok('and the phone numbers it means are listed under it',
     after.chips.length === 1 && /Dave/.test(after.chips[0]), JSON.stringify(after.chips));
  ok('the button reports, where his eye already is',
     /Added|Already/.test(after.btn), after.btn);
  ok('and the box is cleared for the next one', after.empty === '', after.empty);
  ok('nothing about modes is written down',
     !/mode/.test(JSON.stringify(L.acc().sessions)), JSON.stringify(L.acc().sessions));

  // ---------- taking somebody back off ----------
  await L.p.click('.who_chip .who_x');
  await L.p.waitForTimeout(900);
  ok('removing the last one opens it again',
     (await L.p.textContent('#who_state')) === 'Anyone with the link can open it.',
     await L.p.textContent('#who_state'));
  ok('which is the only way it opens now — no second button for it',
     ((L.acc().sessions[PAGE] || {}).allow || []).length === 0, JSON.stringify(L.acc().sessions));
  await L.ctx.close();

  // ---------- an empty Share still answers on the button ----------
  L = await open({ admins: ['ID_PAUL'], people: [], sessions: {} });
  await L.p.click('#who_add');
  await L.p.waitForTimeout(300);
  ok('Share with nothing typed says what to do',
     /name and a phone number/.test(await L.p.textContent('#who_note')), await L.p.textContent('#who_note'));
  ok('and the button says it too',
     /Type a number first/.test(await L.p.textContent('#who_add')), await L.p.textContent('#who_add'));
  await L.ctx.close();
  await b.close();

  // asset_pin — no version number in the check, so there is nothing to forget
  const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
  const pin = (asset) => {
    const seen = {};
    pages.forEach((f) => {
      const m = fs.readFileSync(path.join(DIR, f), 'utf8')
                  .match(new RegExp(asset.replace('.', '\\.') + '\\?v=(\\d+)'));
      if (m) (seen[m[1]] = seen[m[1]] || []).push(f);
    });
    return seen;
  };
  const pd = pin('drawer.js'), pc = pin('site.css');
  ok('every page asks for the same drawer.js', Object.keys(pd).length === 1, JSON.stringify(pd));
  ok('every page asks for the same site.css',  Object.keys(pc).length === 1, JSON.stringify(pc));

  const src = fs.readFileSync(path.join(DIR, 'drawer.js'), 'utf8');
  ok('the dead open/private mode is gone from the box for good',
     !/who_open|r2\.mode/.test(src), (src.match(/who_open|r2\.mode/g) || []).join(' '));

  console.log('\nshare_ready: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH ' + e.message); process.exit(1); });

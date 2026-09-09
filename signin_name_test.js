// signin_name_test — the sample in the box is the only instruction anybody
// reads, so it shows a name in front of the number. Which makes the name a
// promise: if it is asked for, it has to be kept, or the sample is decoration.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const OPEN = '2026_07_31_sound_union.html';
const SHUT = '2026_08_14_sound_union.html';

(async () => {
  const b = await chromium.launch();
  let ME = { ok: true, signed_in: false };
  let ENTER = { ok: false, unknown: true };
  let CALLS = 0;

  async function open(page, acc) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    let ACC = acc || { admins: ['ID_PAUL'], people: [{ id: 'ID_PAUL', label: 'Paul', last4: '0105' }],
                       sessions: { [SHUT]: { allow: ['ID_DAVE'] } } };
    let WROTE = null;
    await ctx.route('**/*', async (r) => {
      const u = r.request().url();
      const J = (o) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (u.indexOf('op=shut') >= 0) return J({ ok: true, shut: [SHUT] });
      if (u.indexOf('op=status') >= 0) return J({ ok: true, worker: true, secret: true, admins: 1, people: 1, private: 1 });
      if (u.indexOf('op=list') >= 0) return J(Object.assign({ ok: true }, ACC));
      if (u.indexOf('op=me') >= 0) return J(ME);
      if (u.indexOf('op=enter') >= 0) { CALLS++; return J(ENTER); }
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
    await p.goto('https://vampsf.com/' + page);
    await p.waitForTimeout(2000);
    return { ctx, p, wrote: () => WROTE, acc: () => ACC };
  }

  // ---------- the sample, in all three doors ----------
  let L = await open(OPEN);
  ok('the quiet offer shows a name with the number',
     (await L.p.getAttribute('.ask_box .hello_in', 'placeholder')) === 'Dave 415 555 1212',
     await L.p.getAttribute('.ask_box .hello_in', 'placeholder'));
  ok('and it is still the phone keypad',
     (await L.p.getAttribute('.ask_box .hello_in', 'type')) === 'tel', 0);
  ok('and the label says so for a screen reader',
     /name and phone/i.test(await L.p.getAttribute('.ask_box .hello_in', 'aria-label')),
     await L.p.getAttribute('.ask_box .hello_in', 'aria-label'));

  // name_from is the same rule the worker uses to name the people he pastes in
  const cases = await L.p.evaluate(() => {
    const f = window.vampjamNameFrom;
    return { dave: f('Dave 415 555 1212'), bare: f('415 555 1212'),
             tail: f('+1 (415) 555-1212  Dave Ross'), punct: f('<dave@x>, 4155551212'),
             empty: f('') };
  });
  ok('a name in front of the number is read off',   cases.dave === 'Dave', cases.dave);
  ok('a bare number yields no name at all',         cases.bare === '', JSON.stringify(cases.bare));
  ok('a name after the number works the same',      cases.tail === 'Dave Ross', cases.tail);
  // whatever survives is whatever the WORKER would have called them - same rule,
  // both sides of the door, so a person names themselves as he would have named them
  ok('and it matches the worker\'s rule exactly',   cases.punct === 'dave@x', cases.punct);
  ok('nothing in, nothing out',                     cases.empty === '', cases.empty);
  await L.ctx.close();

  // ---------- a bare number is still fine ----------
  ENTER = { ok: true, session: 'S1', label: 'Dave', admin: false, allow: [SHUT] };
  ME = { ok: true, signed_in: false };
  L = await open(OPEN);
  await L.p.fill('.ask_box .hello_in', '415 555 1212');
  await L.p.click('.ask_box .hello_go');
  await L.p.waitForTimeout(250);
  ok('a bare number signs in, nothing rejected',
     /You are in/.test(await L.p.textContent('.ask_box .hello_say')),
     await L.p.textContent('.ask_box .hello_say'));
  ok('and the session is kept',
     (await L.p.evaluate(() => localStorage.getItem('vampjam_signin'))) === 'S1', 0);
  await L.p.waitForTimeout(700);
  ok('and nothing is written for a name nobody gave',
     L.wrote() === null, JSON.stringify(L.wrote()));
  await L.ctx.close();

  // ---------- a name typed at the door is kept ----------
  ME = { ok: true, signed_in: false };
  L = await open(OPEN);
  await L.p.fill('.ask_box .hello_in', 'Eileen 415 555 1212');
  // me() answers signed-in once the token is set, the way the worker would
  ME = { ok: true, signed_in: true, id: 'ID_E', label: '', admin: false, allow: [SHUT] };
  await L.p.click('.ask_box .hello_go');
  await L.p.waitForTimeout(1400);
  let w = L.wrote() && JSON.parse(L.wrote().content);
  ok('the name he typed is written to the list',
     !!w && (w.people || []).some(x => x.id === 'ID_E' && x.label === 'Eileen'),
     w && JSON.stringify(w.people));
  ok('and nobody else on the list is disturbed',
     !!w && (w.people || []).some(x => x.id === 'ID_PAUL' && x.label === 'Paul'),
     w && JSON.stringify(w.people));
  ok('the recording lists are untouched',
     !!w && (w.sessions[SHUT].allow || []).join() === 'ID_DAVE', w && JSON.stringify(w.sessions));
  ok('and no phone number is in what was written',
     !!w && !/4155551212|555/.test(JSON.stringify(w)), w && JSON.stringify(w).slice(0, 120));
  await L.ctx.close();

  // ---------- a name that matches what is already there costs nothing ----------
  ME = { ok: true, signed_in: false };
  L = await open(OPEN);
  await L.p.fill('.ask_box .hello_in', 'Paul 917 693 0105');
  ME = { ok: true, signed_in: true, id: 'ID_PAUL', label: 'Paul', admin: true, allow: '*' };
  await L.p.click('.ask_box .hello_go');
  await L.p.waitForTimeout(1200);
  ok('a name the list already holds is not rewritten',
     L.wrote() === null, JSON.stringify(L.wrote()));
  await L.ctx.close();

  // ---------- the takeover on a private recording says the same thing ----------
  ME = { ok: true, signed_in: false };
  L = await open(SHUT);
  ok('the door on a private recording shows the same sample',
     (await L.p.getAttribute('.hello .hello_in', 'placeholder')) === 'Dave 415 555 1212',
     await L.p.getAttribute('.hello .hello_in', 'placeholder'));
  await L.ctx.close();

  // ---------- the very first sign-in carries the name across the page change ----------
  ENTER = { ok: true, first: true, session: 'S', id: 'ID_P', id7: 'ID7_P', last4: '0105', admin: true, allow: '*' };
  ME = { ok: true, signed_in: false };
  L = await open(SHUT);
  await L.p.fill('.hello .hello_in', 'Paul 917 693 0105');
  await L.p.click('.hello .hello_go');
  await L.p.waitForTimeout(1600);
  ok('the first sign-in goes to the page that owns the name',
     /signin\.html/.test(L.p.url()), L.p.url());
  ok('and the name he already typed travels with him',
     /name=Paul/.test(decodeURIComponent(L.p.url())), L.p.url());
  await L.ctx.close();

  // ---------- signin.html: one field, and it takes a name ----------
  ENTER = { ok: true, first: true, session: 'S', id: 'ID_P', id7: 'ID7_P', last4: '0105', admin: true, allow: '*' };
  ME = { ok: true, signed_in: false };
  L = await open('signin.html');
  const fields = await L.p.evaluate(() => ({
    n: document.querySelectorAll('#ask input').length,
    ph: document.getElementById('phone').getAttribute('placeholder'),
    gone: !document.getElementById('name')
  }));
  ok('the sign-in page has one field, not two',  fields.n === 1 && fields.gone, JSON.stringify(fields));
  ok('and it shows the same sample as everywhere else',
     fields.ph === 'Dave 415 555 1212', fields.ph);
  await L.p.fill('#phone', 'Paul 917 693 0105');
  await L.p.click('#go');
  await L.p.waitForTimeout(1400);
  w = L.wrote() && JSON.parse(L.wrote().content);
  ok('the first sign-in writes the name out of the one line',
     !!w && w.people[0].label === 'Paul', w && JSON.stringify(w.people));
  ok('and never the word "you" when a name was given',
     !!w && !/\byou\b/.test(JSON.stringify(w.people)), w && JSON.stringify(w.people));
  await L.ctx.close();

  // ---------- a bare number there still becomes "you", not a crash ----------
  ME = { ok: true, signed_in: false };
  L = await open('signin.html');
  await L.p.fill('#phone', '917 693 0105');
  await L.p.click('#go');
  await L.p.waitForTimeout(1400);
  w = L.wrote() && JSON.parse(L.wrote().content);
  ok('a bare number still sets up the administrator',
     !!w && w.admins[0] === 'ID_P', w && JSON.stringify(w.admins));
  ok('with a placeholder name rather than nothing',
     !!w && w.people[0].label === 'you', w && JSON.stringify(w.people));
  await L.ctx.close();

  await b.close();

  // one implementation of each, not two
  const src = fs.readFileSync(path.join(DIR, 'drawer.js'), 'utf8');
  ok('the name is read off a line in one place only',
     (src.match(/function name_from/g) || []).length === 1, 0);
  ok('and kept in one place only',
     (src.match(/function name_keep/g) || []).length === 1, 0);
  const html = fs.readFileSync(path.join(DIR, 'signin.html'), 'utf8');
  ok('the sign-in page borrows both rather than copying them',
     /vampjamNameFrom/.test(html) && /vampjamNameKeep/.test(html), 0);

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
  ok('every page asks for the same drawer.js', Object.keys(pin('drawer.js')).length === 1, JSON.stringify(pin('drawer.js')));
  ok('every page asks for the same site.css',  Object.keys(pin('site.css')).length === 1, JSON.stringify(pin('site.css')));

  console.log('\nsignin_name: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH ' + e.message); process.exit(1); });

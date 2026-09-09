// who_name_test — three faults he reported in one breath, which turned out to
// be two:
//   · "I didn't put my name in so want to redo it"  — nothing ever asked, and
//     the first sign-in wrote the word "you" into the list as a name
//   · "the prompt to add a phone number appears and disappears immediately"
//   · "I can't add protection to the other recordings"
// The last two are the same fault: the box hid itself, silently, whenever the
// worker did not answer admin — which reads exactly like the "nothing happens"
// this box exists to prevent. Waiting is not hiding, and neither is no.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const PAGE = '2026_08_14_sound_union.html';
let ENTER = { ok: false, why: 'nothing set up in this test' };

(async () => {
  const b = await chromium.launch();

  // one browser context per "who is looking", because the answer to that is the
  // whole of what this build changed
  async function look(me, acc) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    let WROTE = null;
    let ACC = acc || { admins: [], people: [], sessions: {} };
    await ctx.route('**/*', async (r) => {
      const u = r.request().url();
      const J = (o) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
      if (u.indexOf('op=shut') >= 0) return J({ ok: true, shut: Object.keys(ACC.sessions || {})
        .filter(k => ((ACC.sessions[k] || {}).allow || []).length) });
      if (u.indexOf('op=status') >= 0) return J({ ok: true, worker: true, secret: true,
                                                  admins: 1, people: 1, private: 0 });
      if (u.indexOf('op=list') >= 0) return J(Object.assign({ ok: true }, ACC));
      if (u.indexOf('op=me') >= 0) return J(me);
      if (u.indexOf('op=enter') >= 0) return J(ENTER);
      if (u.indexOf('op=ids') >= 0) return J({ ok: true, first: false, people: [
        { line: '415 555 9999', ok: true, id: 'ID_NEW', id7: 'ID7_NEW',
          label: '•••9999', phone_last4: '9999' }] });
      if (u.indexOf('vampjam-sync') >= 0) {
        WROTE = JSON.parse(r.request().postData() || '{}');
        ACC = JSON.parse(WROTE.content);
        return J({ ok: true });
      }
      if (u.indexOf('access.json') >= 0) return J(ACC);
      if (u.indexOf('vampjam-auth') >= 0) return J(me);
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
    return { ctx, p, wrote: () => WROTE, acc: () => ACC };
  }

  const read = (p) => p.evaluate(() => {
    const el = document.getElementById('who_box');
    if (!el) return { box: false };
    const a = document.querySelector('#who_note a');
    const mine = document.getElementById('who_me');
    return { box: true, hidden: el.hidden,
             note: document.getElementById('who_note').textContent,
             link: a ? a.getAttribute('href') : null,
             linkText: a ? a.textContent : null,
             worker: /open the worker in this browser/.test(document.getElementById('who_note').textContent),
             me: mine && !mine.hidden ? mine.textContent : null,
             meLink: mine && mine.querySelector('a') ? mine.querySelector('a').getAttribute('href') : null,
             canType: !document.getElementById('who_in').hidden };
  });

  // ---------- signed out on this browser ----------
  // 369 made this box explain itself instead of vanishing, because vanishing
  // read as "nothing happens". 374 took the box away from everyone but the
  // administrator, which sounds like the same mistake and is not: there is a
  // sign-in offer on the page now, so this box has nothing left to say, and
  // telling a stranger about a control they will never have is noise. The rule
  // 369 wrote still stands where it was written - once this box is UP it never
  // hides - and it is now also never built for anybody it is not for.
  {
    const L = await look({ ok: true, signed_in: false });
    await L.p.goto('https://vampsf.com/' + PAGE);
    await L.p.waitForTimeout(1800);
    const r = await read(L.p);
    ok('signed out, there is no share box at all',   r.box === false, JSON.stringify(r).slice(0, 140));
    ok('and the sign-in offer is what speaks instead',
       await L.p.evaluate(() => !!document.getElementById('ask_box')), 0);
    await L.ctx.close();
  }

  // ---------- signed in, but somebody else ----------
  {
    const L = await look({ ok: true, signed_in: true, id: 'ID_DAVE', label: 'Dave',
                           admin: false, allow: [PAGE] });
    await L.p.goto('https://vampsf.com/' + PAGE);
    await L.p.waitForTimeout(1800);
    const r = await read(L.p);
    ok('a guest gets no share box either',           r.box === false, JSON.stringify(r).slice(0, 140));
    ok('and is told nothing about a control they will never have',
       await L.p.evaluate(() => !/administrator/i.test(document.body.textContent)), 0);
    await L.ctx.close();
  }

  // ---------- the administrator ----------
  {
    const ACC = { admins: ['ID_PAUL'],
                  people: [{ id: 'ID_PAUL', id7: 'ID7_PAUL', label: 'Paul', last4: '0105' }],
                  sessions: {} };
    const L = await look({ ok: true, signed_in: true, id: 'ID_PAUL', label: 'Paul',
                           admin: true, allow: '*' }, ACC);
    await L.p.goto('https://vampsf.com/' + PAGE);
    await L.p.waitForTimeout(1600);
    const r = await read(L.p);
    ok('the administrator gets the working box',   r.canType === true, JSON.stringify(r).slice(0, 140));
    ok('and it says the name the site knows him by', r.me && /Signed in as/.test(r.me) && /Paul/.test(r.me), r.me);
    ok('with one way to change it, on the sign-in page',
       r.meLink === 'signin.html' && /change your name/.test(r.me), r.me + ' / ' + r.meLink);
    await L.ctx.close();
  }

  // ---------- a second recording, which is the "can't protect the others" ----------
  // Nothing about the box is per-recording: it reads PAGE_KEY. What stopped it
  // on every other recording was the same hide.
  {
    const ACC = { admins: ['ID_PAUL'],
                  people: [{ id: 'ID_PAUL', label: 'Paul', last4: '0105' }],
                  sessions: { [PAGE]: { allow: ['ID_PAUL'] } } };
    const L = await look({ ok: true, signed_in: true, id: 'ID_PAUL', label: 'Paul',
                           admin: true, allow: '*' }, ACC);
    const other = '2026_07_31_sound_union.html';
    await L.p.goto('https://vampsf.com/' + other);
    await L.p.waitForTimeout(1600);
    const r = await L.p.evaluate(() => ({
      canType: !document.getElementById('who_in').hidden,
      state: document.getElementById('who_state').textContent
    }));
    ok('the box works on a second recording too', r.canType === true, JSON.stringify(r));
    ok('and that one is still open, on its own',
       /Anyone with the link can open it/.test(r.state), r.state);

    await L.p.fill('#who_in', '415 555 9999');
    await L.p.click('#who_add');
    await L.p.waitForTimeout(900);
    const after = await L.p.evaluate(() => document.getElementById('who_state').textContent);
    ok('adding a number there makes THAT one private',
       /Only these phone numbers can open it/.test(after), after);
    const acc = L.acc();
    ok('and leaves the first recording\'s list alone',
       (acc.sessions[PAGE].allow || []).join() === 'ID_PAUL', JSON.stringify(acc.sessions));
    await L.ctx.close();
  }

  // ---------- the name, at the sign-in ----------
  // The first sign-in used to write the literal word "you" as his name.
  {
    ENTER = { ok: true, first: true, session: 'S', id: 'ID_PAUL', id7: 'ID7_PAUL',
              last4: '0105', label: '', admin: true, allow: '*' };
    const L = await look({ ok: true, signed_in: false });
    await L.p.goto('https://vampsf.com/signin.html');
    await L.p.waitForTimeout(900);
    // 375 folded the separate name field back into the one line: the sample
    // shows "Dave 415 555 1212", so the name rides in with the number here the
    // same as it does at a recording's door. Two fields asking for one identity
    // was the second door again.
    const asked = await L.p.evaluate(() => ({
      fields: document.querySelectorAll('#ask input').length,
      gone: !document.getElementById('name'),
      ph: document.getElementById('phone').getAttribute('placeholder')
    }));
    ok('the sign-in asks for a name in the one field',
       asked.fields === 1 && asked.gone, JSON.stringify(asked));
    ok('and shows one in the sample',            /^Dave /.test(asked.ph), asked.ph);
    await L.p.fill('#phone', 'Paul 917 693 0105');
    await L.p.click('#go');
    await L.p.waitForTimeout(1200);
    const w = L.wrote();
    const wrote = w ? JSON.parse(w.content) : null;
    ok('the first sign-in writes the name he typed',
       wrote && wrote.people[0].label === 'Paul', wrote && JSON.stringify(wrote.people));
    ok('and never the word "you" when he gave one',
       wrote && !/\byou\b/.test(JSON.stringify(wrote.people)), wrote && JSON.stringify(wrote.people));
    ok('and he is the administrator',            wrote && wrote.admins[0] === 'ID_PAUL', wrote && JSON.stringify(wrote.admins));
    ok('the number itself is still nowhere in it',
       wrote && !/9176930105|693/.test(JSON.stringify(wrote)), wrote && JSON.stringify(wrote).slice(0, 120));
    await L.ctx.close();
  }

  // ---------- redoing the name he already has ----------
  {
    const ACC = { admins: ['ID_PAUL'],
                  people: [{ id: 'ID_PAUL', id7: 'ID7_PAUL', label: 'you', last4: '0105' }],
                  sessions: { [PAGE]: { allow: ['ID_DAVE'] } } };
    const L = await look({ ok: true, signed_in: true, id: 'ID_PAUL', label: 'you',
                           admin: true, allow: '*' }, ACC);
    await L.p.goto('https://vampsf.com/signin.html');
    await L.p.waitForTimeout(1200);
    const before = await L.p.evaluate(() => ({
      who: document.getElementById('who').textContent,
      chg: !!document.getElementById('chg'),
      openYet: !document.getElementById('rename').hidden
    }));
    ok('signed in, it greets him by the name on file', /you/.test(before.who), before.who);
    ok('and offers to change it',                      before.chg === true, before.chg);
    ok('but does not open the field until he asks',    before.openYet === false, before.openYet);

    await L.p.click('#chg');
    await L.p.waitForTimeout(200);
    ok('clicking it opens the field',
       await L.p.evaluate(() => !document.getElementById('rename').hidden), 0);
    ok('and it does not prefill the placeholder word "you"',
       (await L.p.inputValue('#new_name')) === '', await L.p.inputValue('#new_name'));

    await L.p.fill('#new_name', 'Paul');
    await L.p.click('#save_name');
    await L.p.waitForTimeout(1200);
    const wrote = L.wrote() ? JSON.parse(L.wrote().content) : null;
    ok('saving writes the new name',        wrote && wrote.people[0].label === 'Paul', wrote && JSON.stringify(wrote.people));
    ok('and moves nothing else about him',  wrote && wrote.people[0].id === 'ID_PAUL'
       && wrote.people[0].id7 === 'ID7_PAUL' && wrote.people[0].last4 === '0105', wrote && JSON.stringify(wrote.people));
    ok('the lists it governs are untouched',
       wrote && (wrote.sessions[PAGE].allow || []).join() === 'ID_DAVE', wrote && JSON.stringify(wrote.sessions));
    ok('he is still the administrator',     wrote && wrote.admins.join() === 'ID_PAUL', wrote && JSON.stringify(wrote.admins));
    ok('and no stray ok is written into the list',
       wrote && !('ok' in wrote), wrote && Object.keys(wrote).join());
    const said = await L.p.evaluate(() => ({ say: document.getElementById('say').textContent,
                                             who: document.getElementById('who').textContent,
                                             shut: document.getElementById('rename').hidden }));
    ok('it says so out loud',               /Saved/.test(said.say) && /Paul/.test(said.say), said.say);
    ok('and warns the rest of the site lags a minute',
       /take a minute/.test(said.say), said.say);
    ok('the greeting is redrawn with the new name', /Paul/.test(said.who), said.who);
    ok('and the field closes again',        said.shut === true, said.shut);
    await L.ctx.close();
  }

  await b.close();

  // ---------- the cache-buster, which I have broken three builds running ----
  // asset_pin — I have shipped a stale cache-buster three builds running, so this
  // is asserted rather than remembered. It names no version number on purpose:
  // a check with a number in it is one more thing to update, and updating it is
  // exactly the step I keep missing. The rule is only that every page agrees.
  function pinned(asset) {
    const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
    const seen = {};
    pages.forEach((f) => {
      const m = fs.readFileSync(path.join(DIR, f), 'utf8')
                  .match(new RegExp(asset.replace('.', '\\.') + '\\?v=(\\d+)'));
      if (m) (seen[m[1]] = seen[m[1]] || []).push(f);
    });
    const vs = Object.keys(seen);
    return { vs, seen, n: pages.filter(f => new RegExp(asset).test(fs.readFileSync(path.join(DIR, f), 'utf8'))).length };
  }
  const pinD = pinned('drawer.js'), pinC = pinned('site.css');
  ok('every page asks for the same drawer.js',
     pinD.vs.length === 1, JSON.stringify(pinD.seen));
  ok('every page asks for the same site.css',
     pinC.vs.length === 1, JSON.stringify(pinC.seen));
  ok('and there are plenty of them, so the check means something',
     pinD.n >= 10 && pinC.n >= 10, pinD.n + '/' + pinC.n);

  // the box may never hide itself again: that is the whole lesson of this one
  const src = fs.readFileSync(path.join(DIR, 'drawer.js'), 'utf8');
  const mount = src.slice(src.indexOf('function who_mount'), src.indexOf('window.vampjamWhoMount'));
  ok('nothing in the box hides itself once it is up',
     !/box\.hidden\s*=\s*true/.test(mount), (mount.match(/box\.hidden[^;]*/g) || []).join(' | '));
  ok('it is still shown from the first paint',
     /box\.hidden\s*=\s*false/.test(mount), 0);

  console.log('\nwho_name: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH ' + e.message); process.exit(1); });

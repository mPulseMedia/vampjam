// next_look_test — do-this-next now wears signin_steps' clothes, because he asked
// for the instructions to look like that page. Two things to hold: it really is
// that design (measured, not claimed), and it still says only what is waiting on
// him — three steps and the window that closes behind them.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
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
    if (u.includes('fonts.g')) return r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    return r.fulfill({ status: 204, body: '' });
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.goto('https://vampsf.com/vampjam_do_this_next.html');
  await p.waitForTimeout(700);

  const look = await p.evaluate(() => {
    const pn = document.querySelector('.panel[data-part]');
    return {
      sheet: getComputedStyle(document.body).backgroundColor,
      card:  getComputedStyle(pn).backgroundColor,
      col:   getComputedStyle(pn).gridTemplateColumns.split(' ')[0],
      h1w:   getComputedStyle(document.querySelector('h1')).fontWeight,
      h1f:   getComputedStyle(document.querySelector('h1')).fontFamily,
      kick:  getComputedStyle(document.querySelector('.kicker')).textTransform,
      count: getComputedStyle(document.querySelector('ol.steps li'), '::before').color,
      panels: document.querySelectorAll('.panel').length,
      nums:  [...document.querySelectorAll('.panel .n')].map(e => e.textContent.trim())
    };
  });
  ok('dark navy sheet, same as the steps page', look.sheet === 'rgb(14, 42, 63)', look.sheet);
  ok('cream panels on it',                      look.card === 'rgb(247, 245, 240)', look.card);
  ok('the 74px number column',                  look.col === '74px', look.col);
  ok('archivo 800 for the title',               look.h1w === '800' && /Archivo/.test(look.h1f), look.h1w);
  ok('the uppercase kicker',                    look.kick === 'uppercase', look.kick);
  ok('amber step counters',                     look.count === 'rgb(163, 90, 0)', look.count);
  ok('a now panel, three steps, and a warning',
     look.nums.join(',') === 'now,1,2,3,!', look.nums.join(','));

  const say = await p.evaluate(() => ({
    text: document.body.textContent.replace(/\s+/g, ' '),
    html: document.body.innerHTML.replace(/\s+/g, ' '),
    out:  [...document.querySelectorAll('a')].map(a => a.getAttribute('href')),
    svgs: document.querySelectorAll('svg.mini').length,
    ringed: [...document.querySelectorAll('svg.mini')].filter(s =>
      [...s.querySelectorAll('*')].some(e => (e.getAttribute('stroke') || '').toLowerCase() === '#d7263d')).length
  }));
  ok('it is about one job and says so',
     /Reset the administrator/.test(say.text) && /one job/.test(say.text), 0);
  ok('it opens by saying where things stand',
     /AUTH_SECRET is running/.test(say.text) && /checked it directly/.test(say.text)
     && /nothing is broken/.test(say.text), 0);
  ok('step 1 is the paste loop, with why',
     /Edit code/.test(say.text) && /admins only/.test(say.text), 0);
  ok('and names the access.json block as the last two failures',
     /access\.json<\/b>/.test(say.html) && /blocked in your browser/.test(say.text), 0);
  ok('step 2 quotes the sentence that grants permission',
     /one number is here so far \(ending 0105\)/.test(say.text)
     && /That sentence is the permission/.test(say.text), 0);
  ok('step 3 gives the number and what he should see',
     /917-693-0105/.test(say.text) && /••0105/.test(say.text)
     && /private — 1 person can open it/.test(say.text), 0);
  ok('and that it replaces rather than joins',
     /replaces the mistyped one rather than joining/.test(say.text), 0);
  ok('the window that closes behind him is a warning panel',
     /Do this one first/.test(say.text) && /window closes behind you/.test(say.text), 0);
  ok('and the standing honesty is still on it',
     /a phone number is not a password/.test(say.text), 0);
  ok('one drawing, of his own box, with the ring on the sentence',
     say.svgs === 1 && say.ringed === 1, say.svgs + '/' + say.ringed);
  ok('it links to the steps and back to the recordings',
     say.out.includes('signin_steps.html') && say.out.includes('index.html'), say.out.join(' '));
  ok('and never at itself',
     !say.out.some(h => /do_this_next/.test(h || '')), say.out.join(' '));
  ok('no twilio anywhere on it',                !/twilio/i.test(say.text), 0);

  await b.close();
  console.log('\nnext_look: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

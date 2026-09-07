// name_edit_test — the pencil beside the title renames the TITLE. It used to
// open the audio-file form, whose first field was the file URL, which is how a
// rename ended up pointing two sessions at files that do not exist.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';
const R2  = 'https://pub-33cfd8558d314eb58642c8550608850b.r2.dev/';
const SIL = fs.readFileSync(path.join(DIR, 'silence_long.wav'));

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

const REG = [{ page: 'session.html?p=a1', name: '2026-09-01 Redwood City', date: '2026-09-01', dur: 200, count: 1 }];
const SESS = { audio: { label: '2026-09-01 Redwood City', url: R2 + 'a1.m4a', kind: 'url' },
               tags: [{ id: 't_1', t: 12, label: 'one' }] };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const writes = [];
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
    if (u.includes('api.github.com'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(REG) });
    if (u.includes('sessions_auto'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(REG) });
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
    if (/a1\.json/.test(u))
      return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SESS) });
    if (u.includes('.json'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"tags":[]}' });
    if (u.startsWith(R2))
      return r.fulfill({ status: 200, headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }, body: SIL });
    return r.fulfill({ status: 204, body: '[]' });
  });

  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });
  await p.goto('https://vampsf.com/session.html?p=a1');
  await p.waitForTimeout(1800);

  const before = await p.evaluate(() => ({
    title: document.getElementById('session_title').textContent,
    btnTitle: document.getElementById('audio_edit_btn').title,
    aria: document.getElementById('audio_edit_btn').getAttribute('aria-label')
  }));
  ok('the title is the recording name',    /Redwood City/.test(before.title), before.title);
  ok('the pencil says it renames',         /rename/i.test(before.btnTitle) && /rename/i.test(before.aria),
                                           before.btnTitle + ' / ' + before.aria);

  // ---------- the pencil opens a NAME field, not the file form ----------
  await p.click('#audio_edit_btn');
  await p.waitForTimeout(250);
  const open = await p.evaluate(() => ({
    field: !!document.getElementById('name_in'),
    value: (document.getElementById('name_in') || {}).value,
    selected: (() => { const i = document.getElementById('name_in');
      return i && i.selectionStart === 0 && i.selectionEnd === i.value.length; })(),
    fileFormShown: getComputedStyle(document.getElementById('audio_edit_form')).display !== 'none',
    titleHidden: getComputedStyle(document.getElementById('session_title')).display === 'none',
    escape: !!document.getElementById('name_file_link')
  }));
  ok('it opens a name field',              open.field, open.field);
  ok('holding the current name, selected', /Redwood City/.test(open.value || '') && open.selected,
                                           open.value + ' sel=' + open.selected);
  ok('and NOT the audio-file form',        open.fileFormShown === false, open.fileFormShown);
  ok('the static title steps aside for it', open.titleHidden, open.titleHidden);
  ok('with a way to the file, said plainly', open.escape, open.escape);

  // ---------- Escape leaves it alone ----------
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  const esc = await p.evaluate(() => ({
    field: !!document.getElementById('name_in'),
    title: document.getElementById('session_title').textContent,
    writes: 0
  }));
  ok('Escape closes without renaming',     !esc.field && /Redwood City/.test(esc.title), esc.title);
  ok('and wrote nothing',                  writes.length === 0, writes.length);

  // ---------- Enter renames, in BOTH places ----------
  await p.click('#audio_edit_btn');
  await p.waitForTimeout(200);
  await p.fill('#name_in', '2026-09-01 Sound Union');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(2500);

  const after = await p.evaluate(() => ({
    title: document.getElementById('session_title').textContent,
    docTitle: document.title,
    field: !!document.getElementById('name_in')
  }));
  ok('the title changes on the page',      after.title === '2026-09-01 Sound Union', after.title);
  ok('and in the browser tab',             /Sound Union/.test(after.docTitle), after.docTitle);
  ok('the field is gone',                  !after.field, after.field);

  const sessWrite = writes.find(w => /a1\.json$/.test(w.path || ''));
  const regWrite  = writes.find(w => w.path === 'sessions_auto.json');
  ok('the session file was written',       !!sessWrite, writes.map(w => w.path).join(','));
  const sd = sessWrite && JSON.parse(sessWrite.content);
  ok('with the new label',                 sd && sd.audio.label === '2026-09-01 Sound Union', sd && sd.audio.label);
  ok('and the audio file UNTOUCHED',       sd && sd.audio.url === R2 + 'a1.m4a', sd && sd.audio.url);
  ok('the moments came through too',       sd && sd.tags.length === 1, sd && sd.tags.length);

  ok('the LIST was renamed as well',       !!regWrite, writes.map(w => w.path).join(','));
  const rd = regWrite && JSON.parse(regWrite.content);
  const row = rd && rd.find(x => x.page === 'session.html?p=a1');
  ok('its row carries the new name',       row && row.name === '2026-09-01 Sound Union', row && row.name);
  ok('and keeps its page, date and count', row && row.date === '2026-09-01' && row.count === 1, JSON.stringify(row));
  // exactly two writes carry the rename — the session file and the registry.
  // (The drawer's background sweep may add an unrelated "dur refresh"; count
  // the renames, not the traffic.)
  const renames = writes.filter(w => /^rename /.test(w.message || ''));
  ok('the rename is one commit each, not a storm', renames.length === 2,
     writes.map(w => w.message || w.path).join(' | '));

  // ---------- the file form is still reachable, and now warns ----------
  await p.click('#audio_edit_btn');
  await p.waitForTimeout(200);
  await p.click('#name_file_link a');
  await p.waitForTimeout(300);
  const file = await p.evaluate(() => ({
    shown: getComputedStyle(document.getElementById('audio_edit_form')).display !== 'none',
    warn: (document.querySelector('.audio_warn') || {}).textContent || '',
    nameField: !!document.getElementById('name_in'),
    url: document.getElementById('audio_url_in').value
  }));
  ok('the file form is one step further in', file.shown, file.shown);
  ok('the name field closed behind it',    !file.nameField, file.nameField);
  ok('and it warns what it is',            /audio FILE, not the name/.test(file.warn), file.warn.slice(0, 60));
  ok('prefilled with the real file',       /a1\.m4a$/.test(file.url), file.url);
  await p.close();

  // ---------- every session page got it ----------
  const pages = fs.readdirSync(DIR)
    .filter(f => /^2026_\d\d_\d\d_.*\.html$/.test(f) && fs.statSync(path.join(DIR, f)).size > 5000)
    .concat(['session.html']);
  const missing = pages.filter(f => {
    const t = fs.readFileSync(path.join(DIR, f), 'utf8');
    return !/name_edit_open/.test(t) || !/PAGE_KEY/.test(t) || !/aria-label="Rename this recording"/.test(t);
  });
  ok('all nine session pages rename',      missing.length === 0, missing.join(','));

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

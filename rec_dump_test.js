// rec_dump_test — when an upload will not go, one tap has to produce a
// paste-able account of why. The suite plants a stuck local recording, makes
// the upload worker refuse it the way a too-big file is refused, and reads
// the dump back to see that it says so.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.env.VJ_DIR || '/tmp/vj';

let pass = 0, fail = 0;
const ok = (n, c, g) => { c ? (pass++, console.log('  ok   ' + n))
                            : (fail++, console.log('  FAIL ' + n + (g !== undefined ? '  got: ' + g : ''))); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'https://vampsf.com' }).catch(() => {});
  let uploads = 0;
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
    // the upload worker refuses the body the way Cloudflare refuses one over
    // its limit: an HTML page, not JSON
    if (u.includes('vampjam-upload')) {
      uploads++;
      return r.fulfill({ status: 413, contentType: 'text/html',
        body: '<html><body><h1>413 Request Entity Too Large</h1></body></html>' });
    }
    if (u.includes('vampjam-sync'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    if (u.includes('api.github.com'))
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ content: Buffer.from('[]').toString('base64'), sha: 'x' }) });
    if (u.includes('sessions_auto'))
      return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    return r.fulfill({ status: 204, body: '' });
  });

  const p = await ctx.newPage();
  p.on('pageerror', e => { fail++; console.log('  FAIL pageerror: ' + e.message); });

  // ---------- the quiet state: button there, box not ----------
  await p.goto('https://vampsf.com/record.html');
  await p.waitForTimeout(800);
  const quiet = await p.evaluate(() => {
    const btn = document.getElementById('dump_btn'), box = document.getElementById('dump_box');
    return { btn: !!btn, text: btn && btn.textContent.trim(), op: btn && getComputedStyle(btn).opacity,
             boxHidden: box && box.hidden };
  });
  ok('there is a debug button',            quiet.btn, quiet.btn);
  ok('it says what it does',               /copy debug/i.test(quiet.text || ''), quiet.text);
  ok('and it is quiet',                    parseFloat(quiet.op) < 0.7, quiet.op);
  ok('the box is not there until needed',  quiet.boxHidden === true, quiet.boxHidden);

  // ---------- plant a stuck recording, the way a long take leaves one ----------
  await p.evaluate(() => new Promise((res, rej) => {
    const rq = indexedDB.open('vampjam_rec', 1);
    rq.onsuccess = () => {
      const db = rq.result;
      const tx = db.transaction(['recs', 'chunks'], 'readwrite');
      tx.objectStore('recs').put({ id: 'loc_test1', label: 'Long one', date: '2026-09-05',
        dur: 5400, state: 'ready', ts: Date.now(), mime: 'audio/mp4', ext: 'm4a', tags: [{ t: 10, label: 'a' }] });
      const big = new Blob([new Uint8Array(3 * 1024 * 1024)], { type: 'audio/mp4' });
      for (let i = 0; i < 4; i++) tx.objectStore('chunks').put({ id: 'loc_test1', seq: i, blob: big });
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    };
    rq.onerror = () => rej(rq.error);
  }));
  await p.reload();
  await p.waitForTimeout(2500);   // recover_locals tries the upload on its own

  const after = await p.evaluate(() => ({
    status: document.getElementById('status').textContent.trim(),
    retry: !!document.getElementById('retry_link')
  }));
  ok('the recovery upload was attempted',       uploads >= 1, uploads);
  ok('the error names the STATUS, not a parse error',
     /upload 413/.test(after.status), after.status);
  ok('and what the server said',                /Too Large/i.test(after.status), after.status);
  ok('with a way to try again',                 after.retry, after.retry);

  // ---------- the dump ----------
  await p.click('#dump_btn');
  await p.waitForTimeout(900);
  const d = await p.evaluate(() => ({
    box: document.getElementById('dump_box').value,
    hidden: document.getElementById('dump_box').hidden,
    status: document.getElementById('status').textContent.trim(),
    btn: document.getElementById('dump_btn').textContent.trim(),
    retry: !!document.getElementById('retry_link')
  }));
  const clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
  ok('the box appears, filled',                  d.hidden === false && d.box.length > 400, d.box.length);
  ok('and the clipboard has the same text',      clip === d.box, (clip || '').length + ' vs ' + d.box.length);
  ok('the BUTTON says it is copied',             /copied/i.test(d.btn), d.btn);
  ok('and the status line was left alone',       /upload 413/.test(d.status), d.status);
  ok('so the try-again link survived the dump',  d.retry === true, d.retry);
  ok('the dump names the stuck recording',       /loc_test1/.test(d.box), '');
  ok('with its size',                            /bytes=12\.0 MB/.test(d.box), (d.box.match(/bytes=[^\s]+ ?\w+/) || [])[0]);
  ok('its state and length',                     /state=ready/.test(d.box) && /5400s/.test(d.box), '');
  ok('and how many chunks it is in',             /chunks=4/.test(d.box), '');
  ok('the dump has the failed upload, with its status', /resp\s+413/.test(d.box), '');
  ok('and what was sent',                        /POST .*vampjam-upload.*body=12582912/.test(d.box), '');
  ok('and the upload error line',                /upload\s+upload 413/.test(d.box), '');
  ok('the browser is identified',                /^ua:\s+\S/m.test(d.box), '');
  ok('the recorder formats are listed',          /audio\/mp4=[yn]/.test(d.box), '');
  ok('storage headroom is reported',             /storage:\s+used/.test(d.box), '');
  ok('and the pending marker is in it',          /vampjam_pending_session/.test(d.box), '');
  ok('and it is dated',                          /rec_dump 20\d\d-/.test(d.box), '');
  ok('the recovery attempt said what it was doing',
     /stage\s+recover loc_test1: 4 chunks, 12\.0 MB, 5400s/.test(d.box), '');
  ok('and the upload went out as an XHR with the whole body',
     /fetch\s+POST .*vampjam-upload.* body=12582912 xhr/.test(d.box), (d.box.match(/fetch .*upload.*/) || [])[0]);

  // ---------- try again: every stage shows its name, and it is all logged ----------
  const seen = [];
  const watch = setInterval(async () => {
    const t = await p.evaluate(() => document.getElementById('status').textContent.trim()).catch(() => null);
    if (t && (!seen.length || seen[seen.length - 1] !== t)) seen.push(t);
  }, 40);
  await p.click('#retry_link');
  await p.waitForTimeout(2500);
  clearInterval(watch);
  ok('try again actually did something visible', seen.length >= 3, JSON.stringify(seen).slice(0, 300));
  ok('it said how big the file is',       seen.some(t => /retry: file is 12\.0 MB/.test(t)), '');
  ok('it said it was uploading, with a count', seen.some(t => /uploading .*of 12\.0 MB/.test(t)), '');
  ok('and it ended on the error again, not on nothing',
     /upload 413/.test(seen[seen.length - 1] || ''), seen[seen.length - 1]);

  await p.click('#dump_btn');
  await p.waitForTimeout(900);
  const d2 = await p.evaluate(() => document.getElementById('dump_box').value);
  ok('the tap itself is in the log',      /tap\s+try again/.test(d2), '');
  ok('so are the stages',                 /stage\s+registering placeholder/.test(d2) && /stage\s+uploading 0 of/.test(d2), '');
  ok('and the second refusal',            (d2.match(/resp\s+413/g) || []).length >= 2, (d2.match(/resp\s+413/g) || []).length);

  await b.close();
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();

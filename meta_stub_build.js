// meta_stub_build — one tiny html file per session whose whole job is to carry
// the session's NAME, so a link pasted into Messages previews as
// "2026-11-14 Sound Union" instead of "Recording".
//
// Why a separate file exists at all: the real player is session.html?p=<id> —
// one page serving every recording — and its title can only be filled in by
// javascript once the page is running. Link previewers (iMessage, Slack,
// WhatsApp) never run javascript; they read the html exactly as it comes off
// the server. The site is GitHub Pages, which is static, so there is no server
// that could fill the title in either. A stub per session is the only place
// left to put the name.
//
// The stub is read by machines and passed through by people: a previewer takes
// the title and stops, a person is sent straight on to the player.
//
// Everything here comes out of the session registries, so this is a build and
// not a file to hand-edit. After adding a session:  node meta_stub_build.js
'use strict';
var fs = require('fs');
var path = require('path');
var DIR = __dirname;
var PREFIX = 'session.html?p=';
var MARK = 'meta_stub_build';          // how a stub is known to be ours to rewrite

function sessions_read() {
  var win = {};
  new Function('window', fs.readFileSync(path.join(DIR, 'sessions.js'), 'utf8'))(win);
  var list = (win.VAMPJAM_SESSIONS || []).slice();
  try {
    list = list.concat(JSON.parse(fs.readFileSync(path.join(DIR, 'sessions_auto.json'), 'utf8')));
  } catch (e) {}
  return list;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// the same h:mm the session list shows, so the preview and the row agree
function hmm(sec) {
  sec = Math.round(sec || 0);
  if (!sec) return '';
  var m = Math.max(1, Math.round(sec / 60));
  return Math.floor(m / 60) + ':' + (m % 60 < 10 ? '0' : '') + (m % 60);
}

// older rows are named "Sound Union" with the date in a column beside them; the
// preview has no column, so the date joins the name when it is not already there
function label_of(s) {
  var n = String(s.name || '').trim();
  return /^\d{4}-\d{2}-\d{2}/.test(n) ? n : ((s.date || '') + ' ' + n).trim();
}

function stub_html(id, label, desc) {
  var to = 'session.html?p=' + id;
  return '<!doctype html>\n<html lang="en">\n<head>\n'
    + '<meta charset="utf-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    + '<!-- ' + MARK + ' — generated. Edit meta_stub_build.js, not this file. -->\n'
    + '<title>vampsf — ' + esc(label) + '</title>\n'
    + '<meta name="description" content="' + esc(desc) + '">\n'
    + '<meta property="og:site_name" content="vampsf">\n'
    + '<meta property="og:type" content="music.song">\n'
    + '<meta property="og:title" content="' + esc(label) + '">\n'
    + '<meta property="og:description" content="' + esc(desc) + '">\n'
    + '<meta property="og:url" content="https://vampsf.com/' + id + '.html">\n'
    + '<meta name="twitter:card" content="summary">\n'
    + '<meta name="twitter:title" content="' + esc(label) + '">\n'
    + '<meta name="twitter:description" content="' + esc(desc) + '">\n'
    + '<link rel="canonical" href="https://vampsf.com/' + to + '">\n'
    // the refresh is for anyone whose javascript is off; the script is for
    // everyone else, and runs first so there is no visible pause
    + '<meta http-equiv="refresh" content="0;url=' + to + '">\n'
    + '<script>location.replace(' + JSON.stringify(to) + ' + location.hash);</script>\n'
    + '<style>html,body{background:#111;color:#eee;margin:0;'
    + 'font:16px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'
    + 'a{color:#8ab4f8;display:block;padding:24px}</style>\n'
    + '</head>\n<body>\n'
    + '<a href="' + to + '">' + esc(label) + '</a>\n'
    + '</body>\n</html>\n';
}

var made = 0, kept = 0, skipped = [];
sessions_read().forEach(function (s) {
  var page = String(s.page || '');
  if (page.indexOf(PREFIX) !== 0) return;              // old sessions are real pages already
  var id = page.slice(PREFIX.length);
  var file = path.join(DIR, id + '.html');
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8').indexOf(MARK) === -1) {
    skipped.push(id + '.html');                        // a real page lives here — leave it alone
    return;
  }
  var label = label_of(s);
  var d = hmm(s.dur);
  var next = stub_html(id, label, 'Vamp jam recording' + (d ? ' · ' + d : ''));
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === next) { kept++; return; }
  fs.writeFileSync(file, next);
  made++;
  console.log('wrote ' + id + '.html  ' + label);
});
console.log(made + ' written, ' + kept + ' already current'
  + (skipped.length ? ', left alone: ' + skipped.join(', ') : ''));

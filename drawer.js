// vampjam_drawer — the session surface that slides down from the top edge.
// Open it three ways:
//   1. tap the caret (top-left),
//   2. when the page is at rest at the very top, swipe DOWN to pull the surface in,
//   3. when the surface is open, swipe UP to push it back (page returns to the top).
// If you are not at the top, a downward swipe is just a normal scroll.
// Clicking a session collapses the drawer (page slides back up) before nav.
(function () {
  var OPEN_FRACTION = 0.72;                 // matches .session_drawer.open max-height: 72vh
  var SETTLE_MS = 350;                      // rest-at-top time required before a pull reveals
  function drawer() { return document.getElementById('session_drawer'); }
  function caret()  { return document.getElementById('drawer_toggle'); }
  function maxOpenPx() { return Math.round(window.innerHeight * OPEN_FRACTION); }

  function update_sess_overflow() {
    var d = drawer(); if (!d) return;
    // shadow the session card's bottom only when the list is taller than the drawer
    d.classList.toggle('sess_overflow', d.classList.contains('open') && d.scrollHeight > d.clientHeight + 2);
  }
  function set_open(on) {
    var d = drawer(); if (!d) return;
    d.classList.toggle('open', on);
    var c = caret(); if (c) c.classList.toggle('open', on);
    // sessions run oldest -> newest, so open scrolled to the bottom (newest)
    if (on) { setTimeout(function () { update_sess_overflow(); d.scrollTop = d.scrollHeight; }, 250); }
    else { d.classList.remove('sess_overflow'); }
  }
  window.addEventListener('resize', update_sess_overflow);
  function toggle() {
    var d = drawer(); if (!d) return;
    set_open(!d.classList.contains('open'));
  }
  function close_then(go) {
    set_open(false);
    setTimeout(go, 190); // matches the .session_drawer max-height transition
  }
  window.vampjamDrawer = { toggle: toggle };

  // ---- data-driven session list (rendered from sessions.js) ----
  var ICO_CASS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><circle cx="8" cy="12" r="2.2"/><circle cx="16" cy="12" r="2.2"/><path d="M10.2 12h3.6"/><path d="M7 18.5l1.6-2.5h6.8l1.6 2.5"/></svg>';
  var ICO_GEAR = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M12 2.6l1.7 2.2 2.7-.7.4 2.8 2.5 1.2-1 2.6 1 2.6-2.5 1.2-.4 2.8-2.7-.7L12 21.4l-1.7-2.2-2.7.7-.4-2.8-2.5-1.2 1-2.6-1-2.6 2.5-1.2.4-2.8 2.7.7z"/></svg>';
  var ICO_SHARE = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 14V4"/><path d="M8.5 7.3L12 3.8l3.5 3.5"/><path d="M6.6 11H6a1.6 1.6 0 0 0-1.6 1.6v5.8A1.6 1.6 0 0 0 6 20h12a1.6 1.6 0 0 0 1.6-1.6v-5.8A1.6 1.6 0 0 0 18 11h-.6"/></svg>';
  var ICO_NEW = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>';
  var HERE = (location.pathname.split('/').pop() || '');

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt_dur(s) { s = Math.round(s || 0); if (!s) return ''; var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60; return h > 0 ? h + ':' + pad(m) + ':' + pad(ss) : m + ':' + pad(ss); }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function build_menu() {
    var menu = document.querySelector('.session_drawer .jam_menu');
    if (!menu || !window.VAMPJAM_SESSIONS) return;   // no manifest -> keep static markup
    var rows = ['<div class="jam_item jam_admin"><a class="jam_link" href="admin.html">'
      + '<span class="jam_left"><span class="jam_ico">' + ICO_GEAR + '</span><span class="jam_name">Admin</span></span>'
      + '<span class="menu_sub">setup</span></a></div>'];
    window.VAMPJAM_SESSIONS.forEach(function (s) {
      var cur = (s.page === HERE) ? ' current' : '';
      var dur = s.dur;
      try { var ov = localStorage.getItem('vampjam_dur_' + s.page); if (ov) dur = parseInt(ov, 10); } catch (e) {}
      var right = fmt_dur(dur);
      if (s.count) right += ' <span class="jam_count">' + s.count + '</span>';
      rows.push('<div class="jam_item' + cur + '"><a class="jam_link' + cur + '" href="' + s.page + '">'
        + '<span class="jam_left"><span class="jam_ico">' + ICO_CASS + '</span>'
        + '<span class="jam_name">' + esc(s.name + ' — ' + s.date) + '</span></span>'
        + '<span class="menu_sub">' + right + '</span></a>'
        + '<button class="jam_share" data-href="' + s.page + '" aria-label="Copy link to this session">' + ICO_SHARE + '</button></div>');
    });
    rows.push('<div class="jam_item jam_new"><a class="jam_link" href="admin.html">'
      + '<span class="jam_left"><span class="jam_ico">' + ICO_NEW + '</span><span class="jam_name">New recording</span></span></a></div>');
    menu.innerHTML = rows.join('');
  }

  // remember this session for the index; cache its duration going forward
  try { localStorage.setItem('vampjam_last_session', HERE); } catch (e) {}
  function capture_dur() {
    var pl = document.getElementById('player');
    if (!pl) return;
    pl.addEventListener('loadedmetadata', function () {
      if (isFinite(pl.duration) && pl.duration > 0) {
        try { localStorage.setItem('vampjam_dur_' + HERE, Math.round(pl.duration)); } catch (e) {}
      }
    });
  }

  // ---- session links: animate the drawer closed, then navigate ----
  function wire_links() {
    var menu = document.querySelector('.session_drawer .jam_menu');
    if (!menu) return;
    Array.prototype.forEach.call(menu.querySelectorAll('a[href]'), function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        e.preventDefault();
        close_then(function () { window.location.href = href; });
      });
    });
    // share button on each session row: copy that session's page link (no timestamp)
    Array.prototype.forEach.call(menu.querySelectorAll('.jam_share'), function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var href = b.getAttribute('data-href');
        var url = new URL(href, window.location.href).href;
        try { if (navigator.clipboard) navigator.clipboard.writeText(url); } catch (err) {}
        if (typeof window.toast === 'function') window.toast('Link copied: ' + url);
      });
    });
  }

  // ---- drag: pull down (at top) to reveal, swipe up (when open) to close ----
  var drag = null;
  var last_scroll_at = 0;
  window.addEventListener('scroll', function () { last_scroll_at = Date.now(); }, { passive: true });

  function onStart(e) {
    var d = drawer();
    if (!d || e.touches.length !== 1) { drag = null; return; }
    var t = e.touches[0];
    if (d.classList.contains('open')) {
      // swipe up to close (only once the list itself is at its own top)
      drag = { mode: 'close', y0: t.clientY, x0: t.clientX, active: false };
      return;
    }
    if (window.scrollY > 0) { drag = null; return; }                 // not at top -> plain scroll
    if (Date.now() - last_scroll_at < SETTLE_MS) { drag = null; return; } // just scrolled -> stop at top
    var tg = e.target;
    if (tg && tg.closest && tg.closest('.seek_bar, input, textarea, [contenteditable]')) {
      drag = null; return;                                           // don't hijack seek / editing
    }
    drag = { mode: 'open', y0: t.clientY, x0: t.clientX, active: false };
  }

  function onMove(e) {
    if (!drag) return;
    var d = drawer(); if (!d) { drag = null; return; }
    var t = e.touches[0];
    var dy = t.clientY - drag.y0, dx = t.clientX - drag.x0;
    var max = maxOpenPx();
    if (!drag.active) {
      if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;              // too small to decide
      if (Math.abs(dx) > Math.abs(dy)) { drag = null; return; }      // horizontal -> ignore
      if (drag.mode === 'open') {
        if (dy <= 0) { drag = null; return; }                        // reveal needs a downward pull
        if (window.scrollY > 0) { drag = null; return; }             // scrolled away since start
      } else { // close
        if (dy >= 0) { drag = null; return; }                        // close needs an upward swipe
        if (d.scrollTop > 0) { drag = null; return; }                // let the list scroll to its top first
      }
      drag.active = true;
      d.classList.add('dragging');                                   // track finger, no transition
    }
    var h = (drag.mode === 'open')
      ? Math.max(0, Math.min(max, dy))          // grow from 0 with the pull
      : Math.max(0, Math.min(max, max + dy));   // shrink from full as you swipe up (dy < 0)
    d.style.maxHeight = h + 'px';
    e.preventDefault();                                              // suppress native rubber-band
  }

  function onEnd() {
    if (drag && drag.active) {
      var d = drawer();
      if (d) {
        var cur = parseFloat(d.style.maxHeight) || 0;
        var max = maxOpenPx();
        var openIt = (drag.mode === 'open')
          ? cur > Math.min(100, max * 0.3)      // pulled far enough to open?
          : cur > max * 0.7;                    // released before pulling up ~30% -> stay open
        d.classList.remove('dragging');                             // re-enable transition
        d.style.maxHeight = (openIt ? max : 0) + 'px';              // animate to the snap point
        set_open(openIt);                                           // caret + shadow follow
        setTimeout(function () {                                    // hand back to CSS (72vh)
          if (d.classList.contains('open') === openIt) d.style.maxHeight = '';
        }, 200);
      }
    }
    drag = null;
  }

  window.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd, { passive: true });
  window.addEventListener('touchcancel', onEnd, { passive: true });

  function boot() { build_menu(); wire_links(); capture_dur(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

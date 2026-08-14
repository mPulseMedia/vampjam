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
    if (on) { setTimeout(update_sess_overflow, 250); } else { d.classList.remove('sess_overflow'); }
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire_links);
  } else {
    wire_links();
  }
})();

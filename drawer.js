// vampjam_drawer — the session surface that slides down from the top edge.
// Open it two ways:
//   1. tap the caret (top-left), or
//   2. when the page is already scrolled to the very top, swipe DOWN to pull
//      the surface into view (the page follows your finger, then snaps).
// If you are not at the top, a downward swipe is just a normal scroll.
// Clicking a session collapses the drawer (page slides back up) before nav.
(function () {
  var OPEN_FRACTION = 0.72;                 // matches .session_drawer.open max-height: 72vh
  function drawer() { return document.getElementById('session_drawer'); }
  function caret()  { return document.getElementById('drawer_toggle'); }
  function maxOpenPx() { return Math.round(window.innerHeight * OPEN_FRACTION); }

  function set_open(on) {
    var d = drawer(); if (!d) return;
    d.classList.toggle('open', on);
    var c = caret(); if (c) c.classList.toggle('open', on);
  }
  function toggle() {
    var d = drawer(); if (!d) return;
    set_open(!d.classList.contains('open'));
  }
  function close_then(go) {
    set_open(false);
    setTimeout(go, 300); // matches the .session_drawer max-height transition
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
  }

  // ---- pull-to-reveal at the very top ----
  var drag = null;

  function onStart(e) {
    var d = drawer();
    if (!d || e.touches.length !== 1) { drag = null; return; }
    if (d.classList.contains('open')) { drag = null; return; }   // already open
    if (window.scrollY > 0) { drag = null; return; }             // not at top -> plain scroll
    var tg = e.target;
    if (tg && tg.closest && tg.closest('.seek_bar, input, textarea, [contenteditable]')) {
      drag = null; return;                                       // don't hijack seek / editing
    }
    var t = e.touches[0];
    drag = { y0: t.clientY, x0: t.clientX, active: false };
  }

  function onMove(e) {
    if (!drag) return;
    var d = drawer(); if (!d) { drag = null; return; }
    var t = e.touches[0];
    var dy = t.clientY - drag.y0, dx = t.clientX - drag.x0;
    if (!drag.active) {
      if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;          // not moved enough to decide
      if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) { drag = null; return; } // not a downward pull
      if (window.scrollY > 0) { drag = null; return; }           // scrolled away since start
      drag.active = true;
      d.classList.add('dragging');                               // track the finger, no transition
    }
    var h = Math.max(0, Math.min(maxOpenPx(), dy));
    d.style.maxHeight = h + 'px';
    e.preventDefault();                                          // suppress native rubber-band
  }

  function onEnd() {
    if (drag && drag.active) {
      var d = drawer();
      if (d) {
        var cur = parseFloat(d.style.maxHeight) || 0;
        var max = maxOpenPx();
        var openIt = cur > Math.min(100, max * 0.3);             // pulled far enough?
        d.classList.remove('dragging');                          // re-enable transition
        d.style.maxHeight = (openIt ? max : 0) + 'px';           // animate to the snap point
        set_open(openIt);                                        // caret + shadow follow
        setTimeout(function () {                                 // hand back to CSS (72vh)
          if (d.classList.contains('open') === openIt) d.style.maxHeight = '';
        }, 320);
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

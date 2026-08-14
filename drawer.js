// vampjam_drawer — the session surface that slides down from the top edge.
// Hamburger caret toggles it; clicking a session animates the page back up
// (drawer collapses) before navigating, so the transition reads as one motion.
(function () {
  function drawer() { return document.getElementById('session_drawer'); }
  function caret()  { return document.getElementById('drawer_toggle'); }

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

  function wire() {
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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();

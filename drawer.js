// vampjam_drawer — the session surface that slides down from the top edge.
// Open it three ways:
//   1. tap the caret (top-left),
//   2. when the page is at rest at the very top, swipe DOWN to pull the surface in,
//   3. when the surface is open, swipe UP to push it back (page returns to the top).
// If you are not at the top, a downward swipe is just a normal scroll.
// Clicking a session collapses the drawer (page slides back up) before nav.
(function () {
  var OPEN_FRACTION = 0.80;                 // matches .session_drawer.open max-height: 80dvh
                                            // (the lower 20% stays with the play_deck)
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
    // play_deck — while the session list is open, pages that have a
    // transport panel dock it into the bottom fifth of the viewport
    try { document.body.classList.toggle('drawer_open', on); } catch (eB) {}
    var c = caret(); if (c) c.classList.toggle('open', on);
    // newest-first: the panel always opens scrolled to the top
    if (on) { setTimeout(function () { update_sess_overflow(); d.scrollTop = 0; }, 250); }
    else { d.classList.remove('sess_overflow'); }
  }
  window.addEventListener('resize', update_sess_overflow);
  function toggle() {
    var d = drawer(); if (!d) return;
    var opening = !d.classList.contains('open');
    if (opening) { build_menu(); wire_links(); }   // fresh rows (e.g. Favorites) on every open
    set_open(opening);
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
  // pending_session — a recording that was just created on this device but may
  // not have landed in sessions_auto.json yet (GitHub can take a minute).
  var SYNC_URL = 'https://vampjam-sync.crimson-dust-a18d.workers.dev/';
  var PENDING_KEY = 'vampjam_pending_session';
  function pending_get() {
    try {
      var p = JSON.parse(localStorage.getItem(PENDING_KEY) || 'null');
      if (p && p.ts && (Date.now() - p.ts) < 15 * 60 * 1000) return p;
      if (p) localStorage.removeItem(PENDING_KEY);
    } catch (e) {}
    return null;
  }
  function pending_clear() { try { localStorage.removeItem(PENDING_KEY); } catch (e) {} }

  // deleted_pages — pages this device deleted. Registry reads can be minutes
  // stale (CDN), so every display AND every registry write filters against
  // this list; otherwise a delete based on a stale read resurrects rows.
  var DELETED_KEY = 'vampjam_deleted_pages';
  function deleted_get() {
    try {
      var arr = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]');
      if (!Array.isArray(arr)) return [];
      var cut = Date.now() - 7 * 24 * 3600 * 1000;
      return arr.filter(function (t) { return t && t.page && t.ts > cut; }).slice(-50);
    } catch (e) { return []; }
  }
  function deleted_has(page) {
    return deleted_get().some(function (t) { return t.page === page; });
  }
  function deleted_add(page) {
    try {
      var arr = deleted_get();
      if (!arr.some(function (t) { return t.page === page; })) arr.push({ page: page, ts: Date.now() });
      localStorage.setItem(DELETED_KEY, JSON.stringify(arr));
    } catch (e) {}
  }
  function deleted_remove(page) {
    try {
      localStorage.setItem(DELETED_KEY, JSON.stringify(
        deleted_get().filter(function (t) { return t.page !== page; })));
    } catch (e) {}
  }
  // pages whose delete is mid-flight: still rendered, grayed, with a red spinner
  var deleting = {};

  // drawer_confirm — the same themed pop-up the highlight delete uses,
  // self-contained here so it works on every page that has the drawer
  function drawer_confirm(msg, yesLabel, onYes) {
    var ov = document.createElement('div');
    ov.className = 'jamc_overlay';
    var card = document.createElement('div');
    card.className = 'jamc_card';
    var m = document.createElement('div');
    m.className = 'jamc_msg';
    m.textContent = msg;
    var row = document.createElement('div');
    row.className = 'jamc_row';
    var noBtn = document.createElement('button');
    noBtn.className = 'jamc_cancel';
    noBtn.textContent = 'Cancel';
    var yesBtn = document.createElement('button');
    yesBtn.className = 'jamc_yes';
    yesBtn.textContent = yesLabel || 'OK';
    function close() { ov.remove(); }
    noBtn.addEventListener('click', close);
    yesBtn.addEventListener('click', function () { close(); onYes(); });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    row.appendChild(noBtn); row.appendChild(yesBtn);
    card.appendChild(m); card.appendChild(row);
    ov.appendChild(card);
    document.body.appendChild(ov);
  }

  // my_recs — recordings this device successfully registered. Registry writes
  // built on a stale CDN read used to drop earlier rows (each new recording
  // overwrote the list with whatever the lagging CDN showed). Every display
  // AND every registry write unions this roster back in, so a recording that
  // reached the cloud can never silently leave the session list again.
  var MY_KEY = 'vampjam_my_recs';
  function my_recs_get() {
    try {
      var arr = JSON.parse(localStorage.getItem(MY_KEY) || '[]');
      if (!Array.isArray(arr)) return [];
      return arr.filter(function (m) { return m && m.page; }).slice(-40);
    } catch (e) { return []; }
  }
  function my_recs_remove(page) {
    try {
      localStorage.setItem(MY_KEY, JSON.stringify(
        my_recs_get().filter(function (m) { return m.page !== page; })));
    } catch (e) {}
  }
  function reg_union(list) {
    var have = {};
    list.forEach(function (s2) { if (s2 && s2.page) have[s2.page] = true; });
    my_recs_get().forEach(function (m) {
      if (!have[m.page] && !deleted_has(m.page)) {
        list.push({ page: m.page, name: m.name, date: m.date, dur: m.dur || 0, count: m.count || 0 });
      }
    });
    return list;
  }
  // dur_overlay — this device caches every real duration it learns (a played
  // session's metadata, a probed orphan) under vampjam_dur_<page>; every
  // registry write carries those corrections cloudward, so estimated or
  // missing durations improve on their own.
  function dur_overlay(list) {
    list.forEach(function (s2) {
      if (!s2 || !s2.page) return;
      try {
        var cv = parseInt(localStorage.getItem('vampjam_dur_' + s2.page) || '0', 10);
        if (cv > 0 && Math.abs(cv - (s2.dur || 0)) > 2) s2.dur = cv;
      } catch (e) {}
    });
    return list;
  }
  // freshest possible registry — the GitHub API sees a commit instantly while
  // the raw CDN can lag minutes. Used before every registry WRITE only (the
  // API is rate-limited); plain display reads stay on the raw CDN.
  function reg_fresh() {
    return fetch('https://api.github.com/repos/mPulseMedia/vampjam/contents/sessions_auto.json?ref=main&t=' + Date.now(),
      { headers: { Accept: 'application/vnd.github.raw+json' }, cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('api ' + r.status); return r.json(); })
      .then(function (j) { if (!Array.isArray(j)) throw new Error('api shape'); return j; })
      .catch(function () {
        return fetch('https://raw.githubusercontent.com/mPulseMedia/vampjam/main/sessions_auto.json?v=' + Date.now(), { cache: 'no-store' })
          .then(function (r) { return r.ok ? r.json() : []; })
          .then(function (j) { return Array.isArray(j) ? j : []; })
          .catch(function () { return []; });
      });
  }

  var ICO_NEW = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>';
  var ICO_HEART_M = '<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M12 20.3l-1.2-1.1C6.2 15.1 3.2 12.4 3.2 9.1c0-2.6 2-4.6 4.6-4.6 1.5 0 2.9.7 3.8 1.8.9-1.1 2.3-1.8 3.8-1.8 2.6 0 4.6 2 4.6 4.6 0 3.3-3 6-7.6 10.1L12 20.3z"/></svg>';
  var ICO_TRASH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V4.8A0.8 0.8 0 0 1 9.8 4h4.4a0.8 0.8 0 0 1 0.8 0.8V7"/><path d="M6.5 7l0.9 12.2A1.6 1.6 0 0 0 9 20.6h6a1.6 1.6 0 0 0 1.6-1.4L17.5 7"/><path d="M10 11v6M14 11v6"/></svg>';
  var HERE = (location.pathname.split('/').pop() || '');
  // On the generic session page (session.html?p=<id>) the identity includes the
  // recording id, so duration cache + current-row detection stay per-recording.
  var PKEY = (function () {
    var m = /[?&](p|local)=([A-Za-z0-9_\-]+)/.exec(location.search);
    return m ? HERE + '?' + m[1] + '=' + m[2] : HERE;
  })();

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt_dur(s) { s = Math.round(s || 0); if (!s) return ''; var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h > 0 ? h + ':' + pad(m) : m + 'm'; }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function build_menu() {
    var menu = document.querySelector('.session_drawer .jam_menu');
    if (!menu || !window.VAMPJAM_SESSIONS) return;   // no manifest -> keep static markup
    // merge the static manifest with auto-registered recordings (sessions_auto.json),
    // oldest first by date so the drawer keeps newest at the bottom
    var autos = (window.VAMPJAM_SESSIONS_AUTO || []).slice();
    var locals = (window.VAMPJAM_SESSIONS_LOCAL || []).slice();
    // one row per recording: if the cloud row for a local copy is fully
    // registered, the cloud row wins; while it's only a placeholder (or
    // absent), the local row wins and its placeholder twin is hidden
    var autoByPage = {};
    autos.forEach(function (a2) { autoByPage[a2.page] = a2; });
    locals = locals.filter(function (L) {
      var twin = L.cloudPage && autoByPage[L.cloudPage];
      return !(twin && !twin.pending);
    });
    var localCloud = {};
    locals.forEach(function (L) { if (L.cloudPage) localCloud[L.cloudPage] = true; });
    autos = autos.filter(function (a2) { return !(a2.pending && localCloud[a2.page]); });
    // a placeholder that never resolved stops breathing after 30 min
    autos = autos.map(function (a2) {
      if (a2.pending && a2.ts && (Date.now() - a2.ts) > 30 * 60 * 1000) {
        a2 = Object.assign({}, a2); delete a2.pending;
      }
      return a2;
    });
    var all = window.VAMPJAM_SESSIONS.concat(autos).concat(locals);
    all = all.filter(function (s2) { return !deleted_has(s2.page) || deleting[s2.page]; });
    var pend = pending_get();
    var pendDone = (pend && pend.done) ? pend.page : null;
    if (pend) {
      var hit = null;
      all.forEach(function (s2) { if (s2.page === pend.page) hit = s2; });
      if (hit && !hit.pending) { pending_clear(); pend = null; pendDone = null; }
      else if (!hit) all = all.concat([Object.assign({}, pend, pend.done ? {} : { _pending: true })]);
    }
    all = all.slice().sort(function (x, y) { return x.date < y.date ? 1 : x.date > y.date ? -1 : 0; });   // newest first
    // list_order: Favorites on top, then New recording, then sessions
    // newest-first, with Admin tucked at the bottom
    var rows = [];
    var favSeen = false;
    try { favSeen = localStorage.getItem('vampjam_fav_seen') === '1'; } catch (eF) {}
    if (favSeen) {
      var favCur = (PKEY === 'favorites.html') ? ' current' : '';
      rows.push('<div class="jam_item' + favCur + '"><a class="jam_link' + favCur + '" href="favorites.html">'
        + '<span class="jam_left"><span class="jam_ico">' + ICO_HEART_M + '</span><span class="jam_name">Favorites</span></span></a></div>');
    }
    rows.push('<div class="jam_item jam_new"><a class="jam_link" href="record.html">'
      + '<span class="jam_left"><span class="jam_ico">' + ICO_NEW + '</span><span class="jam_name">New recording</span></span></a></div>');
    all.forEach(function (s) {
      var cur = (s.page === PKEY) ? ' current' : '';
      var dur = s.dur;
      try { var ov = localStorage.getItem('vampjam_dur_' + s.page); if (ov) dur = parseInt(ov, 10); } catch (e) {}
      // dur_align: duration and moment count are two fixed right-aligned
      // columns, so every duration lines up regardless of the count's width
      var right = '<span class="jam_dur">' + fmt_dur(dur) + '</span>'
                + '<span class="jam_count">' + (s.count || '') + '</span>';
      if ((s._pending || s.pending) && s.page !== pendDone) right = '<span class="jam_sync">syncing…</span>';
      // naming convention: date first, then the time (default recordings) or the
      // venue name — and the row shows exactly the session's title
      var disp = (s.name && String(s.name).indexOf(s.date) >= 0) ? s.name : (s.date + ' ' + s.name);
      var isAuto = s.page.indexOf('session.html?p=') === 0;
      var isLocal = !!s._local;
      if (isLocal) right = fmt_dur(s.dur) + ' <span class="jam_localb">local</span>';
      var isDel = !!deleting[s.page];
      var del = isDel
        ? '<span class="jam_spin" aria-label="Deleting…"></span>'
        : (isLocal
          ? '<button class="jam_del" data-local="' + s.page.split('local=')[1] + '" data-page="' + s.page + '" data-name="' + esc(disp) + '" aria-label="Delete this local recording">' + ICO_TRASH + '</button>'
          : (isAuto
            ? '<button class="jam_del" data-page="' + s.page + '" data-name="' + esc(disp) + '" aria-label="Delete this session">' + ICO_TRASH + '</button>'
            // dur_align: rows without a trash can reserve its slot, so every
            // row's duration column ends on the same right edge
            : '<span class="jam_del_sp"></span>'));
      rows.push('<div class="jam_item' + cur + (isDel ? ' jam_deleting' : '') + '"><a class="jam_link' + cur + '" href="' + s.page + '">'
        + '<span class="jam_left"><span class="jam_ico">' + ICO_CASS + '</span>'
        + '<span class="jam_name">' + esc(disp) + '</span></span>'
        + '<span class="menu_sub">' + right + '</span></a>'
        + '<button class="jam_share" data-href="' + s.page + '" aria-label="Copy link to this session">' + ICO_SHARE + '</button>' + del + '</div>');
    });
    rows.push('<div class="jam_item jam_admin"><a class="jam_link" href="admin.html">'
      + '<span class="jam_left"><span class="jam_ico">' + ICO_GEAR + '</span><span class="jam_name">Admin</span></span>'
      + '<span class="menu_sub">setup</span></a></div>');
    menu.innerHTML = rows.join('');
  }

  // remember this session for the index; cache its duration going forward
  try { localStorage.setItem('vampjam_last_session', PKEY); } catch (e) {}
  function capture_dur() {
    var pl = document.getElementById('player');
    if (!pl) return;
    pl.addEventListener('loadedmetadata', function () {
      if (isFinite(pl.duration) && pl.duration > 0) {
        try { localStorage.setItem('vampjam_dur_' + PKEY, Math.round(pl.duration)); } catch (e) {}
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
    // delete button (auto sessions only): themed confirm pop-up, then remove
    // from the shared registry and tombstone the session json. The audio file stays in
    // the R2 bucket for now (removing it needs an upload-worker change).
    Array.prototype.forEach.call(menu.querySelectorAll('.jam_del'), function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var loc = b.getAttribute('data-local');
        if (loc) {
          var nm = b.getAttribute('data-name');
          drawer_confirm('Delete "' + nm + '"?\n\nThis recording only exists on this device — deleting it is final.', 'Delete', function () {
            var pg = b.getAttribute('data-page');
            deleting[pg] = true; build_menu(); wire_links();
            idb_delete_local(loc, function () {
              delete deleting[pg];
              window.VAMPJAM_SESSIONS_LOCAL = (window.VAMPJAM_SESSIONS_LOCAL || []).filter(function (s2) { return s2.page !== pg; });
              build_menu(); wire_links();
              if (typeof window.toast === 'function') window.toast('Deleted ' + nm);
            });
          });
          return;
        }
        delete_session(b.getAttribute('data-page'), b.getAttribute('data-name'));
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
    // split_land: in the landscape split view the right pane (highlights)
    // holds still — drawer gestures only start on the left half
    if (window.matchMedia('(orientation: landscape) and (pointer: coarse) and (max-height: 520px)').matches &&
        e.target && e.target.closest && e.target.closest('.tag_list')) { drag = null; return; }
    if (d.classList.contains('open')) {
      // swipe up to close (only once the list itself is at its own top)
      drag = { mode: 'close', y0: t.clientY, x0: t.clientX, active: false };
      return;
    }
    if (window.scrollY > 0) { drag = null; return; }                 // not at top -> plain scroll
    if (Date.now() - last_scroll_at < SETTLE_MS) { drag = null; return; } // just scrolled -> stop at top
    var tg = e.target;
    if (tg && tg.closest) {
      if (tg.closest('.seek_bar')) { drag = null; return; }          // don't hijack the seek bar
      var ed = tg.closest('input, textarea, [contenteditable]');
      if (ed && ed === document.activeElement) { drag = null; return; } // actively editing -> leave it
      // note: highlight titles are readonly inputs; a pull that starts on one
      // should reveal the drawer just like the control region does
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

  // land_drawer: in the landscape split the sheet covers the Sessions button,
  // so a tap OUTSIDE the open sheet (e.g. the right half) closes it.
  var SPLIT_MQ = '(orientation: landscape) and (pointer: coarse) and (max-height: 520px)';
  document.addEventListener('click', function (e) {
    var d = drawer();
    if (!d || !d.classList.contains('open')) return;
    if (!window.matchMedia(SPLIT_MQ).matches) return;
    if (d.contains(e.target)) return;
    var c = caret(); if (c && c.contains(e.target)) return;
    set_open(false);
  }, true);

  window.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd, { passive: true });
  window.addEventListener('touchcancel', onEnd, { passive: true });

  // the syncing… text breathes so it reads as 'working', not stuck
  (function () {
    var st = document.createElement('style');
    st.textContent = '@keyframes jam_sync_pulse{0%,100%{opacity:0.35}50%{opacity:0.9}}' +
      '.jam_sync{animation:jam_sync_pulse 1.6s ease-in-out infinite;font-size:13px;}' +
      '.jam_del{flex:0 0 auto;background:none;border:none;color:var(--muted);opacity:0.5;' +
        'padding:6px;margin-left:2px;min-height:32px;cursor:pointer;line-height:0;}' +
      '.jam_del:hover{opacity:1;color:var(--danger,#c75450);}' +
      '.jam_item .menu_sub{min-width:84px;display:inline-flex;justify-content:flex-end;text-align:right;' +
        'font-variant-numeric:tabular-nums;}' +
      '.jam_item .menu_sub .jam_dur{display:inline-block;min-width:48px;text-align:right;}' +
      '.jam_item .menu_sub .jam_count{display:inline-block;min-width:26px;text-align:left;margin-left:8px;}' +
      '.jam_del_sp{flex:0 0 auto;width:30px;}' +
      '.jamc_overlay{position:fixed;inset:0;z-index:120;background:rgba(0,0,0,0.5);' +
        'backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;}' +
      '.jamc_card{background:var(--panel);color:var(--fg);border-radius:14px;padding:20px 22px;' +
        'max-width:320px;width:84%;box-shadow:0 12px 40px rgba(0,0,0,0.45);}' +
      '.jamc_msg{margin-bottom:16px;font-size:16px;white-space:pre-line;}' +
      '.jamc_row{display:flex;gap:10px;justify-content:flex-end;}' +
      '.jamc_row button{border:none;border-radius:10px;padding:10px 16px;font-size:15px;cursor:pointer;}' +
      '.jamc_cancel{background:var(--panel_3);color:var(--fg);}' +
      '.jamc_yes{background:var(--danger,#c75450);color:#fff;}' +
      '.jam_localb{background:rgba(232,180,84,0.22);color:var(--warn,#8a6d1a);border-radius:999px;' +
        'padding:2px 8px;font-size:11px;font-weight:600;margin-left:4px;}' +
      '.jam_item.jam_deleting{opacity:0.45;}' +
      '.jam_item.jam_deleting .jam_link{pointer-events:none;}' +
      '@keyframes jam_spin_rot{to{transform:rotate(360deg)}}' +
      '.jam_spin{flex:0 0 auto;width:15px;height:15px;margin:6px 8px 6px 8px;border-radius:50%;' +
        'border:2px solid rgba(215,0,21,0.25);border-top-color:#d70015;' +
        'display:inline-block;animation:jam_spin_rot 0.8s linear infinite;}';
    document.head.appendChild(st);
  })();

  var auto_retry = 0;
  // recordings still on this device (recorded but not yet in the cloud) —
  // they list like any session, marked 'local', playable from the device copy
  function fetch_local_recs() {
    try {
      var rq = indexedDB.open('vampjam_rec', 1);
      rq.onupgradeneeded = function () {
        var db = rq.result;
        if (!db.objectStoreNames.contains('recs')) db.createObjectStore('recs', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('chunks')) db.createObjectStore('chunks', { keyPath: ['id', 'seq'] });
      };
      rq.onsuccess = function () {
        try {
          var g = rq.result.transaction('recs', 'readonly').objectStore('recs').getAll();
          g.onsuccess = function () {
            var arr = (g.result || [])
              .filter(function (m) { return m && m.state && m.state !== 'uploaded'; })
              .map(function (m) {
                return { page: 'session.html?local=' + m.id, name: m.label || m.date, date: m.date,
                         dur: m.dur || 0, count: (m.tags || []).length, _local: true, cloudPage: m.cloudPage || null };
              });
            window.VAMPJAM_SESSIONS_LOCAL = arr;
            if (arr.length) { build_menu(); wire_links(); reconcile_locals(); }
          };
        } catch (e) {}
      };
    } catch (e) {}
  }
  function idb_delete_local(id, done) {
    try {
      var rq = indexedDB.open('vampjam_rec', 1);
      rq.onsuccess = function () {
        try {
          var tx = rq.result.transaction(['recs', 'chunks'], 'readwrite');
          tx.objectStore('recs').delete(id);
          tx.objectStore('chunks').delete(IDBKeyRange.bound([id, 0], [id, Infinity]));
          tx.oncomplete = done;
        } catch (e) { done(); }
      };
      rq.onerror = function () { done(); };
    } catch (e) { done(); }
  }

  // if a row still says local but the cloud already has that recording,
  // clear the device copy and let the plain cloud row stand
  var reconciled = {};
  function reconcile_locals() {
    var autos = window.VAMPJAM_SESSIONS_AUTO || [];
    var locals = window.VAMPJAM_SESSIONS_LOCAL || [];
    locals.forEach(function (L) {
      if (!L.cloudPage) return;
      var locId = (L.page.split('local=')[1] || '');
      var recId = (L.cloudPage.split('p=')[1] || '');
      function clear_it() {
        idb_delete_local(locId, function () {
          window.VAMPJAM_SESSIONS_LOCAL = (window.VAMPJAM_SESSIONS_LOCAL || []).filter(function (s2) { return s2.page !== L.page; });
          build_menu(); wire_links();
        });
      }
      var twin = null;
      autos.forEach(function (a2) { if (a2.page === L.cloudPage) twin = a2; });
      if (twin && !twin.pending) { clear_it(); return; }
      if (!recId || reconciled[L.page]) return;
      reconciled[L.page] = true;   // the direct json check runs once per load
      fetch('https://raw.githubusercontent.com/mPulseMedia/vampjam/main/' + recId + '.json?v=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          // only clear when the cloud PROVABLY has the audio
          if (j && !j.deleted && j.audio && j.audio.url) clear_it();
        })
        .catch(function () {});
    });
  }

  function fetch_auto_sessions() {
    fetch('https://raw.githubusercontent.com/mPulseMedia/vampjam/main/sessions_auto.json?v=' + Date.now(),
          { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (arr) {
        if (!Array.isArray(arr)) arr = [];
        var raw = arr.slice();               // what the shared registry really shows
        arr = reg_union(arr);                // + this device's own recordings
        if (arr.length) {
          window.VAMPJAM_SESSIONS_AUTO = arr;
          build_menu(); wire_links();
          heal_registry(raw);
          reconcile_locals();
        }
        retry_if_pending();
      })
      .catch(function () { retry_if_pending(); });
  }
  function sync_write(path, content, message) {
    return fetch(SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: path, content: content, message: message })
    }).then(function (r) { if (!r.ok) throw new Error('sync ' + r.status); return r.json(); });
  }
  function delete_session(page, name) {
    // same themed pop-up as the highlight delete, not the native confirm
    drawer_confirm('Delete "' + name + '"?\n\nThis removes it from the session list everywhere. Its moments go with it.',
      'Delete', function () { delete_session_go(page, name); });
  }
  function delete_session_go(page, name) {
    deleted_add(page);      // remember locally FIRST — stale registry reads can't bring it back
    my_recs_remove(page);   // and this device stops vouching for it
    deleting[page] = true;
    build_menu(); wire_links();   // row stays, grayed, trash -> red spinner
    var id = (page.split('p=')[1] || '').replace(/[^A-Za-z0-9_\-]/g, '');
    // freshest registry first (GitHub API), so we don't resurrect or drop
    // someone else's new entry
    reg_fresh()
      .then(function (list) {
        list = dur_overlay(reg_union(list).filter(function (s2) { return s2 && s2.page !== page && !deleted_has(s2.page); }));
        return sync_write('sessions_auto.json', JSON.stringify(list, null, 2), 'delete ' + id)
          .then(function () {
            if (id) return sync_write(id + '.json', JSON.stringify({ deleted: true, tags: [] }, null, 2), 'tombstone ' + id);
          });
      })
      .then(function () {
        delete deleting[page];
        window.VAMPJAM_SESSIONS_AUTO = (window.VAMPJAM_SESSIONS_AUTO || []).filter(function (s2) { return s2.page !== page; });
        var pend = pending_get();
        if (pend && pend.page === page) pending_clear();
        build_menu(); wire_links();
        if (typeof window.toast === 'function') window.toast('Deleted ' + name);
      })
      .catch(function () {
        // the delete didn't land: restore the row and its trash button
        delete deleting[page];
        deleted_remove(page);
        build_menu(); wire_links();
        if (typeof window.toast === 'function') window.toast('Delete failed — try again');
        else window.alert('Delete failed — try again');
      });
  }
  // registry heal — one write per page load, only when the shared registry
  // visibly disagrees with this device: it still lists something we deleted,
  // or it LOST a recording this device registered (a stale-read write from
  // another upload clobbered it). The write starts from the freshest copy
  // (GitHub API), unions this device's roster in, and drops tombstoned rows.
  var healed = false;
  function heal_registry(arr) {
    if (healed) return;
    var needPurge = arr.some(function (s2) { return s2 && deleted_has(s2.page); });
    var missing = my_recs_get().filter(function (m) {
      return !deleted_has(m.page)
        && !(m.ts && Date.now() - m.ts < 90000)   // its own register write may still be landing
        && !arr.some(function (s2) { return s2 && s2.page === m.page; });
    });
    if (!needPurge && !missing.length) return;
    if (needPurge && !missing.length) {
      var dead = deleted_get();
      var newest = dead.reduce(function (m2, t) { return Math.max(m2, t.ts); }, 0);
      if (Date.now() - newest < 60000) return;   // give the delete's own write time to land
    }
    healed = true;
    reg_fresh()
      .then(function (fresh) {
        var out = dur_overlay(reg_union(fresh).filter(function (s2) { return s2 && !deleted_has(s2.page); }));
        return sync_write('sessions_auto.json', JSON.stringify(out, null, 2), 'heal registry');
      })
      .catch(function () { healed = false; });
  }

  // orphan_sweep — self-publish. A recording whose json + audio reached the
  // cloud but whose registry row got lost (or never landed) re-registers
  // itself: list the repo's json files (GitHub API), fetch the ones the
  // registry doesn't know, and re-add any that carry live audio. Missing or
  // zero durations get an approximation by reading just the audio metadata.
  // Runs at most every 6 hours per device; also pushes cached duration
  // corrections cloudward when anything else changed.
  var SWEEP_KEY = 'vampjam_sweep_ts';
  function probe_dur(url) {
    return new Promise(function (res) {
      try {
        var a = document.createElement('audio');
        a.preload = 'metadata';
        var done = false;
        function fin(v) { if (!done) { done = true; try { a.removeAttribute('src'); a.load(); } catch (e2) {} res(v); } }
        a.addEventListener('loadedmetadata', function () {
          fin(isFinite(a.duration) && a.duration > 0 ? Math.round(a.duration) : 0);
        });
        a.addEventListener('error', function () { fin(0); });
        setTimeout(function () { fin(0); }, 8000);
        a.src = url;
      } catch (e) { res(0); }
    });
  }
  function orphan_sweep() {
    try {
      var last = parseInt(localStorage.getItem(SWEEP_KEY) || '0', 10);
      if (Date.now() - last < 6 * 3600 * 1000) return;
      localStorage.setItem(SWEEP_KEY, String(Date.now()));
    } catch (e) { return; }
    fetch('https://api.github.com/repos/mPulseMedia/vampjam/contents/?ref=main&t=' + Date.now(),
          { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (items) {
        if (!Array.isArray(items)) return;
        var staticPages = {};
        (window.VAMPJAM_SESSIONS || []).forEach(function (s2) { staticPages[s2.page] = true; });
        return reg_fresh().then(function (fresh) {
          var before = JSON.stringify(fresh);
          var reg = {};
          fresh.forEach(function (s2) { if (s2 && s2.page) reg[s2.page] = true; });
          var cand = items
            .filter(function (it) { return it && it.type === 'file' && /\.json$/.test(it.name) && it.name !== 'sessions_auto.json'; })
            .map(function (it) { return it.name.slice(0, -5); })
            .filter(function (id) { return /^\d{4}_\d{2}_\d{2}/.test(id); })         // session ids start with a date
            .filter(function (id) { return !staticPages[id + '.html']; })            // static sessions live in sessions.js
            .filter(function (id) { var pg = 'session.html?p=' + id; return !reg[pg] && !deleted_has(pg); })
            .slice(0, 12);
          return Promise.all(cand.map(function (id) {
            return fetch('https://raw.githubusercontent.com/mPulseMedia/vampjam/main/' + id + '.json?v=' + Date.now(), { cache: 'no-store' })
              .then(function (r) { return r.ok ? r.json() : null; })
              .then(function (j) {
                if (!j || j.deleted || !j.audio || !j.audio.url) return null;
                return { page: 'session.html?p=' + id, name: (j.audio.label || id),
                         date: id.slice(0, 10).replace(/_/g, '-'), dur: 0,
                         count: (j.tags || []).length, _url: j.audio.url };
              })
              .catch(function () { return null; });
          })).then(function (found) {
            found = found.filter(Boolean);
            // approximate durations: found orphans + registry rows still at 0
            var zero = fresh.filter(function (s2) {
              var pg = s2 && s2.page, id2 = pg && (pg.split('p=')[1] || '');
              return id2 && !s2.dur && !localStorage.getItem('vampjam_dur_' + pg);
            }).slice(0, Math.max(0, 6 - found.length));
            var probes = found.map(function (f) {
              return probe_dur(f._url).then(function (dv) {
                if (dv) { f.dur = dv; try { localStorage.setItem('vampjam_dur_' + f.page, String(dv)); } catch (e3) {} }
                delete f._url; return f;
              });
            }).concat(zero.map(function (s2) {
              var id2 = s2.page.split('p=')[1];
              return fetch('https://raw.githubusercontent.com/mPulseMedia/vampjam/main/' + id2 + '.json?v=' + Date.now(), { cache: 'no-store' })
                .then(function (r) { return r.ok ? r.json() : null; })
                .then(function (j) { return (j && j.audio && j.audio.url) ? probe_dur(j.audio.url) : 0; })
                .then(function (dv) { if (dv) { try { localStorage.setItem('vampjam_dur_' + s2.page, String(dv)); } catch (e4) {} } })
                .catch(function () {});
            }));
            return Promise.all(probes).then(function () {
              var add = found.filter(function (f) { return !deleted_has(f.page); });
              if (add.length) {
                var disp = (window.VAMPJAM_SESSIONS_AUTO || []).slice();
                var have2 = {};
                disp.forEach(function (s2) { if (s2 && s2.page) have2[s2.page] = true; });
                add.forEach(function (f) { if (!have2[f.page]) disp.push(f); });
                window.VAMPJAM_SESSIONS_AUTO = disp;
                build_menu(); wire_links();
              }
              var out = dur_overlay(reg_union(fresh.concat(add)).filter(function (s2) { return s2 && !deleted_has(s2.page); }));
              if (JSON.stringify(out) === before) return;   // nothing to publish
              return sync_write('sessions_auto.json', JSON.stringify(out, null, 2),
                add.length ? 'sweep orphans' : 'dur refresh');
            });
          });
        });
      })
      .catch(function () {});
  }
  // while a pending recording hasn't appeared in the registry, keep checking
  function retry_if_pending() {
    var pend = pending_get();
    var autos = window.VAMPJAM_SESSIONS_AUTO || [];
    var registryPending = autos.some(function (s2) { return s2 && s2.pending; });
    if (pend && autos.some(function (s2) { return s2.page === pend.page && !s2.pending; })) {
      pending_clear(); build_menu(); wire_links(); pend = null;
    }
    if (!pend && !registryPending) return;
    if (auto_retry < 40) {
      auto_retry++;
      // first checks come quickly, then settle down
      setTimeout(fetch_auto_sessions, auto_retry < 6 ? 8000 : 20000);
    }
  }
  function boot() {
    build_menu(); wire_links(); capture_dur(); fetch_auto_sessions(); fetch_local_recs();
    // orphan_sweep waits out the first registry paint, then self-publishes
    // anything the cloud has that the list forgot (6h throttle inside)
    setTimeout(orphan_sweep, 4000);
    // arriving with #sessions (e.g. Back from the record screen) opens the list
    if (location.hash === '#sessions') {
      setTimeout(function () { set_open(true); }, 150);
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

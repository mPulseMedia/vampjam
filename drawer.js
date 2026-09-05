// vampjam_drawer — the session surface that slides down from the top edge.
// Open it three ways:
//   1. tap the caret (top-left),
//   2. when the page is at rest at the very top, swipe DOWN to pull the surface in,
//   3. when the surface is open, swipe UP to push it back — either from the
//      control_panel below it (logo, player, transport), or from inside the list
//      once it has been scrolled to its own BOTTOM (list_swipe).
// If you are not at the top, a downward swipe is just a normal scroll.
// Clicking a session collapses the drawer (page slides back up) before nav.
(function () {
  var OPEN_FRACTION = 0.80;                 // matches .session_drawer.open max-height: 80dvh
                                            // (control_panel — wordmark down through the transport —
                                            // is pushed down in one solid piece; its top shows
                                            // in the lower 20%)
  var SETTLE_MS = 350;                      // rest-at-top time required before a pull reveals
  function drawer() { return document.getElementById('session_drawer'); }
  function caret()  { return document.getElementById('drawer_toggle'); }
  function maxOpenPx() { return Math.round(window.innerHeight * OPEN_FRACTION); }

  function update_sess_overflow() {
    var d = drawer(); if (!d) return;
    // shadow the session card's bottom only when the list is taller than the drawer
    d.classList.toggle('sess_overflow', d.classList.contains('open') && d.scrollHeight > d.clientHeight + 2);
  }
  // del_leave — deleting the session you are LOOKING AT used to leave you on a
  // corpse: a page whose audio and moments are gone, one swipe below the open
  // list. While that delete is in flight the list is pinned open, so there is
  // no way back down to the dead page; when it lands you are taken to the list
  // for real. Every close in this file funnels through set_open(false), so one
  // guard here covers the caret, the swipe, the tap-outside and close_then.
  var listPinned = false;
  function pin_list(on) {
    listPinned = on;
    try { document.body.classList.toggle('list_pinned', on); } catch (e) {}
    if (on) set_open(true);
  }
  function set_open(on) {
    if (!on && listPinned) return;
    var d = drawer(); if (!d) return;
    d.classList.toggle('open', on);
    // control_panel — the page below the open list stays in normal flow, so the
    // whole player (wordmark through transport) moves as one solid piece;
    // the body class stays available as a styling hook
    try { document.body.classList.toggle('drawer_open', on); } catch (eB) {}
    var c = caret(); if (c) c.classList.toggle('open', on);
    var lo = low(); if (lo) lo.classList.toggle('open', on);
    if (fold_ok()) { fold_go(on); return; }
    // newest-first: the panel always opens scrolled to the top
    if (on) { setTimeout(function () { update_sess_overflow(); d.scrollTop = 0; }, 250); }
    else { d.classList.remove('sess_overflow'); }
  }
  window.addEventListener('resize', update_sess_overflow);

  // ---- list_fold: the page collapses under its own row in the list ---------
  // Opening the list used to push the whole page down and park it below the
  // rows, which said "here is a list, and your page is somewhere under it".
  // It never said WHERE. The list already knows: one of its rows IS this page.
  // So the page now folds shut into that row — rows above it hold still, rows
  // below it ride up into the space — and what you are left looking at is the
  // list with your row still lit in the middle of it.
  //
  // The shape that makes this possible: everything after the drawer is wrapped
  // once, at boot, in #fold_page, and a SECOND drawer (#session_low) carries
  // the rows that come after the current one. So the DOM reads top-of-list,
  // page, rest-of-list — which is what the picture is.
  var SPLIT_MQ_F = '(orientation: landscape) and (pointer: coarse) and (max-height: 520px)';
  function fold_page() { return document.getElementById('fold_page'); }
  function low()       { return document.getElementById('session_low'); }
  function fold_ok() {
    // the landscape split opens its own fixed sheet over the left half, and
    // index-as-list has no page under it to fold. Both keep the old behaviour.
    if (window.VAMPJAM_LIST_HOME) return false;
    if (window.matchMedia(SPLIT_MQ_F).matches) return false;
    return !!fold_page();
  }
  function fold_build() {
    var d = drawer();
    if (!d || !d.parentNode || document.getElementById('fold_page')) return;
    var w = document.createElement('div');
    w.id = 'fold_page';
    d.parentNode.insertBefore(w, d.nextSibling);
    // every already-executed script comes along too; moving a script that has
    // run does not run it again, and by DOMContentLoaded they all have.
    while (w.nextSibling) w.appendChild(w.nextSibling);
    var lo = document.createElement('div');
    lo.id = 'session_low';
    lo.className = 'session_drawer session_low';
    lo.innerHTML = '<div class="jam_menu"></div>';
    w.parentNode.appendChild(lo);
  }
  var foldH = null;                       // natural heights, measured per gesture
  function fold_measure() {
    var d = drawer(), lo = low(), fp = fold_page();
    var tm = d && d.querySelector('.jam_menu'), lm = lo && lo.querySelector('.jam_menu');
    return {
      // +12 for .jam_menu's own top margin, which is outside scrollHeight
      top:  tm ? tm.scrollHeight + 12 : 0,
      low:  (lm && lm.children.length) ? lm.scrollHeight : 0,
      page: fp ? fp.scrollHeight : 0
    };
  }
  // k is the whole animation: 0 = the page, 1 = the list. Rows grow by k, the
  // page shrinks by the same k, so the two are always exactly the one motion.
  function fold_apply(k) {
    var d = drawer(), lo = low(), fp = fold_page();
    if (!d || !fp || !foldH) return;
    d.style.maxHeight = Math.round(foldH.top * k) + 'px';
    // fold_anchor — clipping a shrinking box takes the BOTTOM off, which would
    // eat the lit row first and leave the rows above it sitting still. The rows
    // above are what should move. Sliding the menu up by exactly what the box
    // lost pins its bottom edge to the seam instead: the lit row rides the top
    // of the page all the way, and everything above it leaves upward.
    var tm = d.querySelector('.jam_menu');
    if (tm) tm.style.transform = 'translateY(' + Math.round(-foldH.top * (1 - k)) + 'px)';
    // fold_push — the rows BELOW are not shrunk, they are pushed. They keep
    // their real height the whole time and the growing page shoves them off the
    // bottom edge; folding back up, the page lets them come back to meet the
    // lit row. Shrinking them would have looked like they were being deleted.
    if (lo) lo.style.maxHeight = (foldH.low ? foldH.low + 'px' : '0px');
    fp.style.height = Math.round(foldH.page * (1 - k)) + 'px';
  }
  function fold_clear() {
    var d = drawer(), lo = low(), fp = fold_page();
    if (d) {
      d.style.maxHeight = '';
      var tm = d.querySelector('.jam_menu');
      if (tm) tm.style.transform = '';
    }
    if (lo) lo.style.maxHeight = '';
    if (fp) fp.style.height = '';
  }
  // ---- row_fly ------------------------------------------------------------
  // The lit row and the page's own <h1> are the SAME NAME in two places. So the
  // transition is not the page appearing near the row, it is that name moving
  // from where it sits in the list to where it sits on the page, and the list
  // and the page rearranging themselves around it.
  // It flies as one fixed clone, scaled from the row's type size up to the
  // title's, so the whole trip is one compositor transform.
  var FOLD_MS = 380;
  // fold_ease — slow off the mark, quicker as it goes. Paul asked for that
  // shape by name; the tail is eased just enough that it settles instead of
  // stopping dead, which is the part that would actually read as jarring.
  var FOLD_EASE = 'cubic-bezier(0.55, 0, 0.35, 1)';
  function name_el() {
    var d = drawer();
    var r = d && d.querySelector('.jam_item.current .jam_name');
    return r || null;
  }
  function title_el() {
    var fp = fold_page();
    return fp ? fp.querySelector('h1') : null;
  }
  function box(el) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    var cs = getComputedStyle(el);
    return { x: r.left, y: r.top, w: r.width, h: r.height,
             size: parseFloat(cs.fontSize) || 17, weight: cs.fontWeight, color: cs.color };
  }
  // a and b are measured in the two end states; the clone is drawn in b's
  // clothes and starts wearing a's position and scale.
  function fly(a, b, text) {
    if (!a || !b) return null;
    var c = document.createElement('div');
    c.className = 'fold_fly';
    c.textContent = text;
    var k = b.size ? (a.size / b.size) : 1;
    c.style.cssText = 'position:fixed;left:0;top:0;margin:0;padding:0;z-index:200;'
      + 'white-space:nowrap;pointer-events:none;transform-origin:left center;'
      + 'font-size:' + b.size + 'px;font-weight:' + b.weight + ';color:' + b.color + ';'
      + 'line-height:' + b.h + 'px;height:' + b.h + 'px;'
      + 'transition:transform ' + FOLD_MS + 'ms ' + FOLD_EASE + ';'
      + 'transform:translate(' + a.x + 'px,' + (a.y + a.h / 2 - b.h / 2) + 'px) scale(' + k + ')';
    document.body.appendChild(c);
    void c.offsetWidth;
    requestAnimationFrame(function () {
      c.style.transform = 'translate(' + b.x + 'px,' + b.y + 'px) scale(1)';
    });
    return c;
  }

  var foldT = null;
  function fold_go(on) {
    var b = document.body, d = drawer();
    if (!d) return;
    clearTimeout(foldT);
    if (b._fly) { try { b._fly.remove(); } catch (e0) {} b._fly = null; }
    foldH = fold_measure();
    var y0 = window.scrollY || 0;
    b.classList.add('fold_run', 'fold_jump');

    // both ends are measured before anything paints: put the layout in the END
    // state, read it, put it back, read that. Two forced reflows inside one
    // frame, which is cheaper than guessing where the title is going to land.
    fold_apply(on ? 1 : 0);
    if (on) window.scrollTo(0, 0);
    void d.offsetHeight;
    var endName = on ? box(name_el()) : null;
    var endTtl  = on ? null : box(title_el());

    fold_apply(on ? 0 : 1);
    window.scrollTo(0, on ? y0 : y0);
    void d.offsetHeight;
    var startTtl  = on ? box(title_el()) : null;
    var startName = on ? null : box(name_el());

    var ttl = title_el(), nm = name_el();
    var text = (ttl && ttl.textContent.trim()) || (nm && nm.textContent.trim()) || '';
    // shutting: the title flies down into its row. opening: the row flies up
    // into the title. Same clone, same curve, endpoints swapped.
    b._fly = on ? fly(startTtl, endName, text) : fly(startName, endTtl, text);
    if (b._fly) b.classList.add('fold_fly_on');

    b.classList.remove('fold_jump');
    requestAnimationFrame(function () { fold_apply(on ? 1 : 0); });
    foldT = setTimeout(function () {
      b.classList.remove('fold_run');
      b.classList.toggle('fold_on', !!on);
      fold_clear();
      if (on) window.scrollTo(0, 0);
      b.classList.remove('fold_fly_on');
      if (b._fly) { try { b._fly.remove(); } catch (e1) {} b._fly = null; }
    }, FOLD_MS);
  }

  // fold_in — the other direction, and it is the SAME animation run backwards.
  // Tapping a row does not close the list and then load a page; it hands the
  // next page a note saying "you were just opened from your own row", and that
  // page comes up folded shut at the same scroll position and unfolds. Both
  // screens are showing the identical list at the identical offset when the
  // swap happens, so the swap itself is the invisible part: what you see is the
  // row you tapped, and the page growing out of the gap under it.
  var FOLD_IN = 'vampjam_fold_in';
  function fold_in_arm(href) {
    try {
      sessionStorage.setItem(FOLD_IN, JSON.stringify({
        page: href, y: window.scrollY || 0, t: Date.now()
      }));
    } catch (e) {}
  }
  function fold_in_take() {
    var raw = null;
    try { raw = sessionStorage.getItem(FOLD_IN); sessionStorage.removeItem(FOLD_IN); } catch (e) {}
    if (!raw) return null;
    var n = null;
    try { n = JSON.parse(raw); } catch (e) { return null; }
    // a note goes stale the moment it could belong to some other navigation:
    // Back, a typed URL, a bookmark. Five seconds and the right page, or it is
    // not ours and the page opens the ordinary way.
    if (!n || Date.now() - n.t > 5000) return null;
    if (String(n.page).split('#')[0] !== PKEY) return null;
    return n;
  }
  // fold_ride — the rows above the tapped one collapse while the page grows,
  // so the whole list rides upward and the page has to arrive at its own top.
  // Left to the browser this is a clamp per frame that stops wherever the
  // document happens to get short enough; tweened, it lands on the page.
  function fold_ride(from, ms) {
    var t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / ms);
      // fold_ease again, by hand: slow away, quicker later
      var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      try { window.scrollTo(0, Math.round(from * (1 - e))); } catch (eS) {}
      if (k < 1) requestAnimationFrame(step);
    }
    if (from > 0) requestAnimationFrame(step);
  }
  // the folded state with no animation at all — the arriving page has to be
  // ALREADY shut on its first paint, or the unfold starts from a flash of page
  function fold_set_now(on) {
    var d = drawer(), lo = low(), b = document.body;
    if (!d) return;
    b.classList.add('fold_jump');
    d.classList.toggle('open', on);
    if (lo) lo.classList.toggle('open', on);
    var c = caret(); if (c) c.classList.toggle('open', on);
    try { b.classList.toggle('drawer_open', on); } catch (e) {}
    b.classList.toggle('fold_on', on);
    fold_clear();
    void d.offsetHeight;
    b.classList.remove('fold_jump');
  }

  function toggle() {
    var d = drawer(); if (!d) return;
    if (listPinned) return;
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
  // row_size — ONE size for every icon that sits in a list row: 29px, the size the
  // highlight rows already use. The session list had drifted to four different
  // numbers (25, 21, 24, 20) which is four conventions where there should be one.
  // The header pair stays at 26 — that is the other convention, and two is the
  // whole set.
  // The gear and the plus come along, because "most things follow the convention"
  // beats "these two are special for a reason nobody can see".
  var ICO_CASS = '<svg viewBox="0 0 24 24" width="29" height="29" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><circle cx="8" cy="12" r="2.2"/><circle cx="16" cy="12" r="2.2"/><path d="M10.2 12h3.6"/><path d="M7 18.5l1.6-2.5h6.8l1.6 2.5"/></svg>';
  var ICO_GEAR = '<svg viewBox="0 0 24 24" width="29" height="29" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M12 2.6l1.7 2.2 2.7-.7.4 2.8 2.5 1.2-1 2.6 1 2.6-2.5 1.2-.4 2.8-2.7-.7L12 21.4l-1.7-2.2-2.7.7-.4-2.8-2.5-1.2 1-2.6-1-2.6 2.5-1.2.4-2.8 2.7.7z"/></svg>';
  var ICO_SHARE = '<svg viewBox="0 0 24 24" width="29" height="29" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 14V4"/><path d="M8.5 7.3L12 3.8l3.5 3.5"/><path d="M6.6 11H6a1.6 1.6 0 0 0-1.6 1.6v5.8A1.6 1.6 0 0 0 6 20h12a1.6 1.6 0 0 0 1.6-1.6v-5.8A1.6 1.6 0 0 0 18 11h-.6"/></svg>';
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
      // last_drop — index.html reopens whatever you were last on. If that is the
      // page you just deleted, index sends you back to it, del_gone sends you
      // back to index, and the two bounce off each other for ever. A tombstoned
      // page stops being the last one you were on, in the same breath.
      if (localStorage.getItem('vampjam_last_session') === page) {
        localStorage.removeItem('vampjam_last_session');
      }
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
  // self-contained here so it works on every page that has the drawer.
  //
  // code_gate — pass a code and the Delete button will not arm until it is
  // typed. It is not security; it is a speed bump, and it exists only so that a
  // long recording cannot go in two taps. Anyone who wants the code can read it
  // in this file — that is fine, because the person it protects against is the
  // one who was not paying attention.
  function drawer_confirm(msg, yesLabel, onYes, code) {
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
    function go() { close(); onYes(); }
    var codeIn = null;
    if (code) {
      codeIn = document.createElement('input');
      codeIn.className = 'jamc_code';
      codeIn.type = 'text';
      codeIn.inputMode = 'numeric';
      codeIn.autocomplete = 'off';
      // code_hush — the pop-up must not print the code. It was in the placeholder
      // and in the aria-label, which made the speed bump a formality: read it,
      // type it back. The person this protects is the one who tapped by mistake,
      // and they are exactly the person the screen was telling.
      codeIn.setAttribute('aria-label', 'Confirmation code');
      codeIn.placeholder = 'code';
      yesBtn.disabled = true;
      function check() {
        var ok = codeIn.value.replace(/\s+/g, '') === code;
        yesBtn.disabled = !ok;
        codeIn.classList.toggle('ok', ok);
      }
      codeIn.addEventListener('input', check);
      codeIn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !yesBtn.disabled) go();
      });
      card.appendChild(m);
      card.appendChild(codeIn);
    } else {
      card.appendChild(m);
    }
    noBtn.addEventListener('click', close);
    yesBtn.addEventListener('click', function () { if (!yesBtn.disabled) go(); });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    row.appendChild(noBtn); row.appendChild(yesBtn);
    card.appendChild(row);
    ov.appendChild(card);
    document.body.appendChild(ov);
    if (codeIn) setTimeout(function () { codeIn.focus(); }, 30);
  }
  // long_rec — a recording past this needs the code. Five minutes: below it a
  // deletion is a tap you can afford to get wrong.
  var LONG_REC = 300;
  var DEL_CODE = '8764';
  function del_code_for(dur) { return (Number(dur) || 0) > LONG_REC ? DEL_CODE : null; }
  function dur_words(dur) {
    var s2 = Math.round(Number(dur) || 0);
    var mm = Math.floor(s2 / 60), hh = Math.floor(mm / 60);
    if (hh) return hh + 'h ' + (mm % 60) + 'm';
    return mm + ' min';
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

  // nav_pair — two more header glyphs, drawn to the header's idiom: 26px,
  // stroke 1.6, currentColor, no fills except where a fill IS the meaning.
  // ICO_FAVLIST — a heart with three rules beside it. Not a heart alone: this
  // goes to a LIST of favourites, and the row-heart on a moment already means
  // "favourite this". The lines are what say list.
  var ICO_FAVLIST = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.8 17.3C3.4 14.3 1.5 12.6 1.5 10.5c0-1.6 1.3-2.9 2.9-2.9 0.9 0 1.8 0.43 2.4 1.13 0.6-0.7 1.5-1.13 2.4-1.13 1.6 0 2.9 1.3 2.9 2.9 0 2.1-1.9 3.8-5.3 6.8z"/><path d="M15.4 8.4h7.1M15.4 12h7.1M15.4 15.6h7.1"/></svg>';
  // ICO_REC_H — the record glyph in the header's grey: a stroked ring with a
  // filled centre. The disc in the list was red because it was the only red
  // thing there; up here it is one of four icons and wears their colour.
  var ICO_REC_H = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.8" fill="currentColor" stroke="none"/></svg>';
  // ICO_NEW_ROW — the row's version, and it stays the solid red disc. Down here
  // it is the only red thing in a column of blue cassettes and it is the one row
  // that starts something rather than opening something; up there it is one of
  // four grey icons. Same idea, two drawings, on purpose.
  var ICO_NEW_ROW = '<svg viewBox="0 0 24 24" width="29" height="29" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>';
  // nav_state — the cassette, filled. Same silhouette as the outline it swaps
  // for, with the two reels and the tape between them knocked out in the page's
  // own background so it reads as a cassette and not a blob. It appears only
  // while audio on this page is actually playing.
  var ICO_CASS_ON = '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M5 5.5h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3z"/><circle cx="7.8" cy="12" r="2.7" fill="var(--bg)"/><circle cx="16.2" cy="12" r="2.7" fill="var(--bg)"/><rect x="10.1" y="11.4" width="3.8" height="1.2" rx="0.6" fill="var(--bg)"/><path d="M7 18.5l1.6-2.5h6.8l1.6 2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICO_HEART_M = '<svg viewBox="0 0 24 24" width="29" height="29" fill="currentColor" aria-hidden="true"><path d="M12 20.3l-1.2-1.1C6.2 15.1 3.2 12.4 3.2 9.1c0-2.6 2-4.6 4.6-4.6 1.5 0 2.9.7 3.8 1.8.9-1.1 2.3-1.8 3.8-1.8 2.6 0 4.6 2 4.6 4.6 0 3.3-3 6-7.6 10.1L12 20.3z"/></svg>';
  // row_x — the same X the highlight rows use for "remove this", instead of a
  // trash can. Two glyphs for one idea is one glyph too many, and the X is the one
  // he already reaches for. (The action is unchanged: it still deletes the
  // session, still behind the same confirmation.)
  var ICO_X = '<svg viewBox="0 0 24 24" width="29" height="29" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var HERE = (location.pathname.split('/').pop() || '');
  // On the generic session page (session.html?p=<id>) the identity includes the
  // recording id, so duration cache + current-row detection stay per-recording.
  var PKEY = (function () {
    var m = /[?&](p|local)=([A-Za-z0-9_\-]+)/.exec(location.search);
    return m ? HERE + '?' + m[1] + '=' + m[2] : HERE;
  })();

  // del_gone — and the same page must not be reachable a second time. Back, a
  // bookmark or a link into a session this device has already deleted lands on
  // the list instead of on an empty player.
  (function () {
    if (PKEY.indexOf('session.html') !== 0) return;   // only the generic player
    if (!deleted_has(PKEY)) return;
    location.replace('index.html#sessions');
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
    // list_title — the list gets a heading, the way any list of things does. It is
    // built as a jam_item so it inherits the row's height and gutters exactly, and
    // then told not to behave like one: no hover, no press, nothing to tap.
    // list_title — "Recordings", not "Sessions": every row under it is something
    // that was recorded, and the word the app uses for the act is Record.
    // both_ways — Favorites and New recording are in the header AND here. Taken
    // back: the header icons are the fast way, the rows are the way you find
    // them when you do not yet know the icons mean that. The two are not in
    // competition — a list you opened is a place to look things up.
    var curIdx = -1;                 // where the list folds: the row that is this page
    var rows = ['<div class="jam_item jam_title"><span class="jam_name">Recordings</span></div>'];
    rows.push('<div class="jam_item jam_new"><a class="jam_link" href="record.html">'
      + '<span class="jam_left"><span class="jam_ico">' + ICO_NEW_ROW + '</span><span class="jam_name">New recording</span></span></a></div>');
    var favSeen = false;
    try { favSeen = localStorage.getItem('vampjam_fav_seen') === '1'; } catch (eF) {}
    if (favSeen) {
      // fav_share — the Favorites row shares like a session row does: same
      // button, same slot, same handler (wire_links binds every .jam_share in
      // the menu). The empty menu_sub and del spacer keep its right edge lined
      // up with the sessions below.
      var favCur = (PKEY === 'favorites.html') ? ' current' : '';
      if (favCur) curIdx = rows.length;
      rows.push('<div class="jam_item' + favCur + '"><a class="jam_link' + favCur + '" href="favorites.html">'
        + '<span class="jam_left"><span class="jam_ico">' + ICO_HEART_M + '</span><span class="jam_name">Favorites</span></span></a>'
        + '<button class="jam_share" data-href="favorites.html" aria-label="Copy link to Favorites">' + ICO_SHARE + '</button>'
        + '<span class="menu_sub"></span><span class="jam_del_sp"></span></div>');
    }
    all.forEach(function (s) {
      var cur = (s.page === PKEY) ? ' current' : '';
      // dur_hide: rows show only the moment count — durations stay in the
      // registry data but are no longer displayed
      var right = '<span class="jam_count">' + (s.count || '') + '</span>';
      if ((s._pending || s.pending) && s.page !== pendDone) right = '<span class="jam_sync">syncing…</span>';
      // naming convention: date first, then the time (default recordings) or the
      // venue name — and the row shows exactly the session's title
      var disp = (s.name && String(s.name).indexOf(s.date) >= 0) ? s.name : (s.date + ' ' + s.name);
      var isAuto = s.page.indexOf('session.html?p=') === 0;
      var isLocal = !!s._local;
      if (isLocal) right = '<span class="jam_localb">local</span>';
      var isDel = !!deleting[s.page];
      var del = isDel
        ? '<span class="jam_spin" aria-label="Deleting…"></span>'
        : (isLocal
          ? '<button class="jam_del" data-local="' + s.page.split('local=')[1] + '" data-page="' + s.page + '" data-name="' + esc(disp) + '" data-dur="' + (s.dur || 0) + '" aria-label="Delete this local recording">' + ICO_X + '</button>'
          : (isAuto
            ? '<button class="jam_del" data-page="' + s.page + '" data-name="' + esc(disp) + '" data-dur="' + (s.dur || 0) + '" aria-label="Delete this session">' + ICO_X + '</button>'
            // dur_align: rows without a trash can reserve its slot, so every
            // row's duration column ends on the same right edge
            : '<span class="jam_del_sp"></span>'));
      // share_left: the share button sits just left of the duration column
      if (cur) curIdx = rows.length;
      rows.push('<div class="jam_item' + cur + (isDel ? ' jam_deleting' : '') + '"><a class="jam_link' + cur + '" href="' + s.page + '">'
        + '<span class="jam_left"><span class="jam_ico">' + ICO_CASS + '</span>'
        + '<span class="jam_name">' + esc(disp) + '</span></span></a>'
        + '<button class="jam_share" data-href="' + s.page + '" aria-label="Copy link to this session">' + ICO_SHARE + '</button>'
        + '<span class="menu_sub">' + right + '</span>' + del + '</div>');
    });
    rows.push('<div class="jam_item jam_admin"><a class="jam_link" href="admin.html">'
      + '<span class="jam_left"><span class="jam_ico">' + ICO_GEAR + '</span><span class="jam_name">Admin</span></span>'
      + '<span class="menu_sub">setup</span></a></div>');
    // fold_split — the rows above the current one stay in the top drawer, the
    // rows below it go to the low one, and the page sits in the gap between.
    // No current row (a page the list does not name) means no split, and the
    // list behaves exactly as it did before.
    var lowMenu = document.querySelector('#session_low .jam_menu');
    var split = fold_ok() && curIdx > 0 && !!lowMenu;
    if (split) {
      menu.innerHTML = rows.slice(0, curIdx + 1).join('');
      lowMenu.innerHTML = rows.slice(curIdx + 1).join('');
    } else {
      menu.innerHTML = rows.join('');
      if (lowMenu) lowMenu.innerHTML = '';
    }
    try { document.body.classList.toggle('fold_split', !!split); } catch (eS) {}
  }

  // remember this session for the index; cache its duration going forward
  if (!deleted_has(PKEY)) { try { localStorage.setItem('vampjam_last_session', PKEY); } catch (e) {} }
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
    var menus = document.querySelectorAll('.session_drawer .jam_menu');
    if (!menus.length) return;
    var menu = { querySelectorAll: function (sel) {
      var out = [];
      Array.prototype.forEach.call(menus, function (m) {
        Array.prototype.push.apply(out, m.querySelectorAll(sel));
      });
      return out;
    } };
    Array.prototype.forEach.call(menu.querySelectorAll('a[href]'), function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        e.preventDefault();
        // fold_back — the lit row is the page you are standing on. Folded open,
        // tapping it is not navigation, it is unfolding: the list opens back up
        // around the page it came from. Reloading yourself would be the wrong
        // answer to "take me back to where I was".
        if (a.classList.contains('current') && document.body.classList.contains('fold_on')) {
          set_open(false); return;
        }
        // fold_in — from an open list, do NOT play a close animation first.
        // The next page is going to unfold from this exact row at this exact
        // scroll, so anything that moves here is motion the swap has to undo.
        var d0 = drawer();
        if (d0 && d0.classList.contains('open')) {
          fold_in_arm(href);
          window.location.href = href;
          return;
        }
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
        var durB = b.getAttribute('data-dur');
        var codeB = del_code_for(durB);
        if (loc) {
          var nm = b.getAttribute('data-name');
          // ask_short — the question and, when it is gated, the one fact that
          // stops the mistake: how long the thing is. The paragraph explaining
          // what deleting means was read once and skipped for ever after.
          drawer_confirm('Delete "' + nm + '"?'
            + (codeB ? '\n\n' + dur_words(durB) + '. Enter the code.' : ''),
            'Delete', function () {
            var pg = b.getAttribute('data-page');
            var onIt = (pg === PKEY);   // del_leave: this is the page under the list
            if (onIt) { deleted_add(pg); pin_list(true); }
            deleting[pg] = true; build_menu(); wire_links();
            idb_delete_local(loc, function () {
              delete deleting[pg];
              window.VAMPJAM_SESSIONS_LOCAL = (window.VAMPJAM_SESSIONS_LOCAL || []).filter(function (s2) { return s2.page !== pg; });
              build_menu(); wire_links();
              if (onIt) { location.replace('index.html#sessions'); return; }
              if (typeof window.toast === 'function') window.toast('Deleted ' + nm);
            });
          }, codeB);
          return;
        }
        delete_session(b.getAttribute('data-page'), b.getAttribute('data-name'), durB);
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

  // nav_share — the page's own share button, wired once here rather than nine
  // times in nine pages. It copies the page's URL with no query on it: this is
  // "here is this session" / "here is my favourites", not "here is this second".
  // Every page already loads drawer.js, so this is the cheapest place for it to
  // live and the only place it has to be kept right.
  // drawer.js is loaded in <head>, so the button does not exist yet when this
  // runs — wait for the document before looking for it. (It did not, and the
  // button was inert while looking perfectly correct in every other respect.)
  // nav_cass — the cassette in the top left opens the session list, and it is the
  // only thing that has to know that. Wired here beside the share for the same
  // reason: one place, ten pages.
  function wire_page_sessions() {
    var b = document.getElementById('page_sessions');
    if (!b) return;
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggle(); });
  }
  function wire_page_share() {
    var b = document.getElementById('page_share');
    if (!b) return;
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      // the whole query goes, not just the timestamp: this button is "here is this
      // session", and if you arrived on a deep link the tag id is as much a
      // moment as the seconds are. Sharing a moment is the row's own button.
      var url = window.location.origin + window.location.pathname;
      try { if (navigator.clipboard) navigator.clipboard.writeText(url); } catch (err) {}
      // nav_state — the button says it took. A toast says it too, but the toast
      // is at the bottom of the screen and your thumb is at the top.
      share_hit(b);
      if (typeof window.toast === 'function') window.toast('Link copied: ' + url);
    });
  }
  // share_hit — dark green for a moment, then back. Green because it is the one
  // colour in this header that means "done" rather than "here" (blue) or
  // "recording" (red), and a copy is a thing that finished.
  function share_hit(b) {
    if (!b) return;
    b.classList.add('nav_hit');
    clearTimeout(b._hitT);
    b._hitT = setTimeout(function () { b.classList.remove('nav_hit'); }, 1200);
  }
  window.vampjamShareHit = share_hit;
  // nav_pair — the two new header buttons are INJECTED, not written into
  // fifteen files. The cassette and the share already live here in spirit (both
  // are wired from this file); these two live here outright. A page never links
  // to itself: favourites has no favourites button, record has no record button.
  function nav_add() {
    var head = document.querySelector('.brand');
    if (!head) return;
    var cass  = head.querySelector('.nav_cass');
    var share = head.querySelector('.nav_share');

    // here_lit — the icon for the page you are ON is shown and coloured, not
    // blanked. It was hidden-but-holding-its-slot, which kept the wordmark
    // centred but wasted the one place that could say where you are. Lit, it
    // does both. It stops being a link (there is nowhere to go) and says so to
    // a screen reader with aria-current.
    function nav_mark(el, here) {
      if (!here) return el;
      el.classList.add('nav_on');
      el.removeAttribute('href');
      el.setAttribute('aria-current', 'page');
      el.title = el.getAttribute('aria-label') + ' — you are here';
      return el;
    }
    if (cass && !head.querySelector('.nav_fav')) {
      var f = document.createElement('a');
      f.className = 'nav_cass nav_fav';
      f.href = 'favorites.html';
      f.setAttribute('aria-label', 'Favorites');
      f.title = 'Favorites';
      f.innerHTML = ICO_FAVLIST;
      cass.insertAdjacentElement('afterend', nav_mark(f, HERE === 'favorites.html'));
    }
    if (!head.querySelector('.nav_rec')) {
      var r = document.createElement('a');
      r.className = 'nav_share nav_rec';
      r.href = 'record.html';
      r.setAttribute('aria-label', 'New recording');
      r.title = 'New recording';
      r.innerHTML = ICO_REC_H;
      nav_mark(r, HERE === 'record.html');
      if (share) share.insertAdjacentElement('beforebegin', r);
      else head.appendChild(r);
    }
  }
  // cass_live — the header cassette fills while this page's audio is playing.
  // One listener pair on the page's own <audio>; pages without one (record,
  // admin) simply never light it.
  function wire_cass_live() {
    var cass = document.querySelector('.brand .nav_cass:not(.nav_fav)');
    var au = document.getElementById('player');
    if (!cass || !au) return;
    var off = cass.innerHTML;
    function paint() {
      var on = !au.paused && !au.ended && au.currentTime > 0;
      cass.classList.toggle('cass_live', on);
      cass.innerHTML = on ? ICO_CASS_ON : off;
    }
    ['play', 'pause', 'ended', 'emptied'].forEach(function (e) { au.addEventListener(e, paint); });
    paint();
  }
  function wire_header() { nav_add(); wire_page_sessions(); wire_page_share(); wire_cass_live(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire_header);
  } else {
    wire_header();
  }

  // name_roll — the row you are on runs its name through its own width, slowly,
  // the same way the selected highlight's title does on a session page. Session
  // names are long and the list is narrow, so the row you most want to read whole
  // is the one that is truncated. (The session pages carry their own copy of this
  // loop for their own rows; the two scripts share no module, and one small loop
  // twice is better than a module boundary invented to hold twenty lines.)
  // The position is kept as a FLOAT and assigned each frame: at this pace a frame
  // is a fraction of a pixel, and reading scrollLeft back rounds it away.
  var NAME_PXPS = 16, NAME_HOLD = 1400;
  (function name_roll() {
    var el = null, dir = 1, phase = 0, last = 0, pos = 0;
    function tick(now) {
      requestAnimationFrame(tick);
      var d = drawer();
      var field = (d && d.classList.contains('open'))
        ? d.querySelector('.jam_item.current .jam_name') : null;
      if (field !== el) { el = field; dir = 1; phase = NAME_HOLD; pos = 0; last = now; if (el) el.scrollLeft = 0; }
      if (!el) return;
      var over = el.scrollWidth - el.clientWidth;
      if (over <= 2) { pos = 0; el.scrollLeft = 0; last = now; return; }
      var dt = Math.min(120, now - last); last = now;
      if (phase > 0) { phase -= dt; return; }
      pos += dir * NAME_PXPS * dt / 1000;
      if (pos >= over) { pos = over; dir = -1; phase = NAME_HOLD; }
      else if (pos <= 0) { pos = 0; dir = 1; phase = NAME_HOLD; }
      el.scrollLeft = pos;
    }
    requestAnimationFrame(tick);
  })();

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
      // list_swipe: an upward swipe closes the sheet. Started on the
      // control_panel below (logo/player/transport) it closes right away;
      // started inside the list it first scrolls the list, and only closes
      // when the list is already at its own bottom and you swipe again.
      var lo = low();
      var inList = !!(e.target && (d.contains(e.target) || (lo && lo.contains(e.target))));
      drag = { mode: 'close', y0: t.clientY, x0: t.clientX, active: false, inList: inList };
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
        if (document.body.classList.contains('fold_on')) {
          // folded open the list IS the document, so "already at the bottom"
          // is the document's bottom, not a scrollport's
          var docMax = document.documentElement.scrollHeight - window.innerHeight;
          if (docMax > 2 && window.scrollY < docMax - 2) { drag = null; return; }
        } else if (drag.inList && d.scrollHeight > d.clientHeight + 2 &&
            d.scrollTop + d.clientHeight < d.scrollHeight - 2) {
          drag = null; return;                                       // still list to scroll -> plain scroll
        }
      }
      drag.active = true;
      d.classList.add('dragging');                                   // track finger, no transition
      if (fold_ok()) {
        document.body.classList.add('fold_run', 'fold_jump');
        foldH = fold_measure();
      }
    }
    var h = (drag.mode === 'open')
      ? Math.max(0, Math.min(max, dy))          // grow from 0 with the pull
      : Math.max(0, Math.min(max, max + dy));   // shrink from full as you swipe up (dy < 0)
    // fold_drag — under the finger the fold is the same single number the
    // animation uses, so a pull and a tap are literally the same motion at
    // different speeds: rows grow by k, the page shrinks by k.
    if (fold_ok() && foldH) { fold_apply(h / (max || 1)); }
    else { d.style.maxHeight = h + 'px'; }
    e.preventDefault();                                              // suppress native rubber-band
  }

  function onEnd() {
    if (drag && drag.active) {
      var d = drawer();
      if (d) {
        var folding = fold_ok() && foldH;
        var cur = folding
          ? (1 - (parseFloat(fold_page().style.height) || 0) / (foldH.page || 1)) * maxOpenPx()
          : (parseFloat(d.style.maxHeight) || 0);
        var max = maxOpenPx();
        // close_light: closing takes a small push — 36px, or 7.5% of the sheet
        // on a short screen. Opening keeps its own, longer pull (that one has
        // to beat an ordinary scroll, closing does not).
        var openIt = (drag.mode === 'open')
          ? cur > Math.min(100, max * 0.3)      // pulled far enough to open?
          : (max - cur) < Math.min(36, max * 0.075);
        d.classList.remove('dragging');                             // re-enable transition
        if (folding) {
          document.body.classList.remove('fold_jump');
          set_open(openIt);                                         // fold_go animates from here
        } else {
          d.style.maxHeight = (openIt ? max : 0) + 'px';            // animate to the snap point
          set_open(openIt);                                         // caret + shadow follow
          setTimeout(function () {                                  // hand back to CSS (72vh)
            if (d.classList.contains('open') === openIt) d.style.maxHeight = '';
          }, 200);
        }
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

  // ---- tap_only: a drag is not a tap -----------------------------------------
  // Pulling the drawer down with a finger that STARTED on a control also pressed
  // that control when it lifted — on the session pages that meant a swipe from
  // the transport created a new highlight. The browser synthesises a click on
  // touchend wherever the gesture began, and nothing was telling the difference.
  //
  // The highlight list already had this guard, scoped to itself (swipeMoved), so
  // a swipe that began on a title was safe and one that began 40px lower was not.
  // It belongs here instead: drawer.js is on every page, so one copy covers the
  // whole site rather than eight session pages plus the two lists.
  //
  // Capture phase, so it lands before any control's own handler, and time-boxed
  // so it can only ever swallow the click THIS gesture produced. Desktop is
  // untouched: with no touch events tapMoved is never set.
  var TAP_SLOP = 10;                 // the same 10px the list guard used
  var tapX = 0, tapY = 0, tapMoved = false, tapEnd = 0;
  window.addEventListener('touchstart', function (e) {
    if (!e.touches || e.touches.length !== 1) { tapMoved = true; return; }
    tapMoved = false; tapX = e.touches[0].clientX; tapY = e.touches[0].clientY;
  }, { passive: true, capture: true });
  window.addEventListener('touchmove', function (e) {
    if (!e.touches || !e.touches.length) return;
    var t = e.touches[0];
    if (Math.abs(t.clientY - tapY) > TAP_SLOP || Math.abs(t.clientX - tapX) > TAP_SLOP) tapMoved = true;
  }, { passive: true, capture: true });
  window.addEventListener('touchend', function () { tapEnd = Date.now(); },
                          { passive: true, capture: true });
  document.addEventListener('click', function (e) {
    if (!tapMoved) return;
    if (Date.now() - tapEnd > 700) return;    // not this gesture's click
    e.stopPropagation();
    e.preventDefault();                       // and a link does not navigate either
  }, true);

  window.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: false });
  // swipe_deaf: these move to CAPTURE and are registered BEFORE the guard below,
  // because the guard stops propagation at this same node — bubble listeners here
  // would never fire and the drawer would stop snapping.
  window.addEventListener('touchend', onEnd, { passive: true, capture: true });
  window.addEventListener('touchcancel', onEnd, { passive: true, capture: true });

  // ---- swipe_deaf: a moved finger reaches no control at all -------------------
  // tap_only (build 290) swallowed the synthesised CLICK, and that was not enough:
  // "Tag the moment" does not act on click. It acts on TOUCHEND, deliberately —
  // the new title's focus() has to land inside the touch gesture or iOS will not
  // open the keyboard. So the guard was watching a door the button never used.
  //
  // The rule he asked for is the general one, so this is the general mechanism:
  // once a gesture has travelled, its touchend is stopped at the window in the
  // capture phase and never reaches ANY element's handler. Nothing has to opt in,
  // and a control invented tomorrow is covered without knowing this exists.
  window.addEventListener('touchend', function (e) {
    if (tapMoved) e.stopPropagation();
  }, { capture: true });
  window.addEventListener('touchcancel', function (e) {
    if (tapMoved) e.stopPropagation();
  }, { capture: true });

  // the syncing… text breathes so it reads as 'working', not stuck
  (function () {
    var st = document.createElement('style');
    st.textContent = '@keyframes jam_sync_pulse{0%,100%{opacity:0.35}50%{opacity:0.9}}' +
      '.jam_sync{animation:jam_sync_pulse 1.6s ease-in-out infinite;font-size:13px;}' +
      '.jam_del{flex:0 0 auto;background:none;border:none;color:var(--muted);opacity:0.5;' +
        'padding:6px;margin-left:2px;min-height:32px;cursor:pointer;line-height:0;}' +
      '.jam_del:hover{opacity:1;color:var(--danger,#c75450);}' +
      '.jam_item .menu_sub{display:inline-flex;justify-content:center;text-align:center;' +
        'min-width:30px;font-variant-numeric:tabular-nums;flex:0 0 auto;color:var(--muted);white-space:nowrap;}' +
      '.jam_item .menu_sub .jam_count{display:inline-block;min-width:26px;text-align:center;margin:0;}' +
      // col_hold — the empty slot a row without a remove control reserves has to be
      // exactly as wide as the control it stands in for, or the share buttons above
      // and below it stop lining up. It was 30px against a 30px trash can; the X is
      // 29px of icon plus 12 of padding plus 2 of margin, so it is 43 now. Measured
      // by comparing the share buttons' right edges across rows, which is the only
      // way this ever gets noticed.
      '.jam_del_sp{flex:0 0 auto;width:43px;}' +
      // row_match — the session rows wear the highlight rows' grammar: a hairline
      // between every pair (they had one only above Admin), and the same 5px gap.
      // Height and gutters already matched.
      '.jam_item + .jam_item{border-top:1px solid var(--panel_3);}' +
      // the page's own stylesheet sets .jam_item padding and sits AFTER this file in
      // the head, so an equal-specificity rule here loses. Scoped to the drawer to
      // win it back — the same reason the row already had to be measured rather
      // than assumed.
      '.session_drawer .jam_item{gap:5px;padding:7px 12px;}' +
      // list_title — a heading, not a row you can press. Centred: it names the
      // whole list rather than labelling the column the rows start in, and
      // .jam_item is a flex row, so the centring goes on the row AND on the name
      // (which is the flex item that actually holds the text).
      '.jam_title{font-weight:700;color:var(--fg);letter-spacing:0.01em;' +
        'min-height:46px;border-top:none;cursor:default;' +
        'justify-content:center;text-align:center;}' +
      '.jam_title .jam_name{flex:0 1 auto;text-align:center;}' +
      '.jam_title:hover{background:transparent;}' +
      '.jam_title + .jam_item{border-top:1px solid var(--panel_3);}' +
      // name_roll: the current row's name is scrolled, so it must not also
      // ellipsise — the two together show a fading tail that never arrives
      '.jam_item.current .jam_name{text-overflow:clip;' +
        '-webkit-mask-image:linear-gradient(to right,#000 0,#000 calc(100% - 12px),transparent 100%);' +
        'mask-image:linear-gradient(to right,#000 0,#000 calc(100% - 12px),transparent 100%);}' +
      '.jamc_overlay{position:fixed;inset:0;z-index:120;background:rgba(0,0,0,0.5);' +
        'backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;}' +
      '.jamc_card{background:var(--panel);color:var(--fg);border-radius:14px;padding:20px 22px;' +
        'max-width:320px;width:84%;box-shadow:0 12px 40px rgba(0,0,0,0.45);}' +
      '.jamc_msg{margin-bottom:16px;font-size:16px;white-space:pre-line;}' +
      '.jamc_code{display:block;width:100%;box-sizing:border-box;margin:0 0 16px;padding:12px 14px;' +
      'border:1px solid var(--panel_3);border-radius:10px;background:var(--bg);color:var(--fg);' +
      'font-size:19px;letter-spacing:0.22em;text-align:center;font-variant-numeric:tabular-nums;}' +
      '.jamc_code:focus{outline:none;border-color:var(--accent);}' +
      '.jamc_code.ok{border-color:var(--accent);}' +
      '.jamc_row button:disabled{opacity:0.4;cursor:default;}' +
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
        'display:inline-block;animation:jam_spin_rot 0.8s linear infinite;}' +
      // ---- list_fold ----
      // #fold_page is a bare wrapper: no padding, no border, so margins collapse
      // through it and the page lays out exactly as it did unwrapped. It only
      // ever grows teeth while the fold is running or folded shut.
      '#fold_page{transition:height 0.3s ease;}' +
      'body.fold_run #fold_page{overflow:hidden;}' +
      'body.fold_on #fold_page{height:0;overflow:hidden;}' +
      // overflow:hidden would make #fold_page a scrollport and kill the sticky
      // player, so it is only on while the height is actually moving.
      'body.fold_run .session_drawer{overflow:hidden;}' +
      // fold_ease — one curve, one duration, on everything that moves, or the
      // page and the rows arrive at different times and the fold comes apart
      'body.fold_run .session_drawer,body.fold_run .session_drawer .jam_menu,' +
        'body.fold_run #fold_page{transition:max-height 380ms cubic-bezier(0.55,0,0.35,1),' +
        'height 380ms cubic-bezier(0.55,0,0.35,1),transform 380ms cubic-bezier(0.55,0,0.35,1);}' +
      // while the name is in flight neither end of the trip is drawn, or you
      // see the same words in three places at once
      'body.fold_fly_on #fold_page h1{opacity:0;}' +
      'body.fold_fly_on .jam_item.current .jam_name{opacity:0;}' +
      '#fold_page h1{transition:opacity 140ms ease;}' +
      'body.fold_on .session_drawer{max-height:none;overflow:visible;}' +
      'body.fold_jump #fold_page,body.fold_jump .session_drawer,' +
        'body.fold_jump .session_drawer .jam_menu{transition:none;}' +
      // nothing is below the list any more, so nothing casts a shadow into it
      'body.fold_on .session_drawer::after,body.fold_run .session_drawer::after{display:none;}' +
      '.session_low{z-index:89;}' +
      '.session_low .jam_menu{margin-top:0;}' +
      // the two halves are one card: the seam gets the same hairline every other
      // pair of rows has, and only the outer corners stay round
      'body.fold_split .session_drawer:not(.session_low) .jam_menu{border-radius:14px 14px 0 0;padding-bottom:0;}' +
      'body.fold_split .session_low .jam_menu{border-radius:0 0 14px 14px;padding-top:0;}' +
      'body.fold_split .session_low .jam_menu>.jam_item:first-child{border-top:1px solid var(--panel_3);}' +
      // land_fold — the landscape split opens its own fixed sheet, so the
      // wrapper steps out of the way entirely and the body grid sees the page's
      // own children again, exactly as before it existed.
      '@media (orientation: landscape) and (pointer: coarse) and (max-height: 520px){' +
        '#fold_page{display:contents;}.session_low{display:none;}}';
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
  function delete_session(page, name, dur) {
    // same themed pop-up as the highlight delete, not the native confirm
    var code = del_code_for(dur);
    drawer_confirm('Delete "' + name + '"?'
      + (code ? '\n\n' + dur_words(dur) + '. Enter the code.' : ''),
      'Delete', function () { delete_session_go(page, name); }, code);
  }
  function delete_session_go(page, name) {
    deleted_add(page);      // remember locally FIRST — stale registry reads can't bring it back
    my_recs_remove(page);   // and this device stops vouching for it
    deleting[page] = true;
    var onIt = (page === PKEY);   // del_leave: this is the page under the list
    if (onIt) pin_list(true);
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
        if (onIt) { location.replace('index.html#sessions'); return; }
        if (typeof window.toast === 'function') window.toast('Deleted ' + name);
      })
      .catch(function () {
        // the delete didn't land: restore the row and its trash button
        delete deleting[page];
        deleted_remove(page);
        if (onIt) pin_list(false);   // the session is still there — give it back
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
    fold_build();   // before build_menu: the split needs somewhere to put the low rows
    // list_home — index.html renders the list itself when nothing survives to
    // open under it. There is no page beneath, so the list cannot be closed.
    if (window.VAMPJAM_LIST_HOME) pin_list(true);
    build_menu(); wire_links(); capture_dur(); fetch_auto_sessions(); fetch_local_recs();
    // orphan_sweep waits out the first registry paint, then self-publishes
    // anything the cloud has that the list forgot (6h throttle inside)
    setTimeout(orphan_sweep, 4000);
    // fold_in — arrived by tapping this page's own row: come up shut at the
    // list's own scroll offset, then run the collapse backwards.
    var note = fold_in_take();
    if (note && fold_ok()) {
      fold_set_now(true);
      try { window.scrollTo(0, note.y); } catch (eY) {}
      // one frame shut before it moves, so the eye sees the list, not a jump
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          set_open(false);
          fold_ride(note.y, FOLD_MS);
        });
      });
      return;
    }
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

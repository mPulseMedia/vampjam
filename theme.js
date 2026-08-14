// vampjam_theme — shared theme system for the session pages.
// Each theme is a set of CSS variables; switch with the menu control or
// window.vampjamTheme.apply('minimal'). Choice persists in localStorage.
// Evolve a theme in isolation by editing only its block below; all pages
// that load this file update together (coordination).
(function () {
  var KEY = 'vampjam_theme';

  var THEMES = {
    yellow: {
      name: 'Yellow',
      vars: {
        '--bg': '#4a2a0e', '--panel': '#5c3717', '--panel_2': '#6b4423', '--panel_3': '#7a4f2a',
        '--fg': '#f5e5c5', '--muted': '#c9a87e',
        '--accent': '#e8b454', '--accent_2': '#d4a95a',
        '--danger': '#c75450', '--warn': '#e8c794',
        '--on_accent': '#0b0d0f',
        '--accent_hover': '#f0c97a', '--accent_active': '#c89943',
        '--accent_2_hover': '#e0bb6e', '--accent_2_active': '#b88e3d',
        '--playhead': '#ffd84a',
        '--marker': '#ffffff'
      }
    },
    minimal: {
      name: 'Minimal',
      vars: {
        '--bg': '#ffffff', '--panel': '#f5f5f7', '--panel_2': '#ebebed', '--panel_3': '#dcdce0',
        '--fg': '#1d1d1f', '--muted': '#86868b',
        '--accent': '#0071e3', '--accent_2': '#3a3a3c',
        '--danger': '#d70015', '--warn': '#8a6d1a',
        '--on_accent': '#ffffff',
        '--accent_hover': '#0a84ff', '--accent_active': '#0062c4',
        '--accent_2_hover': '#48484a', '--accent_2_active': '#2c2c2e',
        '--playhead': '#0071e3',
        '--marker': '#98989d'
      }
    }
  };
  var ORDER = ['yellow', 'minimal'];

  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function current() { var s = saved(); return THEMES[s] ? s : 'minimal'; }

  function apply(id) {
    var t = THEMES[id] ? id : 'yellow';
    var vars = THEMES[t].vars, root = document.documentElement;
    for (var k in vars) root.style.setProperty(k, vars[k]);
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    render_switch();
  }

  // Apply immediately (runs in <head>) so there is no flash of the wrong theme.
  apply(current());

  function render_switch() {
    var menu = document.querySelector('.jam_menu');
    if (!menu) return;
    var box = menu.querySelector('.theme_switch');
    if (!box) {
      box = document.createElement('div');
      box.className = 'theme_switch';
      box.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:4px;padding:12px 8px 4px;border-top:1px solid var(--panel_3);';
      var label = document.createElement('span');
      label.textContent = 'Theme';
      label.style.cssText = 'font-size:11px;color:var(--muted);margin-right:2px;';
      box.appendChild(label);
      ORDER.forEach(function (id) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('data-theme-btn', id);
        b.textContent = THEMES[id].name;
        b.style.cssText = 'font:inherit;font-size:12px;padding:4px 11px;border-radius:999px;border:1px solid var(--panel_3);cursor:pointer;background:transparent;color:var(--fg);';
        b.addEventListener('click', function (e) { e.stopPropagation(); apply(id); });
        box.appendChild(b);
      });
      menu.appendChild(box);
    }
    var cur = current();
    Array.prototype.forEach.call(box.querySelectorAll('button'), function (b) {
      var on = b.getAttribute('data-theme-btn') === cur;
      b.style.background = on ? 'var(--accent)' : 'transparent';
      b.style.color = on ? 'var(--on_accent)' : 'var(--fg)';
      b.style.fontWeight = on ? '600' : '400';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render_switch);
  } else {
    render_switch();
  }

  window.vampjamTheme = { apply: apply, current: current, themes: THEMES };
})();

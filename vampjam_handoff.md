# vampjam — handoff spec

The single doc a new model/thread reads to pick up **vampjam** and keep going. Read this
top to bottom, then open `vampjam_org.html` (the live runbook) for the current focus.

---

## 1. What vampjam is

A web app for tagging moments ("highlights") in long jam-session audio recordings and
sharing them. One static HTML page per **session** (a recording). You play the audio,
"Tag the moment" drops a highlight at the current time, name it, and each highlight has a
share link that deep-links into the audio at that timestamp. Sessions are ~50 min to ~3 h.

- **Repo:** `github.com/mPulseMedia/vampjam`
- **Site (GitHub Pages):** `https://mpulsemedia.github.io/vampjam/`
- **Audio host:** Cloudflare R2, bucket `vampjam-audio`, public base
  `https://pub-33cfd8558d314eb58642c8550608850b.r2.dev`
- **Cloudflare account id:** `4b9c9adf79c3fb2d43be0ced2b2a8553`
- **Sync Worker (saves JSON to repo):** `https://vampjam-sync.crimson-dust-a18d.workers.dev/`
- **Local workspace:** `~/claude_cowork/vampjam` (a connected folder; edits land on the Mac)

---

## 2. File map

| File | Role |
|---|---|
| `YYYY_MM_DD_<name>.html` | one per session (e.g. `2026_08_07_sound_union.html`). Self-contained: inline CSS/JS + player + highlight list + the session drawer. |
| `YYYY_MM_DD_<name>.json` | that session's data: `{ audio:{label,url,kind}, tags:[…] }`. `DATA_PATH` is derived from the page filename at runtime. |
| `theme.js` | shared theme system (CSS-var themes: `minimal` default, `yellow`). Renders the theme switch into `#theme_switch_mount` (Admin only now). |
| `drawer.js` | shared session-drawer: reveal/close gestures, and it renders the session list **data-driven from `sessions.js`**. Also caches each session's duration + records `vampjam_last_session` in localStorage. |
| `sessions.js` | the session **manifest**: `window.VAMPJAM_SESSIONS = [{page,name,date,dur,count}…]`, oldest→newest. Drawer + index read this. Add a session = one line here. |
| `admin.html` | Admin page: the in-app **recorder**, the "add a session" steps, and the theme switch. Uses the yellow palette in `:root` but loads `theme.js` which overrides it. |
| `index.html` | tiny redirect → last-opened session (`vampjam_last_session`), else the newest in the manifest. |
| `cloudflare/r2_upload_worker.js` | standalone Cloudflare **Worker**: `POST` audio → puts it in R2 → returns the public URL. Needs deploy (see §7). |
| `functions/upload.js` | Pages-Function variant of the same (only if using a Pages project instead of a Worker). |
| `vampjam_org.html` + `vampjam_org_build.js` | the live **runbook** page (see §8) + its auto-reload build sidecar. |
| `prompt_log/prompt_log_lab_data.js` (+ `prompt_log_data.js`, `prompt_log.html`) | the prompt log (see §3). |

Audio files (`*.m4a`) are **gitignored** — audio lives on R2, not the repo. (Older sessions
still point at GitHub-release URLs; those are being migrated to R2.)

---

## 3. Conventions (follow these every prompt)

- **Codenames:** `snake_case`, 1–4 terms, base form (no plurals/-ing). Reuse existing roots.
  Applies to file names, page titles, function/var/id/class names, commit messages, prompt names.
- **Prompt log:** EVERY prompt gets one entry in `prompt_log/prompt_log_lab_data.js`, then
  `cp` it to `prompt_log_data.js`. Structure: `window.prompt_log_data = [ thread ]`, thread =
  `{thread, expanded, entries:[…]}`, entry = `{id:"NN codename", expanded, nodes:[{text,children}]}`.
  Newest entry on top; only the newest `expanded:true`, collapse the rest. Entry body:
  `prompt_restate` (outline), `verbatim` (exact user words), `result_*`, `codename_list`.
  Numbering is per-thread, zero-padded; current thread `vampjam_pickup — 2026-06-16`, at entry ~72.
- **Commits:** commit each prompt with the codename as the message. **The sandbox cannot push**
  (git can't unlink `.git` objects / create `index.lock` in the mount, and has no SSH creds).
  Commits still land locally; the user pushes (`cd ~/claude_cowork/vampjam && git push origin main`)
  or a launchd auto-pusher on the Mac picks them up. Always give the push command when 1+ ahead.
- **Direct feedback (`feedback_direct`):** lead with the outcome; say "not done" plainly, never
  soften a failure as "a snag"; flag status mismatches up front; say "I can't see X" when a file
  isn't connected instead of guessing.
- **Editing many session pages:** they're near-identical clones. Use a Python/bash loop with
  exact-string asserts across all 7 pages rather than editing one at a time. Validate inline JS
  with `node --check` after (extract `<script>` blocks; skip `src=` ones).

---

## 4. How a session works (data flow)

1. Page loads → `fetch_repo_data()` fetches `raw.githubusercontent.com/…/main/<page>.json`
   (raw, not Pages — Pages CDN lags 1–2 min). Sets `audio` + `tags`.
2. `resolve_url(audio)` returns `audio.url` (must be an absolute, playable URL — R2 or release).
3. Adding/renaming a highlight → `save_tags()` (localStorage) + `queue_save_data_to_repo()`
   (3 s debounce) → `POST` to the **sync Worker** which commits `<page>.json` to the repo.
4. A 15 s poll re-`fetch_repo_data()`s for cross-device updates.

**Critical rule already fixed — keep it:** on load/poll the page must **MERGE** repo tags with
local ones (keep any local tag whose id isn't in the repo yet), never blindly replace, or a
just-made highlight is wiped on reload before it round-trips. All 7 pages merge; localStorage is
the safety net. The poll is also guarded by `local_edits_in_progress()` (skip while a title is
focused, a save is pending/in-flight, or within 20 s of the last edit) and a change-signature
check so the list doesn't re-render (flash) when nothing changed.

---

## 5. UI / behavior spec (accumulated requests — honor all)

**Themes:** `minimal` (default, light) and `yellow`, via `theme.js` CSS vars. The theme switch
lives on **Admin** only (`#theme_switch_mount`); the theme applies site-wide via localStorage.

**Session drawer** (the top surface):
- Top-left control is a **caret** (chevron) that rotates when open — not a hamburger.
- Reveal: tap the caret, OR when the page is at rest at the very top, **pull down**; a swipe from
  below just scrolls and stops at the top. When open, **swipe up** to close. Shadows appear
  **only on the darker panel** (never on the white), and only when a list overflows.
- **Data-driven from `sessions.js`.** Order: Admin at top, then sessions **oldest→newest**
  (newest at the **bottom**), then a **New recording** row. Drawer opens **scrolled to the bottom**
  (newest); scroll up for older.
- Each session row: cassette line-icon + **"Name — Date"** (title format, ISO date) on the left;
  **duration + highlight count** on the right; a **share** button (copies the session URL).
  Admin uses a gear icon; New recording uses a plus icon. The **current** session's row is a
  light-blue highlight.

**Player + highlights:**
- Transport circles (−2m…+2m) grouped around the play button (centered on laptop, spread to the
  gutters on a phone). Labels are big-number / small-sign+unit.
- "Tag the moment" is comfortably sized (not full width). The playhead is a plain blue line, full
  row width, no glow.
- Highlight rows sit on a recessed panel **card**; row highlight is full-width **light blue**
  (accent family). Play button is a **bare blue triangle** (no gray square). Share = gray line
  share-arrow icon; delete = gray line X.
- Title interaction: single-tap = play, double-tap = edit (iOS keyboard raises reliably because
  the field is pre-unlocked on the first tap; the edit field background is **white**). Creating a
  moment focuses the title ready to type.
- One text size (17px) across list names, timestamps, session titles/dates, and the theme buttons.
- The Export/Import/Clear-tags footer buttons are **hidden** (kept in code, `display:none`) on the
  bazaar pages.

---

## 6. Sessions (current manifest — `sessions.js`)

Oldest→newest. `dur` seconds, `count` = highlights. Durations were probed via the browser player.

| page | name | date | dur | count | audio host |
|---|---|---|---|---|---|
| 2026_01_17_bazaar_cafe.html | Bazaar Cafe | 2026-01-17 | 3157 | 1 | **R2** |
| 2026_05_23_bazaar_cafe.html | Bazaar Cafe | 2026-05-23 | 10038 | 31 | release → move to R2 |
| 2026_05_30_sound_union.html | Sound Union | 2026-05-30 | 10375 | 15 | release → move to R2 |
| 2026_07_17_sound_union.html | Sound Union | 2026-07-17 | 10259 | 5 | release → move to R2 |
| 2026_07_24_sound_union.html | Sound Union | 2026-07-24 | 9868 | 10 | release → move to R2 |
| 2026_07_31_sound_union.html | Sound Union | 2026-07-31 | 10105 | 9 | release → move to R2 |
| 2026_08_07_sound_union.html | Sound Union | 2026-08-07 | 8776 | 24 | **R2** |

**Adding a session:** rename the audio no-spaces (e.g. `2026-01-17_bazaar_cafe.m4a`), upload to
R2, create `<page>.json` pointing at `pub-…r2.dev/<file>`, clone the newest same-type page and
fix `PAGE_ID` + `<title>` + the h1 date, and add one line to `sessions.js` (drawer/index update
automatically). Old flow cloned the drawer markup per page — no longer needed (drawer is
data-driven), but the static `<div class="jam_menu">` can stay as a fallback.

---

## 7. Recording (in progress — the current #next)

Goal: record in the browser and auto-upload to R2. Built, **not deployed**:
- `admin.html` has a "Record a jam" card (MediaRecorder — `.m4a` on iOS/Safari, `.webm` on
  Chrome which iOS can't play, so record on iPhone). On stop it previews and can `POST` the blob.
- `cloudflare/r2_upload_worker.js` is the upload endpoint. **User must:** create a plain Worker
  ("Start with Hello World", NOT the connect-to-Git flow — that fails on the existing repo name),
  paste the code, add R2 binding `BUCKET → vampjam-audio`, set vars `PUBLIC_BASE` (the r2.dev URL)
  + `UPLOAD_SECRET`, deploy, and give the worker URL. Then set `WORKER_UPLOAD_URL` + `UPLOAD_SECRET`
  near the top of the record script in `admin.html`. **Never handle the secret** — the user sets it.
- Then `session_autocreate` (#ready): after an upload, auto-build the session page + json.

---

## 8. The org runbook page (`vampjam_org.html`)

The live companion page, cloned from `claude_cowork_org` and kept in sync with its presentation:
- Collapsible outline (click a node = toggle, double-click = subtree); click a label to **zoom**
  (hash `#1A`) with gray crumbs; **search** with a recent-searches dropdown; day/night toggle.
  Code blocks are **light in day mode**, collapse to ~3 lines and expand on click; copy buttons
  themed. `.tag` (gray suffix) is **hidden** here per the user's preference.
- **Auto-reload:** the page polls `vampjam_org_build.js` every 2 s; when its `PAGE_BUILD` differs
  from the page's `const BUILD`, it counts down and reloads (state survives). **Every time you edit
  the page, bump `BUILD` in the page AND `PAGE_BUILD` in the sidecar together** or it won't reload.
- **`steer_rule`:** each build may set focus/search/open once (`STEER.focus`, `STEER.search`,
  `OPEN_ON_BUILD`) then the user's manual navigation wins. You may open/close nodes and change the
  focus to guide him — he's fine with that.
- **Markers = focus system:** `#next` (amber) = the single current focus · `#do` (salmon) = the
  **user** does it · `#ready` (blue) = **Claude** can do it on his say-so · `#done` (green).
- **Copy buttons:** `<button class="rowcopy">` copies the `pre` in a child `sc` node (used for the
  worker code, the git-push command, the DNS A-records).
- Runbook style (from `claude_cowork_org`): forward-looking; done work shrinks to a short status;
  give the user the zoom link (`file://…/vampjam_org.html#1A`) when steering him to a task.

Sections now: **1 record_live**, **2 audio_home**, **3 interface** (done), **4 rebrand**, **5 notes**.

---

## 9. Current state / open work

- **1 record_live:** `deploy_worker` **#next** (user) → `wire_admin`, `test_record`, `push` #do.
- **2 audio_home:** `bazaar_01_17` + `audit_audio` #done; `move_to_r2` (drag the 5 release-hosted
  files into the bucket, then Claude repoints their json) + `verify_ios` #do.
- **3 interface:** ALL done — list order (newest bottom), row format (Name — Date + dur + count),
  durations, index→latest, new-recording row.
- **4 rebrand:** `wordmark_name` #ready (change "vamp jam" → "vamp SF" text on every page);
  `domain_vsf` — register domain, add repo `CNAME`, Pages custom domain + DNS (GitHub Pages apex
  A records `185.199.108.153 / .109 / .110 / .111`), update `<title>`s.
- **#ready (Claude, on request):** `session_autocreate`, `wordmark_name`, the `CNAME` + reference
  updates for the domain.

---

## 10. Gotchas

- **Push:** sandbox git can't push; commit locally and hand the user the push command. Stale
  `.git/*.lock` from failed sandbox ops can stall the Mac auto-pusher; on the Mac,
  `rm -f .git/*.lock` clears it (zsh: use `find .git -name '*.lock' -delete` to avoid no-match errors).
- **iOS audio:** the reason audio is on R2 — GitHub releases/raw were unreliable on iPhone.
  New/moved audio goes to R2. GitHub-Pages-hosted audio is a stopgap only.
- **Verifying visually:** the sandbox can't reach the audio hosts (ffprobe fails) and `file://`
  gets forced to `https://` by the browser tool — but the user's **local files are the ones you
  edit**, so previewing usually means opening the live Pages URL or injecting CSS/JS onto it and
  screenshotting. Durations were gotten by loading each page's own `<audio>` player (detached
  `new Audio()` is blocked by the page CSP; the page player + `.load()` works).
- **Don't re-add the buttons the user hid**, and keep `.tag` hidden on the org page.

---

## 11. Pick-up checklist for the new thread

1. Read this file, then open `vampjam_org.html` and look at `#next` (the focus).
2. Each prompt: do the work → add a `prompt_log_lab_data.js` entry (+ cp) → commit with a
   codename → give the push command → if you touched `vampjam_org.html`, bump BUILD + sidecar.
3. When steering the user, put steps on the org page (he prefers that over chat) and hand him the
   `#…` zoom link. Use `#ready`/`#do` to split your work from his.
4. Respect his stylistic decisions (hidden tags, light code blocks, newest-at-bottom, gutters,
   card look) — they were hard-won; keep them and evolve nodes in place.

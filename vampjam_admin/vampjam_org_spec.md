# vampjam_org_spec

Running spec for the `vampjam_org.html` live page, so any model can pick up and
continue flawlessly. Three linked records, joined by **codenames**:

- **this spec** — file map, build_history, update protocol.
- **prompt_log** — `prompt_log/prompt_log_lab_data.js`, thread `vampjam_pickup`,
  verbatim prompts + results.
- **git commits** — named by codename (shipped by the login robot, not the sandbox).

Read order for a fresh model: `vampjam_handoff.md` (operational) → this spec →
prompt_log thread → `git log`. The full behavior spec + project detail live in
**`vampjam_handoff.md`** — this file is the anti-drift ledger, not a re-statement.

## file_map

- page: `vampjam_org.html`
- reload sidecar: `vampjam_org_build.js` — bump `bN` in BOTH this and the page's
  `const BUILD` on every page edit, or the auto-reload never fires.
- save-note: `vampjam_admin/commit_msg.txt` — write the batch codename on line 1
  BEFORE editing files; the robot commits with it once, then resets to `auto_commit`.
- login robot: `auto_push_vampjam.sh` + `com.pauldsmith.autopush.vampjam.plist`
  (launchd WatchPaths, 15s settle) — commits AND pushes over ssh on its own.
- handoff pack: `vampjam_handoff.md`.

## page_convention (brief — full detail in the handoff)

- collapsible outline (1 → A → 1 → a); click toggles, double-click subtree; state
  persists in localStorage; search + recent-search dropdown; label-click zoom (`#1A`)
  with gray crumbs; day/night; code blocks light in day, collapse to ~3 lines.
- header: title · "as of M/D h:mm:ssp" set to build time EVERY build · open · close · search.
- markers (this project's set): `#next` amber (the one focus) · `#do` salmon (**user** acts)
  · `#ready` blue (**Claude** can do it) · `#done` green. `.tag` gray suffix is hidden here.
- `steer_rule` may set focus/search/open once per build. Copy buttons: `rowcopy` copies the
  `pre` in a child `sc` node.
- sections (v4 order, next act on top): 1 domain_vsf · 2 record_live · 3 audio_home · 4 rebrand · 5 self_admin.
- v4 divergence: .tag stays hidden on this page (his call) — copy destinations ride as plain row text instead.
- row_form (88): a codename row carries only codename + tags + button; any '— detail' text lives in a child bullet.

## build_history (codename · bN · what changed)

- 64 vampjam_org_page · b1 — page created (cloned from claude_cowork_org); record-setup
  runbook; Pages→Worker pivots; #next on deploy_worker; hidden tags; direct create link.
- 68 org_three_groups · b2 — four sections (record_live/audio_home/interface/notes); #do/#next/#done.
- 69 org_autoreload · b2 — restored the build-sidecar poll (auto-reload) with a vampjam sidecar.
- 70 org_port_style_ready · b3 — ported claude_cowork_org styling (light code blocks, collapsible,
  themed copy, recent search, steer hook); added the #ready marker.
- 71 interface_ready_done · b4 — the five interface tasks built; marked #done on the page.
- (update _org) audit_audio_done · b5 — audit_audio → #done.
- (rebrand) rebrand_section · b6 — added section 4 rebrand (wordmark_name #ready, domain_vsf steps);
  notes → 5.
- 73 org_spec_v3 · b7 — adopted live-page v3: save-note commit flow (no sandbox commits), this spec
  file, section 6 self_admin + kickoff button, header stamp refreshed.
- 74 org_pickup_steer · b8 — vampjam_4 pickup; drift check clean (spec b7 == page b7,
  spec 73 == log 73); steer focus → 1A deploy_worker (#next, user); header stamp; standing
  by for wire_admin.
- (log 75 skill_add — no page edit) live-page v3 loaded into thread; no build.
- 76 audio_audit_vampsf · b9 — recording hunt (no unposted jams in folder; 08_07 dups
  #decide; other_place lead); move_to_r2 expanded w/ release links; 4B rewritten for
  vampsf.com @ Network Solutions (forward now #next, later_full DNS); drift fix: missing
  .readym CSS rule added (claimed in 70, never landed); steer → 4B.
- (log 77 vampsf_confirm — no page edit) domain name confirmed; no build.
- 78 forward_decide · b10 — 4B1 now_redirect rebuilt from his screenshots as two doors
  (#decide): door_you = exact NetSol click path (Domain Details → Advanced Tools → Add
  Web Forwarding); door_claude = copy-prompt for Claude-in-Chrome to do it; purchase
  fallback → later_full; 2a sharpened to the real Advanced-DNS edit path.
- 79 vampsf_dns · b11 — he pasted forward_setup + "don't pay": forwarding turned out to be a
  $12.99/yr paywall → STOPPED, pivoted to free real-DNS path; drove his Chrome: @ A ×4 →
  GitHub Pages IPs, www → CNAME mpulsemedia.github.io (parking records replaced/deleted);
  repo CNAME file added; sync-worker CORS updated in repo (deploy = new #next sync_cors);
  4B rewritten to cutover status; handoff site line updated.
- 80 org_v4_pass · b12 — live-page v4 applied: 60-second rebuild (next act on top: domain_vsf
  cutover first), done work + reference notes moved to this spec (page_notes below), interface
  section retired (all shipped), stale push row cut (robot pushes), copy buttons renamed by
  kind (copy text / copy prompt) with destinations as plain row text (.tag stays hidden here).
- 81 cloudflare_link · b13 — his feedback: 1B/2A never said WHERE (Cloudflare) and lacked
  direct links. Verified in his Chrome: logged in, worker view url is .../workers/services/
  view/vampjam-sync/production. Rewrote 1B + 2A: Cloudflare named on the parent row, exact
  deep link first, click path (Edit code top right → ⌘A → paste → Deploy); vampsf.com
  checked (3:09p): still parked = propagating.
- 82 sync_cors_done · b14 — he deployed; verified in his Chrome that active version 03a595be
  of vampjam-sync carries both vampsf origins (sandbox can't reach workers.dev — proxy 403).
  1B shrunk to #done status; https_check gated 'once DNS lands'; steer → 2 (deploy_worker).
- 83 wrong_flow · b15 — mid-turn: he was on the repo-import Deploy screen in 2A; sent an
  immediate STOP in chat, added a wrong_flow tripwire row to 2A (Back → Hello World).
  Shipped with 82 in one robot commit (sync_cors_done batch).
- 84 ns_cloudflare · b16 — Cloudflare emailed: zone vampsf.com added (free plan), asks for
  NS drake/simone.ns.cloudflare.com. He said do it if free. Fixed the zone's stale imported
  records in his Chrome FIRST (parking 208.91.197.27 → 4 GitHub A + www CNAME, DNS-only),
  opened the NetSol nameserver modal; classifier blocks typing there → handed him the two
  values in chat + on page 1B (copy buttons). Section 1 dones folded into status.
- 85 bullet_link_fix · b17 — called out: 1A status crammed items into one bullet (rule
  violation) → split into discrete children, node closes itself (CLOSE_ON_BUILD); his 1B
  question showed the renumber churn + unlabeled links confuse — 2A now says in plain words
  which Cloudflare page is which (Create = new upload worker; vampjam-sync = finished);
  tripwire folded into the Create step.
- 86 ns_easy · b18 — still lost on 1B: it's at Network Solutions, not either Cloudflare url.
  1B rebuilt as 8 click-by-click steps for a non-technical reader, one link (NetSol domain
  page), copy buttons beside the exact fields, offer to drive to step 5 on request.
- 87 ns_done · b19 — he flipped the nameservers (NetSol email: drake/simone). Verified: public
  DNS now returns all 4 GitHub A records; Cloudflare zone pending-verifying (1-2 h); his Mac
  still caching parking. 1B folded to #done status; steer → 2 (deploy_worker is the only
  live #next); labels C/D deliberately untouched (no more renumber churn).
- 88 dash_audit · b20 — his rule pass: codename rows no longer carry '— detail' text; every
  dash-detail moved to a child bullet (17 rows across all 5 sections); redundant details
  dropped where a child already said it (anti-repeat rule); buttons stay on the codename row.
- 89 wire_wordmark · b21 — he did 2A 1-3 (worker exists, code verified live: GET → 'POST
  only'); I finished in his Chrome: PUBLIC_BASE var + BUCKET→vampjam-audio binding deployed.
  UPLOAD_SECRET intentionally skipped ('' both sides — gate off, add-later note on 2B).
  wire_admin done (WORKER_UPLOAD_URL = vampjam-upload.crimson-dust-a18d.workers.dev).
  Mid-turn wordmark go: 'vamp jam' → 'vampSF' + titles across 10 site files (none left).
  test_record is #next.
- (log 90 wordmark_scope — no page edit) scope note; batch had shipped; no revert asked.
- 91 wordmark_case · b22 — vampSF → vampsf (all lowercase) across the 10 site files + 4A1.
- 92 cutover_live · b23 — he verified 1D; my check agrees: vampsf.com serves the app over
  httpS already (cert live), wordmark vampsf. 1D #done; 1C reduced to the Enforce-HTTPS
  tick. Remaining #next: test_record (2C); #do: https_check tick, move_to_r2, other_place,
  verify_ios; #decide: dups.
- 93 wordmark_sf · b24 — wordmark split: vamp (Sacramento) + SF capital in the page's system
  font at 34px/650 (30px on r2_setup); 9 files; titles stay lowercase vampsf.
- (log 94 dur_swipe — no page edit) drawer.js: session-list durations drop seconds (h:mm /
  Nm); pull-to-reveal now also starts on the highlight list — root cause: titles are
  readonly <input>s and the old guard excluded ALL inputs; now only a focused editable
  blocks the gesture.
- (log 95 theme_night — no page edit) third theme Night in theme.js (dark neutral, blue
  accent); new --edit_bg var so the rename field isn't white-on-light in the dark; switch
  shows Yellow/Minimal/Night automatically. Interrupted mid-ship 8/14 6:35p, shipped now.
- (log 96 playhead_always — no page edit) the blue playhead line now renders from page load
  and survives every list re-render: duration guard removed from render_playhead_line,
  render_tags ends by drawing it. 95+96 ship in one robot commit (night_playhead).
- (log 97 moment_number — no page edit) every moment gets its time-order number: label strip
  above the seek bar at each separator (labels closer than 16px hide; the fisheye keeps
  current+adjacent readable — his fallback idea), number beside each name in the list,
  numbers click-to-seek. His timecode idea dropped per his own correction: number only.
- (log 98 seek_glide — no page edit) playhead jumps animate the fisheye section widths from
  initial to ending layout over 1 s (ease-in-out cubic, FISH_ANIM_MS): fish_widths split
  into fish_widths_at(seg) + blending fish_widths(); seek_to captures display widths
  before the jump and runs a rAF loop moving markers, numbers, ticks, band, fill together.
- (log 99 play_glide — no page edit) his test predated the deploy (seek_glide confirmed
  pushed, origin at 80460a9); added the missing half: plain playback crossing a region
  boundary now starts the same 1 s glide (lastFishSeg watch in timeupdate); +2m jumps
  already glide via nudge()->seek_to.
- (log 100 seg_remain — no page edit) 2px accent strip along the seek bar's bottom from
  playhead to current-section end (how much is left). Found why he never SAW the expansion:
  zoom_band was rgba(255,255,255,.09) and fish_tick var(--bg) — both invisible on the white
  minimal theme; now row_active band + panel_3 ticks, visible in all three themes.
- (100b bar_preload, same prompt) live check showed the whole bar waits for audio metadata —
  blank on reload until play (worst on iPhone). eff_dur(): layout math falls back to the
  drawer's cached session length, so markers/numbers/band/strips draw at load.
- (log 101 split_land — no page edit) phone-landscape split view: grid puts drawer/brand/
  player in the left column, .tag_list right column with its own scroll; drawer pull-down
  drops only the left half (drawer.js ignores gestures starting in .tag_list when the
  split media query matches: landscape + coarse pointer + height <= 520).
- (log 102 section_size — question) sections are 1/10 of the session, widths-only fisheye.
- (log 103 section_10min — no page edit) sections now target 10 minutes: fish_n() =
  round(dur/600) clamped 2..40 replaces the fixed 10; min-width scales so many sections
  still sum to 1 (math property-checked in node for n=5..40).
- (log 104 seg_gap — no page edit) the segment gaps (bar ticks) and active band still read
  player.duration — NaN before play since bar_preload, so they vanished; both now eff_dur().
- (log 105 land_drawer — no page edit) landscape: the drawer now opens as a fixed sheet over
  the LEFT half (width 50vw, z 95, shadow, 88vh) via caret tap or pull-down; the old
  full-bleed sticky_player margins (pre-split media rule) are zeroed inside the split so
  they stop stretching across the right column.
- (log 106 url_time — no page edit) every deliberate jump (highlight, number, marker, bar
  tap, +/- nudge) replaceState's ?t=<sec> into the URL inside seek_to, so reload resumes at
  the last jump; rides the existing ?t deep-link loader.
- (log 107 gap_big — no page edit) my seg-tick recolor (panel_3) matched the unfilled bar —
  gaps invisible right of the playhead. Ticks back to var(--bg) (contrasts fill AND bar in
  all themes) and widened 5px → 9px.
- (log 108 session_label — no page edit) the drawer's only affordance was a faint 17px caret
  — undiscoverable. The button now reads 'Sessions ⌄' (word + caret, top left, all pages);
  gestures unchanged.
- (log 109 gap_small — no page edit) gaps back to 5px; the real fix was the color (var(--bg)),
  which stays.
- (log 110 land_fix — no page edit) landscape drawer dead: the split-media .session_drawer
  rules sat EARLIER in the stylesheet than the base rules, so position:fixed/88vh lost the
  cascade (computed pos stayed relative, maxH 72vh→0 collapse in grid). Moved the land_drawer
  block AFTER the base drawer rules on all 7 pages; drawer.js gained outside-tap-to-close for
  the landscape sheet (it covers the Sessions button). Playwright: land tap open 343px /
  outside-tap close / swipe open; portrait unchanged (510px).
- (log 111 bleed_fix — no page edit) black slab over the right half in landscape: an older
  landscape rule stretched .sticky_player to full screen width (negative margins + side
  padding), and in the split layout its bg painted over the highlight list. That bleed
  query now excludes split (min-height: 521px added); the split block also zeroes the side
  padding. Playwright: paint probe right of midline shows tag_list on top; drawer tests
  (land tap/outside-tap/swipe + portrait) all still pass.
- (log 112 test_session — no page edit) Paul pasted the R2 URL of a fresh iPhone recording
  (rec_2026_08_25_1144.m4a) — the Admin → Upload-to-R2 pipeline WORKS end to end (test_record
  confirmed). New session page 2026_08_25_test.html (PAGE_ID test_2026_08_25) cloned from the
  08-07 page, 2026_08_25_test.json binds the R2 url, sessions.js entry added (name Test,
  dur/count 0 until first play caches it). Page JSON loads from raw.githubusercontent, so it
  binds only after the robot pushes. Playwright local: title/h1/menu row all correct.
- (log 113 rec_auto — no page edit) three features, one batch. hour_mark: fisheye-aware
  vertical bar + tiny 'Nh' label at each whole hour on all 8 session pages (renders inside
  render_fish_ticks so every glide/update repositions it). auto_session: Admin's Upload-to-R2
  now finishes the whole job — writes <rec_id>.json (audio + live tags) and registers the
  session in sessions_auto.json via the sync worker; NO copy-paste to Claude anymore. New
  generic session.html?p=<rec_id> page binds <rec_id>.json (title follows the label; ?t=
  keeps ?p=; share links keep ?p=). drawer.js merges sessions_auto.json into the Sessions
  list (PKEY identity so per-recording duration cache + current-row work). live_tag: big
  'Tag the moment' button while recording on Admin; taps become the session's initial
  moments. Playwright (routed workers + raw): hour marks 1h/2h ✓, session.html binds ✓,
  admin record→2 live tags→upload posts rec json + sessions_auto ✓.
- (log 114 rec_screen — no page edit) new record.html: the stripped-down record screen —
  Back (top left), editable session-name string (light text + pencil; defaults to the date,
  auto-prefixes the city via geolocation + bigdatacloud reverse-geocode when allowed, never
  overwrites a user edit), big round record button with pulse, blink-dot + elapsed time, big
  Tag the moment button (inert until recording). STOP now goes straight to upload → session
  json → sessions_auto registration (rec_auto flow inlined) — zero instructions on screen.
  The name string drives both label and file id (slug + date + hhmm). Drawer's 'New
  recording' row now opens record.html. admin.html left as the setup/instructions page.
  Playwright (fake mic + geo, routed workers): name 'San Francisco — 2026-08-25', 2 live
  tags, stop → 'Session ready ✓' with correct json + registry posts.
- (log 115 record_link — no page edit) Paul saw the old Record-a-jam block and thought the
  ship missed: he was on admin.html, which stays alive as the setup page. record.html and the
  repointed drawer are confirmed live in the repo (raw checks). Answer: the new screen is
  vampsf.com/record.html; reload any session page once so the cached drawer.js picks up the
  New-recording link.
- (log 116 admin_trim — no page edit) three parts. admin_trim: Admin loses the whole
  Record-a-jam block, the Steps list, and both notes — now just theme switch, a Record-a-
  session link (→ record.html), and the bucket button. list_check: the 'missing' session was
  NOT missing — both 08-25 recordings are in R2, their jsons in the repo, and both registered
  in sessions_auto.json; his phone was running the pre-rec_auto cached drawer.js. All pages
  now load drawer.js?v=116 / sessions.js?v=116 (cache-bust) so menu updates land on reload.
  name_time: record.html default name is now date + local hh:mm:ss (city still prefixes);
  rec_id folds the time in without doubling it (san_francisco_2026_08_25_19_49_38).
- (log 117 back_stop — no page edit) two things. name_match: the file IS named from the
  editable string (slugged) and the string is the session's label; the ready message now
  says 'saved as <id>.<ext>' so the match is visible, and a default-name recording lists as
  its time ('19:59:37 — 2026-08-25') instead of a generic 'Recording'. back_stop: Back on
  the record screen now equals stop when recording — finish, upload, build the session,
  then leave; and Back always lands on the session LIST: record → index.html#sessions →
  last session with the drawer auto-opened (drawer.js handles #sessions; index preserves
  the hash and now accepts session.html?p= as a valid last page). Menu scripts bumped to
  v117. Playwright: back mid-recording → 'saved as …m4a · 1 moment carried over' → lands on
  the last session, drawer open 564px, registry name = the time.
- (log 118 sync_hint — no page edit) new recordings show up before GitHub catches up.
  record.html stores the new entry as vampjam_pending_session (localStorage, 15-min expiry);
  drawer.js renders that row immediately with a breathing 'syncing…' where the duration
  goes, re-fetches sessions_auto.json every 20s until the registry contains it, then clears
  the marker and renders the row normally. session.html?p= on a 404 json shows 'Syncing this
  recording — it needs a moment to land…' and retries every 5s (40 tries). drawer.js?v=118.
  Playwright: pending row + syncing… while absent ✓, cleared + normal row once present ✓,
  session page syncing label then binds on the next retry ✓.
- (log 119 row_delete — no page edit) four parts. name_same: registry name is now the FULL
  session title (no more time-only rows); the drawer appends the date only when the title
  doesn't already carry it, so list row == session title exactly. placeholder_file: exactly
  what Paul suggested — record.html writes the entry into sessions_auto.json with
  pending:true BEFORE the R2 upload starts, so every device's list shows the breathing
  syncing… row while the file is still in flight; the final registry write clears the flag
  (drawer polls while any registry row is pending). play_alert: on session.html, Play while
  the audio isn't bound yet raises a native alert ('still uploading — give it a moment').
  row_delete: trash button far right on auto-session rows (recordings only — the static
  pages would need a repo edit), native confirm, then: entry removed from sessions_auto.json
  + <id>.json tombstoned {deleted:true} (session page then says 'This recording was
  deleted.'). The R2 audio file itself stays in the bucket — deleting it needs an
  upload-worker change (future). drawer.js?v=119. Playwright: placeholder→json→final
  sequence ✓, exact-title rows ✓, confirm+delete posts+row gone ✓, play alert ✓, tombstone ✓.
- (log 120 name_order — no page edit) NEW session-name convention: date first, then either
  the time (default recordings, '2026-08-25 12:38:05') or the venue ('2026-08-07 Sound
  Union'). Applied to: all 8 static page titles + h1s; drawer rows (date prepended only when
  the title lacks it — list row still == session title); record.html city default is now
  '2026-08-25 San Francisco', and an edited name that lacks the date gets it prefixed at
  upload ('Sound Union' → '2026-08-25 Sound Union'). drawer.js?v=120. Playwright: h1/title/
  rows all date-first ✓, city default ✓, typed-venue normalization in json label + registry ✓.
- (log 121 sync_done — no page edit) three parts. sync_done: the uploading device now flips
  its pending marker to done the moment everything lands, which suppresses the syncing… row
  immediately (raw CDN lag no longer keeps it breathing); other devices poll faster at first
  (8s x5, then 20s). time_12h: default names now use 12-hour time with lowercase a/p —
  '2026-08-25 1:05:09p' (rec_id slug follows). test_delete: the Test session's row had no
  trash because it was a STATIC page; converted it to an auto session — 2026_08_25_test.html
  moved to claude_trash/, sessions.js entry removed, sessions_auto.json (now also tracked in
  the repo working copy) gained session.html?p=2026_08_25_test, json label '2026-08-25 Test'.
  Its URL changed accordingly; the old page link is dead. drawer.js?v=121. Playwright: done
  marker suppresses syncing ✓, Test row has trash ✓, 12h format ✓.
- (log 122 delete_stick — no page edit) deletes were not sticking: every registry write
  (delete, record placeholder, final register) bases itself on a raw-CDN read that can be
  minutes stale, so a later write resurrected already-deleted rows (diagnosis: ALL 6 session
  jsons tombstoned, registry still listed 5). Fix: vampjam_deleted_pages tombstone list in
  localStorage (7-day expiry, cap 50) — delete records it FIRST; the drawer filters display
  AND all registry writes against it; record.html filters its two writes too; and a
  once-per-load heal pushes a purged registry when a fetched copy still lists a locally
  deleted page (>60s after the delete). Registry healed to [] now (repo write; Chrome
  bridge was down). Note: sessions_auto.json should normally flow through the worker only —
  repo writes of it risk clobbering (that contributed here). drawer.js?v=122.
- (log 123 rec_live — no page edit) record.html now mirrors the playback page while
  recording. Control row with the big record button where play sits and the six seek buttons
  present but inert (0.3 opacity, pointer-events none — nothing to seek). A growing time
  bar appears once recording starts: it re-proportions every 250ms tick, breaking into
  10-minute segments (5px bg gaps) as they accrue, hour bars + 'Nh' labels, and a dot strip
  below with one dot per tagged moment (positions shift as total time grows). No playhead —
  tapping a dot scrolls to and flashes its row instead. Below, a playback-style moments
  list grows with each Tag: number, EDITABLE name field ('name this moment'), time. Names
  typed live ship as the tags' labels in the session json. window.__rec_set_elapsed test
  hook. Playwright: 2 tags → 2 rows + 2 dots ✓, 4000s render → 6 seg ticks + 1h@90% ✓, dot
  click flashes row ✓, typed name 'killer riff' arrives in the uploaded tags ✓.
- (log 124 git_heal — no page edit) rec_live never reached vampsf.com: the save robot's
  merge hit a conflict (local delete_stick set sessions_auto.json to [] while the Worker's
  commits — Paul's 2:14p recording — changed it on origin) and the script aborts on merge
  failure, so the Mac sat ahead 4 / behind 16 with pushes rejected since delete_stick.
  Fix: auto_push_vampjam.sh merge is now `git merge -X theirs` — conflicts resolve to
  origin's copy (the Worker is source of truth for the files it writes; local-only files
  like record.html are untouched). Also learned: the device bridge cannot repair git itself
  (unlink blocked), and my stray index.lock is cleared by the robot's own rm -f preamble.
  Standing rule reaffirmed: never ship sessions_auto.json in a batch again.
- (log 125 rec_polish — no page edit) record.html: vampSF wordmark now sits centered up top
  (same Sacramento + SF treatment as playback; Back stays top-left); the six seek buttons
  are display:none (hidden, not dimmed); moment NUMBERS render above the bar at each dot's
  position; a time row below reads cur / dur — both the same number while recording, kept
  for consistency with playback. Moment rows lost their placeholder text, and a new moment
  drops the caret straight into its empty name field synchronously inside the tap (phone
  keyboard opens; desktop gets the blinking beam) + scrolls the row into view. Playback
  pages (7 + session.html): the 'tag' placeholder removed from highlight rows — add_tag
  already focused the new row's field, unchanged. Playwright: wordmark ✓, buttons hidden ✓,
  focus lands + typed 'sweet solo' persists ✓, numbers strip ✓, cur/dur pair ✓, playback
  placeholder gone ✓.
- (log 126 tag_below — no page edit) record.html: the Tag-the-moment button moved from
  above the time bar to directly below it (order now: record button, timer, bar + numbers +
  dots + cur/dur, Tag button, moments list). Playwright: tag button top 344 > bar top 269 ✓.
- (log 127 circle_gone — no page edit) circles retired on BOTH screens — the numbers above
  the bar carry the job. Record: dot strip removed; the numbers are the tap targets now
  (scroll+flash the row); renders/reset updated, no leftover refs. Playback (7 pages +
  session.html): .tag_marker display:none (the numbers were already tap-to-seek, so nothing
  lost; zoom band strip untouched). Tag-the-moment buttons now match across screens:
  playback .tag_btn_big = block, width 100%, max-width 420px, padding 20px, font 20,
  radius 14 — same as Record's. Playwright: record 0 dots / 1 number / tap flashes row ✓,
  playback markers hidden + 2 number labels ✓, widths 354 vs 358 (same cap, different
  gutters) ✓.
- (log 128 bar_early — no page edit) record.html: the time bar (with its 0:00 / 0:00 time
  row) now sits in place from page load — empty light gray — instead of appearing when
  recording starts, so nothing new pops in. render_bar's empty state clears ticks/numbers
  and pins the times at 0:00. Playwright: bar visible pre-record, 6px, 0:00/0:00 ✓.
- (log 129 delete_spin — no page edit) delete now shows its work: on confirm the row stays
  put but grays to 0.45 (link inert) and the trash swaps for a small red ring spinner
  (0.8s loop) while the two registry writes run; the row leaves only when they land. If the
  write fails, the row and its trash button come back (local tombstone reverted) with a
  'Delete failed' toast. drawer.js?v=123. Playwright (900ms-slow sync route): mid-delete
  row grayed + spinner + no trash ✓, gone after writes ✓.
- (log 130 local_keep — no page edit) recordings can no longer be lost between mic and
  cloud. record.html persists to IndexedDB (db vampjam_rec: recs meta + chunks) AS IT
  RECORDS — MediaRecorder now runs 5s timeslices, each chunk lands in IDB with meta
  (label/date/dur/tags incl. typed names, state recording→ready→gone-when-uploaded).
  Reload mid-recording: chunks survive, recovery marks it ready. Upload fail: stays ready,
  status says 'your recording is safe on this device — it shows in Sessions as local'.
  record.html on load auto-retries every ready local (?up=<id> prioritizes one); success
  cleans the IDB copy. rec_id_from avoids doubling times in ids. Drawer (v124): local
  recordings list like sessions with an amber 'local' chip, playable, deletable (own
  confirm — 'this device only, final'); PKEY understands ?local=. session.html?local=<id>:
  plays from the device copy (blob URL), tags render and EDITS persist to IDB (repo sync
  diverted), title gains '· local', banner 'on this device only — upload to the cloud'
  (→ record.html?up=<id>). Playwright end-to-end: fail→ready meta w/ typed tag ✓, drawer
  local row+chip+trash ✓, local page blob playback + banner + tag label ✓, ?up recovery
  uploads, registers, cleans IDB ✓.
- (log 131 bar_tune — no page edit) timeline polish + instant local row. Playback pages
  (7 + session.html): zoom_band (light section highlight under the bar) display:none;
  seek_bar 6px → 9px thick (radius 4); tag numbers 11px → 13px (strip 13 → 16px, z-index 4
  so nothing blocks them); hour labels 9px → 13px — same size as the tag numbers. Record
  page matches (rec_bar 9px, mom_no + hour_lbl 13px). local_keep hardening per Paul's ask:
  save_meta('recording') now fires the instant recording starts — the local session (row +
  pointer to the device file) exists from second zero, before the first 5s chunk, so a
  wrecked record page still leaves a listed, recoverable, auto-uploading local recording
  (recovery flow from 130 already retries it). Playwright: bar 9px, band gone, both label
  sizes 13px, meta present 0.5s after start ✓.
- (log 132 row_one — no page edit) the duplicate rows in Paul's screenshot were the local
  IDB row and its unlinked cloud placeholder. Now linked: upload_core stamps the local
  meta with cloudPage the moment the upload starts; drawer (v125) dedupes to ONE row per
  recording — local row wins while the cloud side is absent or still a placeholder (its
  pending twin hidden); the registered cloud row wins once real (local twin hidden until
  its cleanup catches up). Placeholder entries now carry ts and stop showing syncing…
  after 30 min (stale ghosts stay visible + deletable, just not breathing). The local
  copy is still deleted ONLY after the cloud registration confirms — the 2.5-hour-session
  guarantee stands. Playwright: placeholder+local → 1 local row ✓, registered → 1 plain
  row ✓, 40-min ghost → no syncing ✓.
- (log 133 local_clear — no page edit) a row that still says local self-heals on page
  load: reconcile_locals (drawer v126) checks each local rec's cloudPage against the
  registry — a registered (non-pending) twin proves the cloud has it, so the device copy
  is deleted and the plain cloud row stands; if the registry doesn't show it, ONE direct
  raw check of <id>.json runs per load, and only a json with a real audio.url (and not
  deleted) clears the local copy. Nothing is cleared without cloud proof. Debug chase: the
  first cut's reconciled guard sat ABOVE the twin check, so a json-404 first pass blocked
  the later registry pass — guard moved to the json path only. Playwright: registered twin
  → IDB cleared + plain row ✓, json-only proof → cleared ✓, no cloud proof → local kept ✓.
- (log 134 fav_heart — no page edit) three features. rec_blue: the record bar turns full
  accent the moment recording starts (recorded audio = blue), still segmenting into 10-min
  gaps as it grows; pre-record stays gray. fav_heart: every playback moment row has a gray
  outline heart → accent when favorited; fav:true rides the tag through the session json,
  the repo sync (both directions), and local-mode IDB saves; localStorage vampjam_fav_seen
  flips on first sight of any favorite; the drawer (v127, rebuilt fresh on every open)
  gains a Favorites row (heart icon, above the sessions) once seen. New favorites.html:
  DERIVED view — fetches every session json (static + auto registry), lists every fav
  moment (session name date-first + editable name + time + filled heart), tapping play
  loads THAT session's audio, jumps to the moment (title stays Favorites, session name
  shows under it), plain seek bar + click-to-seek; unfav and renames write back to the
  SOURCE json via the sync worker, so every view agrees. key_scroll: on the record screen
  the moments list now scrolls ITSELF (page holds still) — visualViewport-sized max-height
  keeps the newest row visible above the phone keyboard, re-fitted when the keyboard
  animates in. Playwright: hearts render/toggle + fav in sync payload ✓, Favorites row on
  drawer open ✓, favorites page aggregates/plays/unfavs with write-back ✓, blue bar while
  recording ✓, list overflow auto ✓.
- (log 135 tag_juicy — no page edit) Tag-the-moment slimmed to max-width 300px and made
  juicy on both screens: pill shape (999px), vertical accent gradient (hover→accent→active
  tokens so every theme works), soft glow shadow in the accent color + inner top highlight,
  brightness lift on hover, squish-and-settle press (scale 0.96 + reduced shadow). Disabled
  state drops the shadow. NOTE: shipped together with fav_heart in one commit — the Mac
  bridge was offline when 134 finished, so both batches land on reconnect under this
  commit_msg (tag_juicy); spec/log carry both entries.
- (log 136 focus_guard — no page edit) the 'black shelf' Paul filmed is iOS Safari
  force-scrolling the page into the void when focus jumps to a NEW input while the
  keyboard is already up (second Tag in a row). Fix: every programmatic tag-name focus is
  now focus({ preventScroll: true }) with a plain-focus fallback — record.html add_moment
  AND all 8 playback pages' add_tag — and record.html's visualViewport resize handler
  pins window.scrollTo(0,0) so the keyboard can never strand the page. Playwright: two
  Tags back-to-back → scrollY 0, both rows, focus on the newest ✓.
- (log 137 batch_land — no page edit) mystery solved by Paul himself: the Favorites row
  was missing because the Mac was closed, so batches 134-136 had never landed. On
  reconnect the queued files committed as focus_guard and the robot pushed within seconds
  — favorites.html, drawer v127, and the fixes confirmed live on origin.
- (log 138 fav_stick — no page edit) hearts vanished on reload for the same reason deletes
  once did: the save works but the raw CDN serves a minutes-stale json right back, and the
  merge (repo-authoritative) wiped the flag. Fix on all 8 playback pages: recent heart
  flips are stored per-device (STORAGE_TAGS + '_favov', 10-min expiry) and overlaid on
  every merge — this device's recent flip beats a stale read in BOTH directions; plus a
  visibilitychange flush fires any pending debounced save the moment the page hides (a
  heart + quick reload no longer races the 3s debounce). Playwright vs permanently-stale
  raw: tap → on ✓, hide-flush posts fav:true ✓, reload → still on ✓, unfav + reload →
  stays off ✓.
- (log 139 push_lag — no page edit) Paul retested before fav_stick had left the Mac: the
  robot had committed+merged but its push lagged a few minutes (ahead 2); a commit_msg
  touch re-fired it and origin now carries _favov (confirmed via git show on main). His
  earlier heart DID persist — 2026_08_07_sound_union.json holds "fav": true — the loss was
  purely the stale-read display bug fav_stick fixes. Remaining lag is GH Pages HTML cache
  (max-age 600): a hard reload or ~10 min.
- (log 140 fav_global — no page edit) hearts held per-session but fresh ones missed the
  Favorites page: it reads stale raw jsons and couldn't see the device's recent flips
  (stored under per-page keys). The override store is now ONE global key (vampjam_favov —
  tag ids are unique app-wide); all 8 playback pages use it, and favorites.html overlays
  it on every fetched session (apply_overrides) so a just-hearted moment appears there
  instantly. Favorites' un-heart also writes the override (session pages agree at once)
  and applies overrides to the source copy before write-back, so a stale fetched json can
  never clobber this device's recent flips. Playwright vs permanently-stale raw: heart on
  session → appears in Favorites ✓, un-heart from Favorites → session shows it off ✓.
- (log 141 fav_push — no page edit) Paul's principle confirmed and closed: local overrides
  must still land in the shared files. They already did (the heart tap writes the json
  immediately); what was missing was self-healing when that write is lost or clobbered.
  Now every merge compares the repo copy against this device's recent flips — if they
  disagree, the page queues one 'push fav flips' save that writes the corrected tags up;
  when they agree, no write fires. Handled both page variants (mapped/merged). Playwright:
  repo-says-no + local-says-yes → healed push carries fav:true ✓; repo agrees → zero
  writes ✓.
- (log 142 tag_blur — no page edit) Tag-while-keyboard-up still glitched on iOS even with
  preventScroll (136), so add_moment now does exactly what Paul prescribed: if a moment
  name currently holds the keyboard, blur it FIRST (keyboard released), then create the
  row, then hand focus to the new empty name inside the same tap (keyboard returns on the
  new field). Playwright: type in row 1, tag again → 2 rows, first name kept, focus on the
  new row, page unscrolled ✓.
- (log 143 fav_name — no page edit) favorites.html: the playing session's name (#now_name)
  moved from under the Favorites title to between the play/pause circle and the timeline
  bar (margins adjusted). Playwright: play.bottom ≤ name.top ≤ bar.top ✓, shows
  '2026-08-07 Sound Union' ✓.
- (log 144 fav_time_hide — no page edit) favorites.html: the timestamp on each favorite
  row is hidden (CSS display:none on .fav_time — the element still renders, so restoring
  it later is one line). Read 'highlight bar' as the favorite rows; if Paul meant the
  cur/dur under the timeline instead, flip that on request.
- (log 145 row_time_hide — no page edit) clarification of 144: the per-row timestamps
  (e.g. 50:11) are now hidden on EVERY highlight row across the app — .tag_time
  display:none on all 8 playback pages (appended override; the tap-to-jump on the time is
  gone with it, but the row's play button and the bar numbers still seek) and .mom_time on
  the record screen's moment rows. All CSS-only, one line each to restore. Playwright:
  playback + record rows show no times ✓.
- (log 146 fav_sess_right — no page edit) favorites.html rows: the session name moved from
  a small line above the title to the SAME line as it — right-justified, tucked beside the
  heart (muted 12px, ellipsis past 42% width). Playwright: same line ✓, right of the name
  ✓, adjacent to the heart ✓.
- (log 147 land_circle — no page edit) the landscape ovals: the control row (6×52 + 84 +
  gaps ≈ 468px) overflowed the ~408px split column, so flex-shrink squeezed widths while
  heights held — ovals. Fix on all 8 playback pages: base .ctrl_btn gains flex:0 0 auto
  (circles can never squash anywhere), and the split media block sizes the row to FIT —
  gap 6px, side buttons 44px, play 68px (row 399px). Playwright: landscape play 68x68,
  all sides 44x44, row 399 ✓; portrait unchanged (76x76) ✓.
- (log 148 full_width — no page edit) phone landscape now uses the whole viewport. The 8
  playback pages' split grid body drops its 16px gutters for max(8px, env(safe-area-inset))
  each side — edge to edge, with only the notch keeping its clearance. record.html gains a
  matching landscape media block: same paddings, and top_bar/name_row/stage lose their
  560px cap so the growing bar spans the screen. Playwright landscape: seek bar starts at
  8px, list ends at 836/844 ✓; record bar 828/844 ✓.
- (log 149 one_size — no page edit) one text size app-wide: a global override
  (`body :not(...) { font-size: 17px !important; }`) appended to every page — 8 playback
  pages, session.html, record.html, favorites.html, admin.html. Exempt: the vampSF
  wordmark (and its SF span), and the glyph buttons whose ICONS scale with font-size
  (.play_btn, .rec_btn, .fav_play — those aren't text). Number/hour strips bumped to 20px
  height so 17px digits don't clip. Playwright: h1, tag button, bar numbers, hour labels,
  times, row names, ctrl labels all 17px; wordmark 68/34, record dot 38 ✓.
- (log 150 size_confirm — no page edit) Paul specified which size the one-size should be:
  the highlight title's. That is the size 149 already standardized on — the highlight list
  ran at 17px and the app-wide override is 17px — so no change was needed; confirmed and
  logged.
- (log 151 tri_big — no page edit) bigger play triangles everywhere: the big play glyph
  56px base (48 on narrow portrait, 44 in the landscape split — buttons unchanged), row
  triangles (.play_tag) escape the one-size rule at 26px, favorites rows match
  (.fav_play_sm 26, big circle glyph 38). Also fixed a one_size leak found in testing:
  the universal 17px rule was hitting the SVG elements themselves (1em resolves against
  the svg's own font-size), pinning every em-sized icon at 17 — :not(svg) added to the
  override on all 11 pages, so icons inherit their button's size again. Playwright: big
  triangle 48, row triangles 26, hearts/text still 17 ✓.
- (log 152 fav_sort — no page edit) favorites.html sorts by session date DESC (sources now
  carry date; autos included), moments within a session stay in time order. Playwright:
  08-07 favorites above 05-23's, early-before-late within the session ✓.
- (log 153 list_order — no page edit) session list reordered (drawer v128): Favorites on
  top, New recording next, sessions newest-first, Admin at the bottom; opening the panel
  now scrolls to the TOP (was bottom, from the oldest-first days). Durations line up in a
  right-aligned tabular column (menu_sub min-width 84, flex-end). Playwright: order
  Favorites/New/08-07…01-17/Admin ✓, scrollTop 0 ✓, all sub right edges 327 ✓.
- (log 154 admin_slim — no page edit) admin.html loses the 'Add a new session' heading,
  the 'Recording happens on its own page now.' line, and the Record-a-session button.
  Admin is now: wordmark, back link, theme switch, and the bucket button.
- (log 155 registry_heal — no page edit) the session list stops losing recordings. Root
  cause: every registry write started from a raw-CDN read that lags minutes, so each new
  recording's placeholder/register (and every 'purge deleted rows') overwrote rows the
  CDN hadn't shown yet — uploads 'succeeded', then vanished from the list. Fix: (a) every
  registry WRITE now starts from the GitHub contents API (sees commits instantly; the raw
  CDN stays for display reads only), (b) vampjam_my_recs roster — each device remembers
  what it registered, unions it into every registry write AND into the displayed list,
  and heal_registry re-adds lost rows (one write per load, 90s grace for in-flight
  writes), (c) one-time restore — the 9 orphaned recordings (live json + audio, never
  deleted) rebuilt into sessions_auto.json from the repo jsons, durations estimated from
  each recording's last tag; deliberate one-shot exception to the never-ship-
  sessions_auto rule, race-checked after push. Also play_deck (drawer v129): the
  transport panel (.ctrl_row, now id=play_deck) docks into the lower 20dvh of the
  viewport while the session list is open — the list gets 80dvh (was 72vh) — and
  split-landscape keeps its own layout. And dur_align: duration + moment count are two
  fixed right-aligned columns (48/26px) and rows without a trash can reserve its 30px
  slot, so every duration ends on the same right edge. Playwright: deck fixed, bottom 0,
  20% of viewport ✓; drawer 80% ✓; roster row displayed + heal write unions
  fresh+roster ✓; record flow keeps stale+fresh+roster+new in both writes ✓; duration
  right edges all equal ✓.
- (log 156 orphan_sweep — no page edit) sessions publish themselves, no Claude needed:
  orphan_sweep (drawer v130) lists the repo's json files via the GitHub API (6h throttle
  per device), fetches the ones the registry doesn't know, and re-registers any with live
  audio — displayed immediately, written with the usual fresh+roster union. Durations
  self-improve: dur_overlay pushes this device's cached real durations (vampjam_dur_,
  learned on play or probed) into every registry write, and the sweep probes audio
  metadata for orphans and zero-dur rows (probe_dur, metadata-only, 8s cap); a sweep with
  only dur corrections writes 'dur refresh'. count_left: the moment count column is now
  left-justified (26px min-width, 8px gap) after the right-aligned duration. name_time:
  default AND city session names carry the time as h:mm + a/p after the date
  ("2026-08-26 6:31p", "2026-08-26 10:31a San Francisco"); rec_id_from strips the
  minutes-only time from the slug and appends the full h_mm_ss id time, so recordings a
  minute apart still get distinct files; dead rec_id() removed. Playwright: orphan row
  appears + 'sweep orphans' write carries it ✓; counts left-aligned at one edge, dur right
  edges equal ✓; default name h:mm[ap] ✓; upload id has single full time ✓.
- (log 157 confirm_pop — no page edit) session/local-recording deletes use the same
  themed pop-up as the highlight delete instead of the native confirm: drawer_confirm in
  drawer.js (self-contained jamc_* styles injected, white-space:pre-line, works on every
  drawer page incl. favorites), Cancel / red Delete, tap-outside dismisses. Playwright:
  overlay shows, Cancel = no write, Delete = registry write, no native dialog fired ✓.
- (log 158 play_unit — no page edit) the docked transport is undone in favor of one solid
  piece: play_unit = wordmark down through the timeline and transport. With the session
  list open the page below stays in normal flow, so the whole unit is pushed down
  together and its top (the vamp sf logo first) shows in the lower 20% — partially
  visible is fine, detached is not. Removed the body.drawer_open .ctrl_row fixed-dock CSS
  and its split-landscape override from the 8 session pages (drawer v131); the
  body.drawer_open class and the play_deck id stay as hooks. Playwright: deck static,
  wordmark visible right below the open list ✓.
- (log 159 share_left — no page edit) session rows reorder to name · share · duration ·
  count · trash: the share button moved out of the row link to sit just left of the
  duration column; menu_sub carries its own color/nowrap now that it lives outside the
  link. Playwright: child order jam_link/jam_share/menu_sub/jam_del ✓, share right edge
  ≤ duration left ✓.
- (log 160 dur_hide — no page edit) durations come off the session list rows (drawer
  v132): rows now read name · share · count · trash; the local badge drops its duration
  too. Durations stay in the registry data (and keep self-improving via dur_overlay) —
  they're just not displayed. menu_sub loses its 84px dur column width; counts keep
  their 26px left-aligned column. Playwright: zero .jam_dur elements, no m/h:mm text in
  the sub column, counts share one left edge ✓.
- (log 161 list_swipe — no page edit) the session list scrolls like a list again (drawer
  v133). Was: any upward swipe while open closed the sheet, and only from the list's own
  TOP. Now: a swipe that starts inside the list scrolls it freely up and down, and closes
  the sheet only when the list is already at its BOTTOM and you swipe again (onStart
  records drag.inList; the close branch bails to native scroll while
  scrollTop + clientHeight < scrollHeight - 2, and a non-overflowing list is treated as
  at-bottom). A swipe that starts on the play_unit below (logo, name, player, timeline,
  transport) closes immediately, as before. Close snap softened from 30% to ~18% of the
  open height, so 'swipe some more' is a push, not a haul. count_center: the moment count
  is centered on one shared axis across every row (menu_sub justify-content center,
  min-width 30; .jam_count text-align center). Playwright (touch, 14 rows): mid-list swipe
  up keeps it open and scrolls (0 → 515) ✓, swipe down scrolls back ✓, at-bottom swipe
  closes ✓, wordmark swipe closes ✓, 21 counts share center 317 ✓.
- (log 162 tag_clamp — 8 pages) his screenshot: moment 21 sat far off the right edge and
  squeezed the whole page. Cause: a moment tagged past the duration the audio file reports
  (t > eff_dur) made fish_x return > 1, so the label was positioned past 100% and widened
  the document. Fix on all 8 playback pages: fish_x clamps its result to [0,1] (markers,
  hour labels and the playhead all ride the bar now), place_tag_numbers additionally keeps
  each label's center within [10, W-10] px so no glyph hangs off the strip, and
  html/body get overflow-x: clip — clip, not hidden, so the sticky player still sticks.
  Overrun moments pile at the right end and the existing 16px collision rule shows one of
  them. Playwright: 21 tags over a 1:54 duration → scrollWidth == clientWidth (was
  overflowing), every label right edge ≤ the strip's ✓; normal 29-tag page unchanged
  (13 labels, 21→360 inside a 16→374 strip), sticky position still 'sticky' ✓.
- (log 163 control_panel — 9 pages + drawer v134) he named the center panel: control_panel
  = wordmark · session name · transport · timeline (the codename play_unit/play_deck is
  retired; the transport row's id is now transport_row, and drawer.js comments follow).
  control_panel_shadow: .session_drawer::after — a sticky, bottom-pinned strip
  (width min(760px,100%), height 16, margin-bottom -16 so it adds no scroll height,
  border-radius 0 0 14 14) painting a linear-gradient that fades upward into the list.
  Replaces the old inset .sess_overflow shadow: it was conditional on overflow and ran the
  drawer's full width; this one is row-width and present the whole time the list is open.
  (First attempt used box-shadow with a -7px spread on a zero-height box — the spread
  collapses the rect, nothing paints; the gradient is the reliable form.) line_reveal: a
  tap anywhere on the timeline now scrolls the highlight list so the playhead line — the
  spot you landed between highlights — is centered in view (reveal_playhead_line, called
  on both seek-bar branches; it re-renders the line first, then scrollIntoView center on
  the neighbouring row, since the line itself is zero-height). Playwright: ::after sticky,
  358px = row width, sits at the drawer's bottom with the brand right below ✓; tap at 72%
  of the bar → page scrolls 0 → 881 and the line's row lands centered and visible ✓;
  screenshot confirms the band fades up into the card's rounded bottom.
  FIX in the same batch: favorites.html had been truncated to 0 bytes in 162 by a
  read-after-open('w') mistake in the patch script (the open for writing emptied the file
  before the read). Restored from git (ff94455~1) and re-shipped with the v134 bump and
  the control_panel shadow. Guard for next time: never open a file for writing in the same
  expression that reads it.
- (log 164 land_margin — 9 pages) his landscape screenshot: ~60px of dead space on each
  outer edge. Cause: iOS reports the notch inset on BOTH sides in landscape, and the split
  rule took it whole (max(8px, env(safe-area-inset-*))). Now clamp(8px, env(...), 24px) on
  the 8 playback pages' split rule and record.html's landscape rule — a real margin, capped
  at 24, so both panes reach out toward the edges; column-gap 14 → 10. That returns ~72px
  of width in landscape, which goes to the highlight titles. Playwright (932×430): clamp
  resolves 59px inset → 24px and no inset → 8px; list right edge 924 of 932 ✓; portrait
  untouched (the rule lives only in the split query).
- (log 165 tap_select — 9 pages) editing a highlight's text is now gated on selection.
  Was: single tap = play, double tap = edit (a 350ms timer, and the field unlocked on the
  first tap). Now: a label renders readOnly unless its tag IS activeTagId, so a tap on an
  UNSELECTED highlight only plays/selects it, and a tap on the SELECTED one is a native
  tap on an already-editable input (iOS decides the keyboard from the element state at tap
  start — hence set at render, not on tap). blur keeps the field editable while its row
  stays selected. The selecting tap can't leak into an edit: labelHandleTap opens a 450ms
  suppressLabelFocusUntil window; the re-rendered label preventDefaults pointerdown and
  blurs any focus inside it, which swallows the ghost click that follows a touch.
  Also, record.html's add_moment blur-first guard (already there since 142) now blurs ANY
  focused input, not only a .mom_name — the session-name field counted too. Playwright
  (touch): tap unselected → active, not focused ✓; tap again → focused ✓; type + Enter →
  saved, still selected and editable ✓; tap another row → it plays, the old one re-locks ✓.
- (log 166 btn_calm — 9 pages) two visual complaints from his screenshots. blocked_calm:
  the amber block behind a row's play triangle was the autoplay-blocked state
  (.play_tag.autoplay_blocked — var(--warn) fill + pulse_warn keyframes, painted whenever
  a play() promise had been rejected and that row was active). Rule, keyframes and the
  class assignment are gone; the button looks normal and tapping it still clears the flag
  and plays. btn_calm: 'Tag the moment' went pale-with-white-text when the keyboard came
  up — the pill's colour lived ONLY in a background gradient, and iOS drops it when it
  re-rasterises the sticky layer. Now background-color: var(--accent) sits under the
  gradient, so the colour cannot fall away; the :hover rule is deleted (iOS leaves hover
  stuck after a tap, which was the other half of the drift) and filter is out of both the
  :active state and the transition — the press is a scale + shadow only, so the button
  looks the same except for the split second it is tapped. Same treatment on record.html's
  .tag_btn. Playwright: background-color rgb(0,113,227) with the gradient still layered,
  no filter in the transition, no .autoplay_blocked rule or class anywhere ✓.
- (log 167 kbd_black — 10 pages + theme.js v2) a second theory of the black slab above the
  keyboard, and four changes that each remove a known WebKit cause. (1) canvas_paint: the
  black is the BROWSER's own surface, not our page — anything outside the document (the
  strip the keyboard exposes, the rubber-band area) is painted with the system appearance,
  black in dark mode. theme.js now sets html.style.background from the theme, a
  <meta name=theme-color>, and root color-scheme (light for Minimal, dark for Yellow and
  Night); html/body backgrounds carry literal fallbacks (var(--bg, #ffffff)) so the canvas
  is never transparent even before theme.js runs, and body gets min-height 100dvh so the
  painted box always covers the viewport. (2) momentum_layer: every
  -webkit-overflow-scrolling: touch removed (8 split .tag_list rules + record.html's
  .mom_list) — the legacy UIScrollView-backed layer is a long-standing cause of blank/black
  regions when the keyboard opens, and iOS has done momentum scrolling by default since 13.
  (3) scroll_clamp: a visualViewport resize/scroll guard on all 9 pages — when the layout
  viewport shrinks, the page can end up scrolled PAST its own bottom, and that gap is the
  canvas; the guard clamps scrollY back into the document and re-centers the focused field.
  record.html's existing handler gained the same clamp. (4) The html/body overflow-x: clip
  from 162 is gone (a clipped root is itself a blank-render trigger); it turned out to be
  masking a real 14px overflow from the control row, so ctrl_fit gives .ctrl_row the gutter
  back (negative margins, gap 4 → 3) under 480px and the document no longer scrolls
  sideways at all. Playwright: html/body painted #ffffff, color-scheme light, theme-color
  meta present, zero -webkit-overflow-scrolling rules, no clip; viewport shrunk to 380 with
  the scroll pushed past the end → scrollY clamped back inside ✓; scrollWidth == clientWidth
  ✓; 163/165 regressions clean.
- (log 168 m4a_upload — no page edit) he has an m4a on the laptop Desktop for a
  2026-08-14 Sound Union session and asked for the fewest explicit steps. Neither side can
  upload it for him: the sandbox has no egress to R2/workers (curl → 000) and the device
  shell has none either, and the repo gitignores m4a, so the file must go up from his
  browser. Answer given: rename to 2026_08_14_sound_union.m4a → drag into the vampjam-audio
  bucket (dash.cloudflare.com/?to=/:account/r2/default/buckets/vampjam-audio) → say
  'uploaded', and I write 2026_08_14_sound_union.json ({audio:{label:'2026-08-14 Sound
  Union', url: pub-33cfd…r2.dev/<file>, kind:'url'}, tags:[]}) plus the registry row via the
  sync worker. Caveat flagged: the R2 dashboard tops out around 300 MB per file; over that
  we fall back to a GitHub Release asset (2 GB), which is how the pre-R2 sessions are still
  hosted.
- (log 169 release_upload — no page edit) the R2 dashboard refused the file (300 MB cap,
  as flagged in 168). Routes considered: our own upload worker is out (Workers cap the
  request body at 100 MB on the free plan), S3 API needs credentials + a CLI, and
  re-encoding on his Mac (ffmpeg is there — /usr/bin/ffprobe answered in an earlier check)
  would cost quality AND still need an upload afterwards. Chosen: a GitHub Release asset,
  2 GB limit, browser-only, and already how five pre-R2 sessions stream today. Steps given:
  releases/new → tag 2026_08_14_sound_union → drag the file → Publish; the asset then sits
  at github.com/mPulseMedia/vampjam/releases/download/2026_08_14_sound_union/
  2026_08_14_sound_union.m4a, which is the url that goes in the session json. Standing
  move_to_r2 item unchanged — this adds one more release-hosted file to it.
- (log 170 sess_0814 — new page + manifest) the file that got refused was the wrong one;
  the right (smaller) one is in the R2 bucket, so the release route is dropped. Built the
  session the STATIC way (the worker's registry can't be written from here — no sandbox
  egress to workers.dev, and shipping sessions_auto.json is forbidden since 124):
  2026_08_14_sound_union.html is a copy of the 08-07 page with PAGE_ID
  sound_union_2026_08_14, its own <title> and h1, and the stale 'current' marker on the
  static fallback row cleared; DATA_PATH derives from the filename, so it reads the new
  2026_08_14_sound_union.json ({audio:{label:'2026-08-14 Sound Union', url:
  pub-33cfd…r2.dev/2026_08_14_sound_union.m4a, kind:'url'}, tags:[]}); sessions.js gains
  the row (dur 0 — durations aren't displayed since 160 and the page caches the real one
  on first load) and every page's manifest is cache-busted to v=129. Assumption on the
  record: the bucket object is named 2026_08_14_sound_union.m4a, per the rename step in
  168 — the Chrome bridge could list his tabs but not read page text, so the bucket
  listing could not be confirmed from here; if the audio 404s it is a one-line url fix in
  the json.
- (log 171 hour_line — 9 pages) three timeline asks. ctrl_edge: the transport circles line
  up with the seek bar — the negative gutter margins from 167 are gone and the circles are
  sized to fit inside the gutter instead (44 side, 70 play, gap 3), so the row's left and
  right edges are the bar's exactly (measured 16 → 374 on both). fish_tick 5px → 3px, so
  the section gaps along the bar are slimmer. hour_line: the hour marker is a 1px hairline
  (was a 2px rounded bar) that now runs from just above the bar down to its number's
  baseline (bottom: -20px on the playback pages, -19 on record — the numbers render at
  17px under one_size, so the baseline sits ~20px below the bar), and the number is set
  BESIDE the line (margin-left 4, no translateX) instead of centered on it; a .flip class,
  applied in render_hour_marks when the label would run past the bar's right edge, puts it
  on the left of the line instead. Playwright: row and bar share edges ✓, tick 3px ✓,
  1px marks ending at 352 with label baselines at ~352 ✓, no flips needed at 2h ✓, no
  horizontal overflow ✓.
- (log 172 btn_gray — shipped inside the 171 commit) the real reason 'Tag the moment'
  turned gray and STAYED gray, which 166 had only papered over: the generic
  `button:hover { background: var(--panel_3); }` in the base stylesheet outranks a plain
  class selector (0,1,1 vs 0,1,0), and iOS leaves :hover stuck on whatever was tapped last
  — so the shorthand also wiped the gradient. Now that rule lives inside
  @media (hover: hover) and (pointer: fine), touch devices never get a lingering hover,
  every button gets -webkit-tap-highlight-color: transparent, and the Tag button re-asserts
  its blue at button.tag_btn_big{,:hover,:active,:focus} — a specificity the generic rules
  cannot beat. Press is a scale-down that springs back. Playwright (touch context):
  background rgb(0,113,227) with its gradient before the tap, after the tap, and with the
  pointer parked on it ✓.
- (log 173 tap_zoom — 12 pages) a mis-aimed double tap beside a button was making the
  browser zoom the page. touch-action: manipulation on html and body of all 12 pages
  (8 session pages, session.html, record, favorites, admin) — it drops the double-tap-to-
  zoom gesture while leaving pinch-zoom and every scroll untouched, which beats
  user-scalable=no (iOS ignores that anyway, and it would kill pinch too). touch-action
  does NOT inherit, so a second rule names the things actually tapped:
  button, a, input, label, .jam_item, .tag_row, .mom_row. The drag handles' own
  touch-action: none and .tag_list's pan-y both outrank it and are unchanged. Playwright:
  html/body/button all report manipulation on every page, .tag_list still pan-y, drag rule
  intact, 171/172 regressions clean.
- (log 174 icon_big — 10 pages) every icon in a highlight row up 33%: the play triangle
  26 → 35, and the heart / share / x / nudge chevrons 17 → 23. The ghosts needed the
  one_size rule to let go — its selector scores (0,6,1), so no !important on a plain class
  could beat it; :not(.ghost) added to the exclusion list and a plain
  `button.ghost { font-size: 17px }` keeps every ghost elsewhere at the app size, with
  .tag_row/.fav_row ghosts at 23. The triangle also got line-height: 0 (as favorites
  already had): at 35px the inherited 1.45 line box was adding ~16px to every row.
  Favorites rows match. Playwright: triangle svg 35x35, heart 23x23, rows 61px (were 54,
  would have been 78 without the line-height fix).
- (log 175 row_rule — shipped inside the 174 commit) a hairline between highlight rows:
  `.tag_row + .tag_row { border-top: 1px solid var(--panel_3); }` (and .fav_row on
  favorites). The adjacent-sibling combinator IS the rule he asked for — where the blue
  playhead line (or the drag indicator) sits between two rows they are no longer siblings
  in sequence, so no line is drawn there, no JS involved. Playwright: borders 0,0,1,1,1,1
  with the playhead after row 1, and the row right after the line reports 0px ✓.
- (log 176 close_light — drawer v135) closing the session list took too long a swipe. The
  snap test was symmetric-ish (close needed cur > max * 0.82 — about 112px of travel on a
  780px screen, on top of the 6px the drag needs to activate). Now the close arm measures
  travel, not remaining height: (max - cur) < Math.min(36, max * 0.075), so ~40px of push
  closes it. The open arm is untouched (cur > min(100, max * 0.3)) — a downward pull has to
  out-argue an ordinary scroll, a close does not. Playwright (touch, swipe from the
  control_panel): 20px still open, 40/60/90px close ✓; a 40px downward pull still does NOT
  open ✓.
- (log 177 lab_frame — new page + admin button) a side sketch of the feeling the session
  drawer produced, abstracted. New lab.html: a fixed white frame (the page itself) with a
  rounded window cut in it (.frame_window, inset max(14px, safe-area), radius 22, overflow
  hidden) and .frame_shadow — an inset box-shadow on all four edges, heaviest at the top —
  riding above the cells so the white edge appears to cast down onto whatever is showing.
  Behind the window a .track of three full-height cells (1 red, 2 white, 3 blue) that
  translate3d's with the finger and snaps to the nearest page on release; the snap distance
  borrows close_light (40px or 8% of the cell), with rubber-band resistance at the two ends.
  Touch, mouse-drag, wheel and arrow keys all drive it; a floating '‹ Admin' pill returns,
  a three-dot column shows position, and a hint pill fades after the first move.
  window.__lab = { go, at } is the test hook. Admin gains a second CTA ('Open the lab').
  Playwright (390x780 touch): frame 14/14/376/766 radius 22 with an inset shadow ✓;
  swipes 0 → 1 → 2, held at 2 at the end, back down to 1, a 20px nudge does nothing ✓;
  back button lands on admin.html ✓.
- (log 178 pager_prompt — no page edit) he wants lab_frame's mechanism as pagination for an
  existing multi-page site, in another thread. Handed him a copy-block prompt: portable (no
  vampjam context assumed), spelling out the frame (fixed inset window, radius, inset
  shadow above the content, heaviest at top), the track (full-height cells, translate3d,
  0.26s cubic-bezier(.22,.61,.36,1), no transition while dragging), the drag (5px to
  activate, rubber-band 0.35 at the ends, snap at min(40px, 8% of cell height) — the
  close_light number), the input set (touch, mouse drag, wheel with a 420ms lock, arrow /
  page keys), how existing pages map onto cells without rewriting them, hash deep-links,
  the inner-scroll gate that leaves room for his free-scroll mode later, and acceptance
  tests. No repo change beyond this log.
- (log 179 dot_steady — lab.html) a dot dead-centre of each of the three cards, and a
  stabiliser that tries to hold it still in the room while the phone moves. Two sensors,
  two jobs. tilt: deviceorientation beta (nose up/down) and gamma (roll) measured against
  the angles captured when you press the button — reference-at-start, exactly as he asked,
  so the starting pose does not matter; offset = -gamma*7px in x and +beta*7px in y, which
  is what actually keeps a dot planted, since most 'movement' of a hand-held phone is
  rotation. shift: devicemotion acceleration (e.acceleration, or
  accelerationIncludingGravity minus a slow average when the gravity-free stream is
  missing), high-passed, double-integrated, with hard leaks (velocity ×0.86, position ×0.90
  per frame). That cancels a jiggle and then walks itself back to centre — deliberately, because
  two integrations of a phone accelerometer drift within a second or two; real translation
  ('the bottom is where the top was') is NOT recoverable from these sensors, and pretending
  otherwise would just show him drift. Offsets are clamped to 42% of the window and written
  as --sx/--sy on :root, so all three dots move with one write per frame. A readout pill
  shows up/down and side angles plus the jiggle amplitude in mm. iOS gates the sensors:
  the 'Steady the dot' button calls DeviceOrientationEvent/DeviceMotionEvent
  .requestPermission() inside the tap, then becomes 'Recentre' (which re-captures the
  reference); it says 'Motion blocked' or 'No sensors here' when it cannot. Playwright:
  all three dots centred (0,0) at 22px; fed tilts give sy +70/-70 for beta ±10 and sx
  -84/+84 for gamma ±12, readout tracking ✓.
- (log 180 gesture_lab — lab.html) a capture rig, so the stabiliser can be tuned on real
  numbers instead of guesses. A bar along the bottom of the lab page: a name field (the
  pair, e.g. 'raise / lower'), a hold-to-record button, a status line, Copy last take and
  Send takes. While held, every deviceorientation and devicemotion event is stored as a
  sample: { t, ori[alpha,beta,gamma], rel[Δ from the pose at the START of the hold, alpha
  wrapped to ±180], acc[x,y,z], accG[x,y,z], rot[alpha,beta,gamma], iv }. Takes live in
  localStorage (vampjam_gestures, last 40) AND are pushed to the repo automatically on
  release: read lab_gestures.json fresh off the GitHub API, drop takes whose ts is already
  there, append, write through the sync worker (root .json — inside the worker's PATH_RE),
  keeping the last 60. So a take he records reaches this side with no copy-paste; Copy last
  take is the fallback when he is offline. iOS permission is requested inside the press.
  Two traps handled: browsers fire ONE empty deviceorientation/devicemotion event when you
  subscribe — it must not become the reference pose (it was making every angle read from
  zero) or a dead sample; and the bar is excluded from the page-drag handlers (with
  .back_btn and .motion_btn) so recording never flips a card. Playwright: 30 synthetic
  samples captured under the typed name, rel starting at 0/0/0, status 'sent 1 take ✓',
  POST body path lab_gestures.json, and a 96px drag on the bar leaves the page index at 0 ✓.
- (log 181 take_clear — lab.html) the recorder now says where it is, in colour and words:
  say(state,text) drives one of four looks on .gest_bar — idle (grey led), is_rec (red led,
  pulsing, red bar shadow, the button counting 'recording 1.4s'), is_send (amber led,
  'sending "name" …'), is_sent (green led + green shadow, '✓ sent N takes — type the next
  name'); is_warn covers a refused permission, an empty take, or a failed send (which stays
  on the phone and rides along with the next one). On release the field is cleared and
  focused SYNCHRONOUSLY inside the touchend gesture — iOS only raises the keyboard from
  inside a gesture, so the send finishing later can't do it. A chip strip shows the last
  four takes by name and length. Two robustness fixes found while wiring it: the sensors
  are wired once and stay wired (asking permission again on every hold made each start a
  tick late), and a wantRec flag makes a release that lands before permission resolves
  cancel the start instead of leaving it recording. Playwright: idle → is_rec (name in the
  message, live timer on the button) → is_send with the field already empty and #g_name
  focused → is_sent with the chip listed ✓.
- (log 182 paper_scale — lab.html) the whole surface now answers the phone, not just the
  dot. Each cell gains a .paper layer — school-ruled horizontal lines (repeating-linear-
  gradient, 1px of currentColor every 30px, 30% opacity, 16% on the white card), sized 200%
  and centred so panning and scaling never expose an edge — transformed by
  translate3d(var(--sx), var(--sy), 0) scale(var(--sc)). --sx/--sy are the counter-motion
  the dot already used (phone right → surface left, phone up → surface down); --sc is new:
  the z axis (screen normal) is integrated with the same leaks as x and y, and scale =
  clamp(1 - z*3.2, 0.55, 1.8) — closer SHRINKS, further GROWS, per his call. The ruling is
  what makes distance legible: line spacing widens and narrows with the scale. The dot
  stays unscaled as the fixed reference, and the readout's second line became
  'near/far ±NN mm  scale NN%'. Same honest limit as 179: z is a push/pull response that
  eases back, not a distance measurement. Playwright: paper covers 200%×200% with the
  gradient; tilt +12 gamma → x -84, tilt +12 beta → y +84; pulled closer (z +80mm) → scale
  0.90, pushed away → 1.10, with the transform matrix matching ✓.
- (log 183 world_view — lab.html) his model replaces the earlier one wholesale: the screen
  is a window onto a world that does not move. Zero pose captured on demand (Set zero);
  turning the phone or tipping it must change NOTHING; sliding one phone width sideways
  slides the world one screen width the other way (1:1 at the reference distance); moving
  toward the eye raises the multiple AND the drawn size (multiple = D0/D, D0 = 0.35 m,
  clamped 0.35×–3.5×) — which reverses 182's closer-shrinks, per his correction. Rotation is
  dropped properly rather than merely down-weighted: each acceleration sample is rotated out
  of the PHONE frame into the world by the current orientation matrix (ZXY, W3C convention)
  and then into the zero frame, so tilt smears nothing across axes and pure turning leaves
  the three translations untouched. Drift is fought with a zero-velocity update (still for
  350ms → velocity forced to 0, the standard dead-reckoning trick) plus leaks of 0.9s
  (velocity) and 2.5s (position), so a gesture holds and then eases home instead of walking
  off. Deadband 0.12 m/s² and a 45→160 deg/s veto come from his takes. The dot is pinned to
  the world unscaled; the ruled paper takes the same offset plus the multiple as scale.
  Playwright: 4.55cm slide right → 232px left (0.65 screens, exactly the 1:1 law), same
  while the phone is tilted 35°, up-slide → world down, 4.55cm toward the eye → ×1.15;
  a pure spin at 120 deg/s moves 5.6px, a pure tilt 19.5px, and turning with no
  acceleration at all moves 0.0px ✓; after a slide the world eases back within ~2s.
- (log 184 lab_build — lab.html) all three cards share one colour now, and the colour is
  the version stamp: LAB_BUILD (an integer at the top of the page) indexes an eight-colour
  palette — red, teal, indigo, amber, forest, plum, slate, crimson — applied as --lab_bg /
  --lab_fg, with a 'build N · name' pill between the two top buttons. Bump LAB_BUILD on
  every lab ship and a glance says whether the update arrived. Also: no-cache metas added
  (a cached page would show a stale colour and defeat the whole point), the per-cell colour
  and dot/paper overrides removed, and the top-right button renamed 'Set zero' — shorter
  than 'Steady the dot', so the stamp fits between the buttons, and it matches the
  world_view model. Shipped as build 2 (teal), deliberately not red, so this build differs
  from what he was looking at. Playwright: all three cells rgb(15,118,110), one ink colour,
  one paper opacity, tag reads 'build 2 · teal' ✓.
- (log 185 depth_wide — lab.html, build 3 indigo) flip_axes: both pan signs inverted — the
  world now travels WITH the phone (slide right, world right; slide up, world up), his
  call after feeling the counter-motion. depth_wide: the magnifier law alone only spans
  about 3x within arm's reach, so the ratio is raised to a power — multiple =
  (D0/D)^2.2, clamped 0.25x…13x. That lands the two ends he described: brought right in
  (10 cm) the screen holds about 2 ruled lines; pushed out (70 cm) it packs about 100. The
  readout now names it directly — '10 cm ×13.00 2 lines' — so the range is calibratable by
  eye. Playwright: slide right → +252px (was -252), slide up → -252px; z bursts give ×1.40
  at 30cm / 18 lines, ×13 at 10cm / 2 lines, ×0.25 at 70cm / 100 lines ✓.
- (log 186 graph_one — lab.html, release graph_one / burnt orange) the lab is now one
  surface and nothing else. The three per-cell ruled papers are gone; a single .grid sits
  behind everything in the frame (800% square, two repeating gradients at 30px = graph
  paper, panned and scaled by --sx/--sy/--sc), cells are transparent with no numbers, and
  one dot sits at the window's centre instead of one per card — so there are no layers of
  lines to see through, which is what he was seeing at the card seams. lab_release replaces
  the numbered build: a 96px square in the top-left corner painted the release colour with
  the release's commit name inside it (LAB_RELEASE = { name, bg, fg } at the top of the
  page — change both every ship). The back button moved below the square and the readout
  moved under Set zero, so the corner is the stamp and nothing overlaps. Playwright:
  1 grid layer, 0 paper layers, 1 dot, transparent cells, square 96×96 at 22,20 in
  rgb(180,83,9) reading 'graph_one', and the close-in view still resolves to 2 lines ✓.
- (log 187 hold_still — lab.html, release hold_still / forest) he named the flaw exactly:
  the move read right, then the world reset. That was the position leak from 183 (2.5s
  easing home). Gone. The model is now stateful: a move BEGINS when acceleration passes
  0.20 m/s² (or the phone turns), integration runs only while moving, and 180ms of quiet
  ENDS it — velocity is killed and the position simply stays where it landed. Nothing is
  integrated between moves, so drift cannot accumulate while the phone sits. The velocity
  leak went from 1.5s to 6s: a leak makes the braking half of a gesture outweigh the
  pushing half, which was itself dragging the world back on every stop. Each finished move
  is categorised by whichever axis carried it and named in the readout — 'held · right
  6 cm', 'held · closer 9 cm', 'moving…' while in flight. Set zero still recentres.
  Playwright: slide right lands at 310.8px and is still at 310.8px after 1.5s of stillness
  (and through the next unrelated move), closer holds ×1.98 / 13 lines, categories read
  right/up/closer with the distance ✓.
- (log 188 lag_trace — lab.html, release lag_trace / plum) his round trip ended where it
  started but 'took a long time to get there'. Cause: position is the double integral of
  acceleration, so it structurally trails the hand. Fix without breaking the hold: display
  pos + vel*LEAD (0.10s of prediction) for all three axes — while the phone travels the
  world sits where the phone WILL be a tenth of a second on, and at rest vel is 0 so the
  lead vanishes and nothing overshoots. And to answer the second half of his ask — a way
  to say what is and isn't working — the page now shows it instead of describing it:
  .trace, a 130×48 canvas holding four rolling seconds of hand effort (grey, |a| in the
  zero frame) against world offset (plum), so the gap between the two is visible. Takes
  gained an st[] field per sample (pos xyz, vel xyz, moving) so a recording can be measured
  end to end from this side. Also fixed while testing: move-end quiet was counted in
  wall-clock, which is wrong if the sensor throttles (and made synthetic tests impossible)
  — it now accumulates SAMPLE time. Playwright: out-and-back lands at -13.4px of a 358px
  screen and holds there ('held'), the strip renders, state hook exposes px/mult/moving ✓.
- (log 189 pose_arrow — lab.html, release pose_arrow / cyan) the numeric readout is
  replaced by a live diagram: a 148px inline SVG showing the phone as an object standing on
  the zero frame. Isometric projection with the phone's own y drawn away from the viewer
  and its z drawn up, so the zero pose (phone flat) reads flat and every tip reads as a tip.
  Drawn each frame from R_rel = transpose(R0)·Rnow: a translucent plate for the phone body
  with a heavier edge marking its top, its three axes as red/green/blue arrows, a faint
  ellipse and axis stubs for the zero frame it is being measured against, a dropped shadow
  polygon on the ground plane for depth, and a dark-red arrow with a head for how far it
  has travelled (300 units per metre, clamped to the box). One small line of text remains —
  P/Y/R in degrees and the current multiple — extracted from the same matrix
  (pitch = asin(m7), yaw = atan2(-m1,m4), roll = atan2(-m6,m8)). The trace strip moved down
  to make room. Playwright: pitch/roll/yaw each change the plate polygon and read back
  P30 / R-25 / Y40, a slide + approach draws the travel arrow at 18.7,-26.6 with ×1.4, no
  page errors ✓.
- (log 190 dot_scale — lab.html, release dot_scale / crimson) the centre dot now takes the
  world's scale as well as its position: .pin_dot's transform gains scale(var(--sc)), so it
  swells and shrinks in step with the grid squares instead of staying a fixed 22px sticker
  on top of a world that moves in depth. Playwright: at zero dot 22px / square 30px; moved
  closer ×3.25 → dot 72px / square 98px; moved away ×0.47 → dot 10px / square 14px — the
  ratio holds at every distance ✓.
- (log 191 axis_face — lab.html, release axis_face / slate) three changes to the pose
  diagram. camera: the isometric floor view is gone — the camera now looks straight down
  the zero pose's normal (project: x + z*0.34, -y - z*0.22), so at zero the phone is a
  plain upright rectangle parallel with the glass and every tilt reads as a departure from
  that. axes_bold: each axis is a 3.4px shaft with a filled arrowhead and a letter (X red,
  Y green, Z blue), so an axis can be named in conversation; the zero frame behind it is
  now a dashed outline of the phone AS IT WAS at Set zero plus faint axis stubs, so the
  difference between outline and plate IS the attitude. yaw_flip: he reported the flat-on-
  a-table spin drawing backwards — the display decomposes R_rel to pitch/yaw/roll, negates
  yaw, and rebuilds the matrix (mat_from(-yaw, pitch, roll)), so plate, axes and label all
  turn his way. Motion mapping is untouched; this is the diagram only. Playwright: plate at
  zero is exactly -15,-28 15,-28 15,28 -15,28; pose(+40 yaw) now labels Y-40 and pose(-40)
  labels Y40; three arrowheads and XYZ letters present; no page errors ✓.
- (log 192 fixed_axes — lab.html, release fixed_axes / olive) three asks. fixed_axes: the
  diagram's X/Y/Z arrows are the WORLD's now and never move (X right, Y up, Z toward you);
  the plate turns inside them, with the dashed zero rectangle behind it. It had been the
  other way round, which made the frame of reference itself appear to swing — his objective
  is a frame that holds still. view(): the architectural simplification he asked for —
  ONE function turns where the phone is into what the screen shows { cam (metres in the
  zero frame, lead folded in), dist, mult, pxPerM, ox, oy }, and the paint loop, the state
  hook and the diagram all read it. Nothing recomputes the law any more, so pan, scale and
  the reset all have a single place to be tuned or reasoned about. thumb_reach: Set zero
  moved from the top-right corner to bottom-right, 236px up from the bottom edge and
  bigger (106×48, dark pill), just above the recorder bar where a right thumb lands; the
  pose diagram and trace strip moved up into the space it left. Playwright: axis endpoints
  identical at zero and at pose(35,25,-15) while the plate polygon changes ✓; state hook
  and painted CSS vars agree exactly (449px, ×1.245) ✓; button 236px off the bottom ✓;
  no page errors.
- (log 193 name_wide — lab.html, release name_wide / blue) the corner stamp goes from a
  96×96 square to a wide, low pill: height 44, width auto with white-space nowrap so the
  release name sits on one line, capped at calc(100vw - 192px) with ellipsis so a long
  codename shortens instead of colliding with the pose diagram (measured: 118px for
  'name_wide', 198px capped for a 24-character name, never overlapping the diagram at
  x=224). The back button moved up to fill the space the tall square had taken.
  Playwright: one line, nowrap, no overlap ✓.
- (log 194 glide_stop — lab.html, release glide_stop / rust) three faults in how a slide
  ends, all from the same place: braking is itself a shove the other way, and the model was
  reading it as motion. dir_latch: once a move is going faster than LATCH_V (0.02 m/s) it
  latches a direction per axis; from then on opposing acceleration may only bleed speed off
  (BRAKE_DECAY 0.90 a sample, ~0.16 s) and can never carry the world backwards — the glide
  now starts the instant the hand brakes rather than waiting out the still timer, which is
  the 'jump the gun by a second' he asked for. lead_hold: the LEAD lag-compensation term used
  to be computed at paint time as vel*LEAD, so the moment vel fell the picture sprang back
  (measured 384px → 196px). It is carried as state now: it tracks vel while the push builds,
  freezes when that axis starts braking, and is folded into pos when the move ends, so the
  world only ever eases forward to a stop and stays where it was last drawn. settle_lock:
  after a move ends the model is disarmed until the phone has been genuinely quiet for
  STILL_MS, so the tail of the stopping push cannot open a fresh move in reverse.
  creep_floor: the STOP_V clamp was applied on every sample, which killed every move that
  started gently — the first sample of a slow push never cleared 0.015 m/s, so the whole
  closer/away axis registered nothing at all; it now applies only while braking or coasting.
  run_true: travel is tallied only in the latched direction and any pre-latch wobble is
  discarded, so a slide right reads 'right N cm' instead of 'left N cm'. rec_revive: a
  leftover integrate() call from the retired axis_snap model still ran inside grab_motion and
  referenced the deleted POS_LEAK, throwing inside the sensor handler — which is why takes
  #6-#9 in lab_gestures.json captured zero samples. Removed with its dead block.
  Playwright: push 19→300px, brake glides 417→482px, rest holds 482px, peak == final, never
  left of zero, held reads 'right 9 cm' ✓; two slides in a row accumulate (368 → 735px) ✓;
  up reads 'up 7 cm', a push toward the eye reads 'closer 3 cm' and lifts the multiple to
  ×1.25 ✓; recorder captures 20 samples where it captured 0 ✓; no page errors.
- (log 195 gest_small — lab.html, release gest_small / teal) the recorder bar was taking a
  third of the screen away from the thing it is there to measure. Everything around the hold
  button shrinks: the bar goes 340×216 → 206×145 (width -39%, area -59%), padding 12→7,
  gap 8→5, radius 18→13; the name field 15px/9px padding → 12px/5px; the status line 12px →
  10px with a 6px LED; the take chips 11px → 9px, capped at 88px with an ellipsis; the two
  small buttons 13px → 10px with shortened labels (Copy last / Send) and nowrap+ellipsis so
  they can never spill. hold_big: the one thing that does NOT shrink is the hold target —
  17px vertical padding keeps it a 51px slab (was 52), because it is held down through a
  whole gesture while the phone is moving and a small target would be missed. thumb_reach
  follows the shorter bar: Set zero moves from 236px off the bottom to 173px, keeping a 12px
  gap above the bar. Playwright at 390×780: bar 206×145 ✓, hold button 192×51 ✓, no label
  clipped (scrollWidth ≤ clientWidth on all three) ✓, Set zero 12px clear of the bar ✓,
  a recorded take still captures 20 samples ✓, no page errors.
- (log 196 plate_move — lab.html, release plate_move / violet) the diagram is inverted and
  enlarged. plate_move: travel used to be a red arrow with a dot on its head while the phone
  plate sat at the origin — a dot sliding along an axis. Now the AXES and the dashed zero
  rectangle are pinned at the origin and the plate itself stands where the phone has
  travelled to, carrying tilt and position together, with a faint dashed tether back to the
  origin. The plate shrank (26×48 → 20×36 units) and its fill lightened to 0.16 so the frame
  reads through it. axis_rule: each arm gains a faint negative stub (0.8 of the arm) and a
  tick every 15 units = 5 cm, so how FAR along an axis it is can be read, not just which way;
  arm 42 → 46 units, letters 11 → 12px. axis_read: a fat coloured bar runs from the origin to
  the phone's position ON that axis, a white-ringed knob sits at its end, and a dashed line
  joins the knob to the plate — one axis at a time, no projection to do in your head. The
  knobs are a separate group drawn above the plate so the phone can never hide a reading.
  pos_read: a bold 12px line under the picture spells the three positions in centimetres in
  the axis colours (X+6.2 Y+3.5 Z+2.0), with pitch/yaw/roll and the multiple demoted to a
  smaller line below. Panel 148×148 → 178×194 (+55% area), viewBox -72 -74 144 158, and the
  trace strip moved from 182px to 228px to follow it. Each axis is clamped on its own
  (±44 units ≈ ±14.7 cm) so a big move on one never drags the picture off. Playwright: plate
  centre 0,0 at zero and 28.4,0 after a 9.5 cm slide right ✓; pose_axes innerHTML byte-identical
  before the move, after the move and after pose(35,25,-15) — the frame genuinely holds still ✓;
  guide group populates per moving axis (2 elements one axis, 6 for three) ✓; readouts correct ✓;
  panel 178×194 with the trace clear below it ✓; glide_stop and gest_small regressions still
  pass; no page errors.
- (log 197 roll_hold — lab.html, release roll_hold / amber) the surface now counter-rotates
  against the swirl. roll_hold: hold the phone perpendicular to your nose and turn it in its
  own plane and the graph paper turns the opposite way by the same angle, so the paper looks
  like it never moved — the window swirls, the world behind it does not. screen_roll() reads
  the angle straight out of the relative matrix: the phone's own up direction expressed in the
  zero frame, atan2(-m[1], m[4]) — 0 at the zero pose by construction. It joins view() as
  `roll`, so the one law still owns everything the screen shows; paint_world publishes it as
  --rot and zero_here clears it. transform_order: the grid and the pin dot are now
  `rotate(var(--rot)) translate3d(--sx,--sy) scale(--sc)` — rotation FIRST, so the travel
  offset is measured along the world's axes rather than the screen's; a 9.5 cm slide right
  that reads 482px across at swirl 0 reads 482px DOWN at swirl 90, which is what keeping a
  world point in place through a quarter turn requires. Pitch and yaw are deliberately still
  inert — tipping the phone toward or away, or turning it like a door, changes nothing.
  attitude_name: the diagram's second readout line becomes P (pitch) / T (turn like a door) /
  S (swirl), with S signed the same way as the counter-rotation so the number and the picture
  agree; it used to print the swirl as 'Y' with the opposite sign. Playwright: alpha +30 → roll
  +30 → css rotate(30deg) and the drawn world sits 30° clockwise, counter-balancing a 30°
  counter-clockwise swirl ✓; alpha -30, 90, 180 all track ✓; beta 40 and gamma 35 both leave
  --rot at 0.00deg ✓; world offset rotates with the paper (482,0 → 0,482 → -482,0) ✓;
  glide_stop, gest_small and plate_move regressions all still pass; no page errors.
- (log 198 axis_flip — lab.html, release axis_flip / magenta) two asks. axis_flip: every axis
  the screen depends on is reversed — pan left/right, pan up/down, the depth multiple and the
  swirl counter-turn. It is ONE switch: `var INV = -1`, threaded through the only three places
  a sign reaches the screen (dist = D0 - INV*cam.z, ox = INV*cam.x*pxPerM, oy = -INV*cam.y*pxPerM,
  roll = INV*screen_roll()), so the whole model turns inside out by editing that line and
  nothing else — worth knowing, because this is the third time a direction has been reversed.
  The pose diagram is deliberately NOT flipped: it reports where the phone really is, and
  inverting it would make it lie. lock_expire: the settle lock added in 194 was a latch cleared
  only by genuine stillness, so a hand that kept trembling above MOVE_A left the model disarmed
  for good — the first gesture registered and everything after it fell off, exactly what he
  described. It is a countdown now: LOCK_S 0.45s, decremented every sample, cleared early by
  real stillness, and it always expires. Playwright: slide right → screen -315px (was +315),
  slide up → +181 (was -181), toward the eye → ×0.88 (was ×1.14), swirl +30 → -30° ✓; six
  gestures in a row with a hand trembling at 0.30 m/s² between them all register 'right 6 cm'
  where the latch would have dropped every one after the first ✓; lock reads 0 at the end ✓;
  glide_stop still glides without springing back (now to -482px), gest_small and plate_move
  regressions pass; no page errors.
- (log 199 zero_split — lab.html, release zero_split / forest) two buttons and a much
  steeper scale. zero_split: zero_here() takes a keepDepth flag. Set zero now re-centres the
  dot and re-takes the attitude but LEAVES pos.z alone, so whatever scale you have worked out
  to survives a re-centre — without that, finding the middle of the picture meant throwing the
  zoom away. A second button, Reset all, calls zero_here(false) and puts everything back to
  ×1. It is hidden until motion is on, sits above Set zero (231px vs 173px off the bottom,
  10px gap) and is deliberately quieter — white pill, 13px — because Set zero is pressed
  constantly and this one only when the scale has run away. Both are added to the swipe
  guards so neither turns into a page flick. scale_blow: the depth response is tripled —
  Z_POWER 2.2 → 6.6, and the clamps opened to match (MULT_MIN 0.25 → 0.09, MULT_MAX 13 → 39).
  The whole range is now inside a hand's width of travel: ×1 at the zero distance, ×2.2 at
  4 cm nearer the ceiling, ×5.5 at 8 cm, pinned at ×39 by 12 cm, and ×0.49 / ×0.26 / ×0.09 the
  other way. Playwright: Reset all hidden before motion and visible after ✓; after a pull-away
  plus a slide right (x -466, ×1.48), Set zero gives x 0 with ×1.48 and pos.z intact, Reset all
  gives x 0 with ×1.00 and pos.z 0 ✓; five equal pull-aways now read 1.36 1.88 2.65 3.80 5.56
  where the old exponent would have reached ×1.72 in total ✓; button geometry ✓; glide_stop,
  gest_small, plate_move, roll_hold and axis_flip regressions all pass; no page errors.
- (log 200 model_flip — lab.html, release model_flip / sky) entry 198 flipped the wrong
  thing. paper_back: INV goes back to +1, so the world view — pan left/right, pan up/down,
  the depth multiple and the swirl counter-turn — is exactly as it was in roll_hold, which is
  the behaviour he had called perfect. The graph paper was never what he wanted reversed.
  model_flip: the reversal moves to the little diagram and to nothing else, as MODEL_INV
  { x: -1, y: -1, z: +1 } behind a model_pos() helper. X and Y are reversed in the DEPICTION;
  Z is left alone because he had that right. The plate, the axis bars, the knobs, the tether
  and the centimetre readout all read model_pos(), so the picture and the figures can never
  disagree. The plate's attitude (pitch / turn / swirl) is untouched — only the depiction of
  travel is flipped. star_pin: the marker is a five-point star (gold, dark outline, 26px)
  instead of a black dot, carrying a real cast shadow whose geometry reports how far above the
  paper it is: near the paper the shadow is tucked under it, small, sharp and dark (drop 2px,
  blur 3px, 0.64 alpha at ×8); level it is drop 10 / blur 12 / 0.42; far away it slides out,
  spreads and fades (drop 18 / blur 21 / 0.20). The four shadow numbers are divided by the
  scale before they are published as CSS vars, so the star's own scale() transform cannot blow
  the shadow up with it — at ×39 an undivided blur would have been 400px. Playwright: slide
  right → +315px, slide up → -181px, toward the eye → ×1.48, swirl +30 → +30° (all four back
  to the pre-198 signs) ✓; with true pos X+6.2 Y+3.5 Z+2.0 the diagram reads X-6.2 Y-3.5 Z+2.0
  and the plate draws left and down ✓; star polygon has 10 vertices and the shadow tightens
  from drop 16.5/blur 19.6/0.38 at ×0.69 to drop 5.8/blur 7.0/0.46 at ×1.48 ✓; three-way
  visual check far/level/near captured; all prior regressions pass; no page errors.
- (log 201 depth_flip — lab.html, release depth_flip / indigo) the magnifier alone is
  reversed. view_switch: the single INV of 198 becomes two independent signs, because these
  two directions have now been flipped separately twice and will be again — PAN_INV (+1)
  governs left/right, up/down and the swirl counter-turn, DEPTH_INV (-1) governs the
  magnifier. depth_flip: bringing the phone toward the eye makes the paper SMALLER and taking
  it away makes it bigger, the opposite of every build up to here; dist = D0 - DEPTH_INV*cam.z
  is the only line that changed. Pan and swirl are untouched, and the diagram still reports Z
  truthfully (MODEL_INV.z stays +1, which he had said was right). The star's shadow keys off
  the multiple rather than off z, so it stayed correct without a change: a bigger multiple is
  still 'closer to the paper', it is just reached by moving the phone away now. Playwright: a
  push toward the eye lands pos.z +0.02 and ×0.69 (was ×1.48), a pull away lands pos.z -0.02
  and ×1.48 (was ×0.69) ✓; slide right +315px, slide up -181px, swirl +30 → +30° all unmoved ✓;
  after a move toward the eye the diagram still reads Z+2.0 while the paper reads ×0.7 ✓;
  the whole suite (195-201) re-run and passing; no page errors.
- (log 202 nav_left — 13 pages) one top-left control, in the same place everywhere.
  nav_left: a shared .nav_left pill, position:fixed at top max(12px, safe+6) / left
  max(12px, safe+10), 34px tall, panel background with the page's own theme vars and literal
  fallbacks so it reads correctly on the light lab-style pages and the dark session pages
  alike. It replaces four different treatments: the in-flow '‹ back to sessions' / '‹ back to
  admin' anchors on admin and r2_setup, the absolutely-positioned Back button inside
  record's top_bar, and the inline-styled Sessions caret that sat inside the brand header on
  session.html, favorites.html and the eight static session pages. Measured identical on all
  seven checked pages: x12 y12 h34. nav_hide: on a session page the control says Sessions and
  calls vampjamDrawer.toggle(), so pressing it does exactly what the swipe does — and
  `body.drawer_open .nav_left { opacity: 0; pointer-events: none }` takes it away while the
  list is open, because from there it has nowhere to go; closing brings it back. The
  drawer_open body class already existed as a styling hook, so no drawer JS changed.
  nav_room: `.brand, .top_bar { padding-top: max(46px, safe+40) }` gives the pill its own
  band — the big centred wordmark's ink reached back under it on four of five pages
  (session/favorites overlapped by 38px). The room goes on the HEADER, not on .wordmark: most
  of these pages set `.brand .wordmark { margin: 0 }`, a two-class rule that beats a
  one-class one — the same specificity trap as btn_gray. record's Back is now Sessions and
  keeps its own mid-recording confirm. lab.html is deliberately untouched: its top-left corner
  is the release stamp, and its back button stays below it. Playwright: pill geometry
  identical across 7 pages ✓; press opens the drawer and drops the pill to opacity 0 /
  pointer-events none, closing restores it, and the swipe route does the same ✓; wordmark ink
  clear of the pill on every page ✓; all 15 pages loaded with zero page errors ✓.
- (log 203 tilt_flip — lab.html, release tilt_flip / gold) the diagram drew pitch backwards.
  tilt_flip: TILT_INV (-1) negates the pitch taken out of the relative matrix in flip_yaw, and
  because the same value feeds both the rebuilt plate matrix (mat_from(-yaw, pitch, roll)) and
  the P readout, the drawing and the number flip together and cannot disagree. Tipping the top
  of the phone toward you and tipping it away now draw the way he sees them. This is the
  diagram only — the paper has never answered to pitch and still does not, which the test
  asserts rather than assumes. It joins PAN_INV, DEPTH_INV and MODEL_INV as a named switch,
  which is now four independent sign settings, each one having been reversed at least once.
  Playwright: beta +40 reads P-40 and beta -40 reads P40, each redrawing the plate ✓; the two
  tips project to different plate heights (22.4 vs 32.6) — the oblique projection is
  deliberately asymmetric in depth, and that asymmetry is the cue that says which way it is
  tipped ✓; --rot stays 0.00deg through both tips, so the paper is untouched ✓; swirl +30 still
  gives +30 ✓; glide_stop, plate_move, roll_hold, model_flip and depth_flip regressions all
  pass; three-way visual capture (forward / flat / back) taken; no page errors.
- (log 204 deck_one — lab.html, release deck_one / teal) every control on the lab page is one
  panel along the bottom. deck_one: the five floating things — the release stamp in the top-left
  corner, the Admin button under it, Set zero and Reset all stacked at the right, and the
  recorder bar in the middle — are gone as separate fixed elements. In their place a single
  .deck spans the full width at the bottom, 108px tall, in two rows. deck_room: the window's
  bottom moves up by exactly the deck's height, so the white beneath the window IS the deck and
  the window's existing 22px bottom corners are where the panel's top edge curves up and carries
  on round the sides and the top as one continuous frame — no new border, no seam.
  thumb_order: the right-hand end is where the thumb lands, so Set zero (pressed constantly)
  is furthest right, Hold to record sits next to it and takes twice the width, and the name
  field takes what is left on the far left. The quiet row above carries ‹ Admin, the release
  chip in its own colour, one lamp, one line of status, and Reset. deck_say: the recorder's
  furniture — the take chips, Copy last, Send and the take count — is hidden but still in the
  DOM, because the code writes to all of it; `.deck [hidden] { display: none !important }` is
  needed because a class rule setting display beats the hidden attribute (the .g_recent chips
  reappeared under the deck until this was added). The status strings were shortened to fit one
  line ('✓ sent 1 — name the next' rather than '✓ sent 1 take — type the next name'), and the
  release chip is flex 0 0 auto so the status gives way to it and never the other way round.
  The whole deck is excluded from the page-flick swipe guard as one element instead of four.
  Playwright at 390×780: window 14,14 362×644, deck 14,658 362×108, no overlap, window bottom
  radius still 22px ✓; order left→right name 18 / record 121 / Set zero 276, Reset in the top
  row at 311 ✓; Reset still hidden until motion is on ✓; a held take still captures 20 samples
  and the lamp+line report it ✓; all five retired elements still resolve by id so nothing
  throws ✓; glide_stop, plate_move, roll_hold, zero_split, depth_flip and tilt_flip regressions
  all pass; no page errors.
- (log 205 swirl_flip — lab.html, release swirl_flip / violet) the diagram drew the in-plane
  turn backwards. swirl_flip: SWIRL_INV (-1) negates the yaw taken out of the relative matrix
  in flip_yaw, so the plate turns the way the phone turns, and the same factor is applied to
  the S readout so the number turns with it. Diagram only — the paper's counter-turn goes
  through screen_roll()/PAN_INV and is deliberately untouched, which the test asserts: alpha
  +30 still publishes --rot 30.00deg while the plate now reads S-30. That makes five named
  sign switches (PAN_INV, DEPTH_INV, MODEL_INV, TILT_INV, SWIRL_INV), which between them is
  every axis of the diagram now reversed relative to the paper — worth a look next time the
  diagram is touched, because a single MODEL matrix would express it more honestly than five
  scattered factors. Playwright: alpha +30 → S-30, -30 → S+30, +60 → S-60 ✓; plate top edge
  -29.9° vs +29.9° for opposite swirls ✓; paper unchanged ✓; tilt_flip still applies (beta 40
  → P-40) ✓; glide_stop, plate_move, roll_hold, model_flip and deck_one regressions pass; no
  page errors.
  take_read: his 40.6s / 2410-sample take ('these are the positions I went through…') came in
  on the repo copy but not yet on the Mac's clone. Read from raw.githubusercontent (which the
  sandbox CAN reach, unlike api.github.com). What it actually contains, against his narration:
  toward/away 0.9-4.6s ✓, right/left 5.7-9.9s ✓, up/down 11.1-15.1s ✓ — then the order breaks.
  15.8-18.5s is a -88° and a +85° about GAMMA, rolling the phone edge-over-edge, an axis that
  is nowhere in his spoken list; 26.8-33.0s is four BETA tips (-53, +54, +57, -73); and only
  at 33.7-38.5s do the ALPHA in-plane swirls appear, three of them and small (+29, +38, -51),
  not the quarter turns he described. So the 'new angle' he suspected is the gamma roll, and
  the swirls he meant to do second-to-last happened last and under-rotated.
- (log 206 paper_tilt — lab.html, release paper_tilt / red) the paper lies in space now.
  paper_tilt: pitch had been inert on the surface by design since the very first motion build;
  it now leans the graph paper. .frame_window carries `perspective: 760px`, so it is a camera
  rather than a flat viewport, and .grid gains rotateX(var(--tilt)) driven by screen_pitch() —
  the relative pitch out of the same zero-pose matrix everything else reads, clamped to
  TILT_MAX 72 deg so the plane can never go edge-on and vanish. Tip the top of the phone toward
  your eye and the paper's top leans away: the squares crowd toward a vanishing point above and
  open out along the bottom; tip it away and it mirrors. transform_order: rotateX comes AFTER
  the swirl rotate (so the lean is about the phone's own left-right axis, which turns with the
  paper) and BEFORE the pan (so travel runs along the paper's surface, not across the glass).
  The window's background changes from white to the paper's own #fcfcf8, so whatever lies
  beyond the horizon reads as haze rather than a hole. PITCH_INV is the sign switch — the
  sixth — and screen_pitch joins view() as `tilt`, so the one law still owns everything the
  screen shows; zero_here clears --tilt with the rest. The star is deliberately left upright:
  it floats ABOVE the paper, which is what its cast shadow has been saying since model_flip.
  Playwright: perspective 760px on the window ✓; beta 0/40/-40 give --tilt 0/40/-40 and beta
  ±80 clamps at ±72 ✓; the element transform goes 3D at any lean ✓; measured from the RENDERED
  pixels (the parent's perspective is not in the element's own matrix, so a matrix test proves
  nothing here) the row spacing runs 30 30 30 … flat, 34 53 49 51 101 101 131 top-to-bottom
  leaning toward, and reversed leaning away ✓; swirl and lean compose (rot 30 / tilt 45) ✓;
  Set zero clears the lean to 0.00deg ✓; glide_stop, plate_move, roll_hold, deck_one and
  swirl_flip regressions pass; no page errors.
- (log 207 tilt_deep — lab.html, release tilt_deep / ocean) the lean from 206 was real but
  barely visible on the phone, and only had one axis. Three fixes. stage_layer: the perspective
  moves off .frame_window onto its own .stage (position absolute, inset 0, clips nothing,
  rounds nothing, transform-style preserve-3d). WebKit flattens 3D children of an element that
  BOTH clips and rounds its corners, which is why a desktop screenshot showed the lean and the
  phone showed almost none — the window still clips and rounds, the stage inside it carries the
  camera. tilt_deep: the camera comes in from 760px to 460px against a ~360px window and
  TILT_GAIN is 1.7, so 20 deg of hand lays the paper down 34 deg; the clamp is TILT_MAX 74.
  turn_lean: the same thing on the other axis — rotateY(var(--turn)) — so turning the phone
  like a door throws the vanishing point out to the side instead of over the top, which is the
  'and same with right and…' he trailed off on. lean_normal: BOTH leans now come from one
  thing, the screen's own normal in the zero frame (column 2 of the relative matrix): its swing
  up/down is the top lean, its swing left/right is the side lean. The Euler terms used before
  folded the sign away — measured, gamma +25 and -25 BOTH produced +42.5 — and the normal is
  cleanly signed and cleanly separated. Signs: PITCH_INV -1 keeps the direction that already
  shipped (the normal extraction comes out opposite to the Euler term it replaced), TURN_INV -1
  makes the two axes agree on his rule — the edge you bring toward your eye is the edge that
  lies away toward the vanishing point. Playwright: perspective 460px on .stage and none on the
  window, which still reads overflow hidden ✓; beta ±20 → tilt ±34, gamma ±25 → turn ∓42.5,
  ±60 clamps at ±74, and the two axes compose ✓; rendered pixels: rows uniform at 30 when flat
  and collapsing to 42/293 when leaned ✓; Set zero clears both ✓; glide_stop, plate_move,
  roll_hold, deck_one, swirl_flip and paper_tilt regressions pass; no page errors.
  test_note: a stale-CSS-var read made an earlier run report both gamma signs as +42.5; reading
  window.__lab.state() directly showed the maths had been right. Prefer the state hook to
  getComputedStyle for anything the paint loop writes.
- (log 208 smooth_move — lab.html, release smooth_move / violet) the world's motion is shaped
  now instead of raw. smooth_move: the picture no longer sits ON the model, it CHASES it
  through a critically damped spring — show/showV, stiffness SM_W 11 rad/s, advanced in
  on_motion off the SENSOR clock rather than the paint clock so a burst of samples with no
  frame between them shapes the move identically (which is also what keeps the headless tests
  meaningful). view() reads `show` where it used to read pos+lead. Starting from rest the
  spring is slack, so the world eases in; through the middle it is behind and runs FASTER than
  the hand to catch up — the over-acceleration of the middle he asked for; arriving, it has no
  overshoot left and settles rather than stopping dead. Because it is a converging filter and
  not a reshaping of the travel, nothing is lost: measured, the drawn position ends on the
  model to within 0.00 mm, and short gestures and long ones both keep their true distance.
  The LEAD feedforward stays in the target, and its 0.10s roughly cancels the spring's 0.09s
  catch-up, so the net lag against the hand is about nil. zero_here resets show and showV with
  everything else, keeping pos.z when Set zero is keeping depth. Playwright: the per-sample
  step of a slide right runs 1 1 3 5 7 8 11 13 15 18 20 22 24 25 25 25 24 23 22 20 18 17 15 14
  12 11 10 8 … — an S-curve, dimmed at both ends and driven through the middle ✓; peak
  25px/sample against a first step of 1px ✓; final 482px with model and drawn agreeing to
  0.00 mm and settled velocity 0.0001 m/s ✓; within 1px of final at 0.95s ✓; glide_stop still
  holds without springing back, plate_move, roll_hold, zero_split, deck_one and tilt_deep
  regressions pass (the depth sweep reads 1.35 1.87 2.63 3.77 5.51 where it read 1.36 1.88
  2.65 3.80 5.56 — the spring's tail, not a change of law); no page errors.
- (log 209 tap_rec — lab.html, release tap_rec / rose) two asks. depth_back: DEPTH_INV goes
  back to +1, so the phone coming toward the eye makes the paper BIGGER again and going away
  makes it smaller — the pre-depth_flip behaviour. Third move for this one sign, which is the
  argument for having made it a named switch. Pan, swirl and the two leans are untouched.
  tap_rec: the recorder is a toggle, not a hold — one tap starts, one tap stops. Holding meant
  the recording hand and the moving hand were the same hand; they are not any more, which is
  what makes the rest of this possible. The button reads Record, then Stop 3.4s. mark_live: two
  judgement buttons, ≈ (a little off) and ⚡ (haywire), symbols only because they are pressed
  mid-gesture without looking. They exist ONLY while the tape is running and take the name
  field's place in the thumb row — the name is already fixed by then — so nothing new competes
  for width: off 18+48, haywire 73+48, Stop 128+141, Set zero 276+96. mark_time: every take
  now carries an `events` array beside its samples — a judgement track. Each entry is
  { t (ms from the start of the take), kind }, and the two zero buttons add their own entries
  (set_zero, reset_all) stamped with pos, mult, tilt, turn and roll AT the moment of the press,
  before the reset lands, so the segment before a zero can still be read on its own terms.
  Nothing is recorded when the tape is not running, deliberately: these are notes ABOUT a take.
  rec_stop drops is_rec before it focuses the name field, or the field would still be
  display:none when the focus tried to raise the keyboard. Playwright: toward the eye ×1.47,
  away ×0.69 ✓; Record → Stop → Record with the markers appearing and the name field stepping
  aside and back ✓; a bench take saved as 'bench take' with 25 samples and 4 events — 367ms
  a_little_off, 545ms set_zero (mult 0.692, pos x 0.0419), 713ms haywire, 879ms reset_all ✓;
  glide_stop, plate_move, deck_one, tilt_deep and smooth_move regressions pass; no page errors.
  next: the take with its judgement track is the thing to process — the marks say WHERE in the
  data the model went wrong, which is what every sign argument so far has lacked.
- (log 210 axis_iso — lab.html, release axis_iso / burnt orange) the diagram's frame is drawn
  properly now. axis_iso: iso() stops being a straight-on view with a depth nudge and becomes a
  camera stepped off the normal and up onto the corner — three explicit basis vectors,
  IX (0.960, 0.150), IY (0.130, -0.970), IZ (0.560, -0.480). Every axis keeps the screen
  direction it had, so nothing he has already signed off moves: X still goes right, Y up, Z
  toward you and up-right. What changes is that X now falls slightly, Y leans slightly, and Z
  is a real 40-degree diagonal at nearly twice its old length (0.74 against 0.40), which is
  what makes the three read as a box rather than a cross with a stub on it. Measured, the arms
  now sit at 9 deg, -82 deg and -41 deg — no two parallel, none axis-aligned. line_thin:
  hairlines throughout — axis arm 3.4 → 1.4, arrowheads 4 → 2.8, negative stubs 1.5 → 0.9,
  ticks 1.4 → 0.9, the position bars 6.5 → 3, the drop lines 1.3 → 0.9, the knobs r3.2 → r2.6;
  the heaviest stroke left anywhere in the diagram is 2. origin_top: the point the whole picture
  is measured from is drawn LAST, into the knob group above the plate — a ring and a dot at
  0,0 — so the phone passes in front of it and behind it and it never disappears either way;
  the old faint origin dot in the reference layer is dropped as redundant. glass_faint: the
  plate goes from 0.16 fill / 1.5 solid stroke to 0.07 fill / 1.0 stroke at 0.55 alpha, its top
  edge from 2.4 solid to 1.6 at 0.8, and its ground shadow from 0.10 to 0.055 — the axes read
  straight through it now. Playwright: arm angles and lengths as above ✓; max stroke-width 2
  anywhere in the SVG ✓; pose_knob sits after pose_plate in document order and carries the
  0,0 marker, before and after a move ✓; plate fill rgba(...,0.07) ✓; three-way visual capture
  at zero, tilted and spun; plate_move, model_flip, tilt_flip, swirl_flip and tap_rec
  regressions pass (plate centre reads -27.3,-4.3 where it read -28.4,0 — the new camera, not
  a changed law); no page errors.
- (log 211 read_split — lab.html, release read_split / deep blue) four changes, one of them
  driven by his data. read_split: the two crowded rows of initials under the diagram become
  seven named lines — right/left, up/down, near/far in the axis colours, then tilt top, turn
  side, swirl flat, scale — label left at 9.5px grey, value right at 11.5px bold, 13px rows
  starting at y 60 so all seven sit inside the viewBox's 144 floor. Panel 178×194 → 178×268,
  viewBox -72 -74 144 218, trace strip 228 → 302. pose_pos is gone; pose_lbl survives as a
  hidden one-line join of the same values, because the state hook reads it.
  one_reset: the partial reset is deleted outright — a re-centre that leaves the scale wherever
  a drift put it is not a known state to start from. The surviving thumb button IS the full
  reset and says Reset; it writes a `reset` mark. #reset_btn and its handler, its unhide and
  its var are all gone. light_mark: ≈ and ⚡ become a three-lamp spotlight — green working,
  amber off a little, red off a whole lot — no words at all, since they are pressed mid-gesture
  without looking; kinds on the judgement track are working / off_a_little / off_a_lot. They
  flex to share the row, so three fit where two sat.
  rot_tight: THE REFINEMENT, read out of take 11 (62.8s, 3768 samples, 10 marks). The two
  seconds before every judgement: 'a little off' at 4.2 and 18.7 deg/s mean with peaks of 13
  and 60; 'haywire' at 5.5, 12.1 and 36.6 mean with peaks of 22, 85 and 113 — every one of them
  inside the old fully-trusted band, which began doubting only at 45 deg/s and shut only at 160.
  That is the leak: 1.3 to 4.7 cm of position accumulated in two seconds of what was mostly
  turning, with the model calling itself 'moving' 37-77% of the time. ROT_OPEN 45 → 12,
  ROT_SHUT 160 → 70, so 30 deg/s is now trusted 0.69, 60 deg/s 0.17 and 90 deg/s not at all.
  The same take shows 0.13-0.41 m/s^2 mean linear acceleration through windows he called wrong,
  so MOVE_A 0.20 → 0.26 stops noise being called a move. Playwright: seven named rows measured
  and inside the panel ✓; #reset_btn absent, thumb button reads Reset ✓; three lamps hidden
  when idle and shown when running, a bench take carrying working / off_a_little / off_a_lot /
  reset at 350 / 545 / 743 / 940 ms ✓; veto table 10→1, 30→0.69, 60→0.17, 90→0 ✓; every prior
  lab regression re-run and passing (vj_197, vj_200 and vj_205 updated for the removed
  elements); no page errors.
- (log 212 tilt_back — lab.html, release tilt_back / ochre) tilt_back: PITCH_INV -1 → +1, so
  tipping the top of the phone toward you now brings the paper's TOP toward you and pushes its
  bottom away toward the vanishing point — the opposite of every build since paper_tilt.
  One character, because this axis has had its own named switch since tilt_deep. Only the
  top/bottom axis moves: TURN_INV stays -1, so the side axis keeps the old rule (the edge you
  bring toward your eye is the edge that lies away). The two are deliberately on OPPOSITE rules
  now — he asked only for the top and said he may reverse it again, so the side is left alone
  rather than guessed at; if he settles on one rule for both it is the other character.
  Playwright: beta +20 → tilt -34 and beta -20 → tilt +34, exactly mirrored from the last build,
  while gamma ±25 still gives ∓42.5 unchanged ✓; the rendered picture at beta +18 now crowds
  toward the bottom where it crowded toward the top ✓; Set zero still clears the lean ✓;
  glide_stop, plate_move, deck_one, paper_tilt and read_split regressions pass; no page errors.
- (log 213 zero_cal — lab.html, release zero_cal / deep green) pressing Reset stops being just
  a re-centre and becomes a measurement. zero_cal: he pointed out that when he presses Reset the
  phone is in a KNOWN state — held in front of his face, still — and that the maths should use
  that. It now does. For CAL_MS 450 after every reset the model holds itself still (velocity
  pinned, no move detection, the display follower still running so the picture stays alive) and
  READS the accelerometer instead of believing it: whatever a still phone reports IS its resting
  offset. The mean over that window becomes `bias`, subtracted from every sample afterwards, in
  the ZERO frame so it is an offset in his axes and not the phone's. The gravity direction at
  that instant is kept as gZero, a record of the pose the take was measured from.
  This is the drift killed at the source rather than damped downstream: measured, a sensor
  reading a false 0.05 / 0.18 / 0.30 / 0.45 m/s^2 at rest is now measured to the millimetre-per-
  second-squared and produces ZERO drift over ten seconds of stillness at every one of them.
  Untreated, 0.45 clears the 0.12 deadband by 0.33 and integrates to about SIXTEEN METRES in
  those ten seconds — which is the class of bug behind every 'it goes haywire' mark in take 11.
  cal_trust: a reading is only an offset if the phone was really still, so the window also
  measures the SPREAD about its own mean; above CAL_SD 0.35 m/s^2 the result is thrown away, the
  previous offset is kept, and the deck says 'moved while levelling — offset kept from before'.
  Verified: a still hand levels to 0.200, a hand swinging ±2.4 through the window is refused and
  the good 0.200 survives. The window writes itself onto the judgement track as a `levelled`
  mark (bias, gravity, spread, sample count) or a `level_failed` mark, right after the `reset`
  mark — so a take now carries its own calibration record. What is NOT done: he is also telling
  us the viewing distance at reset (arm's length, face-on), which could personalise D0 0.35 —
  but nothing in the sensor stream measures it, so it stays an assumption rather than a guess
  dressed up as a measurement. Playwright: window opens at 0.45s on reset and closes with the
  offset measured exactly; ten seconds of a still biased phone drifts 0px at four offsets; a
  real slide still reads 'right 9 cm' at 467px; take carries reset at 250ms and levelled at
  442ms over 28 samples. Test note: every test that reset and then immediately moved had to
  learn to wait out the levelling — that is the behaviour, not a bug (hold still after Reset).
  vj_201/vj_202 also repointed from the retired pose_pos to pose_lbl. Whole lab suite re-run
  and green; no page errors.
- (log 214 lane_view — lab.html, release lane_view / purple) two asks, both about what he looks
  at. lane_view: the old trace strip (130×48, two overlaid lines, one for the hand and one for
  the world) becomes six stacked lanes at 178×228. Each lane is one axis, filled SOLID away from
  its own centre line — up for positive, down for negative — with no line, no label, no tick and
  no number. lane_colour reuses the diagram's three: red is the left-right axis AND the tilt
  about it, green up-down and the turn about it, blue near-far and the swirl about it, which is
  not a coincidence but the actual pairing (rotation about X is the tilt, about Y the turn,
  about Z the swirl). lane_scale gives every lane its own full scale from what it has seen, with
  a floor, so a small axis is not flattened by a large one and a quiet one does not turn noise
  into a mountain. no_number: the seven-row readout under the diagram is gone entirely; the
  values still exist in the hidden line the state hook and the tests read. The X/Y/Z axis
  letters stay — they name the axes rather than measure anything. The diagram shrinks back to
  178×178 and zooms in 16% (viewBox 144 → 124 wide) now that it carries no text.
  ground_view: the reset pose is no longer a sheet held up facing you, it is a sheet lying on
  the FLOOR seen from about 45 degrees above — TILT_BASE 45, with the phone moving the lean from
  there rather than from flat. Tip the phone forward (top away, screen looking down) and the
  lean unwinds: measured 45 → 28 → 11 → 0.8 at beta -26, where you are looking straight down at
  the paper and it is dead flat; tip the top back toward you and it goes past 45 → 62 → the
  74 clamp, the bottom crowding and the top running to a vanishing point. PITCH_INV back to -1
  for that to fall the right way round — which reverses 212, but 212 was a free-standing lean
  with no base and this is the anchored version he has now described physically, so the base is
  the thing to keep and the sign follows it. far_haze: leaning 45 degrees pushed the grid's own
  far edge into view as a hard diagonal cut; the grid doubles to 1600% and gains a radial mask
  that fades it out toward its rim, so the distance dissolves into the background instead of
  ending at a line. Playwright: diagram 178×178 at viewBox -62 -62 124 124 with no visible text
  but the X Y Z letters ✓; lanes 178×228 painting in all three colours ✓; the lean table above ✓;
  Reset returns the lean to exactly 45.00deg ✓; whole lab suite re-run and green (vj_207 and
  vj_208c updated for the new resting lean); no page errors.
- (log 215 red_reset — lab.html, release red_reset / dark red) the spotlight comes back, in a
  better shape. red_reset: the lamps live in the deck row ALL the time now, not only while the
  tape is running, so the judgement is always one thumb away. Green is gone — there is nothing
  worth saying when it is working. Amber says it is getting a little off. Red says it has gone
  away altogether AND is the reset, because the moment you would reach for it is the moment you
  want to start again: one press, not two. The separate Reset button is therefore deleted, and
  with it the last thumb button — the red lamp also carries the motion-permission flow that
  lived on it (motion_on(), with its failure messages moved off a button label and into the
  deck line). Row is now name 18+95, amber 120+46, red 173+46, Record 226+146. Record changes
  from red to blue: the lamps own red and amber, and nothing should compete with the red one.
  hold_read: a press is timed on both lamps — mousedown/touchstart to mouseup/touchend — and
  the mark carries `hold` in ms and `long` (>= 600ms), so a tap ('this') and a lean ('this,
  badly') are different data instead of the same mark with the difference living only in his
  head. The lamp swells while held, so the hold is visible as it happens. Red resets on the
  way DOWN (that is what reaching for it is for) and files its mark on release once the length
  is known — which is why a red press writes `reset` and `way_off` a couple of ms apart.
  Measured in a bench take: a_little_off held 1ms (tap), a_little_off held 853ms (long), then
  reset + way_off, then the levelling mark 400ms later.
  take_read: no new trace this round — the file still ends at take 11, the 62.8s one already
  read and already acted on in read_split's rot_tight. Playwright: both lamps shown at rest and
  while recording, green/motion_btn/reset_btn all absent ✓; red takes the world from 315px to
  0px ✓; tap vs hold recorded as above ✓; whole lab suite re-run and green (vj_200, vj_205,
  vj_212 and vj_213 repointed from the deleted buttons to the red lamp); no page errors.
- (log 216 iso_true — lab.html, release iso_true / teal) the lane view was crashing the browser.
  Found and fixed, plus two direction changes. haze_cheap: the far-distance fade was a
  `mask-image` ON THE PAPER, and a mask forces an offscreen buffer the size of the masked
  element — which was 1600% of the viewport, 3D-transformed, and scaled by up to 39. That is the
  crash. The fade moves to .haze, one viewport big, a plain radial gradient in the paper's own
  colour sitting over it; the paper is a painted element again with no mask and no buffer.
  paper_small: the paper goes 1600% → 400%. It shrinks with the zoom rather than growing, so the
  size only ever has to cover what the 45-degree lean brings into view, and 400% does; the haze
  covers the rim. paper_floor follows: MULT_MIN 0.09 → 0.45, because below that the paper drags
  its own edge in — and the small-scale end is also the expensive one to paint (a big element
  full of small squares is thousands of lines), so the floor buys frames as well as coverage.
  MULT_MAX 39 is untouched. lane_slow + pose_slow: the ring is still fed EVERY frame — nothing
  about the capture changes, and the recorder's own sampling was never involved — but the
  drawing is rationed. Lanes redraw at 8/s from every third point (86,000 path segments a second
  → about 4,000); the pose diagram, which rebuilds four groups of SVG from strings, redraws at
  15/s instead of 60. Canvas backing store 356×456 → 178×228. star_cap: the star's scale is
  clamped at 6, or at ×39 it fills the window. Measured, headless, under load (leaning, turning,
  moving, at each end of the zoom): BEFORE 10.3 fps with a 218ms worst frame; AFTER 56-61 fps
  with worst frames of 21-58ms, at ×0.45, ×1, ×2, ×3, ×4.6 and ×39 alike.
  Tried and rejected: panning and zooming through background-position/background-size on a
  fixed element instead of a transform — it is FOUR TIMES SLOWER (14 fps), because a background
  change repaints the whole element where a transform change only recomposites it. Worth
  recording so it is not tried again.
  iso_true: the diagram becomes the textbook isometric — the up axis dead vertical, the other two
  30 degrees below the horizon, one to each side. IX (0.866, 0.500), IY (0, -1), IZ (-0.866,
  0.500); measured on the rendered arms as 30°, -90°, 150°. Z now goes down-LEFT, which is how
  depth reads in an isometric drawing and is the first time its screen direction has moved.
  turn_flip: TURN_INV -1 → +1, so pushing the right edge away throws the vanishing point the
  other way. Side axis only — the top/bottom lean and its 45-degree ground base are untouched,
  which the test asserts (tilt still exactly 45 at rest). Whole lab suite re-run and green; no
  page errors.
- (log 217 rig_right — lab.html, release rig_right / royal blue) the interface collapses to
  almost nothing, and the page watches its own source. rig_right: the full-width deck is gone.
  Everything he touches is now a 168px column off the RIGHT edge, lifted 96px off the bottom
  corner: one wide Record (56px tall), and above it the traffic light the button turns into
  when the tape starts. The window gets its bottom back (no more 108px reservation). no_name:
  the name field is deleted outright — a take is identified by its number ('take 7') and by its
  marks, which is what actually tells one from another; the keyboard-raising dance in rec_stop
  goes with it. The two things that are not controls — where you came from and which build this
  is — move to the top-left corner as a small pill and a small chip. light_show: green (good) /
  amber (a little bad) / red (way bad) appear together while recording, BUT red stays out at
  all times on its own, because red is also the reset and the reset has to be reachable when
  you are only moving the paper around; it widens from 52px to a third of the row when its two
  companions arrive. Green is back — with a name field gone there is now a reason to say 'this
  bit was fine'.
  watch_live: the page reloads itself when its own source changes. It asks the server every 5s
  whether lab.html has a new ETag (falling back to Last-Modified, then to length), reloads when
  it does, and gives up after 16 minutes of no change so a page left open does not poll all
  night. A small pulsing dot under the release chip says 'watching', turns blue and says
  'changed — reloading' at the moment it fires, and goes grey with 'watch off — no change for
  15 min' when it stops. Skipped entirely on file:// . Proven live: touching lab.html on disk
  reloaded the open page 4.6s later, and touching it again reloaded it again.
  Playwright: name field absent; rig at x206 y606 168×78 with Record 168×56; back and chip at
  16,16 and 16,56; window back to 362×752; lights off/off/on when idle and on/on/on while
  recording; a take saved as 'take 1' with good / a_little_off / reset / way_off / levelled on
  its track; watcher shown and reloading on a real file change. Whole lab suite re-run and
  green (five tests repointed off the deleted name field and deck geometry); no page errors.
- (log 218 grade_two — lab.html, release grade_two / green) his grading protocol, and the bug
  it exposed. grade_two: amber is gone; the marks are two ordinary buttons, Good (green) and Bad
  (red), the same shape and height as Record rather than lamps — they are pressed deliberately
  after a move now, not blind mid-gesture. Green appears only while the tape runs; Bad is out at
  all times because it is also the reset, which matches his protocol exactly: hitting reset IS
  the bad grade. dwell_mark: he said that when the return is right he simply STAYS there a
  second. That is a signal, not the absence of one, so it goes on the judgement track by itself
  — a `dwell` mark after DWELL_S 1.0 of stillness, carrying the move it followed and where the
  world settled. His grading is therefore complete without him pressing anything: reset = no,
  dwell = yes.
  trap_free + shake_test: he reported that the left-right axis most often gets stuck ON, the
  model believing the hand is still pushing when it is not, and that this is what most of his
  resets are for. It is real and it is now fixed at the root. Three guards, in order of how much
  they mattered. shake_test is the one that counts: the real difference between a push and a
  tremor is NET, not size — a hand going somewhere has a direction over a seventh of a second,
  a hand only shaking averages to nothing while still reading large. Each axis carries a short
  average of its signed drive (aBar, TREM_TAU 0.14s) and of its size (aMag); when |aBar| falls
  below TREM_R 0.34 of aMag the axis is shaking. shake_hold: that state must PERSIST for
  TREM_HOLD 0.35s before the axis is silenced, because a real push-then-brake passes through
  'no net' for an instant at the turn — silencing it there cost half the gesture, measured, a
  slide falling 482px → 266px. With the hold in, the same slide is 482px again. COAST: when the
  drive on an axis is weak (under COAST_A 0.10) its speed decays with COAST_TAU 0.30s instead of
  VEL_TAU 6.0 — coasting is not free. MOVE_MAX 1.5s caps any single move outright, and marks
  `move_capped` only if the runaway actually carried more than a centimetre, so the shake test
  doing its job stays silent. Measured: six seconds of continuous hand tremor at 0.30-0.34 m/s^2
  — comfortably over the MOVE_A threshold — used to walk the world 241px (4.9 cm) and climbing;
  it now moves it 4px (0.1 cm) and stays there. A quick slide still reads 'right 9 cm' at 482px
  and a slow gentle one 727px, both unchanged. Playwright: buttons labelled Good/Bad, green
  hidden when idle and shown while recording; the tremor table above; a take carrying
  levelled / dwell after "right 9 cm" / good / reset / bad. Whole lab suite re-run and green
  (four tests repointed off the retired amber button); no page errors.
- (log 219 spin_arc — lab.html, release spin_arc / indigo) he counted the lanes and said he
  expected three, one per vector, each with a positive and a negative side — and that the
  rotations belong in the diagram instead. He is right on both counts. lane_three: the lane
  panel drops from six lanes to three — red right/left, green up/down, blue near/far — each
  running positive above its centre and negative below, and each now half as cramped (panel
  178×228 → 178×168, canvas with it). The rotations were never distances and did not belong on
  a distance chart. spin_arc: each rotation is now drawn where a rotation can actually be seen —
  an arc swept about the axis it turns, in that axis's own colour, so the colour that names a
  direction also names the turn around it. Tilt sweeps about X, drawn in the Y-Z plane; turn
  about Y, drawn in Z-X; swirl about Z, in X-Y. Each arc is built by walking the circle in the
  plane spanned by the OTHER two axis vectors and pushing every point through the same iso()
  the rest of the diagram uses, so the arcs sit correctly in the isometric frame rather than
  being pasted on flat. A small head at the moving end says which way it is going. Radius 36,
  outside the plate, and the group is drawn ABOVE the plate — at radius 25 and below it, the
  phone hid the very thing it was doing. Nothing is drawn under 3 degrees, so a still phone
  stays clean. Playwright: 0 arcs at rest; beta 30 gives exactly one red polyline, gamma 30 one
  green, alpha 40 one blue, and 40/25/-20 gives all three at once ✓; lane panel measured at
  178×168 with all three vector colours painting ✓; four-way visual capture (rest / tilt / turn
  / swirl) ✓; whole lab suite re-run and green; no page errors.
  test_note: the local http.server had died between runs — restarted on 8901. Worth checking
  first when a suite fails with ERR_CONNECTION_REFUSED rather than debugging the page.
- (log 220 diag_flip — lab.html, release diag_flip / fuchsia) two switches, both diagram-only.
  TILT_INV -1 → +1 reverses the depicted tilt, which flows to the plate matrix AND the red tilt
  arc together because both read flipped.pitch. MODEL_INV.z +1 → -1 reverses the depicted
  near/far travel, which flows to the plate's position, the blue guide bar, its knob and the
  tether together because all of them read model_pos(). With this, all three of the diagram's
  travel axes are reversed against the world, and the Z exception that had stood since
  model_flip is gone. The paper is untouched, which the test asserts rather than assumes: its
  lean still reads exactly 45 at rest (PITCH_INV, a different switch) and a push toward the eye
  still enlarges it (DEPTH_INV, another). Playwright: beta +30 now reads tilt top +30 (was -30)
  and -30 reads -30, each still drawing its red arc; a push toward the eye measures true z
  +0.0241 m and ×1.6 on the paper while the diagram reads near/far -2.4 cm (was +2.0) ✓; whole
  lab suite re-run and green; no page errors.
  switch_count: seven named sign switches now — PAN_INV, DEPTH_INV, PITCH_INV, TURN_INV for the
  paper; MODEL_INV, TILT_INV, SWIRL_INV for the diagram. Every one has been flipped at least
  once and several more than that, which is the argument for having named them rather than
  burying minus signs in the maths.
- (log 221 turn_back — lab.html, release turn_back / maroon) TURN_INV +1 → -1: pulling the
  right edge toward you or away throws the paper's vanishing point the other way again, undoing
  the flip made in iso_true. He said plainly that he likes the tilt as it is, so PITCH_INV and
  the 45-degree ground base are untouched and the test asserts it — tilt still reads exactly
  45.0 at rest, 74.0 at beta +20 and 11.0 at beta -20, unchanged in all three, while gamma ±25
  goes from ∓42.5 to ±42.5 and gamma ±60 from ∓74 to ±74. This is the second reversal of this
  one sign and the fourth on the paper overall; every one has been a one-character edit because
  each axis has its own named switch. The diagram is untouched too (MODEL_INV, TILT_INV,
  SWIRL_INV are separate). Whole lab suite re-run and green; no page errors.
  test_note: the local http.server had died again between prompts. Restarting it on 8901 is the
  first thing to try on ERR_CONNECTION_REFUSED — it is not the page.
- (log 222 mark_line — lab.html, release mark_line / magenta) the presses now appear on the
  charts, and a reset carries a grade. mark_line: the trace ring gains a fourth slot holding
  what was pressed at that frame — 0 nothing, 1 good, 2 a plain reset, 3 a reset inside a burst.
  A press sets pendEv and the very next frame consumes it, so the rule lands at the moment it
  happened and then scrolls away with the data it belongs to. trace_draw paints them LAST, as
  rules spanning all three lanes at once: green for good, red for a reset, and a burst drawn at
  3px and near-opaque against 1.4px at 0.7 for a single one. NOTE: they are drawn VERTICALLY.
  He said 'a horizontal green line', but on a chart whose x axis is time a press is a moment,
  and a moment is a vertical rule; a horizontal line would be a value, which a press does not
  have. Said plainly in the reply so he can correct it if he meant something else.
  reset_run: his shorthand, taken exactly as offered — ONE press means 'I am just re-zeroing',
  several close together mean 'that went disastrously wrong'. Presses are counted against
  RESET_GAP; every reset mark now carries `run` (which press of the burst this was) and
  `severe` (two or more), and the deck says 'noted — that one went badly' the moment the second
  press lands. RESET_GAP is 900ms, not the 1400 first tried: measured, at 1400 a deliberate
  re-zero followed by another a second later was wrongly read as a burst, while a real
  double-tap lands well inside 900. This makes a reset a graded act instead of an ambiguous one,
  and it costs him nothing to say. Playwright: a take carrying good, then reset press 1 (just
  re-zeroing), then reset press 1 / 2 SEVERE / 3 SEVERE for a burst — each reset also writing
  its `bad` mark, since red is both ✓; the canvas read back column by column shows one green
  rule, one lone red, and a tight cluster of thick reds ✓; whole lab suite re-run and green;
  no page errors.
- (log 223 z_calm — lab.html, release z_calm / navy) arc_flip: the plate turns the right way but
  two of the three arrows did not. An arc is swept from 0 to its angle and the head sits at the
  end of the sweep, so negating the angle sweeps the other way and turns the arrow round. Tilt
  and swirl are negated for the ARC only — the plate still reads flipped.pitch untouched, which
  the test asserts (beta +35 still reports tilt top +35 while the red arc's endpoint mirrors).
  The turn arrow was already right and is left alone.
  z_calm: he noticed near/far is the most erratic axis and he is right. Three causes, one fix
  each. (1) Gravity points mostly along the screen's normal at any comfortable holding angle,
  and the phone's gravity-free acceleration is an ESTIMATE whose error is largest exactly along
  gravity — so z carries leakage x and y never see. It gets its own larger deadband, DEAD_Z 0.20
  against 0.12. (2) The depth mapping amplified whatever survived: at Z_POWER 6.6 a centimetre
  of z error moved the whole picture's scale, where a centimetre of x error moved it one
  screen-width. 6.6 → 4.6 — a third less twitchy per centimetre, still reaching ×16.6 at 16 cm
  and the ×39 ceiling beyond, with ×1.75 / ×3.30 / ×6.90 at 4 / 8 / 12 cm where it used to be
  ×2.2 / ×5.5 / ×17. (3) The display spring is softened for z alone (SM_W_Z 6 against 11), so
  what does get through arrives as a glide rather than a flicker. Measured, the same four pushes
  now read ×1.12 / ×1.22 / ×1.35 / ×1.52 where they were far steeper, and six seconds of
  0.17 m/s^2 wobble moves neither x nor z at all.
  next_trace: everything needed to tune this further is already on the judgement track — dwell
  marks, reset runs with their severity, and the marks drawn on the charts. A run of about a
  minute doing only near/far — reset, push toward, hold a second, pull back, hold a second,
  double-tap reset whenever it goes wrong — would let the next pass be measured against his
  grading rather than guessed. Whole lab suite re-run and green; no page errors.
- (log 224 axis_one — lab.html, release axis_one / olive) found why pulling the phone toward
  him and pushing it away threw the FOCAL POINT off while the scale looked fine. The pan is
  world metres multiplied by the zoom — ox = cam.x * (w/PHONE_W) * mult — so at ×6 a
  three-millimetre sideways error is drawn six times bigger. A toward-and-away move is made by
  an arm, an arm arcs, so there is always a little sideways in it, and the zoom the move itself
  creates is exactly what magnifies it. The two errors multiply, which is why it went off 'pretty
  immediately' and why the scale could look right while the focus did not.
  axis_one: the fix is not to fight the arithmetic but to notice that he moves ONE WAY AT A TIME
  — he has said so himself, and his whole grading protocol is built on it. During a move, an
  axis carrying less than ONE_R 0.45 of the LEADING axis's smoothed net drive is not really
  being pushed, so its velocity is zeroed and its drive dropped. It rides on aBar, the same
  short signed average the shake test already keeps, so it costs nothing new. A genuine diagonal,
  where two axes are comparable, still passes both. Measured against the same gesture with a
  0.30 m/s^2 sideways bleed: WITHOUT the gate the focal point sat 171px off at the near end;
  WITH it, 0px — and the scale is identical either way (×3.07 there, ×1.01 back), so nothing
  about the depth response was traded for it. A plain slide right is unchanged at right 9 cm /
  482px and now leaves the scale at exactly ×1.00, where a lateral move used to disturb the zoom
  a little as well. An equal push on x and z still moves both (3.5 cm and 6.0 cm). Whole lab
  suite re-run and green; no page errors.
- (log 225 shot_on — lab.html + lab_surface.png, release shot_on / plum) something real to look
  at instead of a dot. shot_on: an <img class="shot"> is a CHILD of the paper element, absolutely
  centred at the world origin, so it inherits the pan, the zoom, the swirl and both leans for
  free — there is no second transform to keep in step, and it can never drift out of register
  with the surface it is lying on. It is sized in the paper's own units (340px there is about one
  screen wide at ×1), so the whole thing is in view when zeroed and you walk INTO it as you come
  closer; a drop shadow puts it on the paper rather than in front of it. If the file is missing
  the img fires error, sets data-missing and hides, and the page is exactly the graph paper it
  was — so the picture is optional, not load-bearing. Swap lab_surface.png for any image.
  no_upload: his screenshot did not arrive — the uploads directory holds only the old vampjam
  project files, nothing from this turn. Rather than stall, the mechanism is shipped with a
  plainly generic stand-in (a mock content screen drawn with PIL, 450×800, 12KB, no branding and
  no real content) so he can judge the FEEL now; his image drops straight in over it.
  Cost, measured honestly with the image shown and hidden back to back on the same build:
  44 fps against 44 fps — the picture is free. (An earlier reading suggesting 59 → 41 was the
  test harness having grown, not the page: vj_216c drives one full sensor sample per frame and
  has gained the shake test, the axis gate, the per-axis deadband and the per-axis spring since
  it was written.) will-change/translateZ on the image was tried to give it its own layer and
  changed nothing, so it was removed rather than left in costing memory. Playwright: image
  loads at 450×800 and its parent is #grid ✓; three-way capture at rest, closer and slid ✓;
  with the file blocked the image hides and the paper still paints ✓; suite green.
- (log 226 flat_zero — lab.html, release flat_zero / moss) TILT_BASE 45 → 0. He noticed that the
  page LOADS with the picture face on and square to the glass — because motion has not started
  and --tilt is unset — and that pressing Reset then threw it down onto the floor at 45 degrees.
  He is right that the load state is the one worth keeping: laying the surface on the ground is
  a fine way to look at graph paper and a poor way to look at a picture. So the reset pose is
  flat again, and the lean now runs BOTH ways from nothing rather than from 45 — tipping the
  phone still lays the surface down, it just does not start there. This reverses ground_view
  from entry 214, deliberately and for a stated reason. shot_size 340 → 352, so a reset presents
  the picture rather than a stamp in the middle of a field: measured, 97% of the window wide and
  83% tall. Playwright: on load 352×626 with the lean never set; after Reset the same 352×626
  with the lean at exactly 0.00deg — the two states are now identical, which was the whole ask ✓;
  beta ±30 still leans ±51 ✓; three-way capture (load / after reset / tilted) ✓; vj_207 and
  vj_208c updated off the retired 45-degree base; whole lab suite re-run and green; no page
  errors.
- (log 227 zoom_wide — lab.html, release zoom_wide / rust) Z_POWER 4.6 → 9.2, doubling the
  magnification the same hand movement buys: 4 cm toward the eye goes x1.75 → x3.06, 8 cm
  x3.30 → x10.9, and the ×39 ceiling now arrives around 11 cm instead of 17. The exponent had
  been halved in z_calm to stop the axis feeling twitchy, but what actually fixed the twitch was
  the larger deadband on z and the softer spring — so the exponent could go back up and past
  where it started, which is what he asked for. MULT_MIN 0.45 → 0.30 with it, or a doubled
  exponent hits the floor three centimetres out.
  paper_size: whether the paper needs to grow to cover the window at the new floor was measured
  rather than assumed — 400%, 500% and 600% captured and timed back to back at ×0.30 with a
  25-degree lean. They look identical (the pale wash in the corner is the distance haze doing
  its job, not a paper edge) and cost 42 / 28 / 24 fps. So 400% stays, and the 14 fps that
  growing it would have cost is not spent.
  Playwright: pushes of 4 / 6 / 8 / 10 / 12 samples now land x1.25 / 1.48 / 1.81 / 2.31 / 3.05
  against roughly half those before; a full pull away reaches the 0.30 floor; three-way capture
  at the floor, at rest and pushed in; whole lab suite re-run and green; no page errors.
- (log 228 star_off — lab.html, release star_off / teal) star_off: the star is gone, along with
  its shadow machinery (--shx/--shy/--shb/--sho, star_lift, star_cap, dot_scale and the .pin
  wrapper). It existed to be the one thing in the world when the world was blank graph paper;
  with a picture lying on the paper there is something to look at, and a marker sitting on top
  of it was in the way. Z_POWER 9.2 → 18.4, doubling the depth response for the second time in
  two prompts: the whole range is now inside about six centimetres of hand — 2 cm toward the eye
  is ×2.95, 4 cm is ×9.3, and the ×39 ceiling arrives by 6.5. Measured on the same synthetic
  pushes, 2 / 4 / 6 / 8 / 10 samples now land ×1.19 / 1.56 / 2.18 / 3.28 / 5.33, roughly the
  square of what they gave two builds ago. MULT_MIN stays 0.30 and is now reached about
  two and a half centimetres out, so the AWAY side saturates quickly while the toward side has
  the whole range — worth naming: if he wants a long way out and a short way in, the two
  directions need their own exponents rather than one shared one. Playwright: no .pin or
  .pin_dot in the document ✓; the push table above ✓; three-way capture at the floor, at rest
  and pushed in ✓; whole lab suite re-run and green; no page errors.
- (log 229 swipe_pan — lab.html + lab_surface.svg, release swipe_pan / sienna) a finger can move
  the surface, and the surface is worth moving over. swipe_pan: the old up/down flick between
  three coloured cards had no job left — there is one world now, not a stack of pages — so the
  same gestures pan the paper instead. A drag is converted back through the swirl (the paper's
  axes are turned on screen, so a screen delta is not a paper delta) and then through the scale,
  because a pixel buys less world when zoomed in; it is written into BOTH pos and show so the
  surface tracks the finger exactly instead of lagging the spring. Measured: a +120/+80 drag
  moves the surface exactly 120px/80px on screen, and at ×2.18 the same 120px drag moves the
  world 1.08 cm where at ×1 it would move 2.18 — the finger stays glued to the picture at every
  scale. It stays in the plane of the paper by construction, since --sx/--sy live inside the
  rotate and the two leans.
  lab_surface.svg replaces the PNG: an illustrated coastal town, 1800×3200, 224KB, generated —
  a gradient dusk sky with 420 stars, a sun, three hill bands, a sea with 260 glints and seven
  boats, 46 skewed fields with furrow lines, a river, 70 houses each with brick or tile
  patterning and individually lit or dark windows, 150 trees, 38 birds, a lighthouse casting a
  beam, sixteen little place labels and a compass rose with fifteen-degree ticks. Plenty to go
  in and find.
  crisp_deep: and it stays sharp, which took a real fix. An <img> inside a transformed ancestor
  is rasterised at its LAYOUT size and then scaled by the transform, so the SVG blurred exactly
  when he leaned in — the one thing choosing SVG was meant to avoid. The element is now laid out
  --shk times bigger and scaled back down by the same factor, so the raster is taken large and
  the zoom magnifies a picture that already has the detail. --shk steps in powers of two (rare
  re-layout) and caps at SHK_MAX 6, because the memory goes with its square: 6 is 2112×3756,
  about 32MB, and 8 would be 56. Captured at ×6.3 the houses show crisp windows, brick texture
  and sharp roof edges where they were mush before. Whole lab suite re-run and green; no page
  errors.
- 230 lens_glass · b230 · lab.html — you are looking through a magnifying glass now.
  lens_glass: a 270px round window at the middle of the screen, clipped to a circle, holding a
  SECOND copy of the whole world. Both copies read the same pan, swirl, lean and zoom from the
  one view() law, so they can never disagree about where you are looking. Inside the circle is
  a bright bevel, a dark rim and the shadow it throws; inside the glass a soft highlight across
  the upper left, a faint streak and a small specular spot, all clipped to the lens so they
  travel with it.
  lens_gain: the RIM is the plain view — exactly what the page showed before the glass existed —
  and the LENS multiplies it by --gain 1.8. The first attempt did it the other way round,
  shrinking the OUTER world to a third, and that emptied the rim entirely: at x1 the picture is
  only 352px wide, so a third of it hides behind a 270px window. The lens's PAN is multiplied by
  the same gain, so the world point under the middle of the glass is the same one either side of
  the edge — a boat in the rim is that boat, magnified, in the lens. --shk is keyed to
  mult * 1.8 now, so the raster is taken for what the LENS shows rather than what the rim does.
  rim_cheap: the rim copy was first dimmed with filter: brightness/saturate, and that halved the
  frame rate — 60fps down to 15-40, worst frame 138ms. A CSS filter allocates an offscreen buffer
  the size of the element it is on, and this element is the paper: 400% of the stage, scaled by up
  to x39. Exactly the cost that crashed the browser back when the fade was a mask, wearing a
  different hat. The filter is gone and the dimming is done by .haze instead — which also MOVED,
  from a sibling of the stage into it, sitting between the rim (z0) and the lens (z2). Two things
  fixed at once: the fog now dims the distance and no longer washes over the window you are
  looking through, and it costs one constant-size paint that never grows with the zoom. Measured
  back at 44-58fps with both worlds live, against 59-61 with the rim hidden.
  gain_ease + flare_calm: gain came down from 2.6 to 1.8 (at 2.6 the glass at rest landed on open
  sea and read as an empty porthole; at 1.8 it holds the hills, the water and the boats), and the
  flare came down with it — it was tuned against a lens the haze was washing out, and once the
  haze came off the glass it read as an opaque shiny dome.
  Whole lab suite re-run and green, node --check clean, no page errors.
- 231 lens_wide · b231 · lab.html — the glass is nearly the whole window now.
  lens_wide: --lens_d goes from a fixed 270px to min(90vw, 90vh), set once on .stage so the lens
  and its ring can never fall out of step. On a 390-wide phone that is 351px: the circle reaches
  to within 20px of each edge and the wider scene survives only in the four corners and thin
  strips top and bottom — which is all the context the rim needs to say "the same place, further
  back". Sized against both axes so it stays a circle on any phone, in either orientation.
  flare_scale: the marks on the glass are sized in PERCENT of the glass, so blowing the lens up
  1.7× in diameter blew the highlight up with it and it fogged the middle of the picture. The
  soft highlight is now an explicit 38%×30% ellipse held in the top-left quarter rather than a
  closest-side gradient that grows without limit, the streak falls off sooner (16%/38% against
  22%/46%), and the specular spot is smaller (11%×5.5% against 15%×8%) — a bright point on a
  big piece of glass reads as a point, not as a patch.
  Frame rate unchanged by the widening: 39-56fps with both worlds live against 61 with the rim
  hidden, same as before. Suite green, no page errors.
- 232 lens_back · b232 · lab.html — 231 lens_wide is undone. "That's too freaky."
  --lens_d goes back to the fixed 270px and the .stage rule that set it to min(90vw, 90vh) is
  gone. The flare goes back with it: closest-side highlight, the 22%/46% streak falloff and the
  15%×8% specular spot — the values 231 shrank were shrunk only to survive the bigger glass, so
  they have no reason to stay.
  what the widening got wrong: at 90% the glass stops being an OBJECT you hold up and look
  through and becomes the page itself with a ring drawn round it — a huge eye rather than a hand
  lens. The rim was reduced to four corners, so it no longer read as "the same place, further
  back"; there was nothing left of the wider scene to be further back FROM. Worth keeping in
  mind if the diameter is ever raised again: the rim has to hold enough scene to be recognisable
  as the same one, and the glass has to look like it is sitting on top of something.
  Nothing else from lens_glass is touched — two worlds, gain 1.8, the fog between them, no
  filter on the rim. Suite green, no page errors. No new trace with this one.
- 233 lens_none · b233 · lab.html — the magnifying glass is gone entirely. "It's just creating
  this weird fact I wanna back up."
  Everything from 230-232 comes out: the round .lens window, the .lens_ring bevel, the .flare
  highlight and its specular spot, the .grid_out second copy of the world, the .lens .grid gain
  rule and the --gain and --lens_d variables. One .grid again, one <img>, full bleed. The .haze
  goes back to what it was before the glass — a sibling of the stage, transparent at its centre
  (0 at 0%, 0.55 at 62%, 0.96 at 100%) rather than the flat 0.30 floor it grew when it was doing
  the rim's dimming. --shk is keyed to plain mult again rather than mult × the lens gain.
  why: it made the page read as a thing seen through an instrument rather than a place you are
  moving around in. The glass sat still while the world slid under it, so the eye anchored on
  the ring and the motion became something happening inside a porthole. Everything the page is
  for — a gesture landing where you expect it to — is easier to see when the picture simply
  fills the window.
  what stays from that stretch: nothing of the glass, but the two lessons are worth keeping. A
  CSS filter buffers the whole element it sits on, so it is as dangerous on the paper as a mask
  was. And a second copy of the world costs roughly half the frame rate — 60fps down to 15-40 —
  which is the number to weigh against any future "show it twice" idea.
  Frame rate back to 55-61fps across the whole zoom range. Suite green, no page errors, no new
  trace with this one.
- 234 bump_step · b234 · lab.html — the world no longer follows the phone. It steps.
  bump_step: a gesture is now worth exactly ONE step along ONE axis. Bump right, the world goes
  one right; bump back, one left; bump toward you, one closer. How hard or how far you bumped
  changes nothing — one bump, one level. Where the world stands is `cell`, three integers, and
  integers do not drift. Everything under the detector is unchanged and still doing its job:
  deadband, rotation veto, shake test, axis dominance, direction latch, brake, settle lock. What
  changed is what we DO with the answer — instead of integrating it into a distance we read it
  as a single yes on a single axis.
  bump_read: whichever axis carried the most, provided it carried at least BUMP_MIN 2cm AND beat
  the runner-up by BUMP_LEAD 1.5×. A gesture that lands between two axes is refused rather than
  guessed — he asked for bumps aligned with the basic vectors, so an ambiguous one is no bump.
  A refusal files a bump_none mark with the three runs on it, so the threshold can be tuned from
  his takes rather than from my guess.
  bump_centre: this is the "recentre" he was reaching for and it is the point of the whole thing.
  After every bump the metre-scale model — pos, vel, lead — is wiped to zero. Sensor drift, a bad
  brake, a trapped axis and a half-detected wobble now all die at the end of the gesture they
  happened in instead of accumulating across a take. The trapped right/left axis that caused most
  of his resets cannot survive one gesture any more.
  the world holds still THROUGH a gesture and steps when it is over: the display spring targets
  the lattice, not the evidence, so there is no live tracking to disagree with. Measured: screen
  x 0 → 0 mid-gesture → 90px after.
  step_even: a sideways bump is a quarter of the SCREEN, at every zoom. Pan is metres × zoom, so
  a step fixed in metres is a quarter screen at ×1 and nine screens at ×39 — one bump would throw
  you clean off the picture the moment you leaned in. So the metres per step are divided by the
  zoom the LATTICE is at (an exact power of BUMP_ZOOM, not the springing display value, so pan
  and zoom settle together and nothing chases itself). Measured 90 / 92 / 98px at ×1 / ×2.6 / ×7.1.
  a bump toward you is ×1.6, and STEP_Z is DERIVED from that through the zoom law
  (D0·(1 − BUMP_ZOOM^(−1/Z_POWER))), so changing Z_POWER can never silently change what a bump
  toward you is worth. CELL_MAX 7/7/5, so ±5 steps of depth spans ×10.5 in and ×10.5 out.
  swipe_pan survives: the finger drag is its own offset `off` on top of the lattice, so the spring
  does not pull it back. Measured: a 120px drag moves 120px, cell unchanged, and a bump after it
  adds its 90px on top. Reset clears the lattice, the offset and the levelling all together.
  measured: gentle push and violent push both give exactly one step. Six seconds of shaking in
  place gives zero steps. All six directions fire and reverse correctly.
  frame rate: unchanged in kind — A/B'd against the old continuous model at the same zooms, both
  sit at 31/32fps under a synthetic shake-every-frame drive and 51-61fps idle. With bumps the
  world is only in motion for the ~0.3s settle after a step, so the driven case barely occurs in
  real use. The one number that got worse (27 → 21fps while shaking at ×1.6) is --shk 2 raster
  cost, pre-existing and unrelated to the stepping.
  Suite green, no page errors. No new trace with this one.
- 235 blip_out · b235 · lab.html — 234 had it backwards. The bump is the TRIGGER, not the motion.
  blip_out: the moment a bump is recognised, everything measured about it is thrown away — how
  hard, how far, how long, where it ended — and ONE canned signal is played instead: a short move
  out in that direction and straight back to where it started. Same shape, same size, same
  duration, every time, for all six directions. 234 read the gesture and then moved to a new
  place and stayed there, which is still the world following the phone, only in whole numbers.
  This is the phone TELLING the page something and the page answering in its own fixed voice.
  the signal: out 90ms on a smoothstep, hold 50ms so the eye can land on it, ease back over
  180ms. 320ms end to end. Asymmetric on purpose — out and back at the same speed reads as a
  wobble, not as a tick. Sideways it peaks at a quarter of the screen (measured 90-91px on all
  four of right, left, up, down); toward and away it peaks at ×1.6 and ×0.63 zoom, and that
  amplitude is DERIVED from the zoom law (D0·(1 − BUMP_ZOOM^(−1/Z_POWER))) so changing Z_POWER
  can never silently change what a bump toward you looks like.
  the lattice is gone, and so is the display spring. The spring existed to chase a moving target;
  the blip's own curve IS the animation, and a spring on top of it would smear the one thing that
  has to be identical every time. show is now simply "where the finger left it, plus the signal".
  pos, vel and lead survive as evidence being gathered for the NEXT bump and are never drawn.
  nothing accumulates: five bumps right in a row leave rest at exactly x0 y0 zoom ×1. There is no
  running position for drift to get into at all — the strongest form yet of the recentre he asked
  for in 234.
  bump_soft: BUMP_MIN drops from 2cm to 1.2cm. 2cm was tuned when a gesture had to be a whole
  slide; a bump is a flick and a gentle flick carries barely a centimetre, so it was being thrown
  away (measured: a gentle push fired nothing before, fires now). Well clear of a tremor — five
  seconds of shaking at 0.35, 0.55 and 0.9 m/s² each give zero blips and zero pixels of wander.
  shk_hold: --shk now rises the instant the zoom needs it and falls only after a second of not
  needing it. A blip toward you takes the zoom to ×1.6 and back inside a third of a second, and
  re-laying out a 704×1252 image twice per signal is the most expensive thing on the page for no
  gain at all — the picture is identical at the end to what it was at the start.
  swipe_pan survives: the finger drag moves where REST is, and the blip plays out from wherever
  the finger left it. Suite green, no page errors. No new trace with this one.
- 236 nudge_hold · b236 · lab.html — the standard nudge, and it STAYS.
  nudge_hold: the two halves he asked for across 234, 235 and this one, finally together. From
  235: the bump is only the TRIGGER — how hard, how far, how long is all thrown away and one
  standard nudge is delivered instead, identical every time. What 235 got wrong is that its
  signal went out and came straight back; he wants the thing actually moved the way he nudged it.
  So the nudge now carries the world one notch that way and LEAVES it there. Where the world
  stands is `cell`, three whole numbers; a nudge is +1 or -1 on exactly one of them; whole
  numbers do not drift, and the gesture is forgotten the instant it has been counted. CELL_MAX
  9/9/5.
  the delivery is 210ms on a cubic ease-out — fast off the mark, easing into its landing, so it
  reads as a nudge arriving rather than as a slide. No spring anywhere: the curve IS the
  animation, and a spring on top would smear the one thing that has to be identical every time.
  pos, vel and lead survive only as evidence for the NEXT bump and are never drawn, so the world
  holds perfectly still through a gesture and moves when it ends.
  nudge_even + pan_settle + zoom_at: a sideways nudge is a quarter of the SCREEN at every zoom.
  The metres per notch are divided by the zoom, and the first attempt divided by BUMP_ZOOM^z as
  shorthand — but the zoom law is not a power of the depth ((D0/(D0−z))^Z_POWER; two notches is
  ×2.59, not ×2.56), so the shorthand left a couple of pixels of pan snap on every nudge after
  the first. zoom_at() now runs the actual law off cell_at('z'), which is a pure function of the
  clock and so cannot start anything chasing itself. Measured 91px per nudge at ×1, ×2.59 and
  ×7.08 — the same to the pixel.
  measured: right, left, up, down, closer and away all deliver and hold; three nudges right land
  91 + 91 + 90px and stay; gentle, violent and soft all give exactly 91px; five seconds of
  shaking at 0.35, 0.55 and 0.9 m/s² each leave cell at 0,0,0 with zero pixels of wander; reset
  returns to the middle. swipe_pan slides under the lattice and nudges carry on from where the
  finger left off.
  shk_hold earns its keep here: the zoom now moves in short landings that can cross a
  power-of-two boundary, and holding --shk for a second took the shake-driven frame rate at ×1.6
  from 21fps to 54-56. Suite green, no page errors. No new trace with this one.
- 237 nudge_fast · b237 · lab.html — fire on the leading edge, and the picture takes the blow.
  nudge_fast: every version until now waited for the gesture to FINISH — brake to a stop, go
  quiet, then classify what had been integrated. That is a quarter to half a second of delay on
  every nudge, and it is the wrong shape of answer anyway: a nudge is over before it has finished
  and is recognisable from its first 50ms. The loop is now a 45ms average of the drive, a
  threshold on it (NUDGE_A 0.85 m/s²) and a dominance test (×1.5 over the runner-up). The instant
  one axis crosses and is clearly the one being driven, the nudge is delivered. Measured at TWO
  SAMPLES — about 33ms — on all six directions, against roughly 400ms before.
  the refractory window is what makes it safe: on firing the detector DISARMS and stays disarmed
  until the phone has been quiet (below 0.30 m/s²) for NUDGE_REARM 160ms. That is what stops the
  return stroke, the brake and the settle from each firing a nudge of their own — measured: every
  direction fires once and the return stroke is ignored; three of each gives exactly three.
  swoop_out: NUDGE_RISE 220ms is a deadline — a burst must reach the threshold within that of
  leaving quiet or it is not a nudge and the detector just waits for quiet again. A slow swoop
  right over a second and a half now moves nothing (it used to be a full slide). Shaking at 0.35,
  0.55 and 0.9 m/s² for five seconds still moves nothing.
  push_back: PUSH_INV = { x: -1, y: -1, z: +1 }. Nudge the phone UP and the painting goes DOWN
  the screen; nudge it right and the painting goes left. The phone is the hand and the picture is
  the thing being knocked, so the picture takes the blow in the direction it was struck from.
  Measured: phone up → +91px (down), phone down → −90px (up), phone right → −90px (left), phone
  left → +91px (right). DEPTH IS LEFT AS IT WAS — nudge toward you and the picture comes toward
  you (×1.6), nudge away and it goes away (×0.63) — because that is the one he did not describe;
  PUSH_INV.z is one character.
  the landing tightens too: NUDGE_MS 210 → 160, since the delivery is the second half of the time
  between his wrist and his eye.
  the old path is gone: bump_read, BUMP_MIN, BUMP_LEAD and the call to bump_fire from end_move
  are all removed. end_move is now only bookkeeping for the lanes and the marks; nothing about
  where the world goes is decided there any more.
  worth watching: three nudges is 273px at ×1, which pushes a 352px-wide picture most of the way
  off. NUDGE_FRAC 0.25 is the knob if that reads as too big a notch. Suite green, no page errors.
  NO NEW TRACE ARRIVED — lab_gestures.json on main is still the 11:43 batch of 21 takes, byte for
  byte. The up×3/down×3/right×3/left×3/away×3/forward×3 recording has not synced, so everything
  here is built from his description and verified against synthetic gestures, not against it.
- 238 card_deck · b238 · lab.html — the space to traverse: a spread of numbered cards, one nudge
  to the neighbour, one nudge inward to a whole spread inside the card you are on.
  card_deck: the painting steps aside. A layer is 5×5 = 25 cards laid side by side with a gap,
  each carrying its number, and you stand on one — highlighted, so a nudge has something to read
  against. The deck is driven in PIXELS off the card pitch rather than through the metre-and-zoom
  pipeline: a card lattice has no business being measured in metres, and one card must be one
  card at every depth. It keeps the swirl and both leans, so the deck still tips with the phone.
  card_name is the integrated number he asked for — the whole route that got you here. 9.14.13 is
  the thirteenth card of the fourteenth card of the ninth, and every card in view carries its own
  full address plus the layer it is on.
  deck_deep: a nudge toward you drops you THROUGH the card you are standing on into a fresh
  spread inside it; a nudge away brings you back up to exactly where you were standing when you
  left (the position is stacked, not just the route). DEEP_MAX 4. The drop is 220ms: the incoming
  layer arrives from 1/LAY_ZOOM and fades up, the reverse going out, so it reads as passing
  through rather than as a cut. At the top a nudge away says "at the end" and does nothing.
  card_spread: cards are 46% of the window wide with a 7% gap, so three columns and three rows
  are in view at once. The first cut had them at 62%, where the card you were on filled the
  screen and its neighbours were slivers — that reads as one card moving, not as a space you are
  travelling through. haze_light came with it: the vignette had been tuned for a picture running
  off the edges and was fogging the outer cards.
  nudge_small + nudge_floor: NUDGE_A 0.85 → 0.26, and the detector now uses its OWN deadband
  (0.05) instead of the integrator's 0.12. That deadband existed to keep drift out of a running
  position; there is no running position any more, and it was quietly eating exactly the micro
  nudges this pass is about. Measured sensitivity: 0.4 m/s² fires in 50ms, 0.5 in 33ms, 0.85 and
  up in ONE SAMPLE (~17ms). 0.3 still does nothing. Five seconds of shaking at 0.20, 0.35, 0.55
  and 0.9 m/s² each still move nothing — what keeps this honest is not the height of the bar but
  the three tests around it: dominance (now ×1.6), the 220ms rise deadline, and having to be
  quiet first.
  normalising holds: a 0.4 m/s² flick and a 5.0 m/s² shove both move exactly one card.
  vj_226 is retired — it measured the picture's box and lean, and the picture is gone. Its job
  (that a reset presents the same thing as a load) is covered by the deck geometry checks in
  vj_239. Frame rate 58-59fps. Suite green, no page errors.
  still no new trace: lab_gestures.json on main is unchanged, 21 takes from the 11:43 batch.
- 239 deep_room · b239 · lab.html — you start in the middle of the stack, not at the top of it.
  deep_room: DEEP_MAX 4 with a hard floor above was the wrong SHAPE, not just too small. He wants
  to go a long way closer AND a long way further from where he starts, and "where I start" should
  not be a wall in one direction. So the route is pre-seeded DEEP_START 12 levels deep and runs to
  DEEP_MAX 25: twelve layers out and thirteen in from the card the page opens on. At 25 cards a
  layer that is 5^25 addresses — no practical end either way. Measured: 12 out and 13 in, each
  landing on its own layer, and the ends refuse cleanly instead of jamming.
  seed_vary: the seeded layers get a fixed, repeatable SCATTER of card numbers rather than the
  centre card all the way up. Seeded with 13s, every layer out looked identical to the one before
  — same numbers, same spread — and the only sign you had moved was the small line underneath.
  The scatter comes from a fixed integer hash, so a card keeps its number between sessions.
  name_tail: a 25-part route cannot go on a card, so a card wears the last three parts with a
  leading ellipsis — enough to tell neighbours apart and to watch the address change as you drop,
  without becoming a barcode. deep_say replaces the old "layer N" with the thing he actually wants
  to read: "start", "+6 in", "−6 out" — distance from where he began, not absolute depth.
  coming back up: a layer you have visited puts you back exactly where you were standing; a seeded
  one puts you in its middle, because you were never anywhere else on it. Measured: wander in two
  layers and back out and the route retraces exactly, then keeps going past the start.
  name_clip: cards clip their own text. A three-part number at the old size bled across the gap
  into the neighbour, which made two cards read as one. Font down from 0.15 to 0.128 of the card
  width, overflow hidden, and the number kept on one line.
  Sensitivity and shake rejection re-measured unchanged (0.4 fires in 50ms, 0.85+ in one sample,
  four strengths of shaking move nothing). Suite green, no page errors.
  still no new trace: lab_gestures.json on main is unchanged, 21 takes from the 11:43 batch.
- 240 nudge_raw · b240 · lab.html — the detector stops going through the transform chain, and the
  cards get colour.
  nudge_raw: he was right to suspect the chain. Every other thing on the page rotates each sample
  TWICE — by the live attitude, then back into the zero frame — and subtracts a calibrated bias
  before using it. That is correct for a world that must stay put while the phone turns, and
  wrong for this: deviceorientation is noisy and lags the accelerometer by a frame or two, so on
  a SMALL fast nudge the two rotations smear one axis into another, and the dominance test — the
  thing that decides right from up — was being handed exactly the smeared version.
  A nudge needs none of it. The phone barely turns during one, so the phone's own axes ARE the
  axes he means: +x right, +y up, +z out of the glass toward him. nudge_watch now takes
  e.acceleration as it arrives and nothing touches it on the way.
  A/B, same build, same gestures, only the input path swapped: a small UP nudge with the phone
  held at beta 25 / gamma 15 came back as "deeper" on the rotated path and as "up" on the raw
  one. That is the failure he has been feeling.
  nudge_prof: the "simple function that reads the profile of the bump" is two exponential averages
  and a subtraction. The SLOW one (900ms) is whatever the phone thinks zero is right now —
  resting offset, slow drift, a hand gradually tilting; it replaces the calibrated bias entirely
  and needs no levelling window. The FAST one (40ms) is the gesture. Their difference is a nudge
  and nothing else: slower than the slow average is absorbed, faster than the fast one is smoothed
  away, and what survives in the middle is exactly the shape of a wrist flick. Three multiplies
  and an add per axis per sample, no attitude dependence, no calibration.
  measured after the change: 0.4 m/s² fires in 66ms, 0.5 in 33ms, 0.85 and up in ONE sample; four
  strengths of shaking still move nothing; and a nudge along each of the three phone axes reads
  correctly at three attitudes and through 14° of attitude jitter.
  card_hue: every card carries its own colour, so movement is visible without reading a digit.
  Hue comes from the card's number by the golden angle, which puts NEIGHBOURS far apart on the
  wheel — measured: 25 distinct hues on a layer, and the closest two neighbours are 32° apart, so
  whatever slides into the middle is plainly a different colour from what left. Lightness carries
  the DEPTH as a triangle wave over 8 layers rather than a saw, so stepping in and stepping out
  both change it by the same 3 points and no layer boundary ever jumps. Measured: 80, 83, 86, 89
  over four layers in a row. The card you are on takes the same hue at full saturation with a
  matching ring.
  Suite green, no page errors. Still no new trace: lab_gestures.json on main is unchanged.
- 241 orbit_frame · b241 · lab.html — his head is the fixed point and the phone ORBITS it. This is
  the biggest find of the whole stretch.
  orbit_frame: he is not reaching around a Cartesian box, he is sliding the phone over a sphere
  centred on his head, screen kept square to his nose. Two consequences, and BOTH were working
  against him.
  orbit_spin — a nudge sideways on a sphere IS a rotation. Swinging the phone one card's width at
  arm's length turns it through something like 45-80 deg/s, and rotVeto (hypot of all three rates,
  ROT_OPEN 12, ROT_SHUT 70) was scaling anything past 12 down and killing everything past 70. The
  veto was written to reject a phone being spun in place and it was rejecting exactly the gesture
  he makes. A/B on the same build, same gestures, only the veto swapped: under the old veto EVERY
  sideways and vertical orbit nudge returned NOTHING — right, left, up and down, all four dead —
  while the two radial ones (which barely turn the phone) came through fine. That is precisely the
  complaint: "small gestures up down right left" don't register but zoom sort of does. The nudge
  detector now vetoes only rotation about the SCREEN NORMAL (alpha, a wrist twist, which no orbit
  produces), from ORBIT_SPIN 90 deg/s. Measured: accepted at 0/45/90/140 deg/s of twist, refused
  at 220. The lanes and the diagram keep the old all-axis veto — they describe a world that holds
  still, which is a different job.
  orbit_pull — swinging on an arc pulls the phone toward the centre: v²/r pointing at his head,
  which in the phone's own axes is +z, which is "toward you". So every sideways or vertical nudge
  carried a phantom toward-you nudge, and on a small gesture the phantom is a fair fraction of the
  real thing. It is one-sided (an arc can only pull inward, never push out) so the guard is
  one-sided too: a +z reading is refused while sideways drive exceeds ORBIT_TAN 0.22. Nothing is
  estimated or subtracted — the claim is refused when the geometry says it cannot be trusted.
  Measured: a pure sideways swing carrying its full inward pull now reads "right", never "deeper";
  a genuine radial pull still reads "deeper" in ONE sample and a push "back up" in one.
  This also retro-justifies 240: reading in the phone's own frame is exactly right for an orbit,
  because the phone's axes ARE the tangent plane and the radius.
  shove_spin: __lab.shove takes an optional { a, b, g } so a test can send a yaw or pitch that is
  not a twist — without it no test could tell orbit_spin from the old veto, since the old hook only
  ever sent alpha.
  Sensitivity and shake rejection unchanged (0.4 in 66ms, 0.85+ in one sample, four strengths of
  shaking move nothing). Suite green, no page errors. Still no new trace.
- 242 push_go · b242 · lab.html — the four sideways directions flip.
  push_go: PUSH_INV goes from { x: -1, y: -1, z: +1 } to { x: +1, y: +1, z: +1 }. Plainly, what it
  does now: nudge the phone RIGHT and the cards slide right past you, so the card on your LEFT
  arrives in the middle; nudge UP and the cards slide up, so the card BELOW arrives. That is the
  opposite of push_back (237), which had the picture taking the blow in the direction it was
  struck from. Depth is untouched, as it has been throughout: nudge toward you and you go deeper,
  nudge away and you come back up.
  Measured: right → cards +192px, left → −192px, up → −250px, down → +250px, and right-then-left
  returns to the card you started on. Depth unchanged at +1 in and −1 out.
  This pair has now been round once each way, so the sign lives in PUSH_INV alone and nothing else
  in the page has an opinion about it — flipping either is one character.
  Suite green, no page errors. Still no new trace.
- 243 z_one · b243 · lab.html — one layer of cards, moved hard toward and away; and the diagram's
  X and Y bow round the viewpoint. (He named this one himself: z_one xy_curve.)
  z_one: the nested layers are gone — no route, no stack, no dropping through a card. There is ONE
  spread of 25 cards and toward/away move it nearer and further. Z_STEP 2.1 per nudge, which is
  the exaggeration he asked for: one nudge more than doubles it. Z_MAX 4, so the range is ×19.4 in
  to 1/19.4 out. Six was tried and both ends were useless — at ×86 a card is fourteen thousand
  pixels of flat colour and at 1/86 the whole spread is a 60px smudge. At four the near end is a
  wall of one colour with its number across it and the far end is the whole grid as a small
  legible constellation.
  z_pan: the pan is applied BEFORE the scale in the deck's transform, so it has to be multiplied
  by the scale — otherwise one nudge sideways is a whole card at ×1 and a quarter of one at ×4.
  Measured: 13 → 12 at ×1, at ×4.41 and at ×19.4, and the card you stand on stays the card you
  stand on right through a near/far round trip.
  Card names go back to plain numbers (no route to carry) and the depth line reads "start",
  "+2 near", "−3 far". Hue keeps its golden angle; the layer-lightness cycle is gone with the
  layers.
  xy_curve + bow_arc: in the diagram, X and Y are ARCS now, bowing away from the viewpoint the way
  a circle round his eye does — no displacement at the origin, growing as the square of the
  distance out, so both arms of an axis curl back from him and the pair read as hoops rather than
  rails. Z stays a straight arrow, because Z is the radius and a radius genuinely is straight.
  The bend is done in 3-D before the projection, so it stays right whichever way the isometric
  camera looks and the ticks ride the curves.
  Two attempts are worth not repeating. Bowing by the true sagitta d²/2R with R small enough to
  see dragged the tips a long way off, and because the chord tilted with them the arc barely
  looked curved — the heads and letters ended up nowhere near where the axis pointed. Pinning both
  ends instead kept the tips but put a visible kink in the last few units where the curve snapped
  back to the pin. The version that works keeps the honest shape at a legible size (BOW 8 at the
  tip) and takes the head and the letter FROM the arc's own end, so nothing needs pinning.
  vj_239 and vj_240 retired — both tested nested-layer navigation, which no longer exists; vj_244
  covers the one deck, its depth range, and the arcs. Suite green, no page errors, no new trace.
- 244 fav_jump · b244 · favorites.html + all 8 session pages + session.html — the session name on a
  favourite row takes you to that session, landing on that highlight.
  fav_jump: .fav_sess becomes an <a> pointing at `<session>.html?tag=<tag id>&t=<seconds>`. It gets
  a dotted underline and a real 140x46 tap target (padding out, negative margin back, so the row
  height does not change), and it stops its own click so a tap on the name never also starts the
  audio on the favourites page on its way out.
  the tag's OWN id goes on the link, not just its time, and that matters twice: a highlight that
  has been nudged since still resolves to the right one, and two highlights a second apart can no
  longer be confused. Measured against exactly that case — a decoy highlight one second from the
  favourite — and it lands on the right one.
  session side: url_tag_id() reads ?tag= from the query or the hash, and handle_url_time matches by
  id first, falling back to the old within-2-seconds time match so every ?t= link ever shared
  behaves exactly as it did (verified: a bare ?t= still invents a highlight where it lands, 4 tags
  become 5). When an id IS given and is not found, it lands at the time and creates NOTHING — a
  bare ?t= inventing a highlight is fine for a share link, but doing it for a dead favourite would
  quietly litter the session with empty ones. Measured: a link to a removed highlight leaves the
  session at 4 tags with nothing active.
  and it SCROLLS: the active row is brought to the middle of the screen after render. Arriving with
  the highlight three screens down is the same as not arriving at it.
  All nine session pages carry the identical patch, applied read-all-then-write-all so a failure on
  any one of them writes none.
  test harness note worth keeping: python's SimpleHTTPRequestHandler does not answer Range
  requests, so a browser cannot seek in an audio file it serves and EVERY ?t= test sits at zero for
  reasons that have nothing to do with the page. /tmp/rangesrv.py (port 8902) answers Range and the
  same test then lands on 20s exactly. This wasted a pass; it will not again.
  Suite green on the lab page (untouched), no page errors anywhere. Still no new trace.
- 245 nudge_hear · b245 · all 8 session pages + session.html — the chevrons on a highlight row now
  play from the new start.
  nudge_hear: nudge_tag already moved a highlight's start a second either way; it now seeks the
  playhead to the new start and plays from there. Moving a start is an act of LISTENING — the
  question is "does it begin here?" — and answering it meant nudge, reach for the row's play
  button, listen, nudge again. One tap is now the question and the answer.
  playbackIntent is cleared first: a preview_end queued from an earlier tap would otherwise stop
  playback partway through the start you are auditioning, for a reason that has nothing to do with
  what you just pressed.
  the chevrons survive their own tap. seek_to lands currentTime exactly on tag.t, so
  update_playing_tag makes this the playing highlight, so its row keeps the chevrons and you can
  keep tapping. Measured across five taps in both directions: 0:20 → 0:21 → 0:22 → 0:21 → 0:19,
  the playhead landing within a tenth of the new start every time, playing rather than paused
  (started from PAUSED, so "it plays now" is a real result), and both chevrons still present at the
  end.
  All nine session pages carry the identical patch, read-all-then-write-all. fav_jump re-checked
  and still green. No page errors. Still no new trace.
- 246 nav_gone · b246 · all 8 session pages + session.html — no Sessions button on a session page.
  nav_gone: the button is fixed to the corner of the VIEWPORT, not to the header, so the moment the
  page is scrolled it stops being a header control and becomes a lozenge floating over whatever
  happens to be beneath it. In his screenshot it was sitting squarely on top of the −2m and −15s
  transport buttons, which is exactly the position you scroll to when you are working through a
  tag list. Removed from all nine session pages.
  what it costs: nothing that matters. The button was the AFFORDANCE, not the route — drawer.js has
  always opened the session list on a downward swipe from the top of the page, and that is
  untouched. Measured: with the button gone, a swipe down still pulls the list in with all 18 rows
  in it, and the −2m button is clear and tappable when scrolled (checked with elementFromPoint at
  its centre, not by eye).
  it stays on Favorites, where there is nothing else to go back to.
  the two #drawer_toggle CSS rules are left in place: they cost nothing, and the id is what
  drawer.js looks for when it wants to rotate the caret — it already guards for the button's
  absence, so nothing had to change there.
  test note: drawer.js requires the page to have RESTED at the top for SETTLE_MS (350ms) before a
  pull counts as a reveal rather than the tail of a scroll. A test that scrolls to 0 and swipes
  immediately gets nothing, and that is the drawer working, not failing.
  fav_jump and nudge_hear re-checked and still green. No page errors. Still no new trace.
- 247 fav_share · b247 · drawer.js + favorites.html (+ v bump on all 10 pages) — a share button on
  the Favorites row in the session list, and one on every row of the Favorites page.
  fav_share (the list): the Favorites row gets the same .jam_share button every session row already
  has, in the same slot, with the same icon markup — and nothing else was needed, because
  wire_links already binds every .jam_share in the menu and copies its data-href. The empty
  menu_sub and jam_del_sp after it are what keep its right edge on the same column as the sessions
  below: measured at 302px against 302px, aligned to the pixel. Tapping it copies
  http://…/favorites.html.
  fav_share (the page): every favourite row gets the share icon in the slot a highlight row uses on
  a session page — and what it copies is the deep link fav_jump built two builds ago, session +
  tag id + time, so what someone else opens is that exact moment rather than the top of the
  session. Measured end to end: the copy comes back as ?tag=tg_b&t=20 and following it lands on
  tg_b at 20s.
  where it sits, and why there: play | share | heart, so the share is immediately LEFT of the
  heart. On a session row the order is heart | share | delete — share immediately left of the
  destructive control. On a favourite row the heart IS the destructive control (it un-favourites),
  so putting share to its left is the same grammar, not a different one. It also wears --muted like
  every other share on the site; the accent stays reserved for the heart, which is the only thing
  on the row carrying state.
  drawer.js?v=135 → 136 on all ten pages, so the change actually reaches a browser that has the old
  one cached.
  Suite: fav_jump re-verified through the new button (the copied link followed and landed). No page
  errors. Still no new trace.
- 248 nav_share · b248 · all 8 session pages + session.html + favorites.html + drawer.js — a share
  for the page itself, top right of the control panel. And a standing rule.
  nav_share: the same muted share button, one size up (21px icon in a 34px target), sitting at the
  top right of the header, mirroring where the Sessions pill sits on the left — left is where you
  go, right is what you send. It copies the page's URL with the WHOLE query stripped: this button
  is "here is this session" / "here is my favourites", and if you arrived on a deep link the tag id
  is as much a moment as the seconds are. Sharing a moment is the row's own button.
  it lives INSIDE the header, not pinned to the viewport, which is the whole lesson of nav_gone
  three builds ago — a corner control fixed to the screen stops being a header control the moment
  you scroll and becomes a lozenge floating over the transport. Measured on both page types:
  34×34, 16px from the right edge, 23px down, the same colour as every other share, and clear of
  the wordmark.
  wired once in drawer.js rather than nine times in nine pages. It has to wait for DOMContentLoaded
  — drawer.js is loaded in <head>, so the button does not exist yet when the file runs, and the
  first cut was inert while looking perfectly correct in every other respect. drawer.js?v=136 → 137.
  ui_grammar (STANDING RULE, applies to every future build): he wants FEW conventions of display,
  interaction and behaviour, and most things following them. Whenever a SMALL change would bring an
  element on any page into compliance with the established grammar, make it — unprompted, in the
  same build, without asking. Not large refactors; the little ones. The Admin page's zoom
  experiment (lab.html) is exempt.
  first pass under that rule: the ✎ next to the session title was the one raw text glyph on a page
  otherwise made entirely of SVG icons, and it carried three inline styles nothing else needed. It
  is now the same icon system as everything around it, with no inline styles and a proper
  aria-label. Verified: it renders as an svg, has no leftover text, and nothing else on the page
  moved (transport 6 buttons, highlight rows and top-left pills all unchanged).
  fav_share re-verified through the row buttons. No page errors. Still no new trace.
- 249 nav_cass · b249 · all 8 session pages + session.html + favorites.html + drawer.js — the
  cassette in the top left, and it opens the session list.
  (asked first: "takes you to the session page" could have meant the last session you were on —
  index.html already does exactly that — or the list. He said the list.)
  nav_cass: the exact mirror of nav_share put in last build. Same 21px icon in a 34px target, same
  muted colour, same place in the header band, left instead of right. Left is where you go, right
  is what you send. Measured on both page types: 34×34 at 16,23, mirroring the share to the pixel,
  same computed colour, clear of the wordmark.
  it is the CASSETTE because that is already what a session looks like in the list — the icon means
  the same thing in both places rather than teaching a second symbol. Verified by comparing the
  header icon's markup against a session row's icon in the open drawer: identical.
  it replaces the wide "Sessions" pill on Favorites, which was the last .nav_left in the app. Same
  job, but small enough to live in the header instead of being pinned to the viewport — which is
  what had it sitting on the transport (nav_gone, 246). So session pages get a way into the list
  back, in the form that caused the problem in the first place having been fixed rather than
  removed. The swipe still works: two ways in, both verified.
  it hides while the list is open, as the pill did — from there it has nowhere to go.
  ui_grammar pass: with the pill gone from all ten pages, the whole .nav_left block was dead CSS
  and came out with it (admin.html and r2_setup.html keep their own copies for their own back
  links; nothing here referenced these). The nav_room comment was rewritten to describe the two
  header controls that actually own that band now.
  drawer.js?v=137 → 138; the click is wired once in drawer.js beside the share, after
  DOMContentLoaded for the same reason. nav_share and fav_share re-verified. No page errors.
  Still no new trace.
- 250 icon_grow · b250 · record.html + all 8 session pages + session.html + favorites.html +
  drawer.js — the cassette reaches the Recording page, and four icon families go up a quarter.
  record.html: the "< Sessions" pill becomes the cassette, same corner, same 26px-in-40px target as
  everywhere else. It has no session list of its own to open (record.html carries no drawer), so it
  keeps the journey it always had — index.html#sessions, out to the session you were last on. Same
  icon, same corner, same meaning: sessions are through here. The button keeps its id and its
  handler, including the "stop the recording first" behaviour. ui_grammar: the .back_btn class went
  with the pill — it was the last one-off top-left control in the app, and nothing selected it by
  class.
  icon_grow, ×1.25 everywhere the four appear:
    header pair (nav_cass, nav_share) 21 → 26px, targets 34 → 40px
    list rows: cassette 20 → 25, share 17 → 21, heart 19 → 24, trash 16 → 20
    highlight rows: 23 → 29px
    favourite rows: heart 19 → 24, share 17 → 24
  The gear and the plus stay as they were: they label one-off rows rather than being part of the
  working vocabulary of what a thing IS (cassette, heart) and what you can DO with it (share,
  trash).
  two notes on what came along. On a highlight row the heart, the share, the delete and the two
  chevrons all share ONE size rule, so the row grows as a set — separating them would mean inventing
  classes for no benefit, and a row of controls at two sizes is worse than a row at one. And on a
  favourite row the heart was 19 while the share was 17, a near-miss of exactly the kind the grammar
  exists to stop; both are pinned to 24 now rather than one being left at 1em.
  drawer.js?v=138 → 139. Measured every size in the DOM after the change. nav_cass, nav_share and
  fav_share re-verified. No page errors. Still no new trace.
- 251 title_lap · b251 · favorites.html — a favourite's title may run into the first quarter of the
  session name.
  title_lap: a favourite IS its title; the session it came from is context. So the title borrows
  the first 25% of that column and sits above it. The arithmetic is built rather than guessed: the
  session column is FIXED at 40% of the row (it used to size to its text, which is why a percentage
  lap could not be trusted) and the title's margin is -10% of that same row, so 10/40 is a quarter
  exactly, at any screen size, with nothing having to measure anything at runtime. The column's
  RIGHT edge does not move, so the end of the name — the part that tells you which session — stays
  put and keeps its own ellipsis.
  the flex gap had to be paid back. The row has gap: 7px, and the gap eats the first 7px of any
  negative margin, so -10% came out as 20% of the column instead of 25%. calc(-10% - 7px) puts it
  on 25.0% — measured in the page, not assumed, which is the only reason it was caught.
  lap_cross: fading only the title left the two interleaving at half strength, which reads as a
  rendering fault ("A medium2026-08-07"). Both are masked across the same quarter now — the title
  dissolving out as the date dissolves in — so each is legible on its own ground. The title's
  text-overflow goes to clip with it: the fade IS the ellipsis, and an ellipsis inside a fade is
  two endings for one sentence.
  Measured at 34px of lap on a 134px column = 25%, on three titles from short to overlong, with the
  session name ending in the same place on every row. fav_share re-verified. No page errors.
  Still no new trace.
- 252 row_size · b252 · drawer.js + favorites.html — one icon size for every list row, and the
  trash can becomes the X.
  row_size: 29px, the size the highlight rows already use, now on EVERY icon that sits in a list
  row. The session list had drifted to five different numbers across six rows (25, 21, 24, 20, 19,
  20) and the favourite rows were on a sixth (24). That is six conventions where there should be
  one. The header pair stays at 26 — that is the other convention, and two is the whole set.
  the gear and the plus came along. Last build left them out as "labels on one-off rows"; that is a
  reason nobody can see from the outside, and "most things follow the convention" beats a private
  exception. ui_grammar applied to my own previous decision.
  row_x: ICO_TRASH becomes ICO_X, the same glyph the highlight rows use for "remove this". Two
  drawings for one idea is one too many, and the X is the one he already reaches for. The action is
  untouched — it still deletes the session, still behind the same confirmation.
  col_hold: the empty slot a row without a remove control reserves has to be exactly as wide as the
  control it stands in for, or the share buttons above and below stop lining up. It was 30px
  against a 30px trash can; the X is 29 of icon plus 12 of padding plus 2 of margin, so it is 43
  now. Caught by comparing the share buttons' right edges across rows — 302 on rows without the
  control against 289 on the row with it — which is the only way this ever gets noticed. Now one
  column at 289 across every row.
  the cost, stated plainly: bigger icons take room, so session names truncate a little sooner in
  the list. That is the trade he asked for.
  drawer.js?v=139 → 140. Row heights unchanged at 54px. nav_cass, icon_grow and title_lap all
  re-verified. No page errors. Still no new trace.
- 253 num_first · b253 · all 8 session pages + session.html — the number leads the row and plays,
  the selected title travels, and the heart waits for its save.
  num_first: the number moves ahead of the play button and a tap on it plays. Almost everything
  else on the row already means "play from here" — the title of an unselected row, the time — and
  the number was the one piece that looked like a control and did nothing. It keeps its muted
  weight: a label you can press, not a button. Measured: tapping the third row's number takes the
  player from 0s/paused to 34s/playing, which is where that highlight starts.
  title_roll: on the SELECTED row the title runs slowly through its own width, 16px a second with a
  1.4s hold at each end, and both edges crop to a soft fade instead of an ellipsis — an ellipsis
  says "there is more and you cannot have it", a fade says "there is more and it is coming past".
  One loop for the page rather than one per row, driven off the clock so the pace is the same on
  any device. It stops dead the moment the field is focused (you are editing, not reading) and the
  fade lifts with it. Measured travelling 0 → 32 → back, holding still under focus.
  the float. scrollLeft has to be driven from a float kept in the closure and ASSIGNED each frame.
  At 16px a second a frame is a quarter of a pixel; read scrollLeft back and the element has
  rounded it to zero, so `el.scrollLeft += …` sits perfectly still while looking like it should be
  moving. First cut did exactly that and reported 0, 0, 0, 0 for six seconds.
  fav_wait: a heart tap does not reach the repo for three seconds (the save is debounced) and then
  has to travel. In between the heart sat in its new state as though it were done — so the one
  moment you might close the page is the one moment it looks safe to. It now goes grey and
  undulates (1.25s breath, not a blink: a blink says error, a breath says working) until the save
  actually lands, then settles into on or off. Honest about the round trip, not a spinner standing
  in for the result. Respects prefers-reduced-motion.
  save_done: queue_save_data_to_repo takes an optional callback and keeps a LIST of waiters, since
  several edits inside one debounce window collapse into a single save. A page with no worker, or a
  local-only recording, resolves its waiters immediately — otherwise a heart would undulate for
  ever waiting on a request that is never made. The visibilitychange flush resolves them too.
  Measured: on → wait (animation running, title "Saving…") → off, with exactly one POST.
  Suite: the last four builds re-verified green. No page errors. Still no new trace.
- 254 list_title · b254 · drawer.js (+ v bump on all 10 pages) — the session list gets a heading and
  the highlight rows' grammar.
  list_title: a "Sessions" row at the top. Built as a jam_item so it inherits the row height and
  gutters exactly, then told not to behave like one — no link, no hover, cursor default, 700 weight
  in --fg. A heading that is accidentally tappable is worse than no heading.
  row_match: the session rows already shared the highlight rows' height and gutters. What they were
  missing was a hairline between every pair (they had one only above Admin) and the row's 5px gap;
  padding is now 7px 12px on both. The current row's tint and the selected highlight's tint were
  already the same variable. Measured side by side after the change.
  a CSS ordering trap worth remembering: drawer.js is loaded in <head> and injects its stylesheet
  when it runs, which is BEFORE the page's own <style> block further down the head. So an
  equal-specificity rule from the drawer LOSES to the page. The gap took (no competing rule) while
  the padding silently did not, and the measurement is the only reason that showed. Scoping to
  `.session_drawer .jam_item` wins it back.
  name_roll: the row you are on runs its name through its own width, slowly, exactly as the
  selected highlight's title does — same 16px/s, same 1.4s hold, same fading tail, same
  float-position trick (a frame is a fraction of a pixel; read scrollLeft back and it is rounded
  away). Session names are long and the list is narrow, so the row you most want to read whole is
  the one that is truncated. Measured travelling 0 → 39 → back on a name overflowing by 39px, with
  the ellipsis turned off so the fade is the only ending.
  the two loops are separate copies, in drawer.js and in the session pages. They share no module,
  and one twenty-line loop twice is better than a module boundary invented to hold it.
  drawer.js?v=140 → 141. Whole recent suite (245-255) re-verified green. No page errors.
  Still no new trace.
- 255 vec_flip · b255 · lab.html — a reverse switch per vector, and both panels at half size.
  vec_flip: five tiny switches in the rig under Record — L R, U D, N F, the swirl and the
  edge-away rotation — each reversing exactly one vector. Deciding a sign by feel means flipping
  it, walking around with the phone, and flipping it back, and this page RELOADS ITSELF whenever
  its source changes, so a sign held only in memory is gone before the walk is over. They live in
  localStorage and come back lit. Each is applied at the single point its sign is already used, so
  there is still exactly one place in the code that knows which way an axis goes.
  measured, each one on its own axis with the other four untouched: right ±191.9px, up ∓250.1px,
  closer ±1 layer, swirl ±40°, edge-away ±40.56° — every one exactly negated, none of them
  bleeding into another. Then reloaded and the two that were on came back on.
  a test note worth keeping: __lab.pose is (alpha, beta, gamma) — alpha is the swirl in the
  screen's own plane and gamma is the side rotation that pushes one edge away. The first cut of the
  swirl test posed gamma and read 0 both ways, which looked exactly like a dead switch.
  panel_half: the diagram 178→89 and the chart 178×168→89×84, and the chart moved up to follow the
  diagram. They are instruments to glance at, not to read, and at full size they were taking a
  third of the screen away from the thing they describe. The canvas KEEPS its 178×168 backing store
  and is drawn at half that by CSS — halving the buffer would halve the resolution of the one
  thing on the page whose whole job is showing a small wobble. Checked they do not overlap.
  Frame rate 57fps. Lab suite green, no page errors. Still no new trace.
- 256 head_same · b256 · admin.html, record.html — the admin page gets the ordinary header, and
  the record button becomes one red button.
  head_same: the admin page was the last one still wearing a "‹ Sessions" pill in its top left.
  It now carries the same pair every other page carries — the cassette at the left of the header
  and the share at the right, 26px glyphs in 40px targets, muted, both hiding while the list is
  open — plus the session_drawer div, sessions.js and drawer.js, so the cassette opens the list
  in place rather than navigating away. The old .nav_left rule block is gone entirely.
  a trap worth writing down: the structural .session_drawer CSS (max-height 0 → 80dvh, the sticky
  shadow, the jam_menu box) lives in each PAGE's own <style>, not in drawer.js. Adding the div and
  the script alone left the drawer position:static with no max-height, so the whole session list
  rendered inline above the wordmark on load and looked like a broken page rather than a closed
  drawer. Copied the block over from favorites.html, which is the closest page shape (no player).
  rec_red: the record button is now solid #d70015 with white 700-weight REC, becoming STOP while
  recording; the pulse animation is kept.
  count_gone: the counter under the button is hidden. The element stays in the DOM so the per-tick
  writer needs no guard.
  time_one: the "0:00 / " ahead of the duration is gone — #cur_time hidden and the slash removed,
  leaving just the grey counter.
  verified: admin header cassette at 16px from the left and share 16px from the right, both inside
  header.brand, zero .nav_left left, the cassette opens an 11-row list headed "Sessions", the share
  copies the page URL; record button reads REC, rgb(215,0,21) on white at weight 700, STOP and
  rec_pulse while recording, no counter under the button, the row below the bar just the grey
  duration with no blue now and no slash. No page errors. Still no new trace.
- 257 admin_same · b257 · site.css (new), all 11 non-lab pages — one stylesheet for the whole
  site, and the admin page stops being the odd one out.
  the problem: there was never a shared stylesheet. Every page carried its own copy of the reset,
  the page box, the wordmark, the header pair, the drawer and one_size inside its own <style>, and
  the copies had drifted. On the admin page you could see it: a brown palette baked into :root that
  ignored the theme entirely, a 62px wordmark where the rest of the site has 68, a 640px page box
  where the rest has 760, and CTA buttons whose colours were the yellow theme's hexes typed in by
  hand, so they stayed brown-on-gold whichever theme was chosen.
  site.css: the rules that are the same everywhere now live in one file — the pre-theme fallback
  palette, the reset, the page box, .brand and the wordmark, nav_room, the nav_cass/nav_share pair,
  the session drawer, and one_size. Every page except lab.html links it. lab.html is the one page
  that deliberately looks nothing like the site, and it links nothing.
  it is linked BEFORE each page's own <style>, so a page rule still wins at equal specificity. That
  ordering is what made it safe to delete the inline copies a page at a time — no page ever passed
  through a state where it had neither.
  what came out of the pages: the shared core deleted from all 11 (7-8 blocks each), the dead
  .nav_left pill CSS that had outlived its markup on record.html and r2_setup.html, and the whole
  recorder/steps/note block still sitting in admin.html from when admin held the recorder. Admin's
  own stylesheet went from 147 lines to about 20 — an h1 and two buttons.
  admin structure: the "admin" tagline became an <h1>Admin</h1>, which is what every other page
  uses for its name (favorites has <h1>Favorites</h1>). Its CTAs take --accent / --on_accent /
  --accent_hover, so they follow the theme now.
  r2_setup came along: it was a second page with a baked-in brown palette, no theme.js at all, a
  58px wordmark, and the last "‹ Admin" pill on the site. It now has the stylesheet, the theme, the
  cassette-and-share pair and the drawer, exactly like everywhere else. Nothing links to it, but it
  was going to be the next thing that looked wrong.
  record.html: its wordmark was 58/29 against 68/34 everywhere else, because its top bar is
  .top_bar and never carried .brand. It carries both classes now and takes the shared size.
  a trap worth writing down: the first pass linked site.css into only 10 of the 12 pages — the
  loop that inserted the <link> died partway on r2_setup.html, which has no theme.js to anchor to,
  and record.html and session.html came after it alphabetically. Both then had their inline copies
  deleted with nothing to replace them, and session.html rendered with a 16px wordmark and the
  drawer stuck open. Caught by the screenshot diff, not by any assertion — worth remembering that a
  partial-failure loop is more dangerous than one that fails on the first item.
  verified by pixel diff, 390x800, every page shot before and after: favorites, session.html and
  the dated session pages came out byte-identical — the whole refactor is invisible on the pages
  that were already right. admin, r2_setup and record changed only where intended (record's larger
  wordmark shifts its column down about 7px). Then measured on all 7: every page links site.css,
  every wordmark 68px Sacramento, every body 760px, every cassette and share 40x40 at 16px from
  their edge, zero .nav_left anywhere, zero pages with their own :root. The cassette opens the same
  11-row "Sessions" list from admin and from r2_setup, and both shares copy their own URL. Admin
  cycled through all three themes: body and CTA both move together now. Suites 254 and 255 green,
  256 (the lab) green and lab.html untouched. No page errors anywhere. Still no new trace.
- 258 curve_flip · b258 · lab.html — the hoop cups the viewpoint instead of bulging away from it,
  and right/left, up/down and toward/away are permanently reversed.
  curve_flip (the bow): the X and Y arcs were bowing the wrong way. Both arms bent AWAY from the
  viewpoint, which draws the FAR side of a sphere with him outside it looking in. He is at the
  centre — the phone orbits his head — so the arms have to come round TOWARD him at both ends. One
  sign on the sagitta: orb() adds az*sag now instead of subtracting it. The origin is still fixed
  (sag is zero at d=0), so nothing is pinned and no kink comes back.
  BOW 8 → 19, because at 8 the curve was arguable at a glance and the entire reason for drawing it
  is that it should not be. Measured on the drawing: each arm's tip now ends up about 15px toward
  the viewpoint of where a straight rail would have put it — 44% of the arm's own length — while
  still starting exactly at the origin.
  the arithmetic bends with it, which is the half he asked for that is not the picture. A phone
  out along X or Y is no longer at the flat (x, y, z) a rail would give: it has ridden two arcs and
  come round toward the viewpoint by each one's sagitta. sag_of() adds both to Z, from the SAME
  BOW the axes are drawn with, so the plate can never sit off the hoop it is meant to be on. The
  per-axis guide bars and their knobs ride the arcs too, so a knob is on the axis it reads rather
  than beside it.
  a note on reading the drawing: the middle of an arm sits on the FAR side of its own chord even
  though the arm is curling toward him — that is just what a bow anchored at the origin looks like.
  The first version of the test measured that mid-chord bulge and reported the sign backwards. Read
  the TIP against a straight arm of the same length; that is the honest question.
  perm_flip: PUSH_INV goes from { 1, 1, 1 } to { -1, -1, -1 }. That is the one place the resting
  sign of a straight vector lives, so all three reverse at once and the five switches still flip
  against it — every switch reads "off" for the way the page now behaves. Walked through with every
  switch off: nudge right and the cards go left, nudge up and they go down, nudge toward him and he
  goes further. Then each switch on in turn: exactly reversed again, and 256's suite still measures
  every one of the five as exactly negating its own vector and nothing else.
  one thing this shook out: the spoken caption for x and y read off the raw input sign while the
  depth caption read off the result. While every sign was +1 the two agreed and the difference was
  invisible; with the vectors reversed it would have said "right" every time the cards went left.
  Both read off the result now.
  60fps, lab suite 256 green, no page errors. Still no new trace.
- 259 list_css · b259 · site.css, all 11 non-lab pages — the session list styles move to the shared
  sheet, because the list is shared and its styling was not.
  the bug he saw: open the list from the admin page and it came up as raw HTML — blue underlined
  links, boxy buttons, no row height, no card. From a session page it was fine. 257 gave admin the
  drawer and the shared core, but the rules that make a session ROW look like a row (.jam_item,
  .jam_link, .jam_name, .jam_ico, .jam_share, .jam_menu, the confirm sheet) were never part of that
  core — they were sitting in each session page's own <style>, and admin had none of them.
  the real shape of the mistake: drawer.js writes this markup and every page loads it, so the
  markup is shared and the styling for it has to be too. It was only ever "the session pages'" CSS
  by accident of where the drawer was first built. Anything that gains the drawer from now on
  inherits the look with it rather than having to be handed a copy.
  what moved: the whole .jam_* family plus .jam_menu_overlay, the confirm sheet, and the caret
  transition — out of all 11 pages, into site.css. drawer.js keeps injecting the rules only it
  knows about (the remove control, the hairlines, the title row, the scrolling name) on top.
  ?v=2 on the stylesheet, so the change actually arrives.
  verified by opening the list from six different pages and reading 17 measurements off the same
  row in each — row height, padding, gap, link decoration and colour and weight, icon colour, the
  share button and its right edge, the title row, the card's radius, background and border, the
  hairline. Every page now matches session.html exactly, which is the one he said was right. Then
  screenshotted the open list from admin, from session.html and from r2_setup and diffed the drawer
  band: pixel-identical, both pairs. Every page shot again against the state shipped in 257 and 258
  — nothing else moved. Suites 254, 255 and 258 green, no page errors. Still no new trace.
- 260 nudge_core · b260 · lab.html — the detection path is now the whole of the motion path.
  flip_reset (why 258 did nothing on his phone): the permanent reversal shipped, and he felt no
  change. The switches are remembered in localStorage, and his were already set the other way from
  walking the signs out by hand — so PUSH_INV going to -1 and his stored -1 cancelled exactly. A
  permanent change to what "off" MEANS has to clear what people stored against the old meaning, or
  only a fresh browser ever sees it. FLIP_KEY carries the meaning's version now
  (vampjam_lab_flip_2); bumping it brings every switch back off, against the new resting behaviour.
  Verified by writing his exact old state under the old key and reloading: still on disk, ignored,
  all five switches off, and nudge right now moves the cards left.
  nudge_core: on_motion goes from 115 lines of code to 12. What it does: take e.acceleration as
  sent, work out whether the wrist is twisting, hand both to nudge_watch, step the drawing.
  what came out, and why it could: the sample used to be rotated into a world frame and then a zero
  frame, offset by a bias measured during a levelling window, dead-banded, veto'd by an all-axis
  rotation gate, integrated to a velocity with three decay constants (driving, coasting, braking),
  tested for tremor against a second pair of averages, tested for being a passenger of another
  axis, latched to a direction, capped at a maximum duration, and integrated again to a position.
  Twenty-two tuned constants and about seventy lines, on every sample. None of it moved a card:
  nudge_fire wiped the position on every firing, and had said so in a comment since 253. It was
  feeding the diagram and the lanes, and nothing else.
  and it WAS in the way, in one concrete respect: the old guard returned early until a
  deviceorientation event had arrived and a zero pose had been taken. No nudge could fire before
  the attitude was known — on a detector whose whole design is that it reads the phone's own axes
  and needs no attitude at all. There is now a test for exactly this: arm motion, never send an
  orientation event, nudge, and the deck moves.
  no more levelling. The detector's slow average IS the running zero and relearns from wherever the
  phone is, so there is nothing to hold still for. Reset is instant; the "hold still…" message, the
  spread test and the offset are gone.
  the diagram and the lanes now show things that are true. The plate stood at the integrated
  position — a quantity in metres that nothing acted on and that was wiped on every nudge; it
  stands where the DECK stands (which card, how deep), and the readout says cards and notches
  instead of centimetres. The lanes carried where the world had been panned to, which moves only in
  whole notches and drew three staircases — a picture of the OUTPUT on a page whose job is judging
  the INPUT. They carry the detector's own averaged drive per axis now: the exact three numbers
  nudge_watch compares against its threshold, at one FIXED scale for all three lanes where half a
  lane's height IS the threshold. (They each rescaled themselves to their own last four seconds
  before, so a quiet axis's noise looked like a real nudge on a loud one, and no two lanes could be
  compared — on a page whose detector decides by comparing them.) A firing drops its own rule, a
  fourth kind, grey, distinct from the Good button's green. A spike with no rule beside it is a
  nudge that was missed; a rule with no spike under it is one that was imagined. Those are the only
  two ways this can be wrong, and both are now visible.
  the recorded takes changed shape with it: each sample used to carry the integrator's position and
  velocity, which were never used to move anything. They carry the detector's three bars, whether
  it was armed, and where the deck stood.
  lab.html 2414 → 2175 lines. Latency measured at 1 sample, ~17ms — tighter than before, because
  there is now nothing between the reading and the decision. All six directions walked with every
  switch off, then each of the three switches on. 60fps. Suite 256 green: all five switches still
  exactly negate their own vector and nothing else, and still come back lit after a reload.
  Still no new trace.
- 261 nudge_small · b261 · lab.html — the small gestures only, the focal card unmistakable, and the
  paper on the same lattice as the cards.
  flip_again: PUSH_INV back to { 1, 1, 1 }, and FLIP_KEY to _3 with it. His account of what
  happened is right: he asked for the flip in 258, it never reached him because his stored switches
  cancelled it exactly, 260 fixed the cancelling and delivered 258's flip — by which time he had
  asked again, so one flip landed where two had been asked for. This is the second. The key version
  goes with it for the same reason as last time: a change to what "off" means is worthless if the
  switches people already stored quietly undo it. Verified by writing the previous generation's
  switches back under the old key and reloading — still on disk, ignored, all five off.
  nudge_small: the detector had a floor and no ceiling, so a full arm swing sailed past the
  threshold and counted exactly like a wrist flick. NUDGE_BIG is the ceiling; the floor comes down
  from 0.26 to 0.13 at the same time, because with a ceiling doing the rejecting the floor no
  longer has to be high enough to keep swings out and can be low enough to catch the small ones he
  means.
  the subtlety, and it is the whole of this build: the ceiling CANNOT be read off the averaged bar.
  The detector fires on the leading edge — that is where its 17ms comes from — and at the leading
  edge a swing and a nudge are identical, both having only just left zero. By the time the average
  has climbed high enough to call something a swing, the notch is already delivered. Measured: with
  the ceiling on the bar, drives of 1.4 and 2.2 still fired. So it is read off the RAW drive, which
  is at full size on the very first sample: nPeak is the largest raw drive since the phone left
  quiet, reset on every return to quiet, and a gesture that has already been that hard is refused
  before anything is delivered. Refusing disarms rather than returning, so the rest of a swing
  cannot trickle a notch out later — one gesture, one judgement.
  the band, walked in eight steps: 0.10 and 0.16 do nothing, 0.30 through 0.90 fire, 1.40, 2.20 and
  3.50 are refused. (0.16 is below the floor once the 0.05 deadband is taken off it, so the real
  floor in raw terms is about 0.18.) A long gentle push still delivers one notch on its leading
  edge and then cannot fire again until quiet, which is correct: that is a nudge held, not a swing.
  card_focus: three channels rather than one, so no single cue has to carry it. The neighbours step
  back (0.42 opacity, saturation to 0.35), the card you are on comes forward (a heavier ring, a
  deeper shadow, its own stacking), and here_mark — a bracket at the centre of the GLASS, sized to
  one card as drawn, that never moves. A property of a card can only say "this one is special"; a
  fixed mark says "this is the place, and something is standing in it", and the cards visibly
  travel through it.
  here_y — and dimming the neighbours immediately exposed a bug that had been there a long time:
  the deck is translated by -cell.y, so the row arriving in the middle is j = -cell.y, but the
  `here` flag was looking for j = +cell.y. Nudging up highlighted a card TWO ROWS from the one you
  were looking at, and card_here() named that one too. Invisible until now — with every card
  equally bright, a ring in the wrong place just read as decoration. X had been right all along,
  which is exactly why it never looked systematically broken. Both fixed; measured at rest, one and
  two steps right, and one and two steps up: the centred card and the flagged card now agree in
  every case, within a pixel.
  paper_lock: there were two depth systems on this page. The cards moved on a lattice measured in
  card pitches and scaled by Z_STEP per notch; the paper moved in metres through the old
  distance-and-exponent pipeline. They had no reason to agree and did not — a nudge inward grew the
  cards by 2.1 and the paper by something else, so the cards slid over a surface going somewhere
  different. The paper takes the deck's own pan and scale now. The transform order is the same on
  both elements (translate then scale), so the same two numbers mean the same thing to each.
  Measured after two nudges in and one across: paper 4.4100 against cards 4.4100, pan 846.1px
  against 846.1px. A card is now the same number of grid squares across at every depth.
  60fps, suite 256 green, no page errors. Still no new trace.
- 262 nudge_fit · b262 · lab.html — the nudge profile refitted against the recorded takes, and the
  reason the take he meant is not among them.
  the take he described is not in the file. He said the last trace was three up, three left, three
  down, three right, twice — 24 nudges. The newest take on main is "take 21", 68 samples, 1.1
  seconds, four bursts. It cannot hold 24 of anything. Nothing has landed since 11:43 on Aug 27,
  which is what the last sentence of every reply this session has been saying.
  send_stuck — and the cause was in plain sight. The Send and Copy buttons are marked hidden in the
  markup and NOTHING in the page ever unhides them. A take is sent automatically when the recording
  stops; when that send fails, the page says so once in a status line that scrolls away, and there
  is then no way to retry it and no way to get the take off the phone at all. Fixed: every take now
  carries a `sent` flag set only when the server actually acknowledged it, any unacknowledged take
  shows both buttons with its count on Send ("Send 3"), the chips for those takes are marked, and
  the failure line carries the HTTP status. A take that has not arrived is now a fact about the
  page's state rather than a message that happened once. Tested with the worker refusing 403 and
  then accepting: three takes, Send appears reading 3, the failure names the status and the button
  stays, and on success all three flip to sent and the button goes. HIS TAKES ARE NOT LOST — they
  are still in localStorage on the phone, and Send will now offer them.
  what the existing takes were still able to teach, replayed through the real detector maths over
  all 268 gestures in the sixteen takes that have samples:
  dead_z: z led 69% of his gestures, on a page where he is mostly nudging up, down, left and right.
  It is NOT the orbit doing that. The centripetal pull only ever points toward him, and the split is
  95 gestures leading +z against 89 leading -z — near enough even, and nothing about swinging on a
  sphere produces an away-from-you push. Half of it is leakage, and the reason is old and was
  written down here long ago: the phone's gravity-free reading is an estimate, and its error is
  largest along gravity, which at any comfortable holding angle is mostly along the screen's normal.
  There used to be a DEAD_Z for exactly this and nudge_core deleted it along with the integrator it
  happened to sit beside. That was a mistake — the reason for it had nothing to do with the
  integrator. NUDGE_DEAD_Z is 0.13 against 0.05 for the other two; measured, that alone takes z's
  share from 29% to 14%.
  orbit_both: the veto on a near/far reading was one-sided, on the argument that an arc can only
  pull inward. Right about the arc, wrong about the axis — see the sign split above. It is now
  two-sided: a near/far reading is not believed while there is real sideways drive underneath it,
  whichever way it points. A genuine toward or away nudge has little sideways drive and sails
  through; 38 of the 236 gestures stand alone that way, and the page still fires cleanly on a pure
  toward and a pure away.
  big_fit: NUDGE_BIG 1.20 → 1.80. 1.20 was a guess made yesterday without data, and replayed over
  his real gestures it refuses a QUARTER of everything he has ever done. Worth being plain about:
  the distribution has NO natural break — it falls smoothly from 0.3 to 25 — so there is no
  boundary to discover and this is a choice, not a measurement. 1.80 sits above the bulk (median
  0.68, three-quarters under 1.25) and refuses 14%. Verified in the page: 1.2 and 1.6 fire, 1.9 and
  2.5 are refused.
  after the change, replaying his four longest takes through the live page reads a sensible spread
  of directions instead of a wall of near/far — take 11 gives 18 lateral against 7 depth where the
  old numbers gave mostly depth. All six directions still fire on the page, a toward-with-sideways
  now correctly reads as the sideways one, and both floors reject a gesture under them.
  Suite 256 green, no page errors.
- 263 plate_arc · b263 · lab.html — the plate shows where the phone physically is, riding the arcs,
  and near/far is the right way round.
  what he asked for, and it is two different questions on two kinds of axis. Right/left and up/down
  are to be WHERE THE PHONE PHYSICALLY IS — continuously, separate from any nudging: carry it way
  to the right and the plate should be way to the right, ON the curve, because his arm does not
  move in a straight line. Near/far is to be inverted, because it has been backwards.
  plate_arc: the two lateral axes are read off the ATTITUDE, not off any integrated acceleration.
  That is not a shortcut, it is the geometry, and it is the orbit_frame insight cashed in: his head
  is the fixed point and the phone orbits it with the screen kept square to his nose, so carrying
  the phone round to the right IS turning it about the vertical — the angle and the position on the
  sphere are the same fact. Reading the angle is drift-free, instant, and needs nothing integrated;
  an integrated position would drift and would still only ever be an estimate of the angle. It also
  means the plate lands ON the curve rather than beside it: the drawn arcs ARE that sphere, so a
  point placed by its angle is on them by construction. Measured across six poses, 20° and 40°
  either way on both axes: the plate sits between 1.3 and 3.5px of the drawn arc every time.
  ORB_SPAN is 55° — the turn that carries the phone to the end of an arm. Near/far stays the deck's
  depth, because depth is not somewhere he carries the phone to; it is a place he nudges into, and
  the notch is the truth of it.
  z_flip: MODEL_INV.z from -1 to +1. Verified against the drawing rather than by eye — a toward
  nudge now moves the plate +11 along the projected +Z arrow.
  sign_agree — and the other two signs are not guesses either. They are pinned to the angle
  readouts already on the panel: "right / left" must agree with "turn side", and "up / down" with
  "tilt top", because each pair is the same physical fact stated twice. The panel had them
  disagreeing: pose the phone one way and the two lines read +40 and −40 about the same motion.
  Right/left already agreed; up/down did not, and does now. Whatever the felt direction turns out
  to be, the panel cannot contradict itself, and a change of mind is one character in one place.
  the readout follows: the two lateral lines report degrees of arc, because that is what they now
  show, and near/far reports notches, because that is what IT shows.
  verified: the six poses above with the plate's distance from the arc measured each time; the
  plate's travel projected onto each drawn axis arm; the sign agreement checked line by line
  against the angle readouts; the toward-nudge direction measured. Suites 256, 262 and 263 green,
  no page errors. Still no new trace — the Send button shipped last build is on the phone now.
- 264 z_response · b264 · lab.html — near/far's response reversed, and the switches migrated
  instead of wiped.
  z_response: PUSH_INV.z from +1 to -1. Right/left and up/down are untouched — only the depth
  response turns round. Nudge toward you and the deck goes further; nudge away and it comes nearer.
  flip_carry — the third time a resting sign has changed, and the trap is now well understood: a
  switch stored against the OLD meaning silently cancels the change, which is exactly what swallowed
  258 whole. The fix so far has been to bump the storage key, which works but throws away the other
  four settings too, and those he may have chosen deliberately. So this migrates: on first run under
  the new key the previous generation's switches are read across, and only the ones whose meaning
  actually changed are dropped. NEUTERED names them — this step it is just z.
  verified with his shape of state: a saved set with the swirl reversed AND near/far reversed under
  key _3. After the upgrade the swirl is still on, near/far is off, and the stored object under _4
  is {"roll":-1} — the one that changed meaning gone, the one that did not kept. A browser that has
  never seen the page comes up with all five off, as before.
  then walked it: toward now reads "further" and away reads "nearer"; right, left, up and down are
  unchanged; and the N F switch still reverses the new resting behaviour rather than restoring the
  old one. The diagram's plate follows the deck, so it now travels away on a toward-nudge — the
  picture and the deck agree, which is the thing that has to be true.
  Suites 256, 263 and 264 green, no page errors. Still no new trace.
- 265 roll_flip · b265 · lab.html — the diagram's right/left and its right-edge-away rotation, both
  reversed, by one sign.
  he asked for two flips and ONE sign does both, which is not a coincidence — it is sign_agree from
  263 paying off. The plate's position along the right/left arc is read from the turn angle itself,
  because on an orbit, carrying the phone round to the side and turning it about the vertical are
  the same fact. So ROLL_INV reverses the angle at the single point it is derived, and the arc
  position, the rotation arrow, the plate's own turn and the "turn side" readout all move together.
  MODEL_INV.x stays +1 deliberately: a second sign there would have flipped the position back and
  split the pair apart again, which is the state 263 was built to end.
  diagram only, as TILT_INV and SWIRL_INV are — the paper and the deck are untouched.
  verified by running the same three poses against the previous build and this one, side by side:
  "right / left" and "turn side" both go +40 → −40 and the plate's travel along the +X arm goes
  +27.8 → −28.1, while "up / down", "tilt top" and "swirl flat" are character-for-character
  identical. The turn arc is still drawn, and the plate's own top edge lies the other way.
  Suites 256, 263 and 265 green, no page errors. Still no new trace.
- 266 flip_row · b266 · lab.html — three rows of switches, because there are three questions and
  one row of five was answering two of them at once.
  the three questions, which is the whole of the design:
    move — I nudge the phone. Which way does the PAPER go?     (L R, U D, N F)
    show — I move the phone. Which way does the PLATE go?      (L R, U D, N F, tilt, turn, swirl)
    lean — I turn or tilt. Which way does the PAPER lean?      (tilt, turn, swirl)
  The old row mixed the first and third: its L R / U D / N F were the nudge response, but its swirl
  and edge-away were the paper's LEAN, which is a different question entirely. They are separated
  now, and the middle question — the diagram — had no switches at all. Every sign I have been
  hunting by hand over the last four builds is his to set in one press.
  every switch is a MULTIPLIER on the sign the code already ships, so "off" is exactly what the page
  does today and "on" is the reverse of it. That is what made twelve switches safe to add at once:
  nothing changes until he presses something, which the test asserts before it presses anything.
  two couplings worth knowing, and they are deliberate. On the diagram the plate's right/left
  POSITION is read from the turn angle, because on an orbit those are the same fact (sign_agree),
  and up/down likewise from the tilt. So flipping a rotation carries its position with it and the
  panel stays consistent — measured: dturn moves both "right / left" and "turn side", dtilt moves
  both "up / down" and "tilt top". Flipping the position alone splits the pair — dx moves only
  "right / left". Both are now his to choose rather than mine to guess.
  row_wrap: the rig is 168px wide and that shape is worth keeping, so the six-switch group takes a
  second LINE rather than shrinking to 17px buttons, which is under any thumb. Measured: every
  button in all four lines is 40x32, and none wraps its label. The tag is on the first line only,
  so the two lines read as one group.
  verified switch by switch, twelve of them: each changes only its own readouts, the show row never
  touches the paper, the lean row never touches the diagram, the move row still moves the deck and
  only the deck, and all of it survives a reload. dswirl and the lean roll needed a swirl actually
  posed to exercise — the first run had none and reported "(none) changed", which looked like a
  pass and was not; re-run with a 35 degree swirl, dswirl takes the diagram −35 → +35 with the paper
  untouched, and lean roll takes the paper 35 → −35 with the diagram untouched.
  a process note worth keeping: three edit scripts in a row lost their work because they write the
  file at the END and an assertion failed before that. The file was fine, the edit simply was not in
  it, and the browser was blamed for caching. Two lessons — write incrementally or verify the edit
  landed with a grep, and put a cache-buster on the harness URL so a stale page can never be the
  suspect.
  Suites 256 and 263 green, no page errors. Still no new trace.
- 267 edge_near · b267 · lab.html — the plate leans the way the phone in his hand leans, and a
  switch of its own for it.
  what he saw: carrying the phone round to the right brings its right edge TOWARD him — that is what
  an orbit is, the screen staying square to his nose — and the diagram had the right edge going
  away. The rectangle was rotating the opposite way to the real one in his hand while sitting in the
  correct place on the arc.
  edge_near: this is a sign on the plate's DRAWN turn, not on the turn it REPORTS, and that
  distinction is the whole of the fix. The angle was right — the position it drives lands correctly
  on the arc, and "turn side" reads correctly — only the rectangle built FROM it was mirrored. So
  PLATE_INV goes inside mat_from and nowhere else, and the position, the turn arc and the readout
  are untouched. Flipping dturn instead would have fixed the rectangle and dragged the position
  across the diagram with it, which is the coupling 266 warned about.
  and a switch for it, dplate (◱), in the show group where the rest of the diagram's signs live.
  Off is the new behaviour, as always.
  a note on how this was measured, because the pose labels have burned me twice. "Carried to the
  right" is NOT taken from what I pose — it is taken from the diagram's OWN readout: sweep until
  "right / left" reads positive, then ask which edge of the plate is nearer the viewer, by
  projecting its four corners onto the drawn +Z arrow. The first run of the test labelled the pose
  by hand and reported the result exactly backwards. Against that measure: before, the LEFT edge was
  nearer when the diagram said right; now the RIGHT edge is, the plate's centre is unchanged to a
  tenth of a pixel ([19.7,20.6] → [19.8,20.6]), and both readouts are identical.
  row_even: the show group is seven switches now, so its last line holds one. It gets invisible
  spacers so that button is 40px like every other rather than stretching across the line — spacers
  rather than a fixed width, so the columns stay aligned whatever width the rig ends up.
  Suites 256, 263 and 267 green, no page errors. Still no new trace.
- 268 cal_month · b268 · lab.html — the deck becomes September 2026.
  why: the deck was 25 coloured cards with a digit each, and a digit is legible at any size. Nothing
  about it could answer the question the page exists to ask — can I find my way around a space that
  has more in it than fits on the screen — because there was never anything in it to find. A day
  with ten things on it is a grey texture at the zoomed-out scale and perfectly readable three
  notches in, so navigating now REQUIRES the moving and the zooming together.
  the grid: seven columns by five rows, Monday-first, Aug 31 in the top-left through Oct 4 in the
  bottom-right, with the middle of the lattice landing on Thursday the 17th. One nudge sideways is
  one DAY and one up or down is one WEEK — which is what the lattice always meant, it just had
  numbers on it instead of dates. CELL_MAX becomes { 3, 2 }, the month's own edges: you cannot
  nudge off the calendar, verified by nudging six past the right edge and eight past the left.
  cal_fill: some days carry nothing and some carry ten, because a month where every day has the
  same load teaches nothing about navigating one. The 3rd, 9th, 17th and 23rd are the heavy ones.
  cal_span: six multi-day bars, each drawn as ONE element lying across the days it covers rather
  than as a mark on each day, so it reads as one thing that spans rather than several that
  coincide. A span crossing a week boundary is split into one bar per row, which is what a paper
  calendar does with the same problem. Each day's own list starts BELOW however many bars cross it,
  worked out per day, so a bar never lies over an hour.
  cal_open: the month starts WHOLE, two notches out, and a reset returns there rather than to x1.
  Measured: at Z_HOME the month is 333x305 in a 390x820 window, dead centre, and a day is 45x59px —
  at which size its hours are texture, not words. Three notches in, that same day is 418x544 and
  its ten entries are plain text.
  cal_fit: CARD_F 0.46 → 0.55. The old value was chosen so three of five cards showed at once;
  seven columns is a different sum, and at 0.42 the month sat in the middle with a third of the
  glass empty around it.
  day_here: the corner brackets are gone at his word. The day says it itself — full strength while
  its neighbours wash back, a blue ring standing off its edge, a tinted ground and its date in the
  same blue, lifted above the span bars so a bar can never cross the ring.
  a sign left deliberately alone: nudging right currently goes to the EARLIER day and up goes to
  the LATER week. Those are the move row's signs, which he has spent four builds making his own, so
  I have not quietly reversed them to suit a calendar convention — the L R and U D switches are
  right there and it is one press.
  verified: 35 days and 8 bars drawn, the month centred to the pixel, one nudge per day and per
  week with the focal day centred every time, both edges clamped, the zoom walked in and the day's
  entries read back as text. Suites 256, 263 and 267 green, no page errors. Still no new trace.
- 269 icon_row · b269 · site.css, 9 session pages — one row-icon size, and the rule that had been
  quietly preventing it.
  what he saw: the highlight rows' icons are smaller than the session rows'. Measured: 17px against
  29px, on rows the eye compares directly every time the list slides over the highlights.
  the cause, and it is a good one to have written down. Those icons are SVGs sized in em, so their
  font-size IS their icon size. The pages already asked for 29px (and 35px for the play triangle) —
  icon_grow set that back in build 251. But one_size is `body :not(…):not(…) … { font-size: 17px
  !important }`, and that selector is BOTH !important and far more specific than any class, so it
  beat every one of them. `.play_tag` even carried its own !important and still lost, because
  between two !important rules specificity still decides. The pages have been asking for 29 and
  getting 17 ever since one_size moved into the shared sheet.
  the fix is to exclude them rather than to fight them: `.play_tag` and `.ghost` join one_size's
  exclusion list, the highlight row's sizes move into site.css where the row grammar already lives,
  and a ghost button ANYWHERE ELSE — the audio pencil, the local-file picker — is a text control
  rather than a row icon and is given back the app size explicitly. The dead per-page rules came out
  of all nine pages. ?v=3 on the stylesheet.
  measured after: play, heart, share and remove all 29x29, the same as the session row's cassette
  and share, in targets of the same height. Ghost buttons outside a highlight row checked on three
  pages and still 17px with 17px icons. Every page shot against the previous build: pixel-identical
  apart from record.html's clock. No page errors. Still no new trace.
- 270 rec_same · b270 · record.html — the record page takes the site's page box.
  what was left: record.html has linked site.css since 257, but it still carried its own body rule,
  and that copy had drifted — an 18px gutter against the site's 16, a 10px top against its 3, its
  own font-family and its own html rule, none of which said anything the shared sheet did not. It
  was the only reason this page sat on a slightly different grid from the rest of the site.
  and three bands — .top_bar, .name_row and .stage — were capped at 560px, a number chosen when
  this page did not share a stylesheet with anything. They take the site's width now, which also
  retires the landscape rule that existed only to undo that cap.
  what is KEPT, because it is genuinely this page's own: the recorder is a single centred column,
  so body stays a flex column with a min-height, and the safe-area bottom padding stays with it.
  Sharing a stylesheet does not mean pretending a page has no shape of its own.
  measured before and after: padding 10px 18px 24px → 3px 16px 24px, the bands 354 → 358px wide,
  and the wordmark, the record button and the tag button unchanged to the pixel. Every other page
  shot against the previous build: pixel-identical. No page errors. Still no new trace.
- 271 open_view · b271 · lab.html — the month holds still, it is there from load, and the controls
  are one band along the bottom.
  hold_still — the big one, and he is right about it. The deck was panning so the selected day sat
  dead centre, which meant every nudge slid the whole calendar under him and a day was in a
  different place selected than it had been a moment earlier unselected. On a calendar that is
  backwards: the month is the fixed thing and the selection is what moves over it. The deck now
  holds where it is and pans only when it must — when the selected day would otherwise be off the
  glass, and then by the LEAST amount that brings it back inside a margin. Zoomed out, the whole
  month is on screen and it never moves at all; zoomed in, it scrolls the way a page scrolls to keep
  a caret visible, one edge at a time. Measured: three days checked at the home zoom, each in
  exactly the same pixel selected as unselected; and three notches in, the month moved on 3 of 4
  nudges with the selection never once leaving the glass.
  open_draw: the paint loop returned early until motion was switched on, so the page opened blank
  and only became a calendar after a press. Nothing about drawing a month needs the sensor — the
  month, its position and its scale are all page state — so it draws from load, and turning motion
  on only adds the two instrument panels and the leans. One flag decides whether the loop is
  running, so switching motion on cannot start a second loop alongside the first.
  svg_hidden — and open_draw immediately exposed a bug that had been sitting there harmlessly. An
  SVG element does not reflect the `hidden` IDL property, so `poseEl.hidden = false` sets a plain JS
  property and leaves the ATTRIBUTE in place. That did nothing for as long as the attribute did
  nothing to an SVG — but the diagram was therefore painting an empty white box in the corner from
  load, invisible before only because the whole page was blank. Giving the attribute a CSS rule
  fixed the box and broke the unhide in the same stroke; both are fixed by naming the attribute.
  The 256 suite had the same line in it and was measuring 0x0 as a result — corrected there too.
  bar_low: every control on one band along the bottom, at his word. It was a 168px column floating
  in the lower right, which put the switches over the right-hand days and left the whole bottom of
  the glass empty. The band is full width with its own ground, so the calendar reading through it
  can never make a label ambiguous.
  flip_hide: twelve switches were taking a third of the band for something touched once a week, so
  they are closed by default behind one small button and remembered — a setting he had open should
  still be open when the page reloads itself, which this page does constantly.
  Suites 256, 263, 267 and 269 green, no page errors. Still no new trace.
- 272 day_phone · b272 · lab.html — a day has the proportions of the screen it is read on.
  day_phone: ch was `min(h * 0.34, cw * 1.30)` — two invented numbers fighting each other. It is
  now simply `cw * (screen height / screen width)`. On his iPhone a day is a little iPhone.
  two things fall out of it worth having. Zooming into one day frames it like a screen rather than
  letterboxing it. And it holds on any device with no second number to maintain — verified at
  390x820, at 430x932 and in landscape at 820x390, the day's ratio matching the screen's to within
  a thousandth in all three, including the landscape case where the days turn with the phone.
  a detail that mattered: the ratio is taken from the WINDOW, not from the stage element. The stage
  is a few percent off the window's own shape, which is the difference between a day at 2.19 and the
  screen's 2.10 — small, but it is the one number this build is about. The first cut used the stage
  and missed by 4%.
  band_room: the taller days made an existing problem visible — the month was centred in the whole
  window while the controls own a band along the bottom, so the last week sat behind them with a
  matching gap left at the top. The month now centres in the glass ABOVE the band, and the
  keep-the-selection-visible clamp measures against that region rather than the whole window.
  Measured: 121px clear above the month and 121px between the month and the band, on all three
  screen sizes.
  verified: the three screen sizes above; a day still in exactly the same pixel selected as
  unselected; the scroll-when-needed behaviour unchanged three notches in. Suites 256, 263 and 269
  green, no page errors. Still no new trace.
- 273 lab_true · b273 · lab.html — the page's code says what the page is.
  the ask: refactor everything about this page to match what it has become. It became a calendar
  you navigate by nudging a phone; the code still described a photograph lying on graph paper,
  viewed through a magnifier law, inside a three-page swipe carousel.
  what came out, in four sweeps, each measured against a fixed reference before and after:
  page_gone — the carousel: three EMPTY cells, a column of dots and a "swipe up / down" hint, on a
  page where swiping had done nothing for a long time. It was the shape of the first sketch, alive
  only because the frame element it lived in is still the stage.
  drag_gone — the finger-drag of the paper went with it. It moved `off`, which moved `show`, which
  fed the pan that paper_lock has been overwriting from the deck since build 261. Dragging the page
  had been doing nothing visible for eleven builds.
  one_scale — the optics. view() ran a whole pipeline every frame: a camera position in metres, a
  viewing distance, a magnification from the magnifier law, pixels-per-metre and a clamped pan —
  and every output was discarded, because the deck sets the pan and the scale. The proof was on the
  readout, which said "scale x1.00" while the deck sat at 0.476: the number came from the dead
  pipeline rather than from anything on the screen. It reads x0.48 now. Out with it went PHONE_W,
  D0, D_MIN/D_MAX, Z_POWER, MULT_MIN/MAX, DEPTH_INV, NUDGE_Z, BUMP_ZOOM, NUDGE_PAN, NUDGE_FRAC,
  show, showV, off, nudge_m, zoom_at and smooth_step — the last of which was being called on EVERY
  sensor sample to compute three numbers nothing read.
  shot_gone — the photograph that used to lie on the paper. display:none since the deck arrived,
  but still parsed, still fetching its image file on every load, and still carrying the crisp_deep
  raster machinery (SHK_MAX, shkNow, shkPeak, the --shk variable and its power-of-two ladder) that
  existed only to keep it sharp under zoom.
  mul_gone — the two matrix-times-vector helpers, which rotated an acceleration sample out of the
  phone frame. Nothing has rotated a sample since nudge_core.
  and the prose. The three biggest comment blocks on the page described things that no longer
  exist: the world_view essay on metres and the magnifier law, bump_step's account of a world
  following the phone, and card_deck's spread of coloured cards. They are replaced by what is
  actually true, which is shorter. Stale names went too: POSE_SC (the metres-to-diagram scale),
  REPO_RAW, the pose_read group, .g_row, .g_status, .track/.cell/.dots/.hint.
  the verification, and this is the part that matters for a refactor this size: a fixed reference
  run — cold load, then a right nudge, an up nudge and a depth nudge — capturing the card name, the
  cell, the depth, the zoom, the month's size and origin, the selected day's rectangle, all six CSS
  variables, the full readout line and the bar count, plus two screenshots. Run before the first
  cut and after every sweep. Every field identical throughout except the one that was wrong (the
  scale readout). The screenshots differ by 487 pixels across twelve sparse rows, all of them the
  dot column that was deliberately removed.
  lab.html 2733 → 2420 lines. 60fps. All five lab suites green — 256, 263, 267, 269 and 270 — and
  no page errors at any stage. Still no new trace.
- 274 mid_full · b274 · lab.html — the selected day is centred, and one notch makes it 90% of the
  glass.
  stay_mid: the deck pans so the selected day sits at the centre of the viewport, always. This
  REPLACES hold_still from 271, and both are defensible — he has now asked for each in turn.
  Holding still keeps a day where you last saw it; centring keeps the thing you are ON where your
  eye already is. Centring wins once the days are large: at the full-day notch one day is 90% of the
  glass, and a "scroll only when it would leave" rule then spends most of its time scrolling anyway,
  in jumps, which is worse than simply following. deckOff stays a position the page keeps rather
  than an expression inlined into the transform, so going back is one line.
  measured at six positions — at rest, two across, one up, back down, and back across — the selected
  day's centre landed on the centre of the glass to the pixel every time, (0, 0) off.
  day_full: a day's width stops being a taste and becomes a consequence. Name the notch (Z_FULL) and
  the fraction (DAY_FULL) and the width follows from the zoom step: 0.90 / Z_STEP^1. Change any of
  the three and the day resizes itself to keep the promise, which is the point of deriving it rather
  than typing 0.4286 and hoping. And because day_phone gave a day the screen's proportions, 90% of
  the width is 90% of the height in the same breath — measured 89.9% on BOTH axes at that notch,
  not 90% one way and something else the other.
  a trap it walked into first: the width was taken from the stage element rather than the window,
  which put the "90%" day at 83.5% of the glass, because the stage is inset. Both of a day's
  promises are promises about his SCREEN — its proportions and its 90% — so every measurement in
  card_px now comes from the window. Same class of mistake as day_phone's, in the same function, two
  builds apart; the ratio had been fixed and the width had not.
  the dial says what it means at the two notches that have a meaning: "whole month" at Z_HOME and
  "full day" at Z_FULL, plain numbers everywhere else.
  band_h and deck_home went with hold_still — with the selection always centred there is nothing to
  centre above the band.
  verified: the six positions above, the depth dial walked from the whole month to +3 with the
  percentage of the glass printed at each notch, and all five lab suites green. Suite 269's
  hold_still section was rewritten to assert the new contract rather than the one it replaced.
  No page errors. Still no new trace.
- 275 month_name · b275 · lab.html — SEPTEMBER across the top.
  on the GLASS, not in the deck, and that is the whole decision. Inside the deck the title would
  shrink to nothing at the whole-month zoom and sail off the screen the moment he came in on a day
  — which is precisely when knowing which month you are in matters most. Fixed to the top of the
  window it holds: measured at four zooms from the whole month to the full day, the title stays at
  exactly (130, 16), 130px wide, every time.
  the text comes from CAL_MONTH, like the dates and the span bars do, so changing the month cannot
  leave the title behind. Uppercase is done with text-transform rather than by typing SEPTEMBER, so
  the page's own data stays "September" and only the display shouts.
  set at 15px with 0.22em of tracking, letterspaced wide enough to read as a title rather than as a
  word, over a soft light halo so it stays legible against the graph paper at any zoom.
  checked for collisions against everything else fixed at the top — the Admin pill, the release
  badge and the watching indicator, all of which live down the left, and the diagram panel on the
  right. No overlaps, and the title is centred on the glass to within a pixel.
  Suites 256, 263, 269 and 271 green, no page errors. Still no new trace.
- 276 cal_head · b276 · lab.html — the heading is printed on the paper, the zoom-out goes much
  further, and the other days step forward.
  cal_head: the month's name and the weekday letters are children of the DECK now, so they pan and
  scale with the month exactly as a printed calendar's heading does. 275 put the name on the glass
  so it would survive zooming into one day; he wants the printed thing, and he is right that it is
  what makes this read as a calendar rather than as a grid of tiles. Zoom in past the month and the
  heading leaves with the rest of the paper, which is what happens when you put your face against a
  wall calendar. The weekday row is new and is the piece that was actually missing — MON through
  SUN over their own columns.
  measured: the heading sits entirely above week one, spans the paper's exact width to within a
  pixel, and both parts are inside the deck; it travels with a sideways nudge and rescales with a
  depth nudge, checked at four positions.
  panel_low — and putting the heading there immediately collided with the two instrument panels,
  which were top right, squarely over "2026" and the SUN column. No fixed offset can dodge a
  heading that moves with the zoom, so the panels moved instead: bottom left, sitting on the control
  band, whose height they read from the band itself rather than guessing. They are diagnostics; they
  belong beside the controls rather than over the thing they describe. (Suite 256's overlap check
  tested pose.bottom against trace.top, which meant nothing once they sat side by side — it is a
  proper rectangle test now.)
  zoom_room: the two ends stop sharing a limit. Out goes to 8 notches, where the whole month is a
  few pixels — he asked to be able to keep pulling back, and at −4 or −5 it is a real place to be,
  seeing where the month sits rather than what is in it. In stops at 3, because past that one day is
  four screens wide and there is nothing there but the inside of a rectangle; the day already fills
  the glass at +1.
  day_dim: he read the unselected days as about 20% and asked for 40%. Worth being exact, because
  his premise was off: they were at 52% opacity with their colour cut to 60%, and it is the two
  together that made them read fainter than they were. The intent is what matters — less fading —
  so they go to 78% with the colour nearly whole. Still unmistakably secondary next to the ringed
  day, but a month you can read all of.
  Suites 256, 263, 269 and 271 green, no page errors. Still no new trace.
- 277 zoom_deep · b277 · lab.html — the zoom-in range goes six notches, and the day's own chrome
  stops growing with it.
  zoom_deep: Z_IN goes 3 → 6. Yesterday's entry argued the opposite — that past +3 "there is nothing
  there but the inside of a rectangle" — and that reasoning was about an empty rectangle, which is
  not what a day is. A day holds ten lines of text, and the useful depths are the ones where those
  lines are large: at +3 a line sets at 115px, at +6 at 1061px, which is one entry filling the
  screen. That is a legitimate place to stand on a phone you are nudging one-handed. Measured at
  every notch: 38x80px at −2 through 14323x30104px at +6, and 60 frames a second at the deepest
  notch while being shoved sideways.
  ring_flat: the chrome inside the deck now has a unit that does not scale. deck_draw publishes
  --px1 = 1/z px on the root, so a rule written in --px1 lands on the glass at a constant thickness
  no matter how far the deck has been blown up. The selection ring is 2px and its halo 6px, measured
  on screen at all nine depths: 2.00/6.00 everywhere, 2.01/6.02 at +6.
  border_clamp — and the reason a unit was needed at all is a Chromium behaviour worth writing down:
  a non-zero border-width is rounded UP to a whole device pixel before the transform is applied. At
  +6 the ring's 0.02px border became 1px in deck units, which the transform multiplied into an 86px
  navy slab across the glass. There is no way to ask for a thinner border. Card edges are drawn with
  box-shadow spread instead, which takes fractional widths honestly — same look at every zoom, and
  it is why .card and .card.here now carry no border at all.
  New suite vj_274 covers the range, the on-glass ring measurement at every notch and the frame rate
  at +6. Suites 256, 263, 269, 271 and 273 green, no page errors. Still no new trace.
- 278 room_swap · b278 · lab.html — one button, three rooms: the calendar, an article and a
  geometric space you walk through.
  room_swap: the page is a nudge detector with a PLACE attached to it, and the place is now a
  choice. The detector, the recorder, the reverse switches and the instrument panels are untouched
  and unaware — a nudge is still one nudge in one of six directions. All that changes is who is
  listening, and each room answers to a different subset of the six, which turns out to be the
  honest way to express "you can only go up and down in here". Each room keeps its own position, so
  the calendar you left on the 17th is the calendar you come back to; the room itself is remembered
  across a reload, because this page reloads itself constantly and being thrown out of an article
  mid-read would read as a fault.
  room_read: five screens of one column, and one axis. A sideways or a depth nudge is HEARD and
  answered with a caption saying there is nowhere to go, rather than silently dropped — on a page
  whose whole job is judging a detector, "nothing happened" must never be ambiguous between "you did
  not nudge" and "there is nothing that way".
  read_grid — every vertical measurement in the column is a multiple of one line, and a page is
  exactly 30 of them: padding, paragraph spacing, headings, the rule under the byline. That is what
  makes a page turn land BETWEEN two lines instead of through the middle of one, which is the
  difference between five pages and one scroll stopped arbitrarily five times. The type scales with
  the page, so the fit holds across phones: measured at 390x820, 360x780 and 430x932, the prose ends
  at 87%, 94% and 88% of the fifth page.
  read_fit — and the first cut got the page wrong in the way this page has now got a measurement
  wrong three times: --page_h came off the WINDOW, so the bottom fifth of every page was behind the
  control band and the two instrument panels, and four lines were lost at every turn. A page is the
  height that can be READ, measured off the column element. The panels also go entirely in this room
  — a diagnostic overlay across a magazine page ruins the one room whose whole job is being
  legible — and the three corner markers lie in one short row along the top instead of stacked down
  200px of the left margin.
  room_solid: a space of 22 solids on a floor grid, walked with the same six nudges. It is projected
  BY HAND onto a canvas rather than built from CSS 3D transforms, and that is the load-bearing
  decision: a perspective container divides by (P − z), so anything reaching the perspective plane
  inverts and fills the screen, and in a space you walk through things pass the plane every few
  steps. Projecting by hand makes the near plane a comparison instead of a catastrophe, and lets a
  face that is half past it be clipped (Sutherland-Hodgman against z = NEAR) rather than popped out
  of existence.
  solid_lane — every shape stands on the floor at a HALF-step offset in both x and z, and none is
  wider than one step, so the camera's lattice points fall in the gaps by construction and you pass
  BETWEEN things rather than ending up inside one. The first cut had a 560-tall pillar on the centre
  line and three steps forward put its face across the whole glass.
  up_out — up is the way out of the space, from anywhere in it, which is what he asked for. It is
  spent on leaving rather than on rising and so there is no down: an exit usable from only one
  height is not an exit, and a direction that sometimes climbs and sometimes leaves is a trapdoor.
  look_lean gives the phone's attitude a small clamped aim of the camera (0.55x, capped at 26
  degrees) — enough to see round the pillar in front of you, never enough to be steering. Walking
  stays the nudge's job.
  New suite vj_275: the button cycling all three, the five pages and the two directions that do
  nothing, the projector's face count and its painter's-algorithm ordering, walking and the up-exit,
  each room holding its place while you are elsewhere, the reload, and 60fps in all three. Suites
  256, 263, 269, 271, 273 and 274 green, no page errors. Still no new trace.
- 279 nudge_out · b279 · nudge/ + lab.html + admin.html — the nudge experiment is separated
  from the site it grew in, ready to be lifted out as its own project. Nothing has moved OUT of
  the repo, at his instruction; what has happened is that the experiment now occupies one folder
  and every line of it that knows the host's name is in one file of that folder.
  the_folder: nudge/nudge.html is the markup and nothing else, nudge.css every rule the experiment
  owns, nudge.js the engine — detector, three rooms, instruments, recorder — and nudge_host.js the
  seam. nudge_notes.md is the experiment's own build history, 87 entries from 177 lab_frame to here,
  lifted out of this spec; nudge_test/ holds the eight suites, an opener that puts the address in
  one place, and a runner. README.md says in four steps what the move is.
  nudge_host: one object, NUDGE_HOST, loaded first, holding the back link, the release stamp, the
  localStorage prefix, the sync endpoints and the file list the reload-watcher polls. Measured: the
  string "vampjam" appears 9 times in nudge_host.js and ZERO times in the page, the stylesheet, the
  engine and the suites. That number is the deliverable — it is what makes the move an edit to one
  file rather than a search.
  one_file_engine: the engine stays a single file rather than being broken into modules. Every part
  of it shares one piece of state — the phone's attitude, the detector's running average, which room
  you are in — and splitting shared state across files buys boundaries that are not real and costs
  the ability to read it top to bottom. The seam that matters is the one to the HOST, and that is
  where the split was made.
  lab_stub: lab.html stays at its old address as a redirect, because it is the address on his phone
  and the one three hundred builds of the ship loop have reloaded. It uses location.replace, so Back
  does not bounce off it. It is the one thing the move deletes. admin.html's CTA points at the new
  address directly rather than through the hop.
  watch_many: the page is four files now, so the reload-on-change watcher polls all four and reloads
  when any tag changes. Watching only the HTML would have made every CSS or engine edit invisible
  until a manual reload — which is the one thing that loop exists to prevent, and it would have been
  a silent failure of exactly the kind this page's history is full of.
  the split is proved by DIFF, not by assertion: the same three rooms shot before and after,
  1,279,200 pixels each, differ in 112 of them, all inside one 1x28px column at the right-hand edge
  of the version pill — the pill is a different width because the stamp is a different word. Every
  other pixel of all three rooms is identical, and __lab.state() and __lab.rooms() match exactly.
  what did NOT come across, and it is in the README so the move does not have to rediscover it: the
  prompt log (the host keeps two identical twins, one named for the lab, but neither is lab-only —
  separating a log that has never been separate is a decision, not a copy); lab_gestures.json, which
  lives in this repo and is reached by URL through NUDGE_HOST.sync; and the commit robot, which
  watches this folder.
  New suite vj_276: the redirect and its history behaviour, all four files served, the vampjam count
  per file, what the page read out of the host, the watcher polling all four, and the three rooms
  intact. Suites 256, 263, 269, 271, 273, 274 and 275 green from their new home. Still no new trace.
- 280 edge_gone + nudge_move + nudge_gone · b280 · lab_repo/nudge/ + vampjam lab.html, admin.html —
  the last three limits come off, and then the whole experiment leaves vampjam for a project of its
  own in lab_repo/nudge.
  edge_gone: nothing stops you in any direction, in any room.
  · the calendar walks a DAY at a time and wraps at the week — stepping off Monday's side lands on
    Sunday of the week before, as a text cursor wraps at the end of a line, because there is no
    eighth column in a week. On a wrap the column snaps and the row slides; easing six columns
    backwards would read as travel rather than as a wrap.
  · vertically it never stops. September is a place in an endless run of weeks now, and every month
    gets its printed heading, not just September. A heading needs somewhere to be, so the run of
    weeks is deliberately NOT evenly spaced: a gap opens above the week containing a 1st, which
    makes row position cumulative (row_y) rather than row times pitch. Every consumer goes through
    it — the cards, the span bars and the pan — because getting the pan from the pitch alone would
    drift by one heading per month, a week of error by December. head_n is month arithmetic, so row
    10,000 costs what row 1 costs. Verified: nine up lands on Sat Nov 14 with October, November and
    December all printed on the paper; 22 back down lands on Sat Jun 13 with May, June and July.
  · the zoom has no ends. Measured before deciding: the transform is exact and finite at +30 (a day
    775 billion px wide) and the card still measures at -18 (0.0003px); at -22 it rounds to zero,
    which is the MACHINE stopping, not a decision. So nothing clamps zc. What is bounded is
    CELL_BUDGET, 1200 day cells per build — a rendering budget, not a wall.
  · and the space has no walls: CAM_MAX is gone on all three axes.
  room_lock — up no longer leaves the space, at his word, and this is worth recording because it is
  a general lesson: with a reverse switch set on the y vector, "up leaves the room" reads as "down
  throws me out", and he reported exactly that. A direction that sometimes climbs and sometimes
  leaves is a trapdoor. Only the button changes rooms now.
  sky_dive + grid_mid — up and down fly instead. The grid is a reference PLANE through the middle
  rather than a floor, with twelve solids above it and twelve below; flying under it and looking
  back up at what hangs there is the point of the vertical axis once it is not spent on leaving.
  solid_tile — and without walls, flying far enough used to leave you in an empty grid forever,
  which is a worse answer to "no limits" than the wall was. The furniture repeats on a period, laid
  out around wherever you are, with copies pre-culled on their CENTRE before any face is touched.
  Measured: 391 faces in view at the start, 399 sixty steps in, 355 after another 20 sideways and 12
  down. grid_roam does the same for the plane, which now has no edge to reach.
  nudge_move — then the whole thing left. lab_repo/nudge/ holds index.html, nudge.css, nudge.js,
  nudge_host.js, README.md, nudge_hand.md, nudge_notes.md and nudge_test/ with nine suites. The move
  was exactly what 279 promised it would be: copy the folder, edit one file. nudge_host.js now says
  lab_repo, points back at hub.html, and keeps the vampjam_* localStorage keys ON PURPOSE — they are
  keys, not labels, and renaming them would reset his thirteen reverse switches, his last room and
  any takes still held in the browser. Its sync still points at vampjam's worker and
  lab_gestures.json, because that is where the 268-gesture corpus the detector was fitted against
  lives; moving the corpus is its own job and the handoff doc says so.
  nudge_hand.md — the pick-up document, ~660 lines, written so another thread can take this over
  cold: what it is and the three non-goals, every file and why the engine stays one file, the
  detector explained mechanism by mechanism with every constant and why the ceiling has to read the
  raw peak, all three rooms in full, the instruments, the recorder, the whole test hook and what
  each suite covers, the build loop, a table of five decisions that were REVERSED so they are not
  re-argued, ten open loose ends, and eleven traps that each cost a build.
  nudge_gone — vampjam is cleaned. The nudge folder is in claude_trash/, admin's CTA is removed
  rather than pointed across repos at a URL this site cannot know, and lab.html is a plain
  forwarding page saying where the thing went. It cannot redirect: the two repos are different
  sites. Delete it once nothing points at it. lab_gestures.json stays, because the corpus does.
  New suite vj_277 covers the week wrap, the endless months and their headings, the cell budget and
  the tiling space. All nine suites green from lab_repo/nudge/nudge_test/, no page errors. Still no
  new trace — and the send fix from 262 is still unproven, which is now written down where the next
  thread will find it.
- 281 audio_tuck · b281 · local folder only — the six audio masters move out of the repo root into
  audio/. Six .m4a files, 933 MB: the two bazaar_cafe recordings, the by-hand vampjam mix and the
  three Sound Union cuts (raw, v2 and faststart).
  local_only, and it is worth writing down WHY this is a safe move rather than a scary one. Every
  one of these files is matched by .gitignore (*.m4a, line 3) and none is tracked — checked before
  moving and checked again after, where git check-ignore confirms the pattern still covers them one
  level down and git status shows nothing but the commit message. The site never loaded them from
  disk either: every reference in the session jsons is an ABSOLUTE url to R2
  (pub-33cfd8558d...r2.dev) or to a GitHub release. So nothing deployed, nothing tracked and nothing
  linked changes — only the shape of the folder on his Mac, which is what he asked for.
  mv -n, so an existing name in audio/ could not have been overwritten; byte totals check out at
  933 MB and the root has no audio left in it.
  This does not touch the two standing audio items: move_to_r2 (five release-hosted jsons and the
  08-14 R2 file) and dups_decide (the ~1.2 GB of 08-07 spares). It does make dups_decide easier to
  look at — three of the six files in audio/ are cuts of the same 08-07 Sound Union set, which is
  most of that 1.2 GB sitting in one place now.
  No page edit, no suite. Still no new trace.
- 282 folder_tidy · b282 · README.md + prompt_log/prompt_log.html + vampjam_org.html + six moves —
  the local folder organised, and one silent breakage found while doing it.
  the_rule: anything the site SERVES stays at the root. The root is the served directory, so a
  file's path here is its URL, and links to these sessions have been handed to people. Tidiness is
  not worth a dead link. So the root stays wide and the organising happens around it.
  Two mechanisms make that harder than it sounds, and both are now written into README.md because
  both are easy to trip and neither is visible from the folder:
  · the worker only writes ROOT-LEVEL json. worker/vampjam_worker.js guards its path with
    /^[a-zA-Z0-9_\-]+\.json$/ — no slashes. So every json the site or the lab writes back has to
    live at the root: the session sidecars, the 31 deletion tombstones, and lab_gestures.json. Move
    one into a folder and its next write is rejected. This is why the 10 MB nudge corpus stays in a
    repo that no longer hosts the nudge app — and it is a better reason than the one the handoff doc
    gave, which was only that moving it was its own job.
  · the commit robot is addressed absolutely. The plist hard-codes the full path to
    auto_push_vampjam.sh and watches this folder. Moving either stops every ship, from inside a
    session that depends on the robot to ship. They stay.
  one_record — and this is the thing worth finding. There were TWO copies of the record: the spec
  and the prompt log each existed at the root AND in vampjam_admin/. They had drifted badly. The log
  VIEWER at prompt_log/prompt_log.html loads the data sitting beside it, and that copy stopped at
  255 vec_flip on Aug 28 — so for twenty-six builds, everything the ship loop wrote went into the
  admin copy and the page he opens to read it showed none of it. Same for the spec: vampjam_org.html
  named the root copy in its pickup prompt, which was also stale.
  Fixed by making vampjam_admin/ the only writer AND the only reader: the viewer now loads
  ../vampjam_admin/prompt_log/prompt_log_lab_data.js (its own URL unchanged, because he opens it),
  the org page's pickup prompt names the admin path, and the three stale duplicates are in
  claude_trash/. Verified by serving the pair and loading the viewer: 281 entries, newest
  "281 audio_tuck", 5328 outline nodes rendered, no errors and no failed requests.
  moved: Sound Union 29.qta (619 MB QuickTime master, gitignored) joins the others in audio/, which
  is now 1.6 GB of local masters and nothing deployed. vampjam_player.html — 58 KB, referenced by
  nothing anywhere in the repo — to claude_trash/. lab_surface.png and .svg, referenced only by the
  nudge notes that have already left, copied to lab_repo/nudge/ and trashed here.
  README.md at the root: the layout with a line per group, the rule and both mechanisms that enforce
  it, the one_record principle, and the ship loop. The point is that the folder should explain
  itself to whoever opens it next, including me.
  NOT done, deliberately: the 8 session pages, their sidecars and the 31 tombstones stay at the
  root. Grouping them into sessions/ is the one change that would visibly shrink the root, and it is
  the one change that breaks shared links and the worker's write path at the same time.
  No page behaviour changed; no suite. Still no new trace.
- 283 unused_park · b283 · Claude_trash_temp/ + README.md — 33 files the running app never asks
  for, parked where he can look at them before they go.
  how "unused" was decided, because guessing at this is how a working site gets broken: a
  reachability scan from the nine entry pages, following filename mentions transitively, and then
  every candidate checked AGAINST ITS RUNTIME PATH rather than against the scan. The scan alone was
  wrong twice and both corrections matter more than the moves:
  · 2026_07_24_sound_union.json and 2026_07_31_sound_union.json came back unreferenced. They are
    live: a session page builds its sidecar's name at runtime from PAGE_ID, so no filename search
    can see the link. Moving those two would have silently broken two sessions' tags.
  · sources/ and tags/ likewise — fetched as sources/<PAGE_ID>.json, constructed, never written out.
  parked: 29 deletion tombstones, each exactly {"deleted": true, "tags": []} — the residue of the
  delete flow, which removes the entry from sessions_auto.json and leaves the marker. None is in the
  registry, so the drawer never asks for one, and all 29 were his own August test recordings. One
  behaviour does change and it is written down in the folder's README: opening session.html against
  one of those ids used to fetch the marker and could say "deleted" rather than failing. Nobody
  holds a link to a test recording from August 25th.
  also parked: 2026_05_30_bazaar_cafe.json, whose entire contents declare it unused (its sibling
  .html stayed — that one is a redirect stub still catching an old link to the session's former
  name), and two .DS_Store files.
  flagged rather than assumed: 2026_08_28_san_francisco_2_33_49p.json is NOT a tombstone. It holds
  five real tags with audio null, and it is not in the registry — a recording whose upload never
  completed. It is parked rather than deleted precisely because it is real data, and it is called
  out at the top of the folder's README and in the receipt so he can decide.
  kept, and the reason is now in both READMEs: worker/, functions/ and cloudflare/ are DEPLOYED code
  — Cloudflare Pages auto-deploys anything named functions/, so that folder's NAME is the contract.
  lab_gestures.json is fetched by the nudge app by exact name and is root-bound by the worker's path
  guard. The robot, vampjam_admin/ and prompt_log/ are not used by the site and are load-bearing for
  working on it.
  Claude_trash_temp/README.md says what each group is, what changed by parking it, what did NOT come
  and why, and the one-line restore (git mv). Staging, not deletion — everything is tracked, so
  every file is one git mv from home.
  Root json is now ten files: eight live session sidecars, the worker-owned registry, and the nudge
  corpus. No page behaviour changed; no suite. Still no new trace.
- 284 fav_row · b284 · favorites.html + site.css — the favourites rows pick up the session rows'
  behaviour: a two-tap title, a narrow date that cycles, and the same play triangle.
  tap_select, copied from the session pages because it is the same gesture on the same kind of row.
  A tap on a row that is NOT the current one plays it and does NOT open the keyboard; that makes it
  current, so the next tap lands on an editable field and iOS opens the keyboard by itself. readOnly
  is set at RENDER, not inside the handler, because iOS decides by the state at the start of the
  tap. The ghost-click guard came across too — a touchend and its synthetic click would otherwise
  count as the two taps.
  and a real hole it exposed: play_fav returns early when a session has no audio bound, which left
  `current` alone — so that row could never become current and its title was permanently readOnly.
  A favourite you can never rename. It selects now even when it cannot play.
  date_thin: the date had been riding inside the session link as "2026-01-17 Bazaar Cafe" in a fixed
  40% of the row, spending most of that width on the part that repeats. It is its own column now at
  ~58px, and the link carries the name alone: 143px of row handed back on a 390px phone.
  date_cycle: four ways to write it — Jan 17, 1/17/26, 8mo, 2026-01-17 — tapping moves through them,
  and the page remembers. Per PAGE, not per row: a list where every row states its date differently
  is a list you cannot scan.
  lap_hit — and putting a tap target there broke on the title_lap design. The title's input laps OVER
  those two columns on purpose; that overlap is what the crossfade is made of. It was also
  swallowing every tap aimed at the date. The lap is a LOOK, so the two right-hand columns take a
  z-index and the hit goes to whatever is on top.
  icon_miss: the play triangle was 17px, not the 35px the page asked for. one_size excludes
  .fav_play, and .fav_play_sm does not match .fav_play — so the row's triangle took 17px !important
  from a far more specific selector and its own rule lost. Exactly the failure one_size's own comment
  describes, on the one row nobody had checked it against. Added to the exclusion list and set to the
  same 29px as .tag_row .play_tag, in a target of the same height.
  New suite vj_288: the triangle measured at 29px, the date column measured against the row, the
  first tap selecting without focus and the second focusing, the four formats cycling and persisting.
  Still no new trace.
- 285 fav_sort · b285 · favorites.html — a manual reorder mode on the favourites page: one button
  under the list, a grip on every row while it is on, and an order that survives you walking away.
  the_mode: pressing Reorder strips every row down to a grip, its title and its date. The play,
  share and heart buttons are GONE while it is on, which is the point of the mode rather than a
  side effect: while you are arranging, a mis-tap should move a row, never play one or un-favourite
  one. The button says Done while you are in it.
  the_drag is pointer events, written by hand, NOT HTML5 drag-and-drop — Safari on iOS does not
  fire dragstart at all, so on the device this is for, the native API does not exist. The dragged
  row is lifted with a transform, and the rows it passes are moved in the DOM as it crosses their
  midpoints. So what you see IS the new order and the drop has nothing left to work out: it reads
  the list back out of the DOM. touch-action:none on the grip, or the browser claims the gesture
  and scrolls the page instead of moving the row.
  where_the_order_lives, which is the part with a real decision in it: favourites come from several
  sessions, so the order cannot live in any one session's json — a tag's own `order` means its place
  within ITS session and the session pages use it for that. So this is a separate list of tag ids:
  localStorage for instant effect, mirrored to fav_order.json through the same worker everything
  else writes through, so it follows him to another device. (fav_order.json is root-level, which the
  worker's path guard requires.)
  order_apply — his arrangement first, in his order; anything he has never arranged goes on TOP,
  newest first. A favourite hearted since the last tidy should not appear buried at the bottom of a
  long manual list.
  leave_safe: "even if I don't click the exit mode" is the whole requirement, so every drop writes
  localStorage immediately and queues the remote write; pagehide and visibilitychange flush it early
  with sendBeacon, and the fetch carries keepalive so it survives the page going away. pagehide is
  the one iOS actually fires.
  grip_hit — line-height:0 on a glyph button gives a 16px-tall box. That is a thing you miss on a
  phone while trying to drag it. 41px square, like every other row target.
  New suite vj_289: the button under the list, the three buttons gone and 16 grips in their place, a
  row dragged past two others landing third with the ids written down in that order, one post to the
  worker at fav_order.json, and the order still there after navigating away without pressing Done.
  Two of the three failures on the way were the TEST, not the page — a fixture giving every session
  the same tag ids, and a grip measured 202px above the viewport. Still no new trace.
- 286 fav_cass · b286 · favorites.html + audio_steps.html + admin.html + audio/thin — the session
  name on a favourite becomes a cassette, and the audio work he has to do himself becomes a page.
  cass_link: the session's NAME leaves the favourites row and a cassette takes its place — the same
  icon the session rows and the nav button wear, so the eye reads it as "a session" without being
  told. The name was a strip of text that mostly repeated (Sound Union, eight times down the list),
  was ellipsised into uselessness anyway, and told him nothing the date did not. The link is
  unchanged underneath: it still carries the tag id and the timestamp, so it opens the session ON
  that highlight.
  and it took the title_lap machinery with it. The crossfade existed to let the title overlap a
  column of session-name text; with the text gone the overlap was just collision — the title ran
  under the date, which the mask had been hiding. Both go. The title ellipsises honestly again.
  min-width — and the fix for the collision is worth naming, because it is the CSS default that
  causes it: a flex item is min-width:auto, which means "never smaller than my content", so the
  field kept its full width and ran under whatever was next. min-width:0 is what lets it shrink.
  The row is six things wide on a 390px phone and the title is the one carrying meaning, so the
  icons gave up what they could — 4px gap, 6px padding — and handed it about 20px back. It is 71px.
  If that is still short, the share button is the one to lose.
  audio_steps.html: he asked, fairly, what "48 vs 64" was waiting on. The answer is that it was
  waiting on nothing he could usefully decide by ear on a phone, so I decided: 64k mono, the honest
  equivalent of the quality he agreed to before I found this Mac has no HE-AAC encoder. All six
  files are cut and sitting in audio/thin — three light renditions and three faststart copies of the
  masters, 510 MB.
  What is left genuinely needs him: R2 is blocked from both the sandbox and his Mac's proxy, so the
  upload is his. So it is a page, in the house style of r2_setup.html, written to the instruction
  rules: four steps, each a sentence with the link inside it, the gates named before the destination
  (the sign-in, the two-factor code, landing on account home instead of R2), and an inline SVG of
  the screen each one lands on with a single red ring. The Finder drawing is true — it lists the six
  real filenames. The two Cloudflare drawings say on the page that they came from Cloudflare's
  documentation rather than from his screen, because I have not seen his dashboard, and ask for a
  screenshot if they are wrong. A copy button holds the folder path for Finder's Go to Folder.
  Ends by saying nothing on the site changes until he says "uploaded", and that stopping after step
  three breaks nothing. admin gets a CTA to it.
  Suite vj_289 still green. Still no new trace.
- 287 fav_bare · b287 · favorites.html — the date leaves the favourites row, and the whole row
  becomes the drag surface in reorder mode.
  date_gone: the date and its four formats are out, two builds after going in. He asked for a
  narrow cycling date and then asked for it gone, and both are fair — the second is the better row.
  The cassette says which session, the title says which moment, and a favourite IS a moment; the day
  it fell on was the least of the three. Removed rather than hidden, because a display that displays
  nothing is a thing the next reader has to work out the deadness of: fmt_date, date_next, the four
  formats, the remembered mode and the CSS are all gone. The key it used is simply abandoned in his
  browser. The title measures 167px now, up from 71 — the concern the last build ended on, answered
  by deleting the thing rather than by squeezing the icons further.
  row_drag: in reorder mode the drag surface is the WHOLE ROW, not the grip. A grip is a target you
  have to hit, and on a phone that is a thing to miss; in a mode whose only gesture is dragging,
  every pixel of the row should be it. The grip stays as the thing that SAYS so — it is the picture
  of the affordance, not its extent. touch-action:none moves to the row, and nothing inside it takes
  pointer events. A plain tap is now a zero-distance drag, so the write and the "Order saved" are
  gated on having actually moved more than 2px.
  and a process failure worth writing down, because it cost the build twice. I removed the date by
  SLICING the file between two landmarks — and the second landmark was on the far side of three
  other blocks, so the cut took the order store, the drag, the sorting state and sort_set with it.
  node --check passed, because the result was still valid JavaScript; it was just a page missing
  four features. The robot committed it within seconds. Recovery was git show f38289f:favorites.html
  piped over the file, then doing it again by NAMED declarations with a length guard on every slice
  (assert 1100 < len < 1500). The rule this repo already had — never write the file at the end of a
  script — is not enough on its own: a slice needs a guard, and a guard needs to be checked BEFORE
  the write, not after.
  Suites vj_288 and vj_289 updated for the missing date and the mid-row drag; both green, and the
  drag is now driven from 60% across the row, nowhere near the grip. Still no new trace.
- 288 fav_here · b288 · favorites.html — the share on a favourite links back to the favourites
  page, at that highlight, instead of to the session it came from.
  fav_here: the two controls on a favourite row were making the same promise. The cassette goes to
  the session and lands on this moment inside it; the share was handing out a link that did exactly
  that too. So the share now names THIS page — favorites.html?tag=<id> — and sharing a favourite
  lands you among the favourites, on the one you were shown, rather than in a session with the list
  you were sent to look at nowhere in sight.
  land_on_tag: the other half, and the half that makes the link honest rather than decorative.
  Arriving on ?tag= finds that favourite, selects it, scrolls it to the middle of the glass and
  tries to play. The try will usually be refused — a browser will not start audio without a gesture,
  and following a link is not one — which is exactly why the row is SELECTED first: the refusal
  leaves you looking straight at the right row with its play button one tap away, instead of at the
  top of a list of fifty wondering which one you were sent to.
  A tag that is no longer a favourite says so ("That moment is no longer a favorite") rather than
  doing nothing, because from the outside a dead link and a silent one look identical.
  New suite vj_290: the copied link measured against the clipboard and shown to name favorites.html
  rather than the session, following it selecting the right row and scrolling it onto the glass, an
  un-hearted tag toasting instead of failing quietly, and the two controls on one row proved to
  point at different places. Still no new trace.
- 289 do_next · b289 · vampjam_do_this_next.html + site.css + admin.html — one page for things
  waiting on HIM, and the .mjs cards in the chat explained and stopped.
  the_confusion_was_mine: he has been getting a file card in the chat for every regression suite I
  write — "Herechk / MJS / Download and open" — and had no idea what he was meant to do with it.
  Nothing: they are my tests, they get committed into the repo, and he never needs to open one.
  They stop going into the chat, and the page says so in as many words under its own heading, so
  the next one he sees anywhere does not restart the question.
  vampjam_do_this_next.html is the page he named, and the promise on it is the point: it only ever
  holds things waiting on HIM, and if it is empty then nothing is. Right now it holds one item —
  the six audio files into R2 — with a numbered banner, a time estimate, and why it is worth doing
  (it is the fix for the re-downloading he raised). audio_steps.html, written last build for the
  same job, is in claude_trash: two pages both claiming to be the runbook is how one goes stale.
  admin's CTA points here now.
  It carries a second list under "Nothing else is waiting on you" — the sessions still on GitHub
  releases, the duplicate 08-07 cuts, the stale org items — so he can see they are tracked and
  they are mine.
  text_in_svg — and the drawings were broken when I first rendered them: every label was 17px and
  overlapping into mush. one_size again, third time. The exclusion list names elements that carry
  their own size, and a <text> inside an <svg> is not an <svg>. Adding :not(text) was not enough
  either — a drawing usually sets font-size on the GROUP and lets the labels inherit, so the <g>
  took 17px !important and the text inherited it. Both :not(g) and :not(text) go on the list. This
  affects every inline SVG on the site, not just this page.
  Caught by rendering it and looking, which is the only way this class of bug has ever been caught
  here. Suites vj_288 and vj_290 still green after the site.css change. Still no new trace.
- 290 tap_only · b290 · drawer.js — a drag that starts on a control no longer presses it. Pulling
  the drawer down with a finger that began on "Tag the moment" was creating a highlight.
  the cause is the browser doing what it always does: on touchend it synthesises a click wherever
  the gesture BEGAN, and nothing on the page was telling a press from the start of a swipe. So the
  drawer opened AND the button fired, every time.
  the guard already existed — and that is the interesting part. The highlight list has had
  swipeMoved since build 94, scoped to tagList: it watches the finger for 10px of travel and
  swallows the click if it moved. So a pull that began on a highlight title was safe, and one that
  began forty pixels lower on the transport was not. Same gesture, same page, opposite outcomes,
  because the guard was attached to a region instead of to the problem.
  It goes in drawer.js instead, which is loaded by every page: one copy covers the whole site rather
  than eight session pages plus the favourites and the recorder. Capture phase on document, so it
  lands before any control's own handler; time-boxed to 700ms after touchend, so it can only ever
  swallow the click THIS gesture produced; preventDefault as well as stopPropagation, so a drag off
  a link does not navigate either. Desktop is untouched — with no touch events the flag is never set.
  10px, the same slop the list guard used, so the two agree rather than each having a number.
  New suite vj_291 drives the touch sequence and then the click by hand, because the point under
  test is the guard's arithmetic and headless Chromium does not run the gesture recogniser the same
  way. Measured: a 0px tap goes through, a 4px wobble goes through, 12px and 130px are swallowed,
  and the drawer still opens on the 130px pull.
  Three of the four failures getting there were the HARNESS: the row count moved because the page
  re-renders from its own fetch, the second gesture missed because pressing the button re-lays the
  list and moved it out from under the coordinates, and the debug counters were cumulative so a
  click from an earlier step read as this one's. The guard itself was right the first time — I had
  to stop trusting the test to see it. Still no new trace.
- 291 swipe_deaf · b291 · drawer.js + 14 html — the fix 290 should have been. A moved finger now
  reaches no control at all, not just no click.
  what 290 got wrong, and it is a plain miss: it swallowed the synthesised CLICK, and "Tag the
  moment" does not act on click. It acts on TOUCHEND, on purpose — the new title's focus() has to
  land inside the touch gesture or iOS will not open the keyboard. The comment saying so is three
  lines above the handler. I tested the door the button never uses, the test passed, and I shipped
  it. Reading the handler before writing the guard would have cost thirty seconds.
  swipe_deaf is the general mechanism he asked for: once a gesture has travelled its 10px, its
  touchend is stopped at the WINDOW in the capture phase and never reaches any element's handler.
  Nothing has to opt in; a control invented tomorrow is covered without knowing this exists. The
  click guard from 290 stays, because a stopped touchend means the browser still synthesises a
  click, and that one has to be swallowed too. Two doors, both shut.
  and it needed one structural change: drawer's own onEnd moves to capture and is registered BEFORE
  the guard, because stopPropagation on the window stops the event at that node — a bubble listener
  there would never fire and the drawer would have stopped snapping open and closed.
  cache_bump — and this may be why he saw no change at all from 290: drawer.js is loaded as
  drawer.js?v=141 and the query never moved, so Safari had every reason to keep serving the old
  file. 141 → 142 across 13 pages, and site.css 3 → 4 across 14 while I was there, since that also
  changed in 289 without a bump. A shared asset edited without moving its version is an edit that
  may never arrive.
  vj_291 now counts what reaches the BUTTON's touchend rather than what reaches a click listener:
  a tap gets through twice (its touchend, then the click), a 4px wobble gets through, 12px and 130px
  are stopped dead, and the drawer still opens on the 130px pull. Still no new trace.
- 292 row_grow · b292 · site.css + 9 session pages + favorites.html — a new highlight opens instead
  of appearing, and the favourites header loses its clock.
  name_under: on favourites the timeline comes first and the session name sits beneath it. The name
  answers "what am I listening to", which is a question you ask about something already playing, so
  it reads as a caption under the bar rather than a heading over it. The clock — 0:00 / --:-- — is
  gone entirely: on a page of favourites every row is a moment somebody chose, not a position to be
  measured. Its two elements went with it, and the timeupdate handler that wrote into them, so
  nothing is left addressing an element that is not there.
  row_grow: the new row animates from nothing to its full height over half a second, with a fade and
  a six-pixel rise so the arrival has a direction.
  Two things about it are worth keeping written down. First, it cannot be "animate anything newly
  inserted": render_tags rebuilds the list's whole innerHTML on every render, so every row would
  open every time. add_tag already finds the one row it just made in order to focus its title —
  that same loop marks it, and the mark takes itself off at the end.
  Second, height is animated in PIXELS off the row's measured height, because a height of auto
  cannot be animated from zero. And height:0 alone was not enough: the first cut opened from 14px,
  because the row's own padding is still standing when its height is nothing. The padding has to
  collapse in the same transition. Measured: 0px at the start, 31 at 125ms, 48 at 250, 55 at 500,
  and the class, the transition and every inline style cleared afterwards so the row goes back to
  being an ordinary row.
  A prefers-reduced-motion block turns it off: someone who has asked the system for less movement
  gets the row immediately and no opinion about it.
  The animation lives in site.css and the marking in each page, so the nine pages carry three lines
  of intent each rather than a copy of the keyframes.
  cache_bump: drawer.js 142 → 143, site.css 4 → 5. New suite vj_292 measures the growth frame by
  frame and checks the favourites header order and the absent clock. Still no new trace.
- 293 edit_wide · b293 · site.css — while you are typing a highlight's title, the field takes the
  whole row.
  Everything AFTER the field steps out of the way while it has focus: the timestamp, the end
  controls, the heart, the share, the remove. They are things you do to a highlight you have
  finished naming, and with the keyboard up they were spending the width the words needed. The
  number and the play button stay put, deliberately — hiding those too would shift the text
  sideways at the moment you start typing, which is exactly when you are looking at it.
  Measured on a 390px phone: the field goes 123px to 267px of a 358px row and ends 12px from the
  right edge, which is the row's own padding — the "just shy" is not a number I picked, it is the
  row's existing gutter. Everything restores exactly on blur.
  Two small choices in the selector. :focus-within rather than :has(), which is newer than this
  needs to be. And :not(:focus) on the hidden siblings, so a control that itself has focus is never
  the thing that vanishes out from under it — on a phone nothing tabs, but the rule should not have
  a state where focus lands on something it then removes.
  One rule in site.css covers all nine pages, because .tag_label and the row are the same shape
  everywhere. site.css 5 → 6. New suite vj_293 measures the field before, during and after.
  Still no new trace.
- 294 edit_wide_fav · b294 · site.css — edit_wide on the favourites rows too.
  Same idea, one difference that matters in the selector: on a favourite the field is wrapped in
  .fav_main rather than being a direct child of the row, so the sibling run has to start from the
  WRAPPER, not from the field. The controls that step aside are the cassette, the share and the
  heart — again all things you do to a favourite you have finished naming.
  Measured on a 390px phone: 167px to 295px of a 358px row, ending 10px from the edge, which is the
  fav row's own padding (the session row's is 12px — each keeps its own gutter rather than being
  given a shared number). Restores exactly on blur.
  reorder mode cannot collide with it: in that mode the field is readOnly and nothing in the row
  takes pointer events, so it can never be focused there. Checked rather than assumed.
  site.css 6 → 7. New suite vj_294. Still no new trace.
- 295 edit_plain · b295 · 9 session pages — a highlight's title now edits the way a favourite's
  does: no box, just a line.
  It used to take a white ground and a 1px inset ring on focus. That is a CONTROL appearing around
  text that was already there, and next to the favourites row — where the same act is a line under
  the words — it read as two different kinds of editing in one app. It is one dashed underline now,
  transparent until you are in it.
  The underline is on BOTH states, transparent then coloured, so the row does not move by a pixel
  when the line arrives: measured 35px tall before and after. The width still changes, from 123 to
  267, which is edit_wide doing what it was asked to do.
  Compared against the favourites field directly rather than by eye: same background, same absent
  shadow, same 1px dashed rgb(220,220,224), same zero radius. The border-radius went too — a
  rounded corner on a field with no box is a corner on nothing.
  The rule lives in each page's own <style> rather than in site.css, because site.css is linked
  BEFORE the page styles and a page rule wins at equal specificity; overriding from site.css would
  have meant inventing specificity to beat a rule I can simply edit. Nine files, one script, the
  same replacement in each.
  New suite vj_295 renders both pages and compares the two fields property by property.
  Still no new trace.
- 296 audio_live · b301 · the three re-encoded sessions now play the light cut, with a hi-fi word to
  swap, and the file that was playing yesterday left in place underneath as the fallback.
  audio.lite and audio.hifi join audio.url in the session JSON. url is deliberately NOT replaced:
  R2 answers nothing from the sandbox, nothing from his Mac's shell, and his Chrome takes
  open_url but refuses execute_javascript — so the six filenames could not be checked against
  anything before shipping. Rather than point the site at URLs I had not seen resolve, the player
  falls back to url once on a media error and hides the pill. Worst case is the old big file.
  grade_pill is the word "hi-fi" at the right end of .time_row, absolutely positioned so the clock
  stays centred; dim on the light file, accent when lit, hidden outright when the session has only
  one file. The swap reads currentTime, sets src, seeks back on loadedmetadata and resumes only if
  it was playing. localStorage vampjam_hifi remembers it.
  one_size caught it a FOURTH time in the making: the pill is a button, and 17px !important beats a
  bare class every time. site.css now excludes .grade_pill and every page moved to v=8.
  The trap that mattered more: save_data_to_repo serialised the live audio object, so any tag edit
  would have written the renditions back — or, with an absent key, dropped them. audio_out builds
  the payload by hand from label/url/kind plus whichever renditions exist, and the suite adds a tag
  and reads the worker POST body to prove all three survive.
  New suite audio_grade_test.js: 18 assertions across default, swap, stickiness, fallback,
  round-trip and the one-file case. Two harness lessons in it — headless chromium has no AAC
  decoder (an m4a stub errors code 4 and reads exactly like a product bug), and a route.fulfill
  without a 206 leaves nothing seekable, so every currentTime assignment snaps silently back to 0.
  The cache header was the third thing promised and is NOT done: r2.dev sends no caching
  instruction and has no setting that changes it. It needs a custom domain on the bucket plus one
  Cache Rule. Said so on do_this_next rather than quietly dropping it, with the honest note that
  iOS Safari evicts audio anyway.
  Still no new trace.
- 297 logo_line · b302 · the wordmark moved up onto the same line as the two controls, so the
  header reads cassette · vampSF · share instead of a band of icons with the logo underneath.
  .brand became a flex row with align-items:center. The pair stopped being position:absolute and
  became ordinary flex items; the wordmark takes flex:1 and centres inside it, which puts it on the
  page's true centre line rather than the centre of what is left over.
  The markup in all nine pages puts both buttons BEFORE the wordmark, so the row is ordered in CSS
  (order 1/2/3) rather than by moving a button in nine files.
  nav_room is retired: .brand's padding-top was max(46px, safe-area + 40px) to hold a band open
  above the logo. It only needs to clear the notch now, which gives about 46px back at the top of
  every page.
  record.html is the one header with a cassette and no share; :not(:has(.nav_share)) gives its
  wordmark a 40px right margin so it still lands on centre.
  New suite logo_line_test.js: 30 assertions — one row, correct order with no overlap, centred to
  within 3px, both icons still the topmost element at their own centre, no sideways scroll — across
  phone, landscape and desktop on both pages.
  site.css v=9 on 14 pages.
  Still no new trace.
- 298 time_flip · b304 · the two sides of the timeline swapped: the hour marks and their 1h / 2h
  numbers read above the line, the highlight numbers below it.
  .hour_mark used to poke 5px up and 20px down to make room for a number hanging beneath; it now
  pokes 20px up and 5px down, and .hour_lbl anchors bottom: calc(100% + 6px) instead of top.
  The tag_numbers strip moved in the markup from before the seek bar to just after it, and took
  tag_markers' 90% box so each number lands under its own dot. (The dots themselves are still
  display:none from circle_gone — the strip is a spacer — but if they ever return the numbers are
  already in register with them. Its comment said "the numbers above the bar"; corrected.)
  The bar carries the clearance the labels need, margin-top 32px: they overflow upward now and
  there is nothing else above them to make the room. Measured 9px clear of the Tag button.
  Three things taken back in the same breath, all of them loudness:
  haze_off — Tag the moment loses its coloured glow, its vertical gradient and its inset white
  highlight; flat accent, and the press is still a squeeze. The play button's shadow went with it:
  rgba(106,191,105) is green, a leftover from a palette this app no longer has.
  bold_off — the transport circles (-2m … +2m, both the number and its unit) and the running time
  drop from 600 to 400. They are labels, not emphasis.
  New suite time_flip_test.js: 22 assertions on phone and landscape. It needs a 2h20m stub, because
  a shorter one never draws an hour mark and the whole change would go unasserted.
  Still no new trace.
- 299 clock_up · b305 · the clock and the hi-fi word moved from under the whole timeline to the gap
  between Tag the Moment and the line, so the reading order top to bottom is now button, clock,
  hour numbers, line, highlight numbers.
  The hour labels overflow upward into the bar's 32px top margin, and .time_row's own 8px bottom
  margin collapses into it, so the row lands 9px clear of "1h" — the same clearance the button had
  a build ago. No new spacing invented.
  The button is "Tag the Moment" now, in the markup and in the empty-state line that quotes it.
  time_flip_test.js grew by 5 assertions x 2 viewports rather than gaining a near-identical
  sibling file: this is one layout, and a second suite would have been sixty lines of the same
  routing for four facts. 32 assertions.
  Still no new trace.
- 300 grip_only · b306 · row_drag reversed. Only the hamburger starts a drag; the rest of the row is
  inert again.
  This is the second reversal of the same decision and the reasoning is worth keeping, because the
  original argument sounded good: "a grip is a target you have to hit, and on a phone that is a
  thing to miss." What it missed is that a list you are reordering is usually longer than the
  screen, and with the whole row live there is no gesture left for scrolling to the place you are
  dragging TO. A finger put down to scroll picked a row up instead. The small target is the point,
  not a compromise.
  pointerdown, the capture and all three follow-up listeners moved from the row to the grip.
  touch-action:none came OFF the row and stays on the grip alone, so the browser keeps the list's
  scroll and only the grip's own gesture is taken from it. .fav_row * stays pointer-events:none,
  with .fav_grip exempted.
  New suite grip_only_test.js: 13 assertions. The one that matters drags the row BODY a row and a
  half and asserts the order is byte-identical afterwards; the next drags the grip the same
  distance and asserts it moved. Checked the suite against the OLD code before shipping — it fails
  4 of 13 there, including both of those, so it is testing the behaviour and not the wiring.
  Still no new trace.
- 301 rec_calm · b307 · four things around recording, all of them the same idea: say less, and only
  when it is true.
  code_gate — drawer_confirm takes an optional code. Past five minutes the Delete button starts
  disabled and arms only when 8764 is typed; the message also says how long the recording is, which
  is the part that actually stops the mistake. Both delete paths use it (a local recording and a
  cloud session), so the trash button now carries data-dur. It is not security and is not pretended
  to be — the code is in the file, and the person it protects against is the one who was not paying
  attention.
  rec_glow — the REC button was wearing a red halo the whole time, so the halo said nothing. It is
  flat now, and gains the halo only while tape is moving. The old animation was a 1.2s ring that
  expanded and vanished, which reads as urgency; it is a 4.2s in-and-out breath now, which reads as
  running. Reduced-motion gets a steady glow instead of nothing, because the glow is the signal.
  save_calm — 'Uploading…', 'Creating the session…' and the two-line 'Session ready ✓ … saved as
  … · N moments carried over' are gone, replaced by three pulsing dots with no words. Every one of
  those messages was true and not one was his to act on. Words come back only on failure, where
  there IS something to do.
  save_flow — a finished save now goes to the session page. The old ending printed a sentence whose
  only useful part was the link inside it. Back still wins: if he pressed Back mid-recording, it
  finishes and returns to the list as before.
  New suite rec_calm_test.js: 22 assertions — a 4-minute session confirms with no code and an armed
  button, a 50-minute one starts locked, 1234 leaves it locked and 8764 opens it; the button has no
  shadow and no animation idle, and breathes for more than 3s while recording; the dots are three,
  animate, and carry no text.
  drawer.js v=144 on 13 pages.
  Still no new trace.
- 302 tag_quiet · b308 · the record screen's Tag the Moment is now the session pages' button, and
  pressing it no longer opens a keyboard.
  btn_same — record.html carried its own copy of the button, and haze_off only touched the nine
  session pages, so the two had visibly drifted: one flat, one with a gradient and a glow. It is
  the same declarations now, plus the btn_gray specificity re-assert and the :disabled state the
  record screen alone needs. The label matched too — "Tag the Moment".
  tag_quiet — the tap used to blur whatever field you were in and then hand the keyboard straight
  to the new row's name, complete with two scheduled scroll corrections for the keyboard animating
  in. That is backwards. You press this button because something is happening in the room; a
  keyboard covering half the screen with a caret waiting for you to type is the worst possible
  next event. The blur stays and nothing takes focus. Naming is a thing you do afterwards, by
  tapping the row, and an unnamed row now says "tap to name" so it does not read as broken.
  The suite proves the behaviour rather than the source: MediaRecorder and getUserMedia are
  replaced before the page script runs, so REC really starts, Tag really fires, and the assertion
  is `document.querySelector('input:focus')` being null after the tap — twice, the second time
  from inside a row that was being named, which also proves the typed text survives.
  New suite tag_quiet_test.js, 18 assertions, including a property-by-property comparison of the
  two buttons across the two pages. Checked against the old code first: 4 fail there.
  Still no new trace.
- 303 del_leave · b309 · deleting the session you are looking at no longer leaves you standing on the
  corpse.
  The bug was structural, not cosmetic: the delete happens from a list that slides down OVER the
  session page, and the page underneath stays in normal flow. So the moment the row disappeared
  from the list you could swipe the list shut and land on a player with no audio, no moments and a
  title for something that no longer exists — and nothing about that screen said so.
  Two halves. While the delete is in flight the list is PINNED: listPinned makes set_open(false) a
  no-op and toggle() return early, and every close in the file already funnels through those two,
  so the caret, the swipe, the tap-outside and close_then are all covered by one guard rather than
  four. When the write lands, location.replace to the session list; if it fails, unpin and give the
  page back, because the session is still there.
  del_gone is the same hole from the other side: Back, a bookmark or an old link into a session
  this device has already tombstoned now replaces itself with the list on load, instead of
  rendering an empty player.
  New suite del_leave_test.js, 15 assertions across four scenarios — the happy path (with the
  worker write deliberately slowed so the window in which you could swipe back is a real window,
  and all three ways of closing tried inside it), reopening a deleted page directly, deleting a
  session you are NOT on (nothing pins, the list still closes), and a delete that fails (unpins,
  and you can get back down). Ran against the old code first: 5 of 15 fail.
  Harness note worth keeping: these pages navigate out from under the assertions, so every read is
  wrapped — an evaluate racing a teardown throws rather than answering, and waitForURL is not
  reliable across it. Poll p.url() instead.
  drawer.js v=145 on 13 pages.
  Still no new trace.
- 304 list_home · b310 · the fix for del_leave was half a fix, and the missing half was a redirect
  loop. Measured: 914 navigations in about twelve seconds.
  index.html was one line of logic — open the session you were last on, else the newest — and
  del_leave sent the deleted page straight into it. index reopened the session that had just been
  deleted; del_gone bounced it back to index; index reopened it. Neither side was wrong on its own.
  Three changes, smallest first.
  last_drop — tombstoning a page now also clears vampjam_last_session if that is what it pointed
  at, and the page stops recording itself as "last" once it is tombstoned. That alone breaks the
  loop.
  index_pick — index consults the tombstones for BOTH the remembered page and the fallback, and
  looks at this device's own roster as well as the static list, so a recording made ten seconds ago
  still counts before the shared registry has caught up.
  list_home — and the real gap he named: there was no screen that is just the list. Every page is a
  session with the list sliding over it, so with nothing left to be underneath there was nowhere to
  land. index now only redirects when it has somewhere real to go; otherwise it stops being a
  redirect and becomes the list itself — drawer open, pinned (nothing is under it), with a line
  saying there are no sessions yet and a Record button.
  New suite list_home_test.js, 16 assertions: the loop itself (counting main-frame navigations —
  914 against the old code, under 8 now), the empty home and its pin, a first visit with sessions
  present still opening one, and a tombstoned "last" being skipped rather than obeyed. sessions.js
  is stubbed per scenario, because it is the STATIC list of eight hand-built pages and a test about
  "nothing left" has to empty that too — otherwise the app is quite right to open 2026_08_14.
  Still no new trace.
- 305 rec_match · b311 · the record screen and the session screen are the same screen with different
  verbs. Measured band by band, they now land on the same lines: control row 148, Tag the Moment
  232, clock 304, timeline 361, moment numbers 373, list 411. Before this they agreed on none of
  them.
  rec_size — the REC circle was 92px against play's 84, and had no phone or landscape rule at all,
  so it changed size relative to play as the screen changed. Same three sizes now: 84 / 70 / 68.
  rec_order — the record page put the bar above the button and the numbers above the bar. It is the
  session order now: button, clock, line, numbers under it. The hour marks flipped with it, the way
  time_flip did on the session pages.
  name_match — the title was 500 weight and muted; the session's h1 is 600 and full contrast. Same
  box too (33px, margin 14/4) so the row below starts where it does over there.
  stack_match — the biggest single cause of the drift: .stage is a flex column with gap:16px, and
  the session stack is block flow whose spacing is each element's own margin. The gap added to
  every margin. Gap is 0 now and the margins do the work — and one leftover from that difference is
  worth remembering: MARGINS DO NOT COLLAPSE BETWEEN FLEX ITEMS, so the button's 2px top margin
  added here where it vanishes there. Two pixels, and everything below it moved.
  row_match — .mom_list / .mom_row are .tag_list / .tag_row: same panel, radius, inset shadow, 12px
  gutter, 55px row, 5px gap, and the same adjacent-sibling hairline. The row keeps only the control
  that pertains while you are still recording — mom_drop, the X, which removes the tag, renumbers
  the rows and redraws the bar. No play, no heart, no share: there is nothing to play yet.
  list_tight and marker_gone — his "extra gap at the bottom, or the last row is taller". Two
  things: .tag_list carried 20px of padding under the last row plus 24px of margin, and .tag_markers
  sat above the list as 22px of empty strip (its dots have been display:none since circle_gone). 44
  + 22 = 66px of nothing. The padding is gone, the margin is 12, and the marker strip is height 0
  but still in the DOM, because render_tag_markers is the main render entry point and writes into
  it.
  New suite rec_match_test.js, 28 assertions: eleven bands compared across the two live pages
  within 2px, the row and panel compared property by property, the title compared, and the delete
  exercised end to end (row goes, numbers renumber, the bar's number goes with it). The record page
  runs against a stubbed MediaRecorder so it is genuinely mid-take while being measured.
  Re-ran time_flip (32), audio_grade (18), tag_quiet (18) and rec_calm (22): all still green.
  Still no new trace.
- 306 fav_match · b312 · favourites gets the same header band as the other two screens, and the six
  seek circles it never had.
  Measured: title 99, control row 148-218, play circle 70 on a phone — the same numbers the session
  and record pages now hit. Below that the two diverge honestly: favourites has no Tag button and
  no clock, so its bar sits where those would have been.
  fav_nudge — the circles are real here, not the inert placeholders the record screen carries. They
  move the playing favourite and are clamped at both ends, so +2m three seconds from the end lands
  on the end. With nothing loaded they do nothing rather than starting something: the play button
  is what starts, and a seek button that also started would be two controls in one.
  The play button keeps its own class (.fav_play) — the page's JS knows it by that name and so does
  the one_size exclusion list — and takes the play button's size, 84 / 70, losing its shadow the way
  the others did.
  Two things found on the way. The page's @media (max-width: 480px) block sits ABOVE the base
  rules, so at equal specificity the base rule won and the circles never shrank — the phone rules
  needed element selectors to get past their own file order; the row overflowed 390px until they
  did. And .sticky_player had three rules in this file for an element the page has never had:
  removed, with the 12px it would have contributed handed to the control row, which is where the
  comment now explains it.
  list_tight here too: 14px of padding under the last row plus 24px of margin.
  New suite fav_match_test.js, 23 assertions — the bands compared against the live session page,
  the circles compared property by property, and the seeking exercised for real: -15s, +5s, and
  the clamp at both ends. Re-ran grip_only (13), rec_match (28) and time_flip (32): green.
  Still no new trace.
- 307 icon_snug · b313 · the controls at the right end of a highlight row sit 20% closer, and REC is
  back on the centre line.
  rec_centre — my own regression from rec_match, and he caught it in one look. The session page's
  phone rule is justify-content: space-between, which spreads its SEVEN children to the timeline's
  edges. I copied that rule to the record page, where six of the seven are display:none — so
  space-between put the only visible child at the start and REC sat hard left. One visible child
  means centre.
  icon_snug — done with a negative margin on the second and subsequent controls, not with less
  padding: the glyphs move, the tap targets keep their full width. Session: 19px between drawings,
  -4px, now 15. Favourites: 15 and 16, -3px, now 12 and 13.
  The measurement is the lesson. I first sized the favourites pull off the buttons' padding and got
  -4, which overshot to 27%: padding is the wrong proxy there, because the cassette link has no
  padding at all and centres a 24px svg inside a 34px box by flex, while the heart's glyph is
  smaller than its content box. Measuring drawing-edge to drawing-edge — the svg's own rect — gives
  a number that means the same thing on both pages, and the suite measures it that way.
  The assertions are ratios, not remembered pixel counts: the pull is a negative margin, so
  before = after + |margin| and after/before must be 0.8, which pins the margin at a fifth of the
  original spacing without hard-coding anything measured once by hand.
  New suite icon_snug_test.js, 12 assertions, including that the tap targets did not shrink and
  that the row's padding is untouched. Re-ran fav_match (23), rec_match (28), grip_only (13) and
  time_flip (32): green.
  Still no new trace.
- 308 list_title · b314 · the session drawer's heading is "Recordings" now, and centred.
  The word: every row under it is something that was recorded, and the act is called Record on the
  button that makes them, so Sessions was the one place the app used a different noun for the same
  thing. The cassette button in the corner keeps its "Sessions" aria-label — that is the name of
  where you are going, not of the list.
  The centring took two declarations, not one: .jam_item is a flex row, so justify-content centres
  the flex item, and the name inside it needed flex: 0 1 auto and its own text-align — left as
  flex: 1 it would fill the row and centre nothing.
  New suite list_title_test.js, 22 assertions across the four pages that carry the drawer, each one
  opening the list for real. It also asserts the ROWS below did not move — a centring rule scoped
  one level too high would have taken them with it, and that is the way this change fails.
  drawer.js v=146 on 14 pages.
  Still no new trace.
- NEXT → add entry 309 here (codename · bN · change) — every prompt that edits the page, no exceptions.

## update_protocol (read every prompt)

1. Write the batch codename to `vampjam_admin/commit_msg.txt` line 1 FIRST, then edit files.
   Do NOT `git commit`/`push` from the sandbox — the robot ships (commit + ssh push, ~15-30s).
2. On any page edit: bump `bN` in the page AND `vampjam_org_build.js`; set the header stamp to now.
3. Append the build_history entry ABOVE the NEXT marker, then rewrite the marker with the next number.
4. Before appending, CHECK: last spec build id == page build id, and last spec entry ≈ last prompt_log
   entry. If drifted, backfill first and say so in chat — never repair silently.
5. Add the prompt_log entry (newest on top, only newest expanded; cp lab_data → data).

## pickup_note

- ONE thread owns this page at a time; a second must read this spec, claim the next build_history
  and prompt_log numbers, then work.
- The page's section 6 self_admin has a [copy first message] button with the kickoff payload.
- This file's numbers may age; the page's live `#next` markers never lie — trust them.

## page_notes (moved off the page, v4 60-second rule)

- worker_file: `cloudflare/r2_upload_worker.js` (upload) · `worker/vampjam_worker.js` (sync, CORS
  now includes vampsf origins — deployed copy lags until sync_cors ships).
- bucket: R2 `vampjam-audio` · public base `https://pub-33cfd8558d314eb58642c8550608850b.r2.dev`.
- format_caveat: record on iPhone/Safari (.m4a); Chrome records .webm which iOS can't play.
- secret_note: UPLOAD_SECRET lives in client JS — a light gate, not real security.
- interface_history (all #done, 71): list_order, session_row_format, durations, index_latest,
  new_recording_row.
- ns_cloudflare (84): zone vampsf.com on Cloudflare free plan; zone records rebuilt DNS-only
  (imported copy had parking values — the switch-would-break-it trap); NS target
  drake/simone.ns.cloudflare.com; NetSol keeps registrar role. Rollback: revert NS to
  NS1/NS2.WORLDNIC.COM (worldnic records still hold the GitHub values).
- domain_history (79): NetSol forwarding = $12.99/yr paywall, skipped; @ A → 185.199.108/.109/
  .110/.111.153, www CNAME → mpulsemedia.github.io (old parking value both rows: 208.91.197.27,
  for rollback); repo CNAME = vampsf.com; bazaar_01_17 + audit_audio audio work logged in 64-76.

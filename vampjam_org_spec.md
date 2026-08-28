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
- NEXT → add entry 244 here (codename · bN · change) — every prompt that edits the page, no exceptions.

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

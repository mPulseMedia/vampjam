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
- NEXT → add entry 164 here (codename · bN · change) — every prompt that edits the page, no exceptions.

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

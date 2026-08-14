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
- NEXT → add entry 86 here (codename · bN · change) — every prompt that edits the page, no exceptions.

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

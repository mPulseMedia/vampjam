// prompt_log_lab_data.js — primary data for the vampjam prompt log.
// Structure: window.prompt_log_data = [ thread ]; thread = { thread, expanded, entries:[ entry ] };
// entry = { id, expanded, nodes:[ node ] }; node = { text, children:[ node ] }.
// Most recent thread on top; most recent entry on top; only newest entry expanded.

window.prompt_log_data = [
  {
    thread: "vampjam_pickup — 2026-06-16",
    expanded: true,
    entries: [
      {
        id: "06 session_page_create",
        expanded: true,
        nodes: [
          { text: "06 session_page_create", children: [
            { text: "prompt_restate", children: [
              { text: "Release asset URL supplied for 2026-07-17 Sound Union." },
              { text: "Build the new session_page." }
            ]},
            { text: "verbatim", children: [
              { text: "https://github.com/mPulseMedia/vampjam/releases/download/2026-07-17_vampjam_su/SoundUnion.Vamp.Jam.2026-07-17.mp3" }
            ]},
            { text: "decision_tag_empty", children: [
              { text: "Paul chose empty tag list; tag live in player." }
            ]},
            { text: "result_file_new", children: [
              { text: "2026_07_17_sound_union.json — audio + tags:[]." },
              { text: "2026_07_17_sound_union.html — clone of 05_30 page." },
              { text: "PAGE_ID = sound_union_2026_07_17." }
            ]},
            { text: "result_file_edit", children: [
              { text: "index.html — new card on top; 05_30 loses 'latest'." },
              { text: "Both prior session_page get nav link." }
            ]},
            { text: "result_verify", children: [
              { text: "json parses; tags 0." },
              { text: "No stale 05_30 identity in new page." },
              { text: "No hardcoded audio url — page reads json." },
              { text: "auto_push already committed (head 81e3288)." }
            ]},
            { text: "result_open", children: [
              { text: "Release title says m4a_upload but asset is mp3 — cosmetic." },
              { text: "Local branch diverged 8 vs 14 from origin; Mac reconciles." },
              { text: "Audio playback unverified until Paul opens the page." }
            ]},
            { text: "codename_list", children: [
              { text: "session_page_create, sound_union_2026_07_17, decision_tag_empty" }
            ]}
          ]}
        ]
      },
      {
        id: "05 audio_upload_release",
        expanded: false,
        nodes: [
          { text: "05 audio_upload_release", children: [
            { text: "prompt_restate", children: [
              { text: "New recording exists." },
              { text: "How to get audio onto GitHub so a new session_page can be built." }
            ]},
            { text: "verbatim", children: [
              { text: "I have a new recording. How do I get it to github so you cna make a new page?" }
            ]},
            { text: "result_why_release", children: [
              { text: "m4a is gitignored; repo limit 100 MB." },
              { text: "release_asset limit 2 GB — the established path." },
              { text: "Both existing sessions use releases/download/{tag}/{file}." }
            ]},
            { text: "result_route_gh_cli", children: [
              { text: "gh release create {tag} {file} on the Mac." },
              { text: "One command; recommended." }
            ]},
            { text: "result_route_web", children: [
              { text: "github.com/mPulseMedia/vampjam/releases/new." },
              { text: "Set tag, drag file, publish." }
            ]},
            { text: "result_naming", children: [
              { text: "Rename file to snake_case first." },
              { text: "GitHub converts spaces to dots in asset URL." },
              { text: "release_tag pattern: {venue}_{yyyy_mm_dd}." }
            ]},
            { text: "result_limit", children: [
              { text: "Claude cannot upload: no GitHub credential in sandbox." },
              { text: "Paul runs the upload; Claude builds page from URL." }
            ]},
            { text: "result_need_next", children: [
              { text: "venue, date, release asset URL, tag or setlist source." }
            ]},
            { text: "codename_list", children: [
              { text: "audio_upload_release, release_asset, release_tag, route_gh_cli, route_web" }
            ]}
          ]}
        ]
      },
      {
        id: "04 study_up_continue",
        expanded: false,
        nodes: [
          { text: "04 study_up_continue", children: [
            { text: "prompt_restate", children: [
              { text: "Continue the vampjam session." },
              { text: "Re-study current state before new work." }
            ]},
            { text: "verbatim", children: [
              { text: "let's continue here, so study up." }
            ]},
            { text: "result_state_confirm", children: [
              { text: "Read mount: index, two session_page, vampjam_player, worker, auto_push, prompt_log." },
              { text: "Architecture matches prior log entries 01 and 03; no drift found." }
            ]},
            { text: "result_repo_state", children: [
              { text: "git head 72a633f auto_commit; recent history is auto_commit + tag edits." }
            ]},
            { text: "result_ready", children: [
              { text: "Caught up and ready." },
              { text: "codename_list: study_up_continue, result_state_confirm" }
            ]},
            { text: "open_question", children: [
              { text: "What do you want to work on next?" }
            ]}
          ]}
        ]
      },
      {
        id: "03 architecture_summary",
        expanded: false,
        nodes: [
          { text: "03 architecture_summary", children: [
            { text: "prompt_restate", children: [
              { text: "Summarize the vampjam architecture (and show fenced format)." }
            ]},
            { text: "verbatim", children: [
              { text: "show me how you respond: summarize rthe architechture." }
            ]},
            { text: "result_architecture", children: [
              { text: "layer_page", children: [
                { text: "index.html — landing; sessions + tools." },
                { text: "session_page — self-contained player per session." },
                { text: "vampjam_player.html — general player." }
              ]},
              { text: "layer_data", children: [
                { text: "{session}.json = {audio,tags}." },
                { text: "tag = {id, t(seconds), label}." },
                { text: "sources/ + tags/ hold per-session json." }
              ]},
              { text: "layer_audio", children: [
                { text: "GitHub release assets; m4a gitignored." }
              ]},
              { text: "layer_sync", children: [
                { text: "session_page → Cloudflare Worker → GitHub." },
                { text: "vampjam_player.html → jsonblob rooms or local." }
              ]},
              { text: "layer_automation", children: [
                { text: "auto_push_vampjam.sh + launchd plist every 60s." }
              ]},
              { text: "flow_end_to_end", children: [
                { text: "Tag → Worker writes json → Pages serves → devices read." }
              ]}
            ]},
            { text: "codename_list", children: [
              { text: "layer_page, layer_data, layer_audio, layer_sync, layer_automation, flow_end_to_end" }
            ]}
          ]}
        ]
      },
      {
        id: "02 render_block",
        expanded: false,
        nodes: [
          { text: "02 render_block", children: [
            { text: "prompt_restate", children: [
              { text: "Outline response was not in a code block, so indents didn't show." },
              { text: "Asked what to do to make outline always render with indents." }
            ]},
            { text: "verbatim", children: [
              { text: "OK. you didn't put your outline response within a codeblock so I dont see how the indents. What MUST I DO TO MAKE YOU ALWAYS DO IT -- except for the rare exceptions when there is a portion that is decidedly NOT in the outline format?" }
            ]},
            { text: "result_answer", children: [
              { text: "Add a render_block rule to claude_cowork_instruction_global (proposed as 3J)." },
              { text: "Cause: no existing rule said to fence; markdown collapses leading spaces." },
              { text: "Cannot persist edits to global CLAUDE.md from here (read-only cache); user pastes it in." }
            ]},
            { text: "result_decision", children: [
              { text: "Mixed response: fence each outline portion as makes sense; use outline whenever appropriate; prose/code stay unfenced." },
              { text: "Prompt log shown in chat: not fenced — prompt_log.html already renders indents." }
            ]},
            { text: "codename_list", children: [
              { text: "render_block, fence_outline" }
            ]}
          ]}
        ]
      },
      {
        id: "01 study_up",
        expanded: false,
        nodes: [
          { text: "01 study_up", children: [
            { text: "prompt_restate", children: [
              { text: "Pick up the vampjam project from current state." },
              { text: "Study the codebase and report understanding." }
            ]},
            { text: "verbatim", children: [
              { text: "I'll pick up vampjam from here. study up." }
            ]},
            { text: "result_what_is", children: [
              { text: "vampjam = web app to tag moments in long jam-session audio recordings and share highlights with a band." },
              { text: "Brand: 'vamp jam', Sacramento font, dark amber theme; tagline 'tag the moments that matter'." }
            ]},
            { text: "result_architecture", children: [
              { text: "index.html — landing page; lists jam sessions + tools." },
              { text: "session_page — one self-contained player per session, bound to one audio + tag set, synced to GitHub via Cloudflare Worker.", children: [
                { text: "2026_05_23_bazaar_cafe.html" },
                { text: "2026_05_30_sound_union.html" }
              ]},
              { text: "vampjam_player.html — general player; load any audio, waveform, tagging, highlight share; shared rooms via jsonblob.com or local." },
              { text: "worker/vampjam_worker.js — Cloudflare Worker proxies *.json writes to repo mPulseMedia/vampjam via GitHub contents API, so devices need no PAT.", children: [
                { text: "WORKER_URL = https://vampjam-sync.crimson-dust-a18d.workers.dev/" },
                { text: "Mild barriers: ALLOWED_ORIGINS + PATH_RE (^[A-Za-z0-9_-]+\\.json$)." }
              ]},
              { text: "auto_push_vampjam.sh + com.pauldsmith.autopush.vampjam.plist — launchd job every 60s on the Mac; auto-commit/push; reads commit_msg.txt." }
            ]},
            { text: "result_data_model", children: [
              { text: "{session}.json at root = { audio:{label,url,kind}, tags:[ {id,t,label} ] }." },
              { text: "tag = { id, t (seconds), label }." },
              { text: "sources/ holds per-session audio source json; tags/ holds per-session tag json." },
              { text: "Audio: GitHub release assets (m4a gitignored — too big for repo)." }
            ]},
            { text: "result_sessions", children: [
              { text: "bazaar_cafe 2026-05-23 — ~33 photo-synced tags (IMG_xxxx)." },
              { text: "sound_union 2026-05-30 — 10 song tags." }
            ]},
            { text: "result_repo_state", children: [
              { text: "Local mount behind origin/main by 14 commits; auto-push reconciles on the Mac." }
            ]},
            { text: "result_codename_list", children: [
              { text: "vampjam_pickup, study_up, session_page, vampjam_worker, auto_push" }
            ]},
            { text: "open_question", children: [
              { text: "What do you want to work on next?" }
            ]}
          ]}
        ]
      }
    ]
  }
];

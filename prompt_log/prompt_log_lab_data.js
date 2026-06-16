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
        id: "04 study_up_continue",
        expanded: true,
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

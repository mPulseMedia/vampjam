# Claude_trash_temp

Staging, not deletion. Everything here was checked against the running app and
nothing fetches it. It is parked so you can look before it goes, and every file
is one `git mv` from being back where it was.

## What is in here (33 files)

**29 deletion tombstones** — `2026_08_25_*.json`, `2026_08_26_*.json`,
`2026_08_28_11_0*.json`, `rec_2026_08_25_1219.json`. Each is exactly
`{"deleted": true, "tags": []}`, left behind when a recording was deleted: the
delete flow removes the entry from `sessions_auto.json` and leaves this marker.
None is in the registry, so the drawer never asks for any of them. They were all
your own August test recordings.

*The one thing they still did:* opening `session.html?p=<one of these ids>` used
to fetch the marker and could say "deleted" rather than failing. Nobody holds a
link to a test recording from August 25th, but that is the behaviour that changes.

**1 self-declared-unused sidecar** — `2026_05_30_bazaar_cafe.json`, whose entire
contents are `{"_redirect": "This file is unused. See 2026_05_30_sound_union.json"}`.
Its sibling `2026_05_30_bazaar_cafe.html` stayed at the root, because that one is
a redirect stub that still catches an old link to the session's former name.

**1 orphan recording — LOOK AT THIS ONE** —
`2026_08_28_san_francisco_2_33_49p.json`. Not a tombstone: it holds **five real
tags**, with `audio: null`. It is not in `sessions_auto.json`, so the app cannot
reach it; it looks like a recording whose audio upload never completed. It is
here rather than deleted precisely because it is real data. Restore it if those
tags matter.

**2 `.DS_Store` files** — macOS junk, renamed so they do not collide. They will
regenerate on their own.

## What did NOT come here, and why

Things the *site* does not serve are not the same as things nothing uses:

- `worker/`, `functions/`, `cloudflare/` — deployed code. `functions/upload.js`
  in particular is auto-deployed by Cloudflare Pages from that folder name.
- `sources/`, `tags/` — session pages fetch `sources/<PAGE_ID>.json` at runtime.
- `lab_gestures.json` — the nudge app in lab_repo fetches it by this exact name,
  and the worker's path guard forbids subfolders anyway.
- `auto_push_vampjam.sh`, the plist, `vampjam_admin/`, `prompt_log/` — the
  commit robot and the record. Not used by the app; load-bearing for working on
  it.
- `2026_07_24_sound_union.json`, `2026_07_31_sound_union.json` — a plain
  filename search says nothing references these. It is wrong: session pages build
  their sidecar's name at runtime from `PAGE_ID`. Both are live.

## Restoring

    git mv Claude_trash_temp/<file> .

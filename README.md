# vampjam — what is where

A static site on GitHub Pages, served from this folder's root at vampsf.com.
Because the root IS the served directory, **a file's path here is its URL**, and
that is the constraint every decision below answers to.

## The rule that shapes this folder

**Anything the site serves stays at the root.** Moving a served page changes its
address, and links to these sessions have been handed to people. Tidiness is not
worth a dead link, so the root stays wide and the organising happens around it.

Two mechanisms make that rule harder than it sounds, and both are easy to trip:

- **The worker only writes root-level JSON.** `worker/vampjam_worker.js` guards
  its path with `/^[a-zA-Z0-9_\-]+\.json$/` — no slashes. So every `.json` the
  site or the lab writes back **must** live at the root. That is why the session
  sidecars, the deletion tombstones and `lab_gestures.json` are not in folders.
  Move one and its next write is rejected.
- **The commit robot is addressed absolutely.** `com.pauldsmith.autopush.vampjam.plist`
  hard-codes `/Users/pauldsmith/claude_cowork/vampjam/auto_push_vampjam.sh` and
  watches this folder. The script and the plist stay at the root; moving either
  stops every ship.

## Layout

```
  index.html  admin.html  favorites.html  record.html  session.html
  site.css  theme.js  drawer.js  sessions.js  CNAME        the site itself

  2026_*_bazaar_cafe.html                                  session pages, one per
  2026_*_sound_union.html                                  night. sessions.js is
  2026_*_*.json                                            the manifest; each page
                                                           has a .json sidecar
  2026_08_2*_*.json                                        deletion tombstones —
  rec_*.json                                               {"deleted": true}. inert,
                                                           but root-bound (see above)
  sessions_auto.json                                       WORKER-OWNED. never ship
                                                           this in a batch
  lab_gestures.json                                        the nudge corpus, 10 MB.
                                                           the lab moved to lab_repo
                                                           but its corpus cannot —
                                                           root-bound, and the app
                                                           fetches it by this name
  lab.html                                                 forwarding page. the lab
                                                           left on build 280
  vampjam_org.html  r2_setup.html                          working pages
  vampjam_handoff.md                                       the pickup document

  audio/                  the big local masters. gitignored, never deployed; the
                          site plays from R2 and GitHub releases by absolute URL
  vampjam_admin/          THE record: vampjam_org_spec.md (build history) and
                          prompt_log/ (the data). the ship loop writes here, and
                          commit_msg.txt is what the robot reads
  prompt_log/             the log VIEWER only. its data comes from vampjam_admin
  worker/ functions/ cloudflare/   the Cloudflare worker, the Pages function and
                          the R2 upload worker
  sources/ tags/          per-session source and tag data
  claude_trash/           soft delete. nothing is ever hard-deleted here
  Claude_trash_temp/      staging for things nothing uses — checked, parked, and
                          one `git mv` from coming back. Read its README first
```

## "Unused" is not the same as "not served"

`worker/`, `functions/` and `cloudflare/` are deployed code, not clutter —
Cloudflare Pages auto-deploys anything named `functions/`. `sources/` and `tags/`
are fetched at runtime by a name each session page BUILDS from its `PAGE_ID`, so
no filename search will find a reference to them. The robot, `vampjam_admin/` and
`prompt_log/` are not used by the site at all and are load-bearing for working on
it. Check how a thing is reached before deciding nothing reaches it.

## One record, one copy

`vampjam_admin/` holds the spec and the prompt-log data, and it is the only place
either is written. There used to be a second copy of each at the root, and they
drifted badly: the log viewer showed nothing newer than build 255 while twenty-six
builds landed in the admin copy unseen. The duplicates are in `claude_trash/` and
every reader now points at `vampjam_admin/`.

If you find yourself adding a second copy of the record for convenience, don't.

## Shipping

Write the batch codename to `vampjam_admin/commit_msg.txt` **first**, then edit
files. The launchd agent watches this folder, commits with that message, pushes,
and resets the file to `auto_commit`. Do **not** commit or push by hand — the
Mac owns the `.git` lock and a second writer just fights it.

A build that never lands in this folder is silent: no failed commit, no log line.

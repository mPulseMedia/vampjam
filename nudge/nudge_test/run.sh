#!/bin/sh
# nudge_test — the whole battery, against a local copy of the folder.
#
#   ./run.sh              runs every suite against http://localhost:8901/nudge/nudge.html
#   NUDGE_URL=... ./run.sh   runs it against somewhere else
#   ./run.sh vj_275       runs one suite
#
# It needs playwright and a chromium; PLAYWRIGHT_BROWSERS_PATH is honoured.
# Start a static server over the SITE ROOT (the folder holding nudge/) first:
#   python3 -m http.server 8901
set -e
cd "$(dirname "$0")"
LIST="${*:-vj_256 vj_263 vj_269 vj_271 vj_273 vj_274 vj_275 vj_276}"
for s in $LIST; do
  echo "=== $s"
  node "$s.mjs"
done

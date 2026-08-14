#!/bin/bash
# auto_push_vampjam.sh — commit and push vampjam when files settle
# triggered by launchd WatchPaths; debounces 15s before committing
# note: fetch+merge before push because Worker writes directly to origin

REPO="$HOME/claude_cowork/vampjam"
LOG="/tmp/autopush_vampjam.log"
COMMIT_MSG_FILE="$REPO/vampjam_admin/commit_msg.txt"
SETTLE=15

if [[ ! -d "$REPO/.git" ]]; then
  echo "$(date): ERROR — repo not found at $REPO" >> "$LOG"
  exit 1
fi

cd "$REPO" || exit 1
rm -f "$REPO/.git/index.lock" "$REPO/.git/HEAD.lock"

STATUS1=$(git status --porcelain 2>/dev/null)
if [[ -n "$STATUS1" ]]; then
  sleep $SETTLE

  STATUS2=$(git status --porcelain 2>/dev/null)
  if [[ "$STATUS1" != "$STATUS2" ]]; then
    echo "$(date): still in flux — deferring" >> "$LOG"
    exit 0
  fi

  COMMIT_MSG=""
  if [[ -f "$COMMIT_MSG_FILE" ]]; then
    MSG=$(head -1 "$COMMIT_MSG_FILE" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    [[ -n "$MSG" && "$MSG" != "auto_commit" ]] && COMMIT_MSG="$MSG"
  fi

  git add -A 2>> "$LOG"

  if [[ -z "$COMMIT_MSG" ]]; then
    FILES=$(git diff --cached --name-only 2>/dev/null)
    COUNT=$(echo "$FILES" | grep -c .)
    if [[ $COUNT -eq 1 ]]; then
      COMMIT_MSG=$(basename "$FILES" | sed 's/\.[^.]*$//' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g;s/__*/_/g;s/^_//;s/_$//')
    elif [[ $COUNT -le 3 ]]; then
      COMMIT_MSG=$(echo "$FILES" | while read f; do basename "$f" | sed 's/\.[^.]*$//'; done | tr '\n' '_' | sed 's/_$//')
    else
      DIR=$(echo "$FILES" | head -1 | cut -d'/' -f1)
      COMMIT_MSG="${DIR}_${COUNT}f"
    fi
  fi

  if git commit -m "$COMMIT_MSG" >> "$LOG" 2>&1; then
    echo "$(date): committed — $COMMIT_MSG" >> "$LOG"
    echo "auto_commit" > "$COMMIT_MSG_FILE"
  else
    echo "$(date): commit FAILED" >> "$LOG"
  fi
fi

# Reconcile with origin — Worker writes directly to GitHub
git fetch origin main >> "$LOG" 2>&1
BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null)
if [[ -n "$BEHIND" && "$BEHIND" -gt 0 ]]; then
  if git merge --no-edit origin/main >> "$LOG" 2>&1; then
    echo "$(date): merged origin/main ($BEHIND commits)" >> "$LOG"
  else
    git merge --abort 2>/dev/null
    echo "$(date): merge FAILED — needs manual fix" >> "$LOG"
    exit 1
  fi
fi

UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null)
if [[ -n "$UNPUSHED" ]]; then
  git push origin main >> "$LOG" 2>&1 \
    && echo "$(date): pushed OK" >> "$LOG" \
    || echo "$(date): push FAILED" >> "$LOG"
fi

#!/bin/bash
# auto_push_vampjam.sh — commit and push vampjam when files change
# runs on the Mac every 60s via launchd

REPO="$HOME/claude_cowork/vampjam"
LOG="/tmp/autopush_vampjam.log"
COMMIT_MSG_FILE="$HOME/claude_cowork/commit_msg.txt"

if [[ ! -d "$REPO/.git" ]]; then
  echo "$(date): ERROR — repo not found at $REPO" >> "$LOG"
  exit 1
fi

cd "$REPO" || exit 1

# Clear any stale lock files left by crashed git processes
rm -f "$REPO/.git/index.lock" "$REPO/.git/HEAD.lock"

# Commit anything uncommitted
STATUS=$(git status --porcelain 2>/dev/null)
if [[ -n "$STATUS" ]]; then

  # Read first line of signal file; strip leading/trailing whitespace
  if [[ -f "$COMMIT_MSG_FILE" ]]; then
    COMMIT_MSG=$(head -1 "$COMMIT_MSG_FILE" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  fi
  if [[ -z "$COMMIT_MSG" ]]; then
    COMMIT_MSG="auto_commit"
  fi

  git add -A 2>> "$LOG"
  if git commit -m "$COMMIT_MSG" >> "$LOG" 2>&1; then
    echo "$(date): committed — $COMMIT_MSG" >> "$LOG"
    # Clear the message so next commit gets a fresh one
    echo "auto_commit" > "$COMMIT_MSG_FILE"
  else
    echo "$(date): commit FAILED" >> "$LOG"
  fi
fi

# Push anything unpushed
UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null)
if [[ -n "$UNPUSHED" ]]; then
  if git push origin main >> "$LOG" 2>&1; then
    echo "$(date): pushed OK" >> "$LOG"
  else
    echo "$(date): push FAILED" >> "$LOG"
  fi
fi

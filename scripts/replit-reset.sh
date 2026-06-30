#!/usr/bin/env sh
# Nuclear Replit fix — run even when git pull/merge fails.
# Usage on Replit Shell:
#   curl -fsSL https://raw.githubusercontent.com/gmwhipple/viral-suite-dating/main/scripts/replit-reset.sh | sh
set -e

REPO="https://github.com/gmwhipple/viral-suite-dating.git"
BRANCH="main"
REMOTE="origin"

cd "${REPLIT_WORKSPACE:-$HOME/workspace}" 2>/dev/null || cd "$(pwd)"

echo "[replit-reset] Workspace: $(pwd)"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "[replit-reset] Initializing git and cloning..."
  rm -rf ./* ./.[!.]* 2>/dev/null || true
  git init
  git remote add "$REMOTE" "$REPO"
  git fetch "$REMOTE" "$BRANCH"
  git checkout -B "$BRANCH" "${REMOTE}/${BRANCH}"
else
  echo "[replit-reset] Aborting any stuck merge/rebase..."
  git merge --abort 2>/dev/null || true
  git rebase --abort 2>/dev/null || true

  if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
    git remote add "$REMOTE" "$REPO"
  fi

  echo "[replit-reset] Force-syncing to ${REMOTE}/${BRANCH} (no merge)..."
  git fetch "$REMOTE" "$BRANCH"
  git checkout -B "$BRANCH" "${REMOTE}/${BRANCH}" 2>/dev/null || git reset --hard "${REMOTE}/${BRANCH}"
  git clean -fdx
fi

if [ ! -f "src/app/page.tsx" ]; then
  echo "[replit-reset] ERROR: App still missing after reset."
  exit 1
fi

echo "[replit-reset] Installing dependencies..."
npm install

echo "[replit-reset] Done. Starting dev server..."
exec sh scripts/replit-dev.sh

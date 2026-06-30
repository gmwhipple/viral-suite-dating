#!/usr/bin/env sh
set -e

APP_MARKER="src/app/page.tsx"
REMOTE="${REPLIT_GIT_REMOTE:-origin}"
BRANCH="${REPLIT_GIT_BRANCH:-main}"

is_wrong_template() {
  if [ ! -f "$APP_MARKER" ]; then
    return 0
  fi
  if [ -f "pnpm-workspace.yaml" ]; then
    return 0
  fi
  if grep -q '"name"[[:space:]]*:[[:space:]]*"workspace"' package.json 2>/dev/null; then
    return 0
  fi
  return 1
}

restore_from_git() {
  echo "[replit] Force-syncing from git (${REMOTE}/${BRANCH}) — no merge..."
  git merge --abort 2>/dev/null || true
  git rebase --abort 2>/dev/null || true
  git fetch "$REMOTE" "$BRANCH" 2>/dev/null || git fetch "$REMOTE" 2>/dev/null || true
  git checkout -B "$BRANCH" "${REMOTE}/${BRANCH}" 2>/dev/null || git reset --hard "${REMOTE}/${BRANCH}"
  git clean -fdx
}

if is_wrong_template; then
  echo "[replit] Wrong Replit template detected."

  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "[replit] ERROR: Not a git repo. Run:"
    echo "  curl -fsSL https://raw.githubusercontent.com/gmwhipple/viral-suite-dating/main/scripts/replit-reset.sh | sh"
    exit 1
  fi

  if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
    git remote add "$REMOTE" https://github.com/gmwhipple/viral-suite-dating.git
  fi

  restore_from_git

  if [ ! -f "$APP_MARKER" ]; then
    echo "[replit] ERROR: Restore failed. Run replit-reset.sh (see README)."
    exit 1
  fi

  echo "[replit] Restore complete."
fi

if [ ! -d "node_modules/next" ]; then
  echo "[replit] Installing dependencies..."
  npm install
fi

echo "[replit] Starting on http://0.0.0.0:3000"
exec npx next dev -H 0.0.0.0 -p 3000

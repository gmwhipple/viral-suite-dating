#!/usr/bin/env sh
set -e

APP_MARKER="src/app/page.tsx"
REMOTE="${REPLIT_GIT_REMOTE:-origin}"
BRANCH="${REPLIT_GIT_BRANCH:-main}"

restore_from_git() {
  echo "[replit] Restoring app from git (${REMOTE}/${BRANCH})..."
  git fetch "$REMOTE" "$BRANCH" 2>/dev/null || git fetch "$REMOTE" 2>/dev/null || true
  git checkout -B "$BRANCH" "${REMOTE}/${BRANCH}" 2>/dev/null || git reset --hard "${REMOTE}/${BRANCH}"
}

if [ ! -f "$APP_MARKER" ]; then
  echo "[replit] App source not found (Replit template overwrote the import)."

  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "[replit] ERROR: Not a git repo."
    echo "[replit] Create Repl -> Import from GitHub -> gmwhipple/viral-suite-dating"
    exit 1
  fi

  if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
    echo "[replit] ERROR: Git remote '${REMOTE}' not configured."
    echo "[replit] Run: git remote add origin https://github.com/gmwhipple/viral-suite-dating.git"
    exit 1
  fi

  restore_from_git

  if [ ! -f "$APP_MARKER" ]; then
    echo "[replit] ERROR: Restore failed — ${APP_MARKER} still missing."
    echo "[replit] Re-import from GitHub or run: git reset --hard origin/main"
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

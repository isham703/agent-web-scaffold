#!/bin/bash
# Install git hooks for auto-reindexing (Zoekt + Knowledge RAG)
# Run once per machine: bash scripts/install-hooks.sh

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"

echo "Installing git hooks in $HOOKS_DIR..."

for hook in post-commit post-merge; do
  cat > "$HOOKS_DIR/$hook" << 'HOOK'
#!/bin/bash
# Auto-reindex after commit/merge

REPO_ROOT="$(git rev-parse --show-toplevel)"

# Zoekt: reindex in background (fast, incremental)
if command -v zoekt-git-index &> /dev/null; then
  zoekt-git-index -index ~/.zoekt/index -incremental \
    -branches main "$REPO_ROOT" &>/dev/null &
fi

# Knowledge RAG: reindex if docs changed
CHANGED_FILES="$(git diff-tree --no-commit-id --name-only -r HEAD 2>/dev/null || true)"
if echo "$CHANGED_FILES" | grep -qE '(Documentation/|CLAUDE\.md|CLAUDE\.local\.md)'; then
  if command -v python3 &> /dev/null && [ -f ~/.local/mcp-servers/minimal-server.py ]; then
    PROJECT_ROOT="$REPO_ROOT" python3 ~/.local/mcp-servers/minimal-server.py knowledge --reindex &>/dev/null &
  fi
fi
HOOK
  chmod +x "$HOOKS_DIR/$hook"
  echo "  Installed $hook"
done

echo "Done. Zoekt + Knowledge RAG will auto-reindex on commit/merge."

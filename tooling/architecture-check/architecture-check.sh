#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${1:-.}"
APP_DIR="$(cd "$APP_DIR" && pwd)"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$APP_DIR"
FAILED=0

EXCLUDES=(
  --glob '!node_modules/**'
  --glob '!dist/**'
  --glob '!coverage/**'
  --glob '!src/schemas/directus-schema.ts'
)

echo "Running architecture checks for ${APP_DIR}..."

if [[ -d src/components/ui ]]; then
  echo "❌ App has its own src/components/ui. shadcn components belong in @ld/ui."
  FAILED=1
fi

while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  echo "❌ Directus client imported inside a component:"
  echo "$file"
  FAILED=1
done < <(rg -l "@/lib/directus/client|@directus/sdk" src --glob '*.tsx' "${EXCLUDES[@]}" 2>/dev/null || true)

while IFS= read -r match; do
  [[ -z "$match" ]] && continue
  echo "❌ App imports shadcn primitives directly (use @ld/ui):"
  echo "$match"
  FAILED=1
done < <(rg -n "from ['\"]@base-ui/react" src "${EXCLUDES[@]}" 2>/dev/null || true)

SHARED_DIRS=(
  "src/components"
  "src/hooks"
  "src/config"
  "src/lib"
  "src/schemas"
  "src/stores"
  "src/types"
  "src/utils"
  "src/testing"
)

for dir in "${SHARED_DIRS[@]}"; do
  [[ -d "$dir" ]] || continue
  while IFS= read -r match; do
    [[ -z "$match" ]] && continue
    file="${match%%:*}"
    echo "❌ Shared app code imports a feature or page:"
    echo "$file"
    FAILED=1
  done < <(rg -n "@/features/|@/pages/|from ['\"].*features/|from ['\"].*pages/" "$dir" "${EXCLUDES[@]}" 2>/dev/null || true)
done

if [[ -d src/features ]]; then
  for feature_dir in src/features/*/; do
    [[ -d "$feature_dir" ]] || continue
    feature_name="$(basename "$feature_dir")"
    while IFS= read -r match; do
      [[ -z "$match" ]] && continue
      imported_feature="$(echo "$match" | rg -o "features/[^/'\"]+" | head -n 1 | cut -d/ -f2 || true)"
      if [[ -n "$imported_feature" && "$imported_feature" != "$feature_name" ]]; then
        file="${match%%:*}"
        echo "❌ Feature imports another feature:"
        echo "$file imports features/$imported_feature from features/$feature_name"
        FAILED=1
      fi
    done < <(rg -n "@/features/|from ['\"].*features/" "$feature_dir" "${EXCLUDES[@]}" 2>/dev/null || true)
  done
fi

while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  echo "❌ Query or mutation defined directly in a page:"
  echo "$file"
  FAILED=1
done < <(rg -l "useQuery|useMutation" src/pages --glob '*.tsx' "${EXCLUDES[@]}" 2>/dev/null || true)

while IFS= read -r match; do
  [[ -z "$match" ]] && continue
  echo "❌ Auth tokens must not be written to localStorage:"
  echo "$match"
  FAILED=1
done < <(rg -n "localStorage\.setItem\(['\"][^'\"]*(token|auth|session)" -i src "${EXCLUDES[@]}" 2>/dev/null || true)

if [[ -f "vite.config.ts" ]]; then
  while IFS= read -r match; do
    [[ -z "$match" ]] && continue
    echo "❌ Vite config bypasses createViteConfig:"
    echo "$match"
    FAILED=1
  done < <(rg -n "from ['\"]@tailwindcss/vite['\"]|from ['\"]@vitejs/plugin-react['\"]" vite.config.ts 2>/dev/null || true)
fi

if [[ -d "$REPO_ROOT/packages/ui" ]]; then
  while IFS= read -r match; do
    [[ -z "$match" ]] && continue
    echo "❌ @ld/ui imports forbidden dependency:"
    echo "$match"
    FAILED=1
  done < <(rg -n "@ld/directus|@/features|@tanstack/react-query|zustand|@directus/sdk|react-hook-form" "$REPO_ROOT/packages/ui/src" 2>/dev/null || true)
fi

if [[ -d "$REPO_ROOT/packages/directus" ]]; then
  while IFS= read -r match; do
    [[ -z "$match" ]] && continue
    echo "❌ @ld/directus imports app code or schema:"
    echo "$match"
    FAILED=1
  done < <(rg -n "apps/|directus-schema" "$REPO_ROOT/packages/directus/src" 2>/dev/null || true)
fi

if [[ -d "$REPO_ROOT/packages/utils" ]]; then
  while IFS= read -r match; do
    [[ -z "$match" ]] && continue
    echo "❌ @ld/utils imports React or Directus:"
    echo "$match"
    FAILED=1
  done < <(rg -n "from 'react'|@directus/sdk|@ld/directus" "$REPO_ROOT/packages/utils/src" 2>/dev/null || true)
fi

if [[ -d "$REPO_ROOT/packages/forms/src" ]]; then
  while IFS= read -r match; do
    [[ -z "$match" ]] && continue
    echo "❌ @ld/forms imports forbidden dependency:"
    echo "$match"
    FAILED=1
  done < <(rg -n "@ld/directus|@directus/sdk|zustand|@tanstack/react-query" "$REPO_ROOT/packages/forms/src" 2>/dev/null || true)
fi

while IFS= read -r match; do
  [[ -z "$match" ]] && continue
  echo "❌ Shared package imports from apps:"
  echo "$match"
  FAILED=1
done < <(rg -n "apps/" "$REPO_ROOT/packages" --glob '!**/node_modules/**' --glob '!**/dist/**' 2>/dev/null || true)

while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  lines="$(wc -l < "$file" | tr -d ' ')"
  if [[ "$lines" -gt 500 ]]; then
    echo "❌ File too large:"
    echo "$file has $lines lines"
    FAILED=1
  fi
done < <(find src tests scripts -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.sh' \) \
  ! -path '*/node_modules/*' \
  ! -path '*/dist/*' \
  ! -path '*/coverage/*' \
  ! -path 'src/schemas/directus-schema.ts' 2>/dev/null || true)

if [[ "$FAILED" -ne 0 ]]; then
  echo ""
  echo "Architecture check failed."
  exit 1
fi

echo "Architecture check passed."

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="${1:-$ROOT_DIR}"

INFRA_OUT="$OUT_DIR/infra_dump.txt"
FRONT_OUT="$OUT_DIR/front_dump.txt"

EXCLUDE_DIRS=(
  ".git"
  "node_modules"
  "dist"
  "build"
  ".next"
  ".cache"
  "coverage"
  "tmp"
  "temp"
)

EXCLUDE_FILES=(
  "*.log"
  "*.tmp"
  "*.swp"
  "*.swo"
  "infra_dump.txt"
  "front_dump.txt"
)

is_text_file() {
  local file="$1"
  grep -Iq . "$file"
}

is_excluded_file() {
  local rel_path="$1"
  for pattern in "${EXCLUDE_FILES[@]}"; do
    if [[ "$rel_path" == $pattern ]]; then
      return 0
    fi
  done
  return 1
}

write_dump() {
  local scope_root="$1"
  local out_file="$2"

  mkdir -p "$(dirname "$out_file")"
  : > "$out_file"

  local find_cmd=(find "$scope_root" "(")
  for i in "${!EXCLUDE_DIRS[@]}"; do
    find_cmd+=(-name "${EXCLUDE_DIRS[$i]}")
    if [[ "$i" -lt "$((${#EXCLUDE_DIRS[@]} - 1))" ]]; then
      find_cmd+=(-o)
    fi
  done
  find_cmd+=(")" -prune -o -type f -print0)

  while IFS= read -r -d '' file; do
    local rel_path="${file#$ROOT_DIR/}"

    if is_excluded_file "$rel_path"; then
      continue
    fi

    {
      echo "$rel_path - Content:"
      if is_text_file "$file"; then
        cat "$file"
      else
        echo "[BINARY OR NON-TEXT FILE SKIPPED]"
      fi
      echo
      echo "-----"
      echo
    } >> "$out_file"
  done < <("${find_cmd[@]}" | sort -z)
}

write_dump "$ROOT_DIR/infra" "$INFRA_OUT"
write_dump "$ROOT_DIR/src" "$FRONT_OUT"

# Include key frontend root files
for extra in "$ROOT_DIR/package.json" "$ROOT_DIR/package-lock.json" "$ROOT_DIR/vite.config.js" "$ROOT_DIR/tailwind.config.cjs" "$ROOT_DIR/postcss.config.cjs" "$ROOT_DIR/index.html"; do
  if [[ -f "$extra" ]]; then
    rel_path="${extra#$ROOT_DIR/}"
    if ! is_excluded_file "$rel_path"; then
      {
        echo "$rel_path - Content:"
        if is_text_file "$extra"; then
          cat "$extra"
        else
          echo "[BINARY OR NON-TEXT FILE SKIPPED]"
        fi
        echo
        echo "-----"
        echo
      } >> "$FRONT_OUT"
    fi
  fi
done

echo "Infra dump: $INFRA_OUT"
echo "Front dump: $FRONT_OUT"

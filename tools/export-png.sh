#!/usr/bin/env bash
# 사용법: tools/export-png.sh ep02-image-container/ep02.pptx   -> 같은 폴더 slides/ 에 1080x1920 PNG
set -euo pipefail
pptx="$(realpath "$1")"; dir="$(dirname "$pptx")"; base="$(basename "$pptx" .pptx)"
soffice_py="${PPTX_SKILL_DIR:-/root/.claude/skills/synced/f6ee7985-cd8f-428d-9c5e-3cfcda540de8_7c170e14-302a-467a-a00f-a30ec5ee4acf/pptx}/scripts/office/soffice.py"
tmp="$(mktemp -d)"
python "$soffice_py" --headless --convert-to pdf --outdir "$tmp" "$pptx" >/dev/null 2>&1 || soffice --headless --convert-to pdf --outdir "$tmp" "$pptx" >/dev/null
mkdir -p "$dir/slides"
pdftoppm -png -scale-to-x 1080 -scale-to-y 1920 "$tmp/$base.pdf" "$dir/slides/slide"   # 5.625in x 10in @192dpi = 1080x1920
ls "$dir/slides"

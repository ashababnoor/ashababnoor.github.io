#!/usr/bin/env bash
# Renders resume.html to assets/ahmed-shabab-noor-resume.pdf.
# Override the browser with CHROME=/path/to/chrome
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || { echo "Chrome not found at: $CHROME" >&2; exit 1; }

cd "$(dirname "$0")/.."

OUT="assets/ahmed-shabab-noor-resume.pdf"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$OUT" resume.html 2>/dev/null
echo "$OUT"

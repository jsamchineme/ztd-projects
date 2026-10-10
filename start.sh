#!/usr/bin/env sh
# Serve Mapboard on http://localhost:8080 (change the port with: ./start.sh 3000)
PORT="${1:-8080}"
cd "$(dirname "$0")"
echo "Mapboard is running at http://localhost:$PORT  (press Ctrl+C to stop)"
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT" --bind 127.0.0.1
elif command -v python >/dev/null 2>&1; then
  python -m http.server "$PORT" --bind 127.0.0.1
elif command -v npx >/dev/null 2>&1; then
  npx --yes serve@14.2.4 -l "tcp://127.0.0.1:$PORT" .
else
  echo "Install Python 3 or Node.js, or simply open index.html in your browser." >&2
  exit 1
fi

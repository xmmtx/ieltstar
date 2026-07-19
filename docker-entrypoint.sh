#!/bin/sh
set -e

# Write API_URL to static JS for separate-container compatibility
if [ -n "${API_URL}" ]; then
  echo "window.__API_URL = \"${API_URL}\";" > /app/public/__env.js
  echo "[entrypoint] API_URL set to: ${API_URL}"
else
  # Single-container mode: no API_URL needed, Next.js rewrites handle /api/*
  echo "window.__API_URL = \"\";" > /app/public/__env.js
  echo "[entrypoint] Single-container mode (no API_URL)"
fi

# Start Express backend in background
echo "[entrypoint] Starting Express API on :8080"
cd /app/server && node server.js &

# Start Next.js frontend (blocking)
echo "[entrypoint] Starting Next.js on :3000"
cd /app && exec npm run start

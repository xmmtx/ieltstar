#!/bin/sh
# Write API_URL to a static JS file at container startup
echo "window.__API_URL = \"${API_URL}\";" > /app/public/__env.js
exec npm run start

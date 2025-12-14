#!/bin/bash
set -e

# This script injects environment variables into the built React app at runtime
# Vite expects env vars at build time, but K8s provides them at runtime
# Solution: Replace placeholders in the built JS files

echo "Injecting environment variables into built files..."

# Find the main JS bundle
JS_FILE=$(find /usr/share/nginx/html/assets -name 'index-*.js' 2>/dev/null | head -1)

if [ -z "$JS_FILE" ]; then
    echo "Warning: Could not find main JS bundle. Env vars may not be injected."
    exit 0
fi

echo "Found JS bundle: $JS_FILE"

# Create a temporary env.js file that will be loaded by index.html
cat > /usr/share/nginx/html/env-config.js <<EOF
window.__env = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-/api}",
  VITE_API_KEY: "${VITE_API_KEY:-dev-key}",
  VITE_MEMBER_ID: "${VITE_MEMBER_ID:-}"
};
EOF

echo "Environment variables injected successfully!"
echo "VITE_API_BASE_URL: ${VITE_API_BASE_URL:-/api}"
echo "VITE_MEMBER_ID: ${VITE_MEMBER_ID:-not set}"
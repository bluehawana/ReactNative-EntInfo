#!/bin/bash
set -euo pipefail

ROOT_DIR="${CI_WORKSPACE:-$(pwd)}"
echo "Using workspace: ${ROOT_DIR}"
cd "${ROOT_DIR}"

echo "Node: $(node -v)"
echo "npm: $(npm -v)"

# Keep RNFirebase iOS script deterministic in CI (avoid parent-folder lookup noise).
if [ ! -f firebase.json ]; then
  cat > firebase.json <<'EOF'
{
  "react-native": {}
}
EOF
  echo "Created firebase.json for CI defaults."
fi

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

if [ -f scripts/setup-firebase-config.js ]; then
  node scripts/setup-firebase-config.js
fi

cd ios
pod install

echo "Xcode Cloud post-clone setup complete."

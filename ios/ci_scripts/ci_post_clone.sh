#!/bin/bash
set -euo pipefail

# Navigate to repo root from ci_scripts directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
echo "Using workspace: ${ROOT_DIR}"
cd "${ROOT_DIR}"

# Install Node.js if not available (Xcode Cloud doesn't pre-install it)
if ! command -v node &> /dev/null; then
  echo "Node.js not found, installing via Homebrew..."
  brew install node
fi

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

# Generate Firebase config — allowed to fail if env vars not set (iOS plist optional for CI)
if [ -f scripts/setup-firebase-config.js ]; then
  node scripts/setup-firebase-config.js || echo "Warning: Firebase config generation skipped (env vars not set)"
fi

echo "Running pod install..."
cd ios
pod install --repo-update

echo "Xcode Cloud post-clone setup complete."

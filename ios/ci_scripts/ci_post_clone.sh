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

# Generate Firebase config from env vars
echo "Firebase env check: FIREBASE_IOS_API_KEY=${FIREBASE_IOS_API_KEY:+set} FIREBASE_IOS_APP_ID=${FIREBASE_IOS_APP_ID:+set}"
if [ -f scripts/setup-firebase-config.js ]; then
  node scripts/setup-firebase-config.js || echo "Warning: Firebase config generation skipped"
fi

# Ensure GoogleService-Info.plist exists — create placeholder if script didn't generate it
PLIST_PATH="ios/2watch/GoogleService-Info.plist"
if [ ! -f "${PLIST_PATH}" ]; then
  echo "GoogleService-Info.plist not found — creating placeholder for build"
  cat > "${PLIST_PATH}" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>API_KEY</key><string>${FIREBASE_IOS_API_KEY:-placeholder}</string>
  <key>GCM_SENDER_ID</key><string>${FIREBASE_GCM_SENDER_ID:-placeholder}</string>
  <key>BUNDLE_ID</key><string>com.twowatch.app</string>
  <key>PROJECT_ID</key><string>${FIREBASE_PROJECT_ID:-watch-8f60a}</string>
  <key>STORAGE_BUCKET</key><string>watch-8f60a.firebasestorage.app</string>
  <key>IS_ADS_ENABLED</key><false/>
  <key>IS_ANALYTICS_ENABLED</key><false/>
  <key>IS_APPINVITE_ENABLED</key><true/>
  <key>IS_GCN_ENABLED</key><false/>
  <key>IS_SIGNIN_ENABLED</key><true/>
  <key>GOOGLE_APP_ID</key><string>${FIREBASE_IOS_APP_ID:-placeholder}</string>
  <key>CLIENT_ID</key><string>${FIREBASE_IOS_CLIENT_ID:-placeholder}</string>
</dict>
</plist>
EOF
  echo "Placeholder GoogleService-Info.plist created."
fi

echo "Running pod install..."
cd ios
pod install --repo-update

echo "Xcode Cloud post-clone setup complete."

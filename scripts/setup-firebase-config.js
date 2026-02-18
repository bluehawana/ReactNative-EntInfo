#!/usr/bin/env node

/**
 * Generate Firebase config files from environment variables
 * This keeps API keys out of source control
 */

const fs = require('fs');
const path = require('path');

const IOS_OUTPUT_DIR = path.join(__dirname, '..', 'ios', '2watch');
const ANDROID_OUTPUT_DIR = path.join(__dirname, '..', 'android', 'app');

// Ensure output directories exist
if (!fs.existsSync(IOS_OUTPUT_DIR)) {
  console.error(`iOS directory not found: ${IOS_OUTPUT_DIR}`);
  process.exit(1);
}

// Generate iOS GoogleService-Info.plist
function generateiOSConfig() {
  const clientId = process.env.FIREBASE_IOS_CLIENT_ID;
  const apiKey = process.env.FIREBASE_IOS_API_KEY;
  const googleAppId = process.env.FIREBASE_IOS_APP_ID;
  const gcmSenderId = process.env.FIREBASE_GCM_SENDER_ID;
  const bundleId = process.env.FIREBASE_BUNDLE_ID || 'com.twowatch.app';
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  const databaseUrl = process.env.FIREBASE_DATABASE_URL;

  if (!apiKey || !googleAppId) {
    console.log('⚠️  Skipping iOS config - missing FIREBASE_IOS_API_KEY or FIREBASE_IOS_APP_ID');
    return;
  }

  const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CLIENT_ID</key>
	<string>${clientId}</string>
	<key>REVERSED_CLIENT_ID</key>
	<string>com.googleusercontent.apps.${clientId?.split('.')[0] || ''}</string>
	<key>API_KEY</key>
	<string>${apiKey}</string>
	<key>GCM_SENDER_ID</key>
	<string>${gcmSenderId}</string>
	<key>PLIST_VERSION</key>
	<string>1</string>
	<key>BUNDLE_ID</key>
	<string>${bundleId}</string>
	<key>PROJECT_ID</key>
	<string>${projectId}</string>
	<key>STORAGE_BUCKET</key>
	<string>${storageBucket}</string>
	<key>IS_ADS_ENABLED</key>
	<false/>
	<key>IS_ANALYTICS_ENABLED</key>
	<false/>
	<key>IS_APPINVITE_ENABLED</key>
	<true/>
	<key>IS_GCM_ENABLED</key>
	<true/>
	<key>IS_SIGNIN_ENABLED</key>
	<true/>
	<key>GOOGLE_APP_ID</key>
	<string>${googleAppId}</string>
	<key>DATABASE_URL</key>
	<string>${databaseUrl}</string>
</dict>
</plist>`;

  const outputPath = path.join(IOS_OUTPUT_DIR, 'GoogleService-Info.plist');
  fs.writeFileSync(outputPath, plistContent);
  console.log(`✅ Generated ${outputPath}`);
}

// Generate Android google-services.json
function generateAndroidConfig() {
  const apiKey = process.env.FIREBASE_ANDROID_API_KEY;
  const appId = process.env.FIREBASE_ANDROID_APP_ID;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  const databaseUrl = process.env.FIREBASE_DATABASE_URL;
  const mobileSdkAppId = process.env.FIREBASE_ANDROID_APP_ID;

  if (!apiKey || !appId) {
    console.log('⚠️  Skipping Android config - missing FIREBASE_ANDROID_API_KEY or FIREBASE_ANDROID_APP_ID');
    return;
  }

  const jsonContent = {
    project_info: {
      project_number: process.env.FIREBASE_PROJECT_NUMBER || '',
      project_id: projectId,
      storage_bucket: storageBucket,
      firebase_url: databaseUrl
    },
    client: [{
      client_info: {
        mobilesdk_app_id: mobileSdkAppId,
        android_client_info: {
          package_name: process.env.FIREBASE_ANDROID_PACKAGE || 'com.twowatch.app'
        }
      },
      oauth_client: [
        {
          client_id: process.env.FIREBASE_ANDROID_CLIENT_ID1 || '',
          client_type: 1,
          android_info: {
            package_name: process.env.FIREBASE_ANDROID_PACKAGE || 'com.twowatch.app',
            certificate_hash: process.env.FIREBASE_ANDROID_CERT_HASH || ''
          }
        },
        {
          client_id: process.env.FIREBASE_ANDROID_CLIENT_ID2 || process.env.FIREBASE_IOS_CLIENT_ID || '',
          client_type: 3
        }
      ],
      api_key: [{ current_key: apiKey }],
      services: {
        appinvite_service: {
          other_platform_oauth_client: []
        }
      }
    }],
    configuration_version: '1'
  };

  const outputPath = path.join(ANDROID_OUTPUT_DIR, 'google-services.json');
  fs.writeFileSync(outputPath, JSON.stringify(jsonContent, null, 2));
  console.log(`✅ Generated ${outputPath}`);
}

// Run generation
console.log('🔧 Setting up Firebase configuration files...\n');
generateiOSConfig();
generateAndroidConfig();
console.log('\n✨ Done! Config files generated from environment variables.');

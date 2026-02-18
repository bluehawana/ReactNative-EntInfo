# Google Play Store Submission Checklist for 2watch

## Prerequisites

### Google Play Console Account
- [ ] Google Play Developer account active ($25 one-time fee)
- [ ] Access to Google Play Console: https://play.google.com/console
- [ ] App signing configured

### App Signing

#### App Signing Key (Already configured in your project)
- [ ] `android/app/release.keystore` exists
- [ ] Build using: `./gradlew bundleRelease` in `android/` folder
- [ ] Or use EAS: `eas build --platform android --profile production`

#### Play App Signing (Google Play manages signing)
- [ ] Choose "Play App Signing" during first upload
- [ ] Upload your AAB file: `2watch-release.aab`
- [ ] Google will handle signing from there

---

## Step-by-Step Submission Process

### Step 1: Create App in Play Console
1. Log into [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in:
   - App name: **2watch**
   - Default language: **English**
   - App or game: **App**
   - Free or paid: **Free**
   - Confirm declarations
4. Click "Create app"

### Step 2: Set Up App

#### Dashboard → Set up your app
1. **App access**: Select "All functionality is available without a special access"
   - [ ] Complete

2. **Ads**: Select "No, my app does not contain ads"
   - [ ] Complete

3. **Content ratings**: Complete questionnaire
   - [ ] Open "Start questionnaire"
   - [ ] Email: your-email@domain.com
   - [ ] Select category: **Entertainment**
   - [ ] Answer questions about content:
     - Does your app contain...?
       - Sexual content: **No**
       - Violence: **No** (informational content only)
       - Drugs/Alcohol/Tobacco: **No**
       - Profanity: **No** (text from movie descriptions only)
       - Mature humor: **No**
       - Horror: **No** (poster images may vary)
   - [ ] Result should be: **Teen (Content suitable for ages 13 and older)**

4. **Target audience**:
   - [ ] Select "18 and over only" (recommended for entertainment apps)
   - [ ] Or "13-15" / "16-17" if appropriate
   - [ ] Complete questionnaire

5. **News apps**: Select "No, this is not a news app"
   - [ ] Complete

6. **COVID-19**: Select "Not applicable" or "This app is not a COVID-19 app"
   - [ ] Complete

### Step 3: Set Up Store Listing

#### Store Listing Details

**App Details:**
- App name: **2watch**
- Short description: **Track movies & TV shows, find where to watch**
- Full description: (Copy from STORE_LISTING_ASSETS.md)

**Graphics:**

1. **App Icon** (Required)
   - [ ] Upload: `assets/icon.png` (or adaptive icon)
   - Size: 512 x 512 px
   - Format: PNG or JPEG
   - 32-bit PNG with alpha

2. **Feature Graphic** (Required)
   - [ ] Create: 1024 x 500 px
   - Format: PNG or JPEG
   - No alpha channel
   - Should show app name and key visual
   - Position text away from edges (safe zone is 924 x 400)

3. **Phone Screenshots** (Minimum 2, Maximum 8)
   - [ ] Screenshot 1: Home screen - Trending movies
   - [ ] Screenshot 2: Detail screen - Movie details with streaming links
   - [ ] Screenshot 3: Watchlist screen - Saved content
   - [ ] Screenshot 4: Trending by Region - Regional content
   - Size: 1080x1920 or 1080x2160
   - Format: PNG or JPEG
   - No status bar, no alpha channel

4. **Tablet (7-inch)** (Optional)
   - [ ] 2-8 screenshots if supporting tablets
   - Size: Similar aspect ratio to phone

5. **Tablet (10-inch)** (Optional)
   - [ ] 2-8 screenshots if supporting tablets
   - Size: 1920x1080 or similar

6. **Wear OS / Android TV** (Not applicable currently)

**Store Listing Contact Details:**
- Application website: https://2watch.app (optional)
- Support email: support@2watch.app (required)
- Support phone: (optional)
- Privacy policy: https://2watch.app/privacy (required - you must host this)

**Categorization:**
- Application type: Applications
- Category: Entertainment
- Tags: Add relevant tags (streaming, movies, TV shows, watchlist)

**External Marketing:**
- Marketing opt-out: optional
- User acquisition: optional

### Step 4: Set Up Availability

**Countries/Regions:**
- [ ] Select: Available worldwide (or select specific countries)
- [ ] At least one country must be selected

**Pricing:**
- [ ] Free
- [ ] No in-app products currently

**Device Exclusions:**
- [ ] All devices supported
- [ ] No exclusions needed

### Step 5: Set Up Privacy Policy

**Data Safety:**
1. Go to **App content** → **Data safety**
2. Complete the questionnaire:

**Data Collection and Security**
- [ ] Does your app collect or share any user data?: **No**
- [ ] Is all user data your app collects encrypted in transit?: **Not applicable**
- [ ] Do you provide a way for users to request deletion?: **Not applicable**

**Data Types** (can say "No" to all since data is local)
- [ ] Location data: **No**
- [ ] Personal info: **No**
- [ ] Financial info: **No**
- [ ] Health/fitness: **No**
- [ ] Messages: **No**
- [ ] Photos/videos: **No**
- [ ] Audio files: **No**
- [ ] Files/docs: **No**
- [ ] Calendar: **No**
- [ ] Contacts: **No**
- [ ] App activity: **No**
- [ ] Web browsing: **No**
- [ ] App info/performance: **No**
- [ ] Device IDs: **No**
- [ ] Other: **Optional - diagnostics**

3. Add Privacy Policy URL
   - [ ] URL: https://2watch.app/privacy
   - [ ] Must be accessible and match app behavior

### Step 6: Upload App Bundle

#### Build Upload
1. Go to **Production** → **Create new release**
2. Or start with **Internal testing** → **Create new release** (recommended first)

#### Internal Testing Track (Recommended First)
1. Go to **Testing** → **Internal testing**
2. [ ] Create release
3. [ ] Upload your AAB: `2watch-release.aab`
4. [ ] Review Release notes: "Initial release"
5. [ ] Save changes
6. [ ] Add testers via email or Google Groups
7. [ ] Review release
8. [ ] Start rollout to Internal testing

#### Production Track
1. Go to **Production** → **Create new release**
2. [ ] Upload your AAB: `2watch-release.aab`
3. [ ] Release name: "1.0.0" (auto-populated)
4. [ ] Release notes:
   - Language: English (United States)
   - What's new:
   ```
   Initial release:
   • Discover trending movies and TV shows
   • Explore content by region
   • Track your personal watchlist
   • Find where to watch with direct streaming links
   • Support for Netflix, Disney+, Prime Video, and more
   • Clean, modern dark interface
   ```
   - [ ] Copy to all languages (if supporting international markets)

### Step 7: Complete App Review Requirements

**App Review Information**
1. Go to **Policy** → **App content** → **App access**
2. [ ] If asked: "All functionality is available without special access"

**Testing Instructions** (if needed)
- Login credentials: None required (app doesn't need login)
- Instructions: "Track movies & TV shows, find where to watch"

### Step 8: Review and Publish

#### Pre-launch Report (Automated)
- [ ] Let Google run automated testing
- [ ] Review any warnings or errors
- [ ] Fix issues if any found

#### Review Checklist Before Submitting
1. [ ] All required assets uploaded (icon, screenshots, feature graphic)
2. [ ] Privacy policy URL is valid and accessible
3. [ ] Content rating questionnaire completed
4. [ ] Target audience set
5. [ ] Data safety section completed
6. [ ] App bundle uploaded successfully
7. [ ] Release notes written
8. [ ] Contact details provided
9. [ ] App name, descriptions filled
10. [ ] Category and tags set

#### Submit for Review
1. Go to **Publishing overview**
2. [ ] Review all sections
3. [ ] Click "Send for review"
4. Wait for review (typically 1-3 days for updates, 3-7 days for new apps)

### Step 9: Go Live (After Approval)

When approved:
1. [ ] You'll receive an email notification
2. [ ] Go to **Publishing overview**
3. [ ] Click "Start rollout to Production"
4. [ ] Confirm rollout

---

## Post-Launch Checklist

### Monitoring
- [ ] Monitor crash reports in Play Console
- [ ] Check ratings and reviews
- [ ] Track download statistics
- [ ] Monitor user acquisition

### Updates
- [ ] Plan regular updates
- [ ] Update screenshots with new features
- [ ] Update "What's new" text for each release
- [ ] Maintain privacy policy currency

---

## Quick Reference

**Package Name**: com.twowatch.app
**App Name**: 2watch
**Category**: Entertainment
**Content Rating**: Teen (13+)
**Price**: Free
**Target SDK**: [Check in app.json]

**Required Links**:
- Privacy Policy: https://2watch.app/privacy
- Support Email: support@2watch.app
- Website: https://2watch.app (optional)

**Build Commands**:
```bash
# Using EAS
eas build --platform android --profile production

# Manual build
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## Troubleshooting

### Common Issues

**AAB Upload Errors**
- Check keystore is properly configured
- Ensure versionCode is incremented
- Verify package name matches Play Console

**Content Rating Issues**
- Answer questionnaire honestly
- Entertainment apps are typically "Everyone" or "Teen"
- Reference movie content might trigger "Teen" rating

**Missing Assets**
- Feature graphic is required for production
- At least 2 phone screenshots required
- App icon must be 512x512

**Privacy Policy Issues**
- URL must be accessible
- Must accurately describe data collection
- Must be hosted (not a local file)

### Support
- Google Play Developer Support: https://support.google.com/googleplay/android-developer
- Play Console Help: https://support.google.com/googleplay/android-developer/?hl=en#topic=3459870

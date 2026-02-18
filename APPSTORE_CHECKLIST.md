# App Store Submission Checklist for 2watchhub

## Pre-Submission Checklist

### App Information
- [ ] App Name: 2watchhub ✅ (Set in app.json)
- [ ] Bundle ID: com.twowatch.app ✅ (Configured)
- [ ] Version: 1.0.0 ✅ (Set in app.json)
- [ ] Build Number: 1 ✅ (Increment if rebuilding)
- [ ] Supports iOS: Yes
- [ ] Supports iPad: Yes (already configured: "supportsTablet": true)
- [ ] Supports Apple TV: Yes (already configured: "supportsAppleTv": true)

### App Store Connect Setup

#### 1. Create App Record
- [ ] Log into App Store Connect: https://appstoreconnect.apple.com
- [ ] Go to "My Apps"
- [ ] Click "+" → "New App"
- [ ] Fill in:
  - Platform: iOS
  - Name: 2watchhub
  - Primary Language: English
  - Bundle ID: com.twowatch.app
  - SKU: com.twowatch.app (or any unique identifier)
  - User Access: Limited access or Full access

#### 2. App Information
- [ ] Name: 2watchhub
- [ ] Subtitle: Track movies & discover where to stream
- [ ] Category: Entertainment
- [ ] Secondary Category: Lifestyle (optional)
- [ ] Content Rights: Complete (confirm you have rights to display TMDB data)
- [ ] Age Rating: 12+ (self-assessed)
  - Content: Infrequent/Mild Mature/Suggestive Themes
  - Cartoon or Fantasy Violence: None
  - Sexual Content: Infrequent/Mild (from movie posters/content)
  - Profanity: Rare (from movie descriptions)

#### 3. Pricing and Availability
- [ ] Price: Free
- [ ] Availability: All countries or select regions
- [ ] Pre-orders: Optional
- [ ] Educational discount: No (not needed for free app)

#### 4. App Privacy
- [ ] Privacy Policy URL: https://2watchhub.app/privacy (must be hosted)
- [ ] Data Types:
  - [ ] Contact Info: None collected
  - [ ] Financial Info: None collected
  - [ ] Location: None collected
  - [ ] Sensitive Info: None collected
  - [ ] Diagnostics: Crash data (if enabled)
  - [ ] Usage Data: None collected
  - [ ] Other Data: None collected
- [ ] Data Collection: We do NOT collect data
- [ ] Data Tracking: We do NOT track users

#### 5. Required Assets Upload

##### Screenshots

**iPhone 6.7" Display** (Required - iPhone 16 Pro Max, 14 Pro Max)
- [ ] Screenshot 1: Home screen - Trending movies
- [ ] Screenshot 2: Detail screen - Movie details with streaming links
- [ ] Screenshot 3: Watchlist screen - Saved content
- [ ] Screenshot 4: Trending by Region - Regional content
- [ ] Screenshot 5: Additional feature (search, settings, etc.)
- Format: PNG or JPG
- Size: 1290 x 2796 pixels

**iPhone 6.5" Display** (Required - iPhone 14 Plus, 13 Pro Max)
- [ ] Same screenshots as above
- Size: 1284 x 2778 pixels

**iPhone 6.1" Display** (Required - iPhone 16, 15, 14)
- [ ] Same screenshots as above
- Size: 1179 x 2556 pixels (varies by model)

**iPad Pro** (Required if supporting iPad)
- [ ] Same screenshots adapted for tablet
- Size: 2048 x 2732 (12.9"), 1668 x 2388 (11")

**Apple TV** (Required if supporting tvOS)
- [ ] Screenshot 1: Home screen
- [ ] Screenshot 2: Detail view
- [ ] Control Center screenshot showing input
- Size: 1920 x 1080 or 3840 x 2160

##### App Preview Video (Optional but recommended)
- [ ] 15-30 seconds
- [ ] Shows app functionality
- [ ] Resolution matches screenshot requirements
- [ ] Formats: MOV, MP4, M4V

##### App Icon
- [ ] Uploaded via Archive (generated from build)
- [ ] Must match icon in assets: ./assets/icon.png

### Build Upload

#### 1. Build the App
```bash
# Using EAS Build
eas build --platform ios --profile production

# Or using Xcode
# Open ios/EntInfo.xcworkspace in Xcode
# Select "Any iOS Device" as target
# Product → Archive
```

#### 2. Upload to App Store
- [ ] Build completes successfully
- [ ] Upload via Xcode Organizer OR EAS Submit
- [ ] Wait for processing (usually 10-30 minutes)
- [ ] Build appears in App Store Connect → TestFlight

#### 3. TestFlight Testing (Recommended)
- [ ] Add internal testers (up to 100)
- [ ] Install via TestFlight app
- [ ] Verify all features work
- [ ] Check for crashes
- [ ] Get feedback

### App Review Information

#### 1. Review Details
- [ ] Sign-in information: None (app doesn't require login)
- [ ] Contact Information:
  - First Name, Last Name
  - Email address
  - Phone number
- [ ] Notes for reviewer:
  ```
  This is a movie and TV show tracking app. Users can:
  - Browse trending content via TMDB API
  - Add items to a local watchlist
  - View streaming provider links
  - Share content with friends

  No user account or authentication required.
  App stores data locally on device only.
  Uses TMDB API for content data.
  All streaming links open in respective apps/external browsers.
  ```

#### 2. Attachment (Optional)
- [ ] Screenshots or video demonstrating any complex features
- [ ] Can skip unless reviewer specifically needs guidance

#### 3. App Review Contact
- [ ] Name for contact
- [ ] Email for contact
- [ ] Phone number

### Submission Steps

1. **Complete App Information** (see above)
2. **Upload Screenshots** for all required device sizes
3. **Select Build** from "Build" section in App Store Connect
4. **Add Version Information**:
   - What's New: "Initial release - Discover trending movies and TV shows, track your watchlist, and find where to watch with direct streaming links."
   - Promotional Text (170 chars): "Track movies & TV shows. Find where to watch with direct streaming links."
   - Keywords: movies,tv shows,streaming,watchlist,netflix,disney,prime video,entertainment,trending
   - Description: (see STORE_LISTING_ASSETS.md)
   - Support URL: https://2watchhub.app/support
   - Marketing URL: https://2watchhub.app

5. **Set App Review Information**
6. **Select Pricing**
7. **Submit for Review**
   - Click "Add for Review"
   - Wait for App Store review (typically 24-48 hours, can be up to a week)

### Post-Submission

- [ ] Monitor email for review status
- [ ] Check App Store Connect for review updates
- [ ] If rejected: read rejection reason, fix issues, resubmit
- [ ] If approved: Celebrate! 🎉

### Common Rejection Reasons to Avoid

1. **Missing Privacy Policy** - Ensure privacy policy URL is valid and accessible
2. **Inaccurate Screenshots** - Screenshots must show actual app, not mockups
3. **Broken Links** - All links in app must work
4. **Placeholder Content** - Remove any "Lorem ipsum" or placeholder text
5. **Missing Functionality** - All promised features must work
6. **App Crashes** - Ensure no crashes during review
7. **Excessive Permissions** - Don't ask for camera/photos if not needed
8. **External Payment** - Use in-app purchases if selling anything

### Maintenance

- [ ] Monitor ratings and reviews
- [ ] Respond to user feedback
- [ ] Update screenshots with new features
- [ ] Keep app up-to-date with iOS releases
- [ ] Update privacy policy if practices change

---

## Quick Reference

**Bundle ID**: com.twowatch.app
**SKU**: com.twowatch.app
**Primary Category**: Entertainment
**Age Rating**: 12+
**Price**: Free

**Minimum Requirements**:
- iOS: [Check Expo SDK 54 requirements]
- iPad: Yes (multi-platform)
- Apple TV: Yes (tvOS support)

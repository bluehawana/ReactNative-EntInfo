# 2watch - Final Store Submission Checklist

## Screenshots Organized ✅

### Android Screenshots (in `store/android/`)
| # | Filename | Content | Size |
|---|----------|---------|------|
| 1 | 01_movies.png | Movies home screen | 1080x2400 ✅ |
| 2 | 02_tv_shows.png | TV shows screen | 1080x2400 ✅ |
| 3 | 03_movies_trending.png | Trending movies | 818x1822 |
| 4 | 04_tv_shows_popular.png | Popular TV shows | 818x1824 |
| 5 | 05_search.png | Search screen | 826x1822 |
| 6 | 06_movie_detail.png | Movie detail | 822x1830 |
| 7 | 07_trending_by_region.png | Regional trending | 822x1832 |

### iOS Screenshots (in `store/screenshots/ios/`)
#### iPhone (6.1-6.7" displays)
| # | Filename | Content | Size | Device |
|---|----------|---------|------|--------|
| 1 | 01_home.png | Home/Trending | 1860x2562 | iPhone |
| 2 | 02_movies.png | Movies | 1842x1936 | iPhone |
| 3 | 03_tv_shows.png | TV Shows | 1880x1940 | iPhone |
| 4 | 04_search.png | Search | 1002x1078 | iPhone |
| 5 | 05_profile.png | Profile screen | 826x1826 | iPhone |
| 6 | 06_watchlist.png | Watchlist | 812x1828 | iPhone |

#### iPad
| # | Filename | Content | Size |
|---|----------|---------|------|
| 1 | 01_home_ipad.png | Home screen | 1002x1078 |

---

## ⚠️ ACTION REQUIRED: New Screenshots Needed

With the new **Profile** and **Watchlist** features, you should take FRESH screenshots showing:

### Required for Submission:

#### iOS App Store
**iPhone (need 6.7" - iPhone 14/15 Pro Max):**
- [ ] Screenshot 1: Home/Trending Movies
- [ ] Screenshot 2: TV Shows
- [ ] Screenshot 3: Movie Detail with streaming links
- [ ] Screenshot 4: Search
- [ ] Screenshot 5: **Profile screen (NEW)**
- [ ] Screenshot 6: **Watchlist (NEW)**
- [ ] Screenshot 7: Trending by Region

**iPad (if supporting):**
- [ ] 12.9" iPad Pro screenshots (2048x2732)

#### Google Play Store
**Phone (16:9 or 9:16 ratio):**
- [ ] Screenshot 1: Home/Trending
- [ ] Screenshot 2: Movies
- [ ] Screenshot 3: TV Shows
- [ ] Screenshot 4: Search
- [ ] Screenshot 5: **Profile (NEW)**
- [ ] Screenshot 6: **Watchlist (NEW)**
- [ ] Screenshot 7: Detail with streaming links
- [ ] Screenshot 8: Trending by Region

---

## Complete Submission Checklist

### App Store (iOS) Requirements

#### Build & Technical
- [ ] App builds successfully with `eas build --platform ios --profile production`
- [ ] App runs without crashes on iOS 15+
- [ ] All permissions properly declared in Info.plist
- [ ] Privacy manifest included (if using analytics/tracking)
- [ ] App icon: 1024x1024 PNG (no transparency)
- [ ] Launch screen configured

#### App Information
- [ ] App name: "2watch"
- [ ] Subtitle: "Track movies & TV shows"
- [ ] Category: Entertainment
- [ ] Secondary category: Lifestyle
- [ ] Content rating: 12+ (mature themes from movie content)

#### Store Assets
- [ ] Screenshots (3-10 required)
  - Must show app in-use
  - No status bars/translucent elements
  - iPhone 6.7" (1290x2796) REQUIRED
  - iPad 12.9" (2048x2732) if supporting
- [ ] App icon (already have: assets/icon.jpg)
- [ ] Promotional text (170 chars max)
- [ ] Keywords (100 chars max)
- [ ] Support URL (create: https://2watch.app/support)
- [ ] Privacy policy URL (create: https://2watch.app/privacy)
- [ ] Marketing URL (optional)

#### Legal
- [ ] Export compliance information
- [ ] Content rights (verify TMDB attribution)
- [ ] Age rating questionnaire completed

---

### Google Play Store Requirements

#### Build & Technical
- [ ] App builds with `eas build --platform android --profile production`
- [ ] Target SDK 33+ (latest requirements)
- [ ] App bundle (.aab) generated
- [ ] Signing keystore configured
- [ ] App icon: 512x512 PNG (have: assets/icon.jpg)
- [ ] Feature graphic: 1024x500 (NEED TO CREATE)

#### App Information
- [ ] App name: "2watch"
- [ ] Short description (80 chars): "Track movies & TV shows, find where to watch"
- [ ] Full description (4000 chars max) - see STORE_LISTING_ASSETS.md
- [ ] Category: Entertainment
- [ ] Content rating: Teen (13+)

#### Store Assets
- [ ] Screenshots (phone, 7" tablet, 10" tablet if supporting)
  - Phone: 1080x1920 or similar (HAVE)
  - 7" tablet: 1080x1920
  - 10" tablet: 1920x1080
- [ ] Feature graphic: 1024x500 JPEG/PNG (NEED TO CREATE)
- [ ] App icon: 512x512 (HAVE)
- [ ] Privacy policy URL
- [ ] Support email/URL

#### Content Rating
- [ ] Complete content rating questionnaire
- [ ] Declare ads (none currently)
- [ ] Declare in-app purchases (none currently)

---

## Pre-Submission Testing Checklist

### Functionality ✅
- [ ] App launches without crashes
- [ ] Trending movies load correctly
- [ ] Trending TV shows load correctly
- [ ] Search works
- [ ] Detail screen shows streaming links
- [ ] **Profile screen works (NEW)**
- [ ] **Watchlist add/remove works (NEW)**
- [ ] Google Sign-In works (Android/iOS)
- [ ] Apple Sign-In works (iOS)
- [ ] Sign out works

### UI/UX ✅
- [ ] Dark theme consistent throughout
- [ ] No layout issues on different screen sizes
- [ ] Loading states handled
- [ ] Error states handled gracefully
- [ ] Videos/images load properly

### Performance
- [ ] App loads within 3 seconds
- [ ] Smooth scrolling
- [ ] Images load with reasonable speed
- [ ] No memory leaks (test for 10+ min usage)

### Compliance
- [ ] TMDB attribution visible
- [ ] No copyrighted material in screenshots
- [ ] Proper OAuth flow for social sign-ins
- [ ] Privacy policy accurate and complete

---

## Submission Order Recommendation

1. **Week 1:** Take fresh screenshots, create feature graphic
2. **Week 2:**
   - Submit to **Google Play Internal Testing**
   - Submit to **App Store TestFlight (Internal)**
3. **Week 3:**
   - Fix any issues from testing
   - Move to **Google Play Closed Testing**
   - Move to **App Store External Testing**
4. **Week 4:**
   - Submit for **production release** on both stores

---

## Commands to Use

### Build Production Apps
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### Submit to Stores
```bash
# Submit both platforms
eas submit --platform all

# Or individually
eas submit --platform ios
eas submit --platform android
```

---

## Outstanding Tasks

1. **URGENT:** Take new screenshots showing Profile & Watchlist features
2. **URGENT:** Create Google Play feature graphic (1024x500)
3. Create/upload Privacy Policy page
4. Create/upload Support page
5. Test Google Sign-In on production build
6. Test Apple Sign-In on production build
7. Verify TMDB attribution is visible
8. Complete App Store content rating questionnaire
9. Complete Google Play content rating questionnaire

---

## Resources

- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Guidelines: https://play.google.com/console/about/guides/
- EAS Documentation: https://docs.expo.dev/build/setup/

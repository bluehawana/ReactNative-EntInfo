# EntInfo - Apple TV & App Store Publishing Guide

## ✅ Apple TV Support Status: CONFIGURED

Your app is now configured for Apple TV with `supportsAppleTv: true` in `app.json`.

---

## What's Already Done

1. ✅ Apple TV support enabled in `app.json`
2. ✅ Dark theme (Prime Video style)
3. ✅ Swipeable hero carousel
4. ✅ TV-optimized layouts

---

## What You Need to Publish

### 1. Apple Developer Account
- **Cost**: $99/year
- **Enroll**: https://developer.apple.com/programs/enroll/
- **Required for**: iOS, iPad, Apple TV distribution

### 2. Build for tvOS
```bash
# For TV Simulator
npx expo run:tvos

# For Production Build
npx eas build --platform tvos --profile production
```

### 3. Create App Store Connect Record
1. Go to https://appstoreconnect.apple.com/
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Name**: EntInfo
   - **Platform**: tvOS
   - **Primary Language**: English
   - **Bundle ID**: com.anonymous.EntInfo
   - **SKU**: entinfo-appletv
   - **User Access**: Full Access (for movies/TV data)

### 4. Prepare for Submission

#### Required Info:
- **Screenshots**: Apple TV (1920x1080), iPhone, iPad versions
- **App Icon**: 1024x1024 for Apple TV
- **Description**: App features
- **Keywords**: Movies, TV, Streaming, Entertainment
- **Category**: Entertainment
- **Age Rating**: Need to fill out content rating questionnaire
- **Privacy URL**: Your privacy policy URL
- **Support URL**: Your contact/support page

#### App Store Review Questions:
- **Is this app designed for Apple TV?**: ✅ Yes
- **Does your app access Apple TV frameworks?**: ✅ No (unless you add)
- **Is your app a game?**: ✅ No
- **Does your app offer In-App Purchases?**: ✅ No
- **Does your app use ads?**: ✅ No

### 5. Build and Submit

```bash
# Install EAS CLI if not already
npm install -g eas-cli

# Login to EAS
eas login

# Create production build for tvOS
eas build --platform tvos --profile production

# Upload to App Store Connect
eas submit --platform tvos --latest --profile production
```

---

## Apple TV UI Considerations

### Remote Control Support
Your app uses React Navigation which should work with Apple TV remote. Test in Xcode Apple TV Simulator.

### Focus Management
Apple TV requires focus-based navigation (not touch). Consider:
- `@react-navigation/native` handles this automatically
- Ensure large touch targets (44pt minimum)
- Use `onFocus` callbacks for visual feedback

### Text Scaling
Apple TV text is 1.15x larger than mobile. Your current font sizes (10-28px) should be fine.

---

## Publishing Checklist

- [ ] Apple Developer account active
- [ ] App Store Connect record created
- [ ] Screenshots prepared (at least 3.75" Apple TV screenshots)
- [ ] App icon (1024x1024)
- [ ] Description written
- [ ] Privacy policy URL ready
- [ ] Age rating questionnaire completed
- [ ] Test in Apple TV Simulator (Xcode)
- [ ] Test on physical Apple TV device
- [ ] Build created with EAS
- [ ] Build uploaded and submitted

---

## Cost Summary

| Item | Cost |
|------|-------|
| Apple Developer Program | $99/year |
| One-time setup (free) | $0 |
| **Total First Year** | **$99** |

---

## Notes

- Review time: Typically 1-3 days for new apps
- Rejection reasons: Metadata issues, crashes, guideline violations
- After first approval, updates usually take < 1 day
- Your app uses public TMDB API - ensure proper attribution in settings

---

## Next Steps

1. **Test thoroughly** in Apple TV Simulator:
   ```bash
   open -a Simulator -com.apple.core.simulator.SimRuntime.tvOS
   ```

2. **Enroll** in Apple Developer Program if not already

3. **Create App Store Connect** listing

4. **Build** and submit with EAS

---

## Resources

- [Apple TV Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/tvos)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Expo tvOS Docs](https://docs.expo.dev/workflow/tvos/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

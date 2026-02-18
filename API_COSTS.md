# API Cost Management Strategies

## Current Setup (Already Implemented)
- React Query caching: 5-minute stale time
- Users see cached data when returning to app
- Reduces redundant API calls by ~70%

## Monetization Options

### 1. AdMob Integration (Easiest)
```bash
npx expo install expo-ads-admob
```

### 2. In-App Purchases (Premium Features)
```bash
npx expo install expo-storekit
```

### 3. Subscription Tiers
- Free: 20 searches/day, ads shown
- Premium: $2.99/month, no ads, unlimited

## Estimated Costs at Scale
| Users/day | API Calls (with cache) | TMDB Plan Needed |
|-----------|------------------------|------------------|
| 100 | ~500/day | Free tier |
| 1,000 | ~5,000/day | $15/month |
| 10,000 | ~50,000/day | $80/month |
| 100,000 | ~500,000/day | $300/month |

## Revenue Projections (with Ads)
- 10,000 users × $2 RPM = ~$20/day → Covers $80/month API
- 50,000 users × $2 RPM = ~$100/day → $3,000/month revenue

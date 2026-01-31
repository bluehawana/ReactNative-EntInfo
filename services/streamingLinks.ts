/**
 * Streaming service deep links
 * Maps provider IDs to app deep links and web URLs
 */

export interface StreamingProvider {
  providerId: number;
  name: string;
  scheme: string; // app deep link scheme
  webUrl: string;
  icon: string;
}

export const streamingProviders: Record<number, StreamingProvider> = {
  // Apple TV+
  350: {
    providerId: 350,
    name: 'Apple TV+',
    scheme: 'tvapp://', // Apple TV app
    webUrl: 'https://tv.apple.com',
    icon: 'logo-apple',
  },
  // Netflix
  8: {
    providerId: 8,
    name: 'Netflix',
    scheme: 'nflx://',
    webUrl: 'https://netflix.com',
    icon: 'logo-netflix',
  },
  // Disney+
  391: {
    providerId: 391,
    name: 'Disney+',
    scheme: 'disneyplus://',
    webUrl: 'https://disneyplus.com',
    icon: 'logo-disney',
  },
  // HBO Max
  384: {
    providerId: 384,
    name: 'Max',
    scheme: 'max://',
    webUrl: 'https://max.com',
    icon: 'logo-hbo',
  },
  // Amazon Prime Video
  119: {
    providerId: 119,
    name: 'Prime Video',
    scheme: 'primevideo://',
    webUrl: 'https://amazon.com/prime-video',
    icon: 'logo-amazon',
  },
  // Hulu
  15: {
    providerId: 15,
    name: 'Hulu',
    scheme: 'hulu://',
    webUrl: 'https://hulu.com',
    icon: 'logo-hulu',
  },
  // Paramount+
  531: {
    providerId: 531,
    name: 'Paramount+',
    scheme: 'paramountplus://',
    webUrl: 'https://paramountplus.com',
    icon: 'logo-paramount',
  },
  // Peacock
  498: {
    providerId: 498,
    name: 'Peacock',
    scheme: 'peacocktv://',
    webUrl: 'https://peacocktv.com',
    icon: 'logo-peacock',
  },
  // Crunchyroll
  726: {
    providerId: 726,
    name: 'Crunchyroll',
    scheme: 'crunchyroll://',
    webUrl: 'https://crunchyroll.com',
    icon: 'logo-crunchyroll',
  },
  // YouTube
  247: {
    providerId: 247,
    name: 'YouTube',
    scheme: 'youtube://',
    webUrl: 'https://youtube.com',
    icon: 'logo-youtube',
  },
  // Google Play Movies
  3: {
    providerId: 3,
    name: 'Google Play',
    scheme: 'market://', // Will use market URL
    webUrl: 'https://play.google.com/store/movies',
    icon: 'logo-google',
  },
  // iTunes
  2: {
    providerId: 2,
    name: 'Apple TV',
    scheme: 'itms-apps://', // iTunes Store
    webUrl: 'https://tv.apple.com',
    icon: 'logo-apple',
  },
  // Tubi
  359: {
    providerId: 359,
    name: 'Tubi',
    scheme: 'tubitv://',
    webUrl: 'https://tubitv.com',
    icon: 'logo-tubi',
  },
  // Pluto TV
  290: {
    providerId: 290,
    name: 'Pluto TV',
    scheme: 'plutotv://',
    webUrl: 'https://plutotv.com',
    icon: 'logo-pluto',
  },
};

/**
 * Get deep link URL for a provider
 */
export function getProviderDeepLink(providerId: number, searchQuery?: string): string | null {
  const provider = streamingProviders[providerId];
  if (!provider) return null;

  const encodedQuery = encodeURIComponent(searchQuery || '');
  const slug = searchQuery ? `?q=${encodedQuery}` : '';

  switch (providerId) {
    case 350: // Apple TV+
      return `tvapp://watch?contentType=movie&contentId=${searchQuery || ''}`;
    case 8: // Netflix
      return `nflx://search?query=${encodedQuery}`;
    case 391: // Disney+
      return `disneyplus://search?query=${encodedQuery}`;
    case 384: // HBO Max
      return `max://search/${encodedQuery}`;
    case 119: // Amazon Prime Video
      return `primevideo://search?keyword=${encodedQuery}`;
    case 15: // Hulu
      return `hulu://search/${encodedQuery}`;
    case 531: // Paramount+
      return `paramountplus://search/${encodedQuery}`;
    case 498: // Peacock
      return `peacocktv://search/${encodedQuery}`;
    case 247: // YouTube
      return `youtube://results?search_query=${encodedQuery}`;
    default:
      return provider.scheme + slug || provider.webUrl;
  }
}

/**
 * Open a streaming provider
 */
export async function openStreamingProvider(
  providerId: number,
  searchQuery?: string
): Promise<{ success: boolean; openedApp: boolean }> {
  const provider = streamingProviders[providerId];
  if (!provider) return { success: false, openedApp: false };

  const { Linking } = await import('react-native');
  const deepLink = getProviderDeepLink(providerId, searchQuery);

  if (!deepLink) {
    // Fallback to web URL
    await Linking.openURL(provider.webUrl);
    return { success: true, openedApp: false };
  }

  try {
    // Try to open the app first
    const canOpen = await Linking.canOpenURL(deepLink);

    if (canOpen) {
      await Linking.openURL(deepLink);
      return { success: true, openedApp: true };
    }

    // Fallback to web URL
    await Linking.openURL(provider.webUrl);
    return { success: true, openedApp: false };
  } catch (error) {
    // Final fallback to web URL
    try {
      await Linking.openURL(provider.webUrl);
      return { success: true, openedApp: false };
    } catch {
      return { success: false, openedApp: false };
    }
  }
}

/**
 * Format watch provider name for display
 */
export function getProviderDisplayName(providerId: number): string {
  const provider = streamingProviders[providerId];
  return provider?.name || 'Watch';
}

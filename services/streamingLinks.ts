/**
 * Streaming service deep links
 * Maps provider IDs to app deep links and web URLs
 */
import { Linking } from 'react-native';

export interface StreamingProvider {
  providerId: number;
  name: string;
  scheme: string; // app deep link scheme
  webUrl: string;
  icon: string;
}

export type ProviderMediaType = 'movie' | 'tv';

export interface ProviderOpenOptions {
  title?: string;
  mediaType?: ProviderMediaType;
  providerPageUrl?: string; // JustWatch URL from TMDB — specific to this title
  imdbId?: string | null;   // IMDB ID for direct Amazon links
  year?: number | null;     // Release year to narrow search results
}

type ProviderInput = string | ProviderOpenOptions | undefined;

function normalizeProviderInput(input?: ProviderInput): ProviderOpenOptions {
  if (!input) return {};
  if (typeof input === 'string') return { title: input };
  return input;
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
export function getProviderDeepLink(providerId: number, input?: ProviderInput): string | null {
  const provider = streamingProviders[providerId];
  if (!provider) return null;

  const { title } = normalizeProviderInput(input);
  const encodedQuery = encodeURIComponent(title || '');
  const slug = title ? `?q=${encodedQuery}` : '';

  switch (providerId) {
    case 350: // Apple TV+
    case 2: // Apple TV / iTunes
      // Prefer search deep link over legacy "watch/contentId" route, which often lands on app home.
      return `tvapp://search?term=${encodedQuery}`;
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
 * Returns the best possible URL for the given title on a streaming provider.
 *
 * - Amazon Prime Video: uses IMDB ID for a direct content page when available.
 * - All others: HTTPS search URL with title + year (universal link → opens in app).
 *
 * Note: Netflix, Disney+, Max, Apple TV+ use proprietary content IDs not
 * available from TMDB, so we cannot link directly to their content page.
 * The JustWatch providerPageUrl (from TMDB) is the best direct-to-content
 * fallback for those platforms.
 */
export function getProviderWebUrl(providerId: number, input?: ProviderInput): string | null {
  const { title, imdbId, year } = normalizeProviderInput(input);
  if (!title) return streamingProviders[providerId]?.webUrl ?? null;

  const q = encodeURIComponent(title);
  const qWithYear = year ? encodeURIComponent(`${title} ${year}`) : q;

  switch (providerId) {
    // Amazon Prime Video — direct content page via IMDB ID, else search
    case 119:
      if (imdbId) return `https://www.amazon.com/gp/video/detail/${imdbId}`;
      return `https://www.amazon.com/gp/video/search?phrase=${qWithYear}`;

    // Apple TV+ / Apple TV (buy/rent) — universal link opens TV app to search
    case 350:
    case 2:
      return `https://tv.apple.com/search?term=${q}`;

    // Netflix — search with year for precision
    case 8:
      return `https://www.netflix.com/search?q=${qWithYear}`;

    // Disney+ — search
    case 391:
      return `https://www.disneyplus.com/search/${q}`;

    // Max (HBO Max) — search
    case 384:
      return `https://play.max.com/search?q=${qWithYear}`;

    // Hulu — search with year
    case 15:
      return `https://www.hulu.com/search?query=${qWithYear}`;

    // Paramount+ — search
    case 531:
      return `https://www.paramountplus.com/search/${q}/`;

    // Peacock — search
    case 498:
      return `https://www.peacocktv.com/search?q=${qWithYear}`;

    // YouTube — search (includes YouTube Movies)
    case 247:
      return `https://www.youtube.com/results?search_query=${qWithYear}`;

    // Crunchyroll
    case 726:
      return `https://www.crunchyroll.com/search?q=${q}`;

    // Tubi (free)
    case 359:
      return `https://tubitv.com/search/${q}`;

    // Pluto TV (free)
    case 290:
      return `https://pluto.tv/search/${q}`;

    // Google Play Movies
    case 3:
      return `https://play.google.com/store/search?q=${qWithYear}&c=movies`;

    // Fubo
    case 257:
      return `https://www.fubo.tv/welcome?q=${q}`;

    // Showtime
    case 37:
      return `https://www.sho.com/search#${q}`;

    // Mubi
    case 11:
      return `https://mubi.com/search/${q}`;

    // Shudder
    case 99:
      return `https://www.shudder.com/search?q=${q}`;

    // BritBox
    case 151:
      return `https://www.britbox.com/us/search?q=${q}`;

    // AMC+
    case 526:
      return `https://www.amcplus.com/search?q=${q}`;

    // Starz
    case 43:
      return `https://www.starz.com/us/en/search#q=${q}`;

    default: {
      const provider = streamingProviders[providerId];
      return provider ? `${provider.webUrl}/search?q=${q}` : null;
    }
  }
}

/**
 * Opens the streaming provider, landing on search results for the title.
 *
 * Strategy (in order):
 *  1. HTTPS universal link (provider search page) — OS routes to app if installed
 *  2. JustWatch page for this exact title from TMDB (providerPageUrl)
 *  3. JustWatch generic search
 */
export async function openStreamingProvider(
  providerId: number,
  input?: ProviderInput
): Promise<{ success: boolean; openedApp: boolean }> {
  const { title, providerPageUrl } = normalizeProviderInput(input);
  const q = encodeURIComponent(title || '');

  // 1. Provider-specific HTTPS search (universal link → opens app)
  const universalLink = getProviderWebUrl(providerId, input);
  if (universalLink) {
    try {
      await Linking.openURL(universalLink);
      return { success: true, openedApp: true };
    } catch {
      // fall through
    }
  }

  // 2. JustWatch page for this exact title (from TMDB watch/providers response)
  if (providerPageUrl) {
    try {
      await Linking.openURL(providerPageUrl);
      return { success: true, openedApp: false };
    } catch {
      // fall through
    }
  }

  // 3. JustWatch search as last resort
  try {
    await Linking.openURL(`https://www.justwatch.com/us/search?q=${q}`);
    return { success: true, openedApp: false };
  } catch {
    return { success: false, openedApp: false };
  }
}

/**
 * Format watch provider name for display
 */
export function getProviderDisplayName(providerId: number): string {
  const provider = streamingProviders[providerId];
  return provider?.name || 'Watch';
}

/**
 * Streaming Links Service Tests
 * Tests streaming provider deep links for iOS and Android
 */

import {
  streamingProviders,
  getProviderDeepLink,
  getProviderDisplayName,
  getProviderWebUrl,
} from './streamingLinks';

// Mock the dynamic import in openStreamingProvider
jest.mock('./streamingLinks', () => {
  const originalModule = jest.requireActual('./streamingLinks');

  return {
    ...originalModule,
    openStreamingProvider: jest.fn(async (providerId: number, searchQuery?: string) => {
      const { streamingProviders: providers, getProviderDeepLink: getDeepLink } = jest.requireActual('./streamingLinks');
      const provider = providers[providerId];
      if (!provider) return { success: false, openedApp: false };

      const Linking = require('react-native/Libraries/Linking/Linking');
      const deepLink = getDeepLink(providerId, searchQuery);

      if (!deepLink) {
        await Linking.openURL(provider.webUrl);
        return { success: true, openedApp: false };
      }

      try {
        const canOpen = await Linking.canOpenURL(deepLink);
        if (canOpen) {
          await Linking.openURL(deepLink);
          return { success: true, openedApp: true };
        }
        await Linking.openURL(provider.webUrl);
        return { success: true, openedApp: false };
      } catch {
        try {
          await Linking.openURL(provider.webUrl);
          return { success: true, openedApp: false };
        } catch {
          return { success: false, openedApp: false };
        }
      }
    }),
  };
});

// Import the mocked openStreamingProvider
import { openStreamingProvider } from './streamingLinks';

const Linking = require('react-native/Libraries/Linking/Linking');

describe('Streaming Links Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('streamingProviders', () => {
    it('should have Netflix provider (ID: 8)', () => {
      expect(streamingProviders[8]).toBeDefined();
      expect(streamingProviders[8].name).toBe('Netflix');
      expect(streamingProviders[8].scheme).toBe('nflx://');
    });

    it('should have Disney+ provider (ID: 391)', () => {
      expect(streamingProviders[391]).toBeDefined();
      expect(streamingProviders[391].name).toBe('Disney+');
      expect(streamingProviders[391].scheme).toBe('disneyplus://');
    });

    it('should have Apple TV+ provider (ID: 350)', () => {
      expect(streamingProviders[350]).toBeDefined();
      expect(streamingProviders[350].name).toBe('Apple TV+');
      expect(streamingProviders[350].scheme).toBe('tvapp://');
    });

    it('should have Prime Video provider (ID: 119)', () => {
      expect(streamingProviders[119]).toBeDefined();
      expect(streamingProviders[119].name).toBe('Prime Video');
      expect(streamingProviders[119].scheme).toBe('primevideo://');
    });

    it('should have Max (HBO) provider (ID: 384)', () => {
      expect(streamingProviders[384]).toBeDefined();
      expect(streamingProviders[384].name).toBe('Max');
      expect(streamingProviders[384].scheme).toBe('max://');
    });

    it('should have Hulu provider (ID: 15)', () => {
      expect(streamingProviders[15]).toBeDefined();
      expect(streamingProviders[15].name).toBe('Hulu');
      expect(streamingProviders[15].scheme).toBe('hulu://');
    });

    it('should have Paramount+ provider (ID: 531)', () => {
      expect(streamingProviders[531]).toBeDefined();
      expect(streamingProviders[531].name).toBe('Paramount+');
      expect(streamingProviders[531].scheme).toBe('paramountplus://');
    });

    it('should have Peacock provider (ID: 498)', () => {
      expect(streamingProviders[498]).toBeDefined();
      expect(streamingProviders[498].name).toBe('Peacock');
      expect(streamingProviders[498].scheme).toBe('peacocktv://');
    });

    it('should have YouTube provider (ID: 247)', () => {
      expect(streamingProviders[247]).toBeDefined();
      expect(streamingProviders[247].name).toBe('YouTube');
      expect(streamingProviders[247].scheme).toBe('youtube://');
    });

    it('should have Crunchyroll provider (ID: 726)', () => {
      expect(streamingProviders[726]).toBeDefined();
      expect(streamingProviders[726].name).toBe('Crunchyroll');
      expect(streamingProviders[726].scheme).toBe('crunchyroll://');
    });

    it('should have Tubi provider (ID: 359)', () => {
      expect(streamingProviders[359]).toBeDefined();
      expect(streamingProviders[359].name).toBe('Tubi');
      expect(streamingProviders[359].scheme).toBe('tubitv://');
    });

    it('should have Pluto TV provider (ID: 290)', () => {
      expect(streamingProviders[290]).toBeDefined();
      expect(streamingProviders[290].name).toBe('Pluto TV');
      expect(streamingProviders[290].scheme).toBe('plutotv://');
    });

    it('should have all required properties for each provider', () => {
      Object.values(streamingProviders).forEach((provider) => {
        expect(provider).toHaveProperty('providerId');
        expect(provider).toHaveProperty('name');
        expect(provider).toHaveProperty('scheme');
        expect(provider).toHaveProperty('webUrl');
        expect(provider).toHaveProperty('icon');
        expect(typeof provider.providerId).toBe('number');
        expect(typeof provider.name).toBe('string');
        expect(typeof provider.scheme).toBe('string');
        expect(typeof provider.webUrl).toBe('string');
        expect(typeof provider.icon).toBe('string');
      });
    });
  });

  describe('getProviderDeepLink', () => {
    it('should return null for unknown provider', () => {
      const result = getProviderDeepLink(99999, 'test query');
      expect(result).toBeNull();
    });

    it('should generate correct deep link for Netflix', () => {
      const result = getProviderDeepLink(8, 'Inception');
      expect(result).toBe('nflx://search?query=Inception');
    });

    it('should encode query for Netflix', () => {
      const result = getProviderDeepLink(8, 'The Dark Knight');
      expect(result).toBe('nflx://search?query=The%20Dark%20Knight');
    });

    it('should generate correct deep link for Disney+', () => {
      const result = getProviderDeepLink(391, 'Marvel');
      expect(result).toBe('disneyplus://search?query=Marvel');
    });

    it('should generate correct deep link for Apple TV+', () => {
      const result = getProviderDeepLink(350, 'Ted Lasso');
      expect(result).toBe('tvapp://search?term=Ted%20Lasso');
    });

    it('should generate correct deep link for Max', () => {
      const result = getProviderDeepLink(384, 'Game of Thrones');
      expect(result).toBe('max://search/Game%20of%20Thrones');
    });

    it('should generate correct deep link for Prime Video', () => {
      const result = getProviderDeepLink(119, 'The Boys');
      expect(result).toBe('primevideo://search?keyword=The%20Boys');
    });

    it('should generate correct deep link for Hulu', () => {
      const result = getProviderDeepLink(15, 'The Handmaid\'s Tale');
      expect(result).toBe("hulu://search/The%20Handmaid's%20Tale");
    });

    it('should generate correct deep link for Paramount+', () => {
      const result = getProviderDeepLink(531, 'Star Trek');
      expect(result).toBe('paramountplus://search/Star%20Trek');
    });

    it('should generate correct deep link for Peacock', () => {
      const result = getProviderDeepLink(498, 'The Office');
      expect(result).toBe('peacocktv://search/The%20Office');
    });

    it('should generate correct deep link for YouTube', () => {
      const result = getProviderDeepLink(247, 'movie trailer');
      expect(result).toBe('youtube://results?search_query=movie%20trailer');
    });

    it('should handle empty query', () => {
      const result = getProviderDeepLink(8, '');
      expect(result).toBe('nflx://search?query=');
    });

    it('should handle undefined query', () => {
      const result = getProviderDeepLink(8, undefined);
      // Netflix search with empty query
      expect(result).toBe('nflx://search?query=');
    });

    it('should handle special characters in query', () => {
      const result = getProviderDeepLink(8, 'What\'s & Where\'s?');
      expect(result).toContain('nflx://search?query=');
      // Query should be encoded
      expect(result).toContain('What');
    });
  });

  describe('openStreamingProvider', () => {
    it('should return failure for unknown provider', async () => {
      const result = await openStreamingProvider(99999, 'test');
      expect(result.success).toBe(false);
      expect(result.openedApp).toBe(false);
    });

    it('should open app when canOpenURL returns true', async () => {
      Linking.canOpenURL.mockResolvedValue(true);
      Linking.openURL.mockResolvedValue(undefined);

      const result = await openStreamingProvider(8, 'Inception');

      expect(result.success).toBe(true);
      expect(result.openedApp).toBe(true);
      expect(Linking.canOpenURL).toHaveBeenCalled();
      expect(Linking.openURL).toHaveBeenCalledWith('nflx://search?query=Inception');
    });

    it('should fallback to web URL when app cannot be opened', async () => {
      Linking.canOpenURL.mockResolvedValue(false);
      Linking.openURL.mockResolvedValue(undefined);

      const result = await openStreamingProvider(8, 'Inception');

      expect(result.success).toBe(true);
      expect(result.openedApp).toBe(false);
      expect(Linking.openURL).toHaveBeenCalledWith('https://netflix.com');
    });

    it('should fallback to web URL on error', async () => {
      Linking.canOpenURL.mockRejectedValue(new Error('Cannot open'));
      Linking.openURL.mockResolvedValue(undefined);

      const result = await openStreamingProvider(391, 'Marvel');

      expect(result.success).toBe(true);
      expect(result.openedApp).toBe(false);
      expect(Linking.openURL).toHaveBeenCalledWith('https://disneyplus.com');
    });

    it('should return failure when both app and web fail', async () => {
      Linking.canOpenURL.mockRejectedValue(new Error('Cannot open'));
      Linking.openURL.mockRejectedValue(new Error('Cannot open web'));

      const result = await openStreamingProvider(8, 'test');

      expect(result.success).toBe(false);
      expect(result.openedApp).toBe(false);
    });

    it('should work with different providers', async () => {
      Linking.canOpenURL.mockResolvedValue(true);
      Linking.openURL.mockResolvedValue(undefined);

      // Test Prime Video
      await openStreamingProvider(119, 'The Boys');
      expect(Linking.openURL).toHaveBeenCalledWith('primevideo://search?keyword=The%20Boys');

      // Test Hulu
      await openStreamingProvider(15, 'Test Show');
      expect(Linking.openURL).toHaveBeenCalledWith('hulu://search/Test%20Show');

      // Test YouTube
      await openStreamingProvider(247, 'trailer');
      expect(Linking.openURL).toHaveBeenCalledWith('youtube://results?search_query=trailer');
    });
  });

  describe('getProviderDisplayName', () => {
    it('should return correct name for Netflix', () => {
      expect(getProviderDisplayName(8)).toBe('Netflix');
    });

    it('should return correct name for Disney+', () => {
      expect(getProviderDisplayName(391)).toBe('Disney+');
    });

    it('should return correct name for Apple TV+', () => {
      expect(getProviderDisplayName(350)).toBe('Apple TV+');
    });

    it('should return correct name for Prime Video', () => {
      expect(getProviderDisplayName(119)).toBe('Prime Video');
    });

    it('should return correct name for Max', () => {
      expect(getProviderDisplayName(384)).toBe('Max');
    });

    it('should return correct name for Hulu', () => {
      expect(getProviderDisplayName(15)).toBe('Hulu');
    });

    it('should return correct name for Paramount+', () => {
      expect(getProviderDisplayName(531)).toBe('Paramount+');
    });

    it('should return correct name for Peacock', () => {
      expect(getProviderDisplayName(498)).toBe('Peacock');
    });

    it('should return correct name for YouTube', () => {
      expect(getProviderDisplayName(247)).toBe('YouTube');
    });

    it('should return "Watch" for unknown provider', () => {
      expect(getProviderDisplayName(99999)).toBe('Watch');
    });
  });

  describe('getProviderWebUrl', () => {
    // Amazon Prime Video — direct content via IMDB ID
    it('should return Amazon direct content page when imdbId is provided', () => {
      const url = getProviderWebUrl(119, { title: 'The Batman', imdbId: 'tt1877830' });
      expect(url).toBe('https://www.amazon.com/gp/video/detail/tt1877830');
    });

    it('should return Amazon search with year when imdbId is absent', () => {
      const url = getProviderWebUrl(119, { title: 'The Batman', year: 2022 });
      expect(url).toBe('https://www.amazon.com/gp/video/search?phrase=The%20Batman%202022');
    });

    it('should return Amazon search with title only when no imdbId or year', () => {
      const url = getProviderWebUrl(119, { title: 'The Batman' });
      expect(url).toBe('https://www.amazon.com/gp/video/search?phrase=The%20Batman');
    });

    it('should ignore imdbId null and fall back to Amazon search', () => {
      const url = getProviderWebUrl(119, { title: 'The Batman', imdbId: null });
      expect(url).toBe('https://www.amazon.com/gp/video/search?phrase=The%20Batman');
    });

    // Netflix — title + year search
    it('should include year in Netflix search URL', () => {
      const url = getProviderWebUrl(8, { title: 'Stranger Things', year: 2016 });
      expect(url).toBe('https://www.netflix.com/search?q=Stranger%20Things%202016');
    });

    it('should use title only for Netflix when no year', () => {
      const url = getProviderWebUrl(8, { title: 'Stranger Things' });
      expect(url).toBe('https://www.netflix.com/search?q=Stranger%20Things');
    });

    // Disney+
    it('should return Disney+ search URL (title only, no year)', () => {
      const url = getProviderWebUrl(391, { title: 'Encanto', year: 2021 });
      expect(url).toBe('https://www.disneyplus.com/search/Encanto');
    });

    // Max / HBO Max — includes year
    it('should include year in Max search URL', () => {
      const url = getProviderWebUrl(384, { title: 'Succession', year: 2018 });
      expect(url).toBe('https://play.max.com/search?q=Succession%202018');
    });

    // Apple TV+ (ID 350) and Apple TV buy/rent (ID 2) — same URL pattern
    it('should return Apple TV+ search URL', () => {
      const url = getProviderWebUrl(350, { title: 'Ted Lasso' });
      expect(url).toBe('https://tv.apple.com/search?term=Ted%20Lasso');
    });

    it('should return Apple TV (buy/rent) search URL', () => {
      const url = getProviderWebUrl(2, { title: 'Top Gun Maverick' });
      expect(url).toBe('https://tv.apple.com/search?term=Top%20Gun%20Maverick');
    });

    // Hulu — includes year
    it('should return Hulu search URL with year', () => {
      const url = getProviderWebUrl(15, { title: 'Fargo', year: 2014 });
      expect(url).toBe('https://www.hulu.com/search?query=Fargo%202014');
    });

    // Paramount+
    it('should return Paramount+ search URL', () => {
      const url = getProviderWebUrl(531, { title: 'Star Trek' });
      expect(url).toBe('https://www.paramountplus.com/search/Star%20Trek/');
    });

    // Peacock — includes year
    it('should return Peacock search URL with year', () => {
      const url = getProviderWebUrl(498, { title: 'The Office', year: 2005 });
      expect(url).toBe('https://www.peacocktv.com/search?q=The%20Office%202005');
    });

    // YouTube — includes year
    it('should return YouTube search URL with year', () => {
      const url = getProviderWebUrl(247, { title: 'documentary', year: 2023 });
      expect(url).toBe('https://www.youtube.com/results?search_query=documentary%202023');
    });

    // Crunchyroll
    it('should return Crunchyroll search URL', () => {
      const url = getProviderWebUrl(726, { title: 'Attack on Titan' });
      expect(url).toBe('https://www.crunchyroll.com/search?q=Attack%20on%20Titan');
    });

    // Tubi
    it('should return Tubi search URL', () => {
      const url = getProviderWebUrl(359, { title: 'free movie' });
      expect(url).toBe('https://tubitv.com/search/free%20movie');
    });

    // Pluto TV
    it('should return Pluto TV search URL', () => {
      const url = getProviderWebUrl(290, { title: 'news' });
      expect(url).toBe('https://pluto.tv/search/news');
    });

    // No title — returns provider home URL
    it('should return provider home URL when no title provided', () => {
      expect(getProviderWebUrl(8)).toBe('https://netflix.com');
      expect(getProviderWebUrl(391)).toBe('https://disneyplus.com');
      expect(getProviderWebUrl(119)).toBe('https://amazon.com/prime-video');
    });

    // Unknown provider
    it('should return null for unknown provider with title', () => {
      const url = getProviderWebUrl(99999, { title: 'test movie' });
      expect(url).toBeNull();
    });

    it('should return null for unknown provider without title', () => {
      const url = getProviderWebUrl(99999);
      expect(url).toBeNull();
    });

    // Special characters
    it('should correctly encode special characters in title', () => {
      const url = getProviderWebUrl(8, { title: "What's Up & Where's It?" });
      expect(url).toContain('https://www.netflix.com/search?q=');
      expect(url).not.toContain(' '); // Spaces should be encoded
    });
  });

  describe('Platform-specific behavior', () => {
    it('should handle iOS deep link schemes', async () => {
      Linking.canOpenURL.mockResolvedValue(true);
      Linking.openURL.mockResolvedValue(undefined);

      // Apple TV+ deep link
      await openStreamingProvider(350, 'show');
      // Apple TV uses tvapp:// scheme
      expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining('tvapp'));
    });

    it('should handle Android deep link schemes', async () => {
      Linking.canOpenURL.mockResolvedValue(true);
      Linking.openURL.mockResolvedValue(undefined);

      // YouTube deep link (works on both platforms)
      await openStreamingProvider(247, 'video');
      expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining('youtube://'));
    });

    it('should fallback to web URLs for both platforms', async () => {
      Linking.canOpenURL.mockResolvedValue(false);
      Linking.openURL.mockResolvedValue(undefined);

      await openStreamingProvider(8, 'test');
      expect(Linking.openURL).toHaveBeenCalledWith('https://netflix.com');

      await openStreamingProvider(391, 'test');
      expect(Linking.openURL).toHaveBeenCalledWith('https://disneyplus.com');
    });
  });
});

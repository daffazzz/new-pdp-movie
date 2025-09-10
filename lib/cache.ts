interface CacheItem {
  data: any;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    };
    this.cache.set(key, item);
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Global cache instance
export const cache = new CacheManager();

// Cache keys generator
export const cacheKeys = {
  popularMovies: (page: number) => `popular-movies-${page}`,
  popularTV: (page: number) => `popular-tv-${page}`,
  moviesByGenre: (genreId: number, page: number) => `movies-genre-${genreId}-${page}`,
  tvByGenre: (genreId: number, page: number) => `tv-genre-${genreId}-${page}`,
  movieDetails: (id: number) => `movie-${id}`,
  tvDetails: (id: number) => `tv-${id}`,
  movieGenres: () => 'movie-genres',
  tvGenres: () => 'tv-genres',
  search: (query: string, page: number) => `search-${query}-${page}`,
  tvSeason: (id: number, season: number) => `tv-${id}-season-${season}`,
};

// Cleanup expired cache items every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}

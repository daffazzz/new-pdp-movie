import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { cache } from '../lib/cache';

interface UseApiCacheOptions {
  cacheKey: string;
  cacheTTL?: number;
  enabled?: boolean;
}

interface UseApiCacheResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export function useApiCache<T>(
  url: string,
  options: UseApiCacheOptions
): UseApiCacheResult<T> {
  const { cacheKey, cacheTTL = 5 * 60 * 1000, enabled = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);
      const responseData = response.data;
      
      // Cache the response
      cache.set(cacheKey, responseData, cacheTTL);
      
      setData(responseData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [url, cacheKey, cacheTTL, enabled]);

  const refetch = useCallback(async () => {
    // Clear cache and refetch
    cache.remove(cacheKey);
    await fetchData();
  }, [cacheKey, fetchData]);

  const clearCache = useCallback(() => {
    cache.remove(cacheKey);
  }, [cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}

// Specialized hooks for common API calls
export function usePopularMovies(page: number = 1) {
  return useApiCache(`/api/movies/popular?page=${page}`, {
    cacheKey: `popular-movies-${page}`,
    cacheTTL: 10 * 60 * 1000, // 10 minutes for popular content
  });
}

export function usePopularTV(page: number = 1) {
  return useApiCache(`/api/tv/popular?page=${page}`, {
    cacheKey: `popular-tv-${page}`,
    cacheTTL: 10 * 60 * 1000, // 10 minutes for popular content
  });
}

export function useMoviesByGenre(genreId: number | null, page: number = 1) {
  return useApiCache(
    genreId ? `/api/movies/by-genre?genre=${genreId}&page=${page}` : '',
    {
      cacheKey: `movies-genre-${genreId}-${page}`,
      cacheTTL: 15 * 60 * 1000, // 15 minutes for genre-based content
      enabled: !!genreId,
    }
  );
}

export function useTVByGenre(genreId: number | null, page: number = 1) {
  return useApiCache(
    genreId ? `/api/tv/by-genre?genre=${genreId}&page=${page}` : '',
    {
      cacheKey: `tv-genre-${genreId}-${page}`,
      cacheTTL: 15 * 60 * 1000, // 15 minutes for genre-based content
      enabled: !!genreId,
    }
  );
}

export function useMovieDetails(id: number) {
  return useApiCache(`/api/movies/${id}`, {
    cacheKey: `movie-${id}`,
    cacheTTL: 30 * 60 * 1000, // 30 minutes for movie details
  });
}

export function useTVDetails(id: number) {
  return useApiCache(`/api/tv/${id}`, {
    cacheKey: `tv-${id}`,
    cacheTTL: 30 * 60 * 1000, // 30 minutes for TV details
  });
}

export function useGenres(type: 'movie' | 'tv') {
  return useApiCache(`/api/genres/${type === 'movie' ? 'movies' : 'tv'}`, {
    cacheKey: `${type}-genres`,
    cacheTTL: 60 * 60 * 1000, // 1 hour for genres (rarely change)
  });
}

export function useSearch(query: string, page: number = 1) {
  return useApiCache(
    query ? `/api/search?query=${encodeURIComponent(query)}&page=${page}` : '',
    {
      cacheKey: `search-${query}-${page}`,
      cacheTTL: 5 * 60 * 1000, // 5 minutes for search results
      enabled: !!query,
    }
  );
}

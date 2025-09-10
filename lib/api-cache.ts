import { NextApiResponse } from 'next';

export interface CacheOptions {
  maxAge?: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  cdnMaxAge?: number;
}

export function setCacheHeaders(res: NextApiResponse, options: CacheOptions = {}) {
  const {
    maxAge = 0,
    sMaxAge = 300, // 5 minutes
    staleWhileRevalidate = 600, // 10 minutes
    cdnMaxAge = 600, // 10 minutes
  } = options;

  const cacheControl = [
    'public',
    maxAge > 0 && `max-age=${maxAge}`,
    `s-maxage=${sMaxAge}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
  ].filter(Boolean).join(', ');

  res.setHeader('Cache-Control', cacheControl);
  res.setHeader('CDN-Cache-Control', `public, s-maxage=${cdnMaxAge}`);
  res.setHeader('Vary', 'Accept-Encoding');
}

// Predefined cache configurations
export const cacheConfigs = {
  // Popular content - cache for 5 minutes, stale for 10 minutes
  popular: {
    sMaxAge: 300,
    staleWhileRevalidate: 600,
    cdnMaxAge: 600,
  },
  
  // Genre-based content - cache for 15 minutes, stale for 30 minutes
  genre: {
    sMaxAge: 900,
    staleWhileRevalidate: 1800,
    cdnMaxAge: 1800,
  },
  
  // Movie/TV details - cache for 30 minutes, stale for 1 hour
  details: {
    sMaxAge: 1800,
    staleWhileRevalidate: 3600,
    cdnMaxAge: 3600,
  },
  
  // Genres list - cache for 1 hour, stale for 6 hours
  genres: {
    sMaxAge: 3600,
    staleWhileRevalidate: 21600,
    cdnMaxAge: 21600,
  },
  
  // Search results - cache for 5 minutes, stale for 10 minutes
  search: {
    sMaxAge: 300,
    staleWhileRevalidate: 600,
    cdnMaxAge: 600,
  },
  
  // Season details - cache for 1 hour, stale for 6 hours
  season: {
    sMaxAge: 3600,
    staleWhileRevalidate: 21600,
    cdnMaxAge: 21600,
  },
};

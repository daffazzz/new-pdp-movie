import axios from 'axios';

// Configuration for client-side TMDB API calls
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// IMPORTANT: In production, this should be in environment variables
// For Android app, we'll use a public key or proxy
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'YOUR_TMDB_API_KEY_HERE';

export const tmdbClientApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
  timeout: 10000,
});

export const getImageUrl = (path: string, size: string = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Client-side API functions
export const tmdbClient = {
  // Movies
  getPopularMovies: async (page: number = 1, country: string | null = null) => {
    try {
      const params: any = { page };
      if (country) {
        params.with_origin_country = country;
      }
      const response = await tmdbClientApi.get('/discover/movie', {
        params: { ...params, sort_by: 'popularity.desc' },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  getTrendingMovies: async (page: number = 1) => {
    try {
      const response = await tmdbClientApi.get('/trending/movie/week', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  getMovieDetails: async (id: number) => {
    try {
      const response = await tmdbClientApi.get(`/movie/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  getMoviesByGenre: async (genreId: number, page: number = 1, country: string | null = null) => {
    try {
      const params: any = {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      };
      if (country) {
        params.with_origin_country = country;
      }
      const response = await tmdbClientApi.get('/discover/movie', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },

  // TV Shows
  getPopularTVShows: async (page: number = 1, country: string | null = null) => {
    try {
      const params: any = { page };
      if (country) {
        params.with_origin_country = country;
      }
      const response = await tmdbClientApi.get('/discover/tv', {
        params: { ...params, sort_by: 'popularity.desc' },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  },

  getTrendingTVShows: async (page: number = 1) => {
    try {
      const response = await tmdbClientApi.get('/trending/tv/week', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      throw error;
    }
  },

  getTVDetails: async (id: number) => {
    try {
      const response = await tmdbClientApi.get(`/tv/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV details:', error);
      throw error;
    }
  },

  getTVShowsByGenre: async (genreId: number, page: number = 1, country: string | null = null) => {
    try {
      const params: any = {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      };
      if (country) {
        params.with_origin_country = country;
      }
      const response = await tmdbClientApi.get('/discover/tv', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV shows by genre:', error);
      throw error;
    }
  },

  getTVSeason: async (id: number, seasonNumber: number) => {
    try {
      const response = await tmdbClientApi.get(`/tv/${id}/season/${seasonNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV season:', error);
      throw error;
    }
  },

  // Genres
  getMovieGenres: async () => {
    try {
      const response = await tmdbClientApi.get('/genre/movie/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching movie genres:', error);
      throw error;
    }
  },

  getTVGenres: async () => {
    try {
      const response = await tmdbClientApi.get('/genre/tv/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching TV genres:', error);
      throw error;
    }
  },

  // Countries
  getCountries: async () => {
    try {
      const response = await tmdbClientApi.get('/configuration/countries');
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },

  // Search
  searchMulti: async (query: string, page: number = 1) => {
    try {
      const response = await tmdbClientApi.get('/search/multi', {
        params: { 
          query: encodeURIComponent(query),
          page 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },
};

// Check if we're in a static environment (Android app)
export const isStaticEnvironment = () => {
  return typeof window !== 'undefined' && 
         (window.location.protocol === 'file:' || 
          window.location.hostname === 'localhost' ||
          !window.location.hostname);
};

// Auto-detect and use appropriate API
export const getApiClient = () => {
  if (isStaticEnvironment()) {
    console.log('Using direct TMDB API for static environment');
    return tmdbClient;
  } else {
    console.log('Using Next.js API routes');
    return null; // Use original API routes
  }
};


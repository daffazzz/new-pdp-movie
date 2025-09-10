import axios from 'axios';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string, size: string = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  production_companies: { id: number; name: string; logo_path: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
}

export interface TVDetails extends TVShow {
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Season[];
  production_companies: { id: number; name: string; logo_path: string }[];
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
}

export interface Genre {
  id: number;
  name: string;
}

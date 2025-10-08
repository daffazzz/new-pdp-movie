import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import GenreFilter from '../components/GenreFilter';
import CountryFilter from '../components/CountryFilter';
import { Movie } from '../lib/tmdb';
import { tmdbClient, isStaticEnvironment } from '../lib/tmdb-client';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const setTarget = useIntersectionObserver(
    { threshold: 0.5 },
    () => {
      if (hasMore && !isLoading) {
        loadMore();
      }
    },
    hasMore
  );

  const fetchMovies = async (pageNum: number, reset: boolean = false, genreId: number | null = null, country: string | null = null) => {
    try {
      setIsLoading(true);
      
      let response;
      if (isStaticEnvironment()) {
        // Use direct TMDB API for Android/static environments
        if (genreId) {
          response = await tmdbClient.getMoviesByGenre(genreId, pageNum, country);
        } else {
          response = await tmdbClient.getPopularMovies(pageNum, country);
        }
      } else {
        // Use Next.js API routes for web
        const endpoint = genreId 
          ? `/api/movies/by-genre?genre=${genreId}&page=${pageNum}${country ? `&country=${country}` : ''}`
          : `/api/movies/popular?page=${pageNum}${country ? `&country=${country}` : ''}`;
        
        const apiResponse = await axios.get(endpoint);
        response = apiResponse.data;
      }
      
      const newMovies = response.results || [];
      
      if (reset) {
        setMovies(newMovies);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
      }
      
      setHasMore(pageNum < response.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, true, selectedGenre, selectedCountry);
    setPage(1);
  }, [selectedGenre, selectedCountry]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage, false, selectedGenre, selectedCountry);
    }
  };

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
  };

  const handleCountryChange = (countryCode: string | null) => {
    setSelectedCountry(countryCode);
  };

  return (
    <>
      <Head>
        <title>Movies - PDP MOVIES</title>
        <meta name="description" content="Browse and watch the latest movies online" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">
            {selectedGenre ? 'Movies by Genre' : 'Popular Movies'}
          </h1>
          <GenreFilter 
            type="movie" 
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
          />
          <CountryFilter
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
          />
        </div>
        
        <MovieGrid items={movies} type="movie" />

        {isLoading && movies.length === 0 && (
          <LoadingSpinner size="large" className="py-20" />
        )}

        <div ref={setTarget} className="h-10" />

        {isLoading && movies.length > 0 && (
          <div className="text-center py-8">
            <LoadingSpinner size="medium" />
          </div>
        )}
      </div>
    </>
  );
};

export default Movies;

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import GenreFilter from '../components/GenreFilter';
import { TVShow } from '../lib/tmdb';

const TVShows: React.FC = () => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const fetchTVShows = async (pageNum: number, reset: boolean = false, genreId: number | null = null) => {
    try {
      setIsLoading(true);
      const endpoint = genreId 
        ? `/api/tv/by-genre?genre=${genreId}&page=${pageNum}`
        : `/api/tv/popular?page=${pageNum}`;
      
      const response = await axios.get(endpoint);
      const newTVShows = response.data.results || [];
      
      if (reset) {
        setTVShows(newTVShows);
      } else {
        setTVShows(prev => [...prev, ...newTVShows]);
      }
      
      setHasMore(pageNum < response.data.total_pages);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows(1, true, selectedGenre);
    setPage(1);
  }, [selectedGenre]);

  useEffect(() => {
    fetchTVShows(1, true);
  }, []);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTVShows(nextPage, false, selectedGenre);
    }
  };

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
  };

  return (
    <>
      <Head>
        <title>TV Shows - PDP MOVIES</title>
        <meta name="description" content="Browse and watch the latest TV shows online" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">
            {selectedGenre ? 'TV Shows by Genre' : 'Popular TV Shows'}
          </h1>
          <GenreFilter 
            type="tv" 
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
          />
        </div>
        
        <MovieGrid items={tvShows} type="tv" />

        {isLoading && tvShows.length === 0 ? (
          <LoadingSpinner size="large" className="py-20" />
        ) : (
          <>
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TVShows;

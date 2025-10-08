import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie, TVShow } from '../lib/tmdb';
import { tmdbClient, isStaticEnvironment } from '../lib/tmdb-client';

interface SearchResult extends Movie, TVShow {
  media_type: 'movie' | 'tv' | 'person';
}

const Search: React.FC = () => {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (q) {
      searchContent(q as string, 1, true);
    }
  }, [q]);

  const searchContent = async (query: string, pageNum: number, reset: boolean = false) => {
    try {
      setIsLoading(true);
      
      let response;
      if (isStaticEnvironment()) {
        // Use direct TMDB API for Android/static environments
        response = await tmdbClient.searchMulti(query, pageNum);
      } else {
        // Use Next.js API routes for web
        const apiResponse = await axios.get(`/api/search?query=${encodeURIComponent(query)}&page=${pageNum}`);
        response = apiResponse.data;
      }
      
      const newResults = response.results?.filter((item: SearchResult) => 
        item.media_type === 'movie' || item.media_type === 'tv'
      ) || [];
      
      if (reset) {
        setResults(newResults);
      } else {
        setResults(prev => [...prev, ...newResults]);
      }
      
      setHasMore(pageNum < response.total_pages);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore && q) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchContent(q as string, nextPage);
    }
  };

  const movies = results.filter(item => item.media_type === 'movie') as Movie[];
  const tvShows = results.filter(item => item.media_type === 'tv') as TVShow[];

  return (
    <>
      <Head>
        <title>{q ? `Search: ${q}` : 'Search'} - PDP MOVIES</title>
        <meta name="description" content={`Search results for ${q}`} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {q && (
          <h1 className="text-3xl font-bold text-white mb-8">
            Search Results for "{q}"
          </h1>
        )}

        {isLoading && results.length === 0 ? (
          <LoadingSpinner size="large" className="py-20" />
        ) : (
          <>
            {results.length === 0 && q ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No results found for "{q}"</p>
              </div>
            ) : (
              <div className="space-y-12">
                {movies.length > 0 && (
                  <section>
                    <MovieGrid items={movies} type="movie" title="Movies" />
                  </section>
                )}

                {tvShows.length > 0 && (
                  <section>
                    <MovieGrid items={tvShows} type="tv" title="TV Shows" />
                  </section>
                )}

                {hasMore && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMore}
                      disabled={isLoading}
                      className="tv-focusable bg-gray-700 hover:bg-gray-600 focus:bg-gray-600 focus:ring-4 focus:ring-gray-500/50 disabled:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto focus:outline-none focus:scale-105"
                      tabIndex={0}
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
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Search;

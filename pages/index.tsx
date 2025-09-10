import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Star, Play } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie, TVShow, getImageUrl } from '../lib/tmdb';

// Types for items with media_type
type MovieWithType = Movie & { media_type: 'movie' };
type TVShowWithType = TVShow & { media_type: 'tv' };
type RecommendedItem = MovieWithType | TVShowWithType;

const Home: React.FC = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<RecommendedItem[]>([]);
  const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [isLoadingTVShows, setIsLoadingTVShows] = useState(false);
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTVPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [hasMoreTVShows, setHasMoreTVShows] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch multiple pages for variety
        const randomMoviePage = Math.floor(Math.random() * 5) + 1; // Pages 1-5
        const randomTVPage = Math.floor(Math.random() * 5) + 1;
        
        const [moviesResponse, tvResponse, trendingMoviesResponse, trendingTVResponse] = await Promise.all([
          axios.get('/api/movies/popular?page=1'),
          axios.get('/api/tv/popular?page=1'),
          axios.get(`/api/movies/popular?page=${randomMoviePage}`),
          axios.get(`/api/tv/popular?page=${randomTVPage}`),
        ]);

        const movies = moviesResponse.data.results || [];
        const tvShows = tvResponse.data.results || [];
        const trendingMovies = trendingMoviesResponse.data.results || [];
        const trendingTVShows = trendingTVResponse.data.results || [];
        
        setPopularMovies(movies);
        setPopularTVShows(tvShows);
        
        // Combine and shuffle recommended items
        const allRecommended: RecommendedItem[] = [
          ...trendingMovies.slice(0, 8).map((item: Movie): MovieWithType => ({ ...item, media_type: 'movie' })),
          ...trendingTVShows.slice(0, 8).map((item: TVShow): TVShowWithType => ({ ...item, media_type: 'tv' }))
        ];
        
        // Shuffle array for random order
        const shuffled = allRecommended.sort(() => Math.random() - 0.5);
        setRecommendedItems(shuffled);
        
        // Random starting index
        setCurrentRecommendedIndex(Math.floor(Math.random() * Math.min(shuffled.length, 10)));
        
        setHasMoreMovies(moviesResponse.data.page < moviesResponse.data.total_pages);
        setHasMoreTVShows(tvResponse.data.page < tvResponse.data.total_pages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-slide effect for recommendations
  useEffect(() => {
    if (recommendedItems.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentRecommendedIndex(prev => 
        prev + 1 >= recommendedItems.length ? 0 : prev + 1
      );
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [recommendedItems]);

  // Helper functions for mixed movie/TV data
  const getItemTitle = (item: any) => {
    if (!item) return '';
    return item.title || item.name || '';
  };

  const getItemYear = (item: any) => {
    if (!item) return 'N/A';
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const getItemLink = (item: any) => {
    if (!item) return '/';
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    return `/${mediaType}/${item.id}`;
  };

  const loadMoreMovies = async () => {
    if (!hasMoreMovies || isLoadingMovies) return;
    
    try {
      setIsLoadingMovies(true);
      const nextPage = moviePage + 1;
      const response = await axios.get(`/api/movies/popular?page=${nextPage}`);
      const newMovies = response.data.results || [];
      
      setPopularMovies(prev => [...prev, ...newMovies]);
      setMoviePage(nextPage);
      setHasMoreMovies(nextPage < response.data.total_pages);
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const loadMoreTVShows = async () => {
    if (!hasMoreTVShows || isLoadingTVShows) return;
    
    try {
      setIsLoadingTVShows(true);
      const nextPage = tvPage + 1;
      const response = await axios.get(`/api/tv/popular?page=${nextPage}`);
      const newTVShows = response.data.results || [];
      
      setPopularTVShows(prev => [...prev, ...newTVShows]);
      setTVPage(nextPage);
      setHasMoreTVShows(nextPage < response.data.total_pages);
    } catch (error) {
      console.error('Error loading more TV shows:', error);
    } finally {
      setIsLoadingTVShows(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSpinner size="large" className="py-20" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>PDP MOVIES - Watch Movies & TV Shows Online</title>
        <meta name="description" content="Stream the latest movies and TV shows online" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Featured Recommendations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Recommended for You</h2>
          
          {/* Featured Movie/Series Carousel */}
          <div className="relative">
            {recommendedItems.length > 0 && (
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-gray-800">
                {/* Featured Item */}
                <div className="relative h-full transition-all duration-1000 ease-in-out">
                  <Image
                    src={getImageUrl(recommendedItems[currentRecommendedIndex]?.backdrop_path, 'w1280')}
                    alt={getItemTitle(recommendedItems[currentRecommendedIndex])}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyayeUhtcdGOynepJeP//Z"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-2xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                          {recommendedItems[currentRecommendedIndex]?.media_type === 'movie' ? 'Movie' : 'TV Series'}
                        </span>
                        <span className="text-gray-300 text-sm">Recommended</span>
                      </div>
                      
                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                        {getItemTitle(recommendedItems[currentRecommendedIndex])}
                      </h3>
                      <p className="text-gray-200 text-sm md:text-base mb-6 line-clamp-3">
                        {recommendedItems[currentRecommendedIndex]?.overview}
                      </p>
                      
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white">{recommendedItems[currentRecommendedIndex]?.vote_average.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-300">
                          {getItemYear(recommendedItems[currentRecommendedIndex])}
                        </span>
                      </div>
                      
                      <div className="flex space-x-4">
                        <Link
                          href={getItemLink(recommendedItems[currentRecommendedIndex])}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Play className="h-5 w-5" />
                          <span>Watch Now</span>
                        </Link>
                        <Link
                          href={getItemLink(recommendedItems[currentRecommendedIndex])}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                          More Info
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    {recommendedItems.slice(0, Math.min(recommendedItems.length, 5)).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentRecommendedIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          index === currentRecommendedIndex % Math.min(recommendedItems.length, 5)
                            ? 'bg-red-500'
                            : 'bg-gray-500 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Recommendations Grid */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">More Recommendations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendedItems.slice(1, 13).map((item, index) => (
                <Link key={`${item.id}-${index}`} href={getItemLink(item)}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(item.poster_path)}
                        alt={getItemTitle(item)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyayeUhtcdGOynepJeP//Z"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Media Type Badge */}
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                        {item.media_type === 'movie' ? 'Movie' : 'TV'}
                      </div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-red-600 rounded-full p-2">
                          <Play className="h-4 w-4 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-white text-sm font-medium mt-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {getItemTitle(item)}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {getItemYear(item)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Movies */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Popular Movies</h2>
          </div>
          <MovieGrid items={popularMovies} type="movie" />
          
          {popularMovies.length > 0 && hasMoreMovies && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreMovies}
                disabled={isLoadingMovies}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                {isLoadingMovies ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Load More Movies</span>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Popular TV Shows */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Popular TV Shows</h2>
          </div>
          <MovieGrid items={popularTVShows} type="tv" />
          
          {popularTVShows.length > 0 && hasMoreTVShows && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreTVShows}
                disabled={isLoadingTVShows}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                {isLoadingTVShows ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Load More TV Shows</span>
                )}
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Star, Play, Info } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import BrowseModal from '../components/BrowseModal';
import { Movie, TVShow, getImageUrl } from '../lib/tmdb';
import { tmdbClient, isStaticEnvironment } from '../lib/tmdb-client';

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
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showTVModal, setShowTVModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch multiple pages for variety
        const randomMoviePage = Math.floor(Math.random() * 5) + 1; // Pages 1-5
        const randomTVPage = Math.floor(Math.random() * 5) + 1;
        
        let movies, tvShows, trendingMovies, trendingTVShows;
        let moviesData, tvData, moviesResponse, tvResponse;

        if (isStaticEnvironment()) {
          // Use direct TMDB API for Android/static environments
          console.log('Fetching from TMDB API directly...');
          const [moviesResult, tvResult, trendingMoviesData, trendingTVData] = await Promise.all([
            tmdbClient.getPopularMovies(1),
            tmdbClient.getPopularTVShows(1),
            tmdbClient.getTrendingMovies(randomMoviePage),
            tmdbClient.getTrendingTVShows(randomTVPage),
          ]);

          moviesData = moviesResult;
          tvData = tvResult;
          movies = moviesResult.results || [];
          tvShows = tvResult.results || [];
          trendingMovies = trendingMoviesData.results || [];
          trendingTVShows = trendingTVData.results || [];
        } else {
          // Use Next.js API routes for web
          console.log('Fetching from Next.js API routes...');
          const [moviesRes, tvRes, trendingMoviesResponse, trendingTVResponse] = await Promise.all([
            axios.get('/api/movies/popular?page=1'),
            axios.get('/api/tv/popular?page=1'),
            axios.get(`/api/movies/popular?page=${randomMoviePage}`),
            axios.get(`/api/tv/popular?page=${randomTVPage}`),
          ]);

          moviesResponse = moviesRes;
          tvResponse = tvRes;
          movies = moviesRes.data.results || [];
          tvShows = tvRes.data.results || [];
          trendingMovies = trendingMoviesResponse.data.results || [];
          trendingTVShows = trendingTVResponse.data.results || [];
        }
        
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
        
        if (isStaticEnvironment()) {
          setHasMoreMovies(moviesData ? 1 < moviesData.total_pages : false);
          setHasMoreTVShows(tvData ? 1 < tvData.total_pages : false);
        } else {
          setHasMoreMovies(moviesResponse ? moviesResponse.data.page < moviesResponse.data.total_pages : false);
          setHasMoreTVShows(tvResponse ? tvResponse.data.page < tvResponse.data.total_pages : false);
        }
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
      
      let response;
      if (isStaticEnvironment()) {
        response = await tmdbClient.getPopularMovies(nextPage);
      } else {
        const apiResponse = await axios.get(`/api/movies/popular?page=${nextPage}`);
        response = apiResponse.data;
      }
      
      const newMovies = response.results || [];
      
      setPopularMovies(prev => [...prev, ...newMovies]);
      setMoviePage(nextPage);
      setHasMoreMovies(nextPage < response.total_pages);
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
      
      let response;
      if (isStaticEnvironment()) {
        response = await tmdbClient.getPopularTVShows(nextPage);
      } else {
        const apiResponse = await axios.get(`/api/tv/popular?page=${nextPage}`);
        response = apiResponse.data;
      }
      
      const newTVShows = response.results || [];
      
      setPopularTVShows(prev => [...prev, ...newTVShows]);
      setTVPage(nextPage);
      setHasMoreTVShows(nextPage < response.total_pages);
    } catch (error) {
      console.error('Error loading more TV shows:', error);
    } finally {
      setIsLoadingTVShows(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-16">
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

      <div className="px-4 py-8 space-y-16">
        {/* Netflix-Style Hero Section */}
        <section className="relative -mx-4 -mt-8">
          {recommendedItems.length > 0 && (
            <div className="relative h-[60vh] min-h-[400px] max-h-[800px]">
              {/* Hero Background Image */}
              <div className="absolute inset-0">
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
  {/* Enhanced Gradient Overlay for Better Integration */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-gray-900/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-transparent to-gray-900/20" />
              </div>

              {/* Hero Content */}
              <div className="relative h-full flex items-end pb-8 sm:pb-12 md:pb-16">
                <div className="px-4">
                  <div className="max-w-4xl">
                    {/* Media Type Badge */}
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-red-600 text-white text-sm px-3 py-1 rounded font-semibold uppercase">
                        {recommendedItems[currentRecommendedIndex]?.media_type === 'movie' ? 'Featured Movie' : 'Featured Series'}
                      </span>
                      <div className="flex items-center space-x-2 text-white">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold">{recommendedItems[currentRecommendedIndex]?.vote_average.toFixed(1)}</span>
                      </div>
                      <span className="text-white text-lg">
                        {getItemYear(recommendedItems[currentRecommendedIndex])}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                      {getItemTitle(recommendedItems[currentRecommendedIndex])}
                    </h1>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-8">
                      <Link
                        href={getItemLink(recommendedItems[currentRecommendedIndex])}
                        className="tv-focusable bg-white hover:bg-gray-200 focus:bg-gray-200 text-black px-8 py-3 rounded-lg font-bold transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-4 focus:ring-white/50 transform hover:scale-105"
                        tabIndex={0}
                      >
                        <Play className="h-6 w-6" />
                        <span className="text-lg">Play</span>
                      </Link>
                      <Link
                        href={getItemLink(recommendedItems[currentRecommendedIndex])}
                        className="tv-focusable bg-gray-700/80 backdrop-blur-sm hover:bg-gray-600 focus:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transform hover:scale-105"
                        tabIndex={0}
                      >
                        <Info className="h-6 w-6" />
                        <span className="text-lg">More Info</span>
                      </Link>
                    </div>

                    {/* Description */}
                    <p className="text-white text-lg max-w-3xl line-clamp-3 opacity-90">
                      {recommendedItems[currentRecommendedIndex]?.overview ||
                       `Discover this amazing ${recommendedItems[currentRecommendedIndex]?.media_type === 'movie' ? 'movie' : 'series'} that's trending right now. Join millions of viewers watching ${getItemTitle(recommendedItems[currentRecommendedIndex])} today.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Carousel Navigation */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {recommendedItems.slice(0, Math.min(recommendedItems.length, 8)).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentRecommendedIndex(index)}
                    className={`tv-focusable w-8 h-1 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:scale-110 ${
                      index === currentRecommendedIndex % Math.min(recommendedItems.length, 8)
                        ? 'bg-white w-16'
                        : 'bg-gray-500/60 hover:bg-gray-400/80 focus:bg-white/80'
                    }`}
                    tabIndex={0}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Side Navigation Arrows */}
              <button
                onClick={() => setCurrentRecommendedIndex(prev => prev === 0 ? recommendedItems.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 focus:bg-black/70 text-white p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 opacity-0 hover:opacity-100 group-hover:opacity-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentRecommendedIndex(prev => (prev + 1) % recommendedItems.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 focus:bg-black/70 text-white p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 opacity-0 hover:opacity-100 group-hover:opacity-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </section>

        {/* Trending Now Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Trending Now</h2>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex space-x-4 transition-transform duration-300">
                {recommendedItems.slice(0, 10).map((item, index) => (
                  <div key={`trending-${item.id}-${index}`} className="flex-none w-48">
                    <Link href={getItemLink(item)}>
                      <div className="trending-card cursor-pointer group">
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                          <Image
                            src={getImageUrl(item.poster_path)}
                            alt={getItemTitle(item)}
                            fill
                            className="object-cover trending-card-image transition-transform duration-300"
                            sizes="192px"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyayeUhtcdGOynepJeP//Z"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 trending-card-overlay transition-opacity duration-300" />

                          {/* Media Type Badge */}
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                            {item.media_type === 'movie' ? 'Movie' : 'TV'}
                          </div>

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 trending-card-play transition-opacity duration-300">
                            <div className="bg-red-600 rounded-full p-3 shadow-2xl">
                              <Play className="h-5 w-5 text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <h4 className="text-white text-sm font-medium mt-2 line-clamp-2 trending-card-title transition-colors">
                          {getItemTitle(item)}
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">
                          {getItemYear(item)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Movies */}
        <section className="space-y-6">
          <MovieGrid
            items={popularMovies.slice(0, 12)}
            type="movie"
            title="Popular Movies"
            showNavigation={true}
          />

          {popularMovies.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => setShowMovieModal(true)}
                className="tv-focusable bg-gray-800 hover:bg-gray-700 focus:bg-gray-600 focus:ring-4 focus:ring-gray-500/50 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto focus:outline-none focus:scale-105"
                tabIndex={0}
              >
                <span>Browse All Movies</span>
              </button>
            </div>
          )}
        </section>

        {/* New Releases */}
        <section className="space-y-6">
          <MovieGrid
            items={popularTVShows.slice(0, 12)}
            type="tv"
            title="New Releases"
            showNavigation={true}
          />

          {popularTVShows.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => setShowTVModal(true)}
                className="tv-focusable bg-gray-800 hover:bg-gray-700 focus:bg-gray-600 focus:ring-4 focus:ring-gray-500/50 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto focus:outline-none focus:scale-105"
                tabIndex={0}
              >
                <span>Browse All TV Shows</span>
              </button>
            </div>
          )}
        </section>

        {/* Continue Watching (Sample Data) */}
        <section className="space-y-6">
          <MovieGrid
            items={[...popularMovies.slice(3, 9), ...popularTVShows.slice(3, 9)]}
            type="movie"
            title="Continue Watching"
            showNavigation={true}
          />
        </section>
      </div>

      {/* Browse Modals */}
      <BrowseModal
        isOpen={showMovieModal}
        onClose={() => setShowMovieModal(false)}
        type="movie"
        title="Browse All Movies"
      />
      <BrowseModal
        isOpen={showTVModal}
        onClose={() => setShowTVModal(false)}
        type="tv"
        title="Browse All TV Shows"
      />
    </>
  );
};

export default Home;

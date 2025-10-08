import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { Movie, TVShow } from '../lib/tmdb';

interface MovieGridProps {
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  title?: string;
  showNavigation?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ items, type, title, showNavigation = false }) => {
  const [isAndroidTV, setIsAndroidTV] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTV = /android.*tv|smart-tv|smarttv/.test(userAgent) ||
                 window.innerWidth >= 1920 && window.innerHeight >= 1080;
    setIsAndroidTV(isTV);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className={`text-gray-400 ${isAndroidTV ? 'text-xl' : 'text-lg'}`}>
          No {type === 'movie' ? 'movies' : 'TV shows'} found.
        </p>
      </div>
    );
  }

  const gridClasses = showNavigation
    ? 'grid grid-flow-col auto-cols-max gap-4 overflow-x-auto scrollbar-hide'
    : `tv-navigation grid ${
        isAndroidTV
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 tv-grid'
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
      }`;

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          {showNavigation && items.length > 6 && (
            <div className="flex space-x-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:bg-gray-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={scrollPosition === 0}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:bg-gray-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={gridClasses}
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {items.map((item) => (
          <div key={item.id} className={showNavigation ? 'w-48 flex-shrink-0' : ''}>
            <MovieCard item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;

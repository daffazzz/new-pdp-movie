import React, { useState, useEffect, useRef } from 'react';
import { X, Star, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, TVShow, getImageUrl } from '../lib/tmdb';
import { tmdbClient, isStaticEnvironment } from '../lib/tmdb-client';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

interface BrowseModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'movie' | 'tv';
  title: string;
}

const BrowseModal: React.FC<BrowseModalProps> = ({ isOpen, onClose, type, title }) => {
  const [items, setItems] = useState<Movie[] | TVShow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && items.length === 0) {
      fetchItems(1);
    }
  }, [isOpen, type]);

  // Reset data when modal closes and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Account for scrollbar removal
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      setItems([]);
      setCurrentPage(1);
      setHasMore(true);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Infinite scroll implementation
  useEffect(() => {
    let isLoadingScheduled = false;

    const handleScroll = (e: Event) => {
      e.stopPropagation();

      if (!scrollContainerRef.current || !hasMore || isLoadingMore || isLoadingScheduled) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when user scrolls to 90% of the content
      if (scrollPercentage >= 0.9) {
        isLoadingScheduled = true;
        loadMore().finally(() => {
          isLoadingScheduled = false;
        });
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && isOpen) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [hasMore, isLoadingMore, currentPage, isOpen]);

  const fetchItems = async (page: number, append = false) => {
    try {
      if (!append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      let response;
      if (isStaticEnvironment()) {
        response = type === 'movie'
          ? await tmdbClient.getPopularMovies(page)
          : await tmdbClient.getPopularTVShows(page);
      } else {
        const apiResponse = await axios.get(`/api/${type}s/popular?page=${page}`);
        response = apiResponse.data;
      }

      const newItems = response.results || [];

      if (append) {
        // Prevent duplicates by checking existing IDs
        setItems(prev => {
          const existingIds = new Set(prev.map((item: Movie | TVShow) => item.id));
          const filteredNewItems = newItems.filter((item: Movie | TVShow) => !existingIds.has(item.id));
          return [...prev, ...filteredNewItems];
        });
      } else {
        setItems(newItems);
      }

      setCurrentPage(page);
      setHasMore(page < response.total_pages);
    } catch (error) {
      console.error(`Error fetching ${type}s:`, error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore || !scrollContainerRef.current) return;

    // Add a small delay to prevent multiple rapid calls
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check again after delay
    if (!isLoadingMore && hasMore) {
      await fetchItems(currentPage + 1, true);
    }
  };

  const getItemTitle = (item: Movie | TVShow) => {
    return type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  };

  const getItemYear = (item: Movie | TVShow) => {
    const date = type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  if (!isOpen) return null;

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-black to-gray-900 p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          ref={scrollContainerRef}
          className="p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 120px)' }}
        >
          {isLoading && items.length === 0 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {items.map((item) => (
                  <div key={item.id} className="cursor-pointer group">
                    <Link href={`/${type}/${item.id}`} onClick={onClose}>
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(item.poster_path)}
                          alt={getItemTitle(item)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 12vw"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyayeUhtcdGOynepJeP//Z"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Media Type Badge */}
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                          {type === 'movie' ? 'Movie' : 'TV'}
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-white font-medium">
                            {item.vote_average.toFixed(1)}
                          </span>
                        </div>

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-red-600 rounded-full p-3 shadow-2xl">
                            <Play className="h-5 w-5 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <h4 className="text-white text-sm font-medium mt-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                        {getItemTitle(item)}
                      </h4>
                      <p className="text-gray-400 text-xs mt-1">
                        {getItemYear(item)}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Loading indicator for infinite scroll */}
              {isLoadingMore && (
                <div className="text-center py-8">
                  <LoadingSpinner size="medium" />
                  <p className="text-gray-400 mt-2">Loading more {type === 'movie' ? 'movies' : 'TV shows'}...</p>
                </div>
              )}

              {/* End indicator */}
              {!hasMore && items.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">You've reached the end</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseModal;
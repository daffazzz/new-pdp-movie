import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Calendar } from 'lucide-react';
import { Movie, TVShow, getImageUrl } from '../lib/tmdb';

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
}

const MovieCard: React.FC<MovieCardProps> = ({ item, type }) => {
  const [isAndroidTV, setIsAndroidTV] = useState(false);
  const title = type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTV = /android.*tv|smart-tv|smarttv/.test(userAgent) ||
                 window.innerWidth >= 1920 && window.innerHeight >= 1080;
    setIsAndroidTV(isTV);
  }, []);

  return (
    <Link href={`/${type}/${item.id}`}>
      <div className={`movie-card group cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
        isAndroidTV 
          ? 'focus:outline-none focus:ring-4 focus:ring-gray-500 focus:scale-110 focus:z-20 focus:shadow-2xl focus:shadow-gray-500/20 hover:scale-105'
          : 'hover:shadow-xl hover:scale-105'
      } border border-gray-700/30`}
      tabIndex={0}
      role="button"
      aria-label={`View ${title} details`}>
        <div className="relative aspect-[2/3]">
          <Image
            src={getImageUrl(item.poster_path)}
            alt={title}
            fill
            className="object-cover group-hover:opacity-80 transition-opacity duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyayeUhtcdGOynepJeP//Z"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white font-medium">
              {item.vote_average.toFixed(1)}
            </span>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-black/80 rounded-full p-3 shadow-xl">
              <svg className="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className={`p-3 ${isAndroidTV ? 'p-4' : 'p-3'}`}>
          <h3 className={`font-semibold text-white mb-2 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300 ${
            isAndroidTV ? 'text-base' : 'text-sm'
          }`}>
            {title}
          </h3>
          
          <div className={`flex items-center justify-between text-gray-400 ${
            isAndroidTV ? 'text-sm' : 'text-xs'
          }`}>
            <div className="flex items-center space-x-1">
              <Calendar className={isAndroidTV ? 'h-4 w-4' : 'h-3 w-3'} />
              <span>{year}</span>
            </div>
            <span className={`capitalize bg-gray-700 px-2 py-1 rounded text-gray-300 ${
              isAndroidTV ? 'text-xs' : 'text-xs'
            }`}>
              {type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

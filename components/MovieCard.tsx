import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';
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
      <div className="cursor-pointer group">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(item.poster_path)}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyayeUhtcdGOynepJeP//Z"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Media Type Badge */}
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
            {type === 'movie' ? 'Movie' : 'TV'}
          </div>

          {/* Rating Badge - Added */}
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
          {title}
        </h4>
        <p className="text-gray-400 text-xs mt-1">
          {year}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;

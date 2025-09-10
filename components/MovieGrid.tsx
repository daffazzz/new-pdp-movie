import React from 'react';
import MovieCard from './MovieCard';
import { Movie, TVShow } from '../lib/tmdb';

interface MovieGridProps {
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  title?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ items, type, title }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No {type === 'movie' ? 'movies' : 'TV shows'} found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <MovieCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieGrid from './MovieGrid';
import LoadingSpinner from './LoadingSpinner';
import { Movie, TVShow, Genre } from '../lib/tmdb';

interface GenreSectionProps {
  type: 'movie' | 'tv';
  title: string;
}

const GenreSection: React.FC<GenreSectionProps> = ({ type, title }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
  }, [type]);

  useEffect(() => {
    if (selectedGenre) {
      fetchItemsByGenre(selectedGenre.id);
    }
  }, [selectedGenre]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`/api/genres/${type === 'movie' ? 'movies' : 'tv'}`);
      const genreList = response.data.genres || [];
      setGenres(genreList);
      
      // Auto-select first popular genre
      if (genreList.length > 0) {
        const popularGenres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Adventure'];
        const firstPopular = genreList.find((g: Genre) => popularGenres.includes(g.name)) || genreList[0];
        setSelectedGenre(firstPopular);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
      setIsLoading(false);
    }
  };

  const fetchItemsByGenre = async (genreId: number) => {
    try {
      setIsLoading(true);
      const endpoint = type === 'movie' 
        ? `/api/movies/by-genre?genre=${genreId}&page=1`
        : `/api/tv/by-genre?genre=${genreId}&page=1`;
      
      const response = await axios.get(endpoint);
      setItems(response.data.results?.slice(0, 8) || []);
    } catch (error) {
      console.error(`Error fetching ${type} by genre:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <LoadingSpinner size="medium" className="py-8" />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        
        {/* Genre Pills */}
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {genres.slice(0, 6).map(genre => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedGenre?.id === genre.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {selectedGenre && (
        <div className="space-y-4">
          <h3 className="text-lg text-gray-400">
            {selectedGenre.name} {type === 'movie' ? 'Movies' : 'TV Shows'}
          </h3>
          <MovieGrid items={items} type={type} />
        </div>
      )}
    </section>
  );
};

export default GenreSection;


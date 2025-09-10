import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Genre } from '../lib/tmdb';
import { Filter } from 'lucide-react';

interface GenreFilterProps {
  type: 'movie' | 'tv';
  selectedGenre: number | null;
  onGenreChange: (genreId: number | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ type, selectedGenre, onGenreChange }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, [type]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`/api/genres/${type === 'movie' ? 'movies' : 'tv'}`);
      setGenres(response.data.genres || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleGenreSelect = (genreId: number | null) => {
    onGenreChange(genreId);
    setIsOpen(false);
  };

  const selectedGenreName = selectedGenre 
    ? genres.find(g => g.id === selectedGenre)?.name || 'Unknown'
    : 'All Genres';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 min-w-[150px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="truncate">{selectedGenreName}</span>
        </div>
        <svg
          className={`h-4 w-4 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
            <div className="py-2">
              <button
                onClick={() => handleGenreSelect(null)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors duration-200 ${
                  selectedGenre === null ? 'bg-red-600 text-white' : 'text-gray-300'
                }`}
              >
                All Genres
              </button>
              
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors duration-200 ${
                    selectedGenre === genre.id ? 'bg-red-600 text-white' : 'text-gray-300'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GenreFilter;

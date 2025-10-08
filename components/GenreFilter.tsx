import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Genre } from '../lib/tmdb';
import { Filter } from 'lucide-react';
import { tmdbClient, isStaticEnvironment } from '../lib/tmdb-client';

interface GenreFilterProps {
  type: 'movie' | 'tv';
  selectedGenre: number | null;
  onGenreChange: (genreId: number | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ type, selectedGenre, onGenreChange }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAndroidTV, setIsAndroidTV] = useState(false);
  
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTV = /android.*tv|smart-tv|smarttv/.test(userAgent) ||
                 window.innerWidth >= 1920 && window.innerHeight >= 1080;
    setIsAndroidTV(isTV);
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [type]);

  const fetchGenres = async () => {
    try {
      let response;
      if (isStaticEnvironment()) {
        // Use direct TMDB API for Android/static environments
        if (type === 'movie') {
          response = await tmdbClient.getMovieGenres();
        } else {
          response = await tmdbClient.getTVGenres();
        }
      } else {
        // Use Next.js API routes for web
        const apiResponse = await axios.get(`/api/genres/${type === 'movie' ? 'movies' : 'tv'}`);
        response = apiResponse.data;
      }
      
      setGenres(response.genres || []);
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
        className={`tv-focusable flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 focus:bg-red-600 focus:ring-4 focus:ring-red-500/50 text-white px-4 py-2 rounded-lg transition-all duration-200 min-w-[150px] justify-between focus:outline-none ${
          isAndroidTV ? 'focus:scale-105 text-lg px-6 py-3' : ''
        }`}
        tabIndex={0}
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
                className={`tv-focusable w-full text-left px-4 py-2 hover:bg-gray-700 focus:bg-red-600 focus:text-white focus:outline-none transition-all duration-200 ${
                  isAndroidTV ? 'text-lg py-3 focus:scale-[1.02]' : ''
                } ${
                  selectedGenre === null ? 'bg-red-600 text-white' : 'text-gray-300'
                }`}
                tabIndex={0}
              >
                All Genres
              </button>
              
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id)}
                  className={`tv-focusable w-full text-left px-4 py-2 hover:bg-gray-700 focus:bg-red-600 focus:text-white focus:outline-none transition-all duration-200 ${
                    isAndroidTV ? 'text-lg py-3 focus:scale-[1.02]' : ''
                  } ${
                    selectedGenre === genre.id ? 'bg-red-600 text-white' : 'text-gray-300'
                  }`}
                  tabIndex={0}
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

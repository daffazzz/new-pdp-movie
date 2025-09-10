import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';
import { Star, Calendar, Clock, Play } from 'lucide-react';
import VideoPlayer from '../../components/VideoPlayer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MovieDetails, getImageUrl } from '../../lib/tmdb';

const MovieDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSpinner size="large" className="py-20" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl text-white">Movie not found</h1>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';

  return (
    <>
      <Head>
        <title>{movie.title} - PDP MOVIES</title>
        <meta name="description" content={movie.overview} />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Hero Section with Backdrop */}
        <div className="relative h-96 md:h-[500px]">
          {movie.backdrop_path && (
            <Image
              src={getImageUrl(movie.backdrop_path, 'w1280')}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{releaseYear}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{runtime}</span>
                </div>
                {movie.genres.map(genre => (
                  <span key={genre.id} className="bg-gray-700 px-2 py-1 rounded text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <button
                onClick={() => setShowPlayer(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Watch Now</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Player */}
              {showPlayer && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Watch Movie</h2>
                  <VideoPlayer movieId={movie.id} />
                </div>
              )}

              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>

              {/* Production Companies */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Production Companies</h2>
                  <div className="flex flex-wrap gap-4">
                    {movie.production_companies.map(company => (
                      <div key={company.id} className="bg-gray-800 rounded-lg p-4 text-center">
                        {company.logo_path && (
                          <Image
                            src={getImageUrl(company.logo_path, 'w200')}
                            alt={company.name}
                            width={100}
                            height={50}
                            className="mx-auto mb-2 object-contain"
                          />
                        )}
                        <p className="text-gray-300 text-sm">{company.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Poster */}
              <div className="sticky top-8">
                {movie.poster_path && (
                  <Image
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className="rounded-lg shadow-lg mx-auto"
                  />
                )}

                {/* Movie Info */}
                <div className="bg-gray-800 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Movie Info</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Release Date:</span>
                      <span className="text-white ml-2">
                        {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Runtime:</span>
                      <span className="text-white ml-2">{runtime}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white ml-2">{movie.vote_average.toFixed(1)}/10</span>
                    </div>
                    {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                      <div>
                        <span className="text-gray-400">Languages:</span>
                        <span className="text-white ml-2">
                          {movie.spoken_languages.map(lang => lang.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';
import { Star, Calendar, Tv, Play } from 'lucide-react';
import VideoPlayer from '../../components/VideoPlayer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TVDetails, Season, Episode, getImageUrl } from '../../lib/tmdb';
import { tmdbClient, isStaticEnvironment } from '../../lib/tmdb-client';

const TVDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [tvShow, setTVShow] = useState<TVDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTVDetails();
    }
  }, [id]);

  useEffect(() => {
    if (selectedSeason) {
      fetchSeasonEpisodes(selectedSeason.season_number);
    }
  }, [selectedSeason]);

  const fetchTVDetails = async () => {
    try {
      setIsLoading(true);
      
      let tvData;
      if (isStaticEnvironment()) {
        // Use direct TMDB API for Android/static environments
        tvData = await tmdbClient.getTVDetails(Number(id));
      } else {
        // Use Next.js API routes for web
        const response = await axios.get(`/api/tv/${id}`);
        tvData = response.data;
      }
      
      setTVShow(tvData);
      
      // Auto-select first season if available
      if (tvData.seasons && tvData.seasons.length > 0) {
        const firstSeason = tvData.seasons.find((s: Season) => s.season_number > 0) || tvData.seasons[0];
        setSelectedSeason(firstSeason);
      }
    } catch (error) {
      console.error('Error fetching TV show details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSeasonEpisodes = async (seasonNumber: number) => {
    try {
      setIsLoadingEpisodes(true);
      
      let seasonData;
      if (isStaticEnvironment()) {
        // Use direct TMDB API for Android/static environments
        seasonData = await tmdbClient.getTVSeason(Number(id), seasonNumber);
      } else {
        // Use Next.js API routes for web
        const response = await axios.get(`/api/tv/${id}/season/${seasonNumber}`);
        seasonData = response.data;
      }
      
      const episodeData = seasonData.episodes || [];
      setEpisodes(episodeData);
      
      // Auto-select first episode
      if (episodeData.length > 0) {
        setSelectedEpisode(episodeData[0]);
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setIsLoadingEpisodes(false);
    }
  };

  const handlePlayEpisode = (episode: Episode) => {
    setSelectedEpisode(episode);
    setShowPlayer(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSpinner size="large" className="py-20" />
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl text-white">TV Show not found</h1>
      </div>
    );
  }

  const firstAirYear = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A';

  return (
    <>
      <Head>
        <title>{tvShow.name} - PDP MOVIES</title>
        <meta name="description" content={tvShow.overview} />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Hero Section with Backdrop */}
        <div className="relative h-96 md:h-[500px]">
          {tvShow.backdrop_path && (
            <Image
              src={getImageUrl(tvShow.backdrop_path, 'w1280')}
              alt={tvShow.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {tvShow.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{tvShow.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{firstAirYear}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tv className="h-4 w-4" />
                  <span>{tvShow.number_of_seasons} Seasons</span>
                </div>
                {tvShow.genres.map(genre => (
                  <span key={genre.id} className="bg-gray-700 px-2 py-1 rounded text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              {selectedEpisode && (
                <button
                  onClick={() => handlePlayEpisode(selectedEpisode)}
                  className="tv-focusable bg-red-600 hover:bg-red-700 focus:bg-red-700 focus:ring-4 focus:ring-red-500/50 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:scale-105"
                  tabIndex={0}
                >
                  <Play className="h-5 w-5" />
                  <span>Watch S{selectedSeason?.season_number}E{selectedEpisode.episode_number}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Player */}
              {showPlayer && selectedEpisode && selectedSeason && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">
                    S{selectedSeason.season_number}E{selectedEpisode.episode_number}: {selectedEpisode.name}
                  </h2>
                  <VideoPlayer 
                    tvId={tvShow.id} 
                    season={selectedSeason.season_number} 
                    episode={selectedEpisode.episode_number} 
                  />
                </div>
              )}

              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {tvShow.overview || 'No overview available.'}
                </p>
              </div>

              {/* Season Selector */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Seasons</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {tvShow.seasons?.map(season => (
                    <button
                      key={season.id}
                      onClick={() => setSelectedSeason(season)}
                      className={`tv-focusable px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:scale-105 ${
                        selectedSeason?.id === season.id
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:bg-red-600 focus:text-white'
                      }`}
                      tabIndex={0}
                    >
                      Season {season.season_number}
                    </button>
                  ))}
                </div>
              </div>

              {/* Episodes List */}
              {selectedSeason && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Season {selectedSeason.season_number} Episodes
                  </h3>
                  
                  {isLoadingEpisodes ? (
                    <LoadingSpinner size="medium" className="py-8" />
                  ) : (
                    <div className="space-y-4">
                      {episodes.map(episode => (
                        <div
                          key={episode.id}
                          className="tv-focusable bg-gray-800 rounded-lg p-4 hover:bg-gray-700 focus:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none focus:scale-[1.02] transition-all duration-200 cursor-pointer"
                          onClick={() => handlePlayEpisode(episode)}
                          tabIndex={0}
                          role="button"
                          aria-label={`Play episode ${episode.episode_number}: ${episode.name}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handlePlayEpisode(episode);
                            }
                          }}
                        >
                          <div className="flex items-start space-x-4">
                            {episode.still_path && (
                              <Image
                                src={getImageUrl(episode.still_path, 'w300')}
                                alt={episode.name}
                                width={120}
                                height={68}
                                className="rounded object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-medium">
                                  {episode.episode_number}. {episode.name}
                                </h4>
                                {episode.vote_average > 0 && (
                                  <div className="flex items-center space-x-1 text-yellow-400">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span className="text-xs">{episode.vote_average.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                              {episode.overview && (
                                <p className="text-gray-400 text-sm line-clamp-2">
                                  {episode.overview}
                                </p>
                              )}
                              {episode.air_date && (
                                <p className="text-gray-500 text-xs mt-2">
                                  {new Date(episode.air_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Poster */}
              <div className="sticky top-8">
                {tvShow.poster_path && (
                  <Image
                    src={getImageUrl(tvShow.poster_path, 'w500')}
                    alt={tvShow.name}
                    width={300}
                    height={450}
                    className="rounded-lg shadow-lg mx-auto"
                  />
                )}

                {/* TV Show Info */}
                <div className="bg-gray-800 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Show Info</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">First Air Date:</span>
                      <span className="text-white ml-2">
                        {tvShow.first_air_date ? new Date(tvShow.first_air_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Seasons:</span>
                      <span className="text-white ml-2">{tvShow.number_of_seasons}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Episodes:</span>
                      <span className="text-white ml-2">{tvShow.number_of_episodes}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white ml-2">{tvShow.vote_average.toFixed(1)}/10</span>
                    </div>
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

export default TVDetail;

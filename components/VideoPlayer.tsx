import React from 'react';

interface VideoPlayerProps {
  movieId?: number;
  tvId?: number;
  season?: number;
  episode?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movieId, tvId, season, episode }) => {
  const getEmbedUrl = () => {
    if (movieId) {
      return `https://player.vidsrc.co/embed/movie/${movieId}`;
    } else if (tvId && season && episode) {
      return `https://player.vidsrc.co/embed/tv/${tvId}/${season}/${episode}`;
    }
    return '';
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Unable to load video player</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
        title="Video Player"
      />
    </div>
  );
};

export default VideoPlayer;

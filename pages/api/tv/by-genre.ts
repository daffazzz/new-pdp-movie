import { NextApiRequest, NextApiResponse } from 'next';
import { tmdbApi } from '../../../lib/tmdb';
import { setCacheHeaders, cacheConfigs } from '../../../lib/api-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { genre, page = 1 } = req.query;
    
    if (!genre) {
      return res.status(400).json({ message: 'Genre parameter is required' });
    }

    // Set cache for genre-based content
    setCacheHeaders(res, cacheConfigs.genre);

    const response = await tmdbApi.get('/discover/tv', {
      params: { 
        with_genres: genre,
        page,
        sort_by: 'popularity.desc'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching TV shows by genre:', error);
    res.status(500).json({ message: 'Error fetching TV shows by genre' });
  }
}

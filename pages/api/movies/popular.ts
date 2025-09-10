import { NextApiRequest, NextApiResponse } from 'next';
import { tmdbApi } from '../../../lib/tmdb';
import { setCacheHeaders, cacheConfigs } from '../../../lib/api-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { page = 1 } = req.query;
    
    // Set optimized cache headers for popular content
    setCacheHeaders(res, cacheConfigs.popular);

    const response = await tmdbApi.get('/movie/popular', {
      params: { page }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ message: 'Error fetching popular movies' });
  }
}

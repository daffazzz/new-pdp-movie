import { NextApiRequest, NextApiResponse } from 'next';
import { tmdbApi } from '../../../lib/tmdb';
import { setCacheHeaders, cacheConfigs } from '../../../lib/api-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Set long cache for genres (rarely change)
    setCacheHeaders(res, cacheConfigs.genres);
    
    const response = await tmdbApi.get('/genre/tv/list');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching TV genres:', error);
    res.status(500).json({ message: 'Error fetching TV genres' });
  }
}

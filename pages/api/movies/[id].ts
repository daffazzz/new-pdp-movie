import { NextApiRequest, NextApiResponse } from 'next';
import { tmdbApi } from '../../../lib/tmdb';
import { setCacheHeaders, cacheConfigs } from '../../../lib/api-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    // Set long cache for movie details
    setCacheHeaders(res, cacheConfigs.details);
    
    const response = await tmdbApi.get(`/movie/${id}`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ message: 'Error fetching movie details' });
  }
}

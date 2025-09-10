import { NextApiRequest, NextApiResponse } from 'next';
import { tmdbApi } from '../../lib/tmdb';
import { setCacheHeaders, cacheConfigs } from '../../lib/api-cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Set cache for search results
    setCacheHeaders(res, cacheConfigs.search);

    const response = await tmdbApi.get('/search/multi', {
      params: { 
        query,
        page 
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ message: 'Error searching' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { tmdbApi } from '../../../../../lib/tmdb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id, season } = req.query;
    const response = await tmdbApi.get(`/tv/${id}/season/${season}`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching season details:', error);
    res.status(500).json({ message: 'Error fetching season details' });
  }
}

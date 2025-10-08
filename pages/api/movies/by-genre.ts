import type { NextApiRequest, NextApiResponse } from 'next';
import { tmdb } from '../../../lib/tmdb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { genre, page, country } = req.query;

    if (typeof genre !== 'string' || typeof page !== 'string') {
      return res.status(400).json({ message: 'Invalid genre or page' });
    }

    try {
      const data = await tmdb.getMoviesByGenre(parseInt(genre), parseInt(page), country as string);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

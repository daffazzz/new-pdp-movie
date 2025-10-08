import type { NextApiRequest, NextApiResponse } from 'next';
import { tmdb } from '../../../lib/tmdb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page, country } = req.query;

    if (typeof page !== 'string') {
      return res.status(400).json({ message: 'Invalid page' });
    }

    try {
      const data = await tmdb.getPopularTVShows(parseInt(page), country as string);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

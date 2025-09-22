import type { NextApiRequest, NextApiResponse } from 'next';

type InstagramMediaItem = {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
};

type ErrorResponse = { error: string; detail?: any };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InstagramMediaItem[] | ErrorResponse>
) {
  // Optional: restrict to GET only
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { NEXT_PUBLIC_INSTAGRAM_ID, NEXT_PUBLIC_ACCESS_TOKEN } = process.env;

  if (!NEXT_PUBLIC_INSTAGRAM_ID || !NEXT_PUBLIC_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Missing Instagram API credentials' });
  }

  const queryParams = new URLSearchParams({
    fields: 'id,caption,media_url,media_type,permalink,timestamp',
    access_token: NEXT_PUBLIC_ACCESS_TOKEN,
    limit: '6',
  });

  const url = `https://graph.facebook.com/v19.0/${NEXT_PUBLIC_INSTAGRAM_ID}/media?${queryParams.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({
        error: 'Instagram API responded with an error',
        detail: errorData,
      });
    }

    const data = await response.json();

    const mediaItems = (data?.data ?? []) as InstagramMediaItem[];

    return res.status(200).json(mediaItems);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to fetch Instagram data',
      detail: error?.message ?? error,
    });
  }
}

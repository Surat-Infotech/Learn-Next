/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { paths } from '@/routes/paths';

type InstagramMediaItem = {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
};

export default function HomeFollowUsSection() {
  const [posts, setPosts] = useState<InstagramMediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/instagram');
        const data = await res.json();
        if (res.ok) {
          setPosts(data);
        } else {
          setError(data.error || 'Failed to load posts');
        }
      } catch (err) {
        setError('Network error');
      }
    };

    fetchPosts();
  }, []);

  if (error) return <center>Error: {error}</center>;
  return (
    <section className="follow-us-section">
      <div className="heading-block">
        <h2>Follow us on Instagram</h2>
        <Link href={paths.instagram.root} target="_blank">
          <i className="fa-brands fa-instagram" />
          <span>loosegrown_diamond</span>
        </Link>
      </div>
      <div className="image-container">
        {posts.map((item) => (
          <Link
            key={item.id}
            href={item.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {item.media_type === 'IMAGE' && (
              <img
                src={item.media_url}
                alt={item.caption || 'Instagram image'}
                className="w-full object-cover rounded-xl shadow"
                style={{
                  maxHeight: '320px',
                  maxWidth: '400px',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}

            {item.media_type === 'VIDEO' && (
              <video
                src={item.media_url}
                onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
                onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                // autoPlay
                loop
                muted
                className="w-full rounded-xl shadow"
                style={{ maxHeight: '320px', maxWidth: '400px', objectFit: 'cover' }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { formatDate } from 'date-fns';

import { IBlog } from '@/api/blog/types';

import HtmlContent from '@/utils/html-content';

import { paths } from '@/routes/paths';
import StaticImg from '@/assets/image/blog-1.jpg';

const BlogCard: FC<IBlog> = (props) => {
  const { title, created_at, content, slug, cover_image, cover_image_alt, date, category_id } = props;
  const category = `${category_id.slug.replaceAll('_', '-')}`
  return (
    <div className="col-lg-4">
      <Link href={paths.blog.details(category, slug)} style={{ textDecoration: "none" }} >
        <div className="card border-0">
          <Image src={cover_image || StaticImg} className="card-img-top img-fluid" alt={cover_image_alt || title} width={100} height={100} />
          <div className="card-body">
            <h2>
              <a href={paths.blog.details(category, slug)} className="card-title text-decoration-none">
                {title}
              </a>
            </h2>
            {content && (
              <div className="blog-text">
                <p className="card-text fw-normal">
                  <HtmlContent html={content} />
                </p>
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center">
              <Link
                href={paths.blog.details(category, slug)}
                className="arrow-icon d-flex justify-content-center align-items-center rounded-circle"
              >
                <i className="fa fa-long-arrow-right" />
              </Link>
              <p className="date-diaplay">{formatDate(new Date(date || created_at), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;

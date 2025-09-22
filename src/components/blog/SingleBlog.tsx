import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { formatDate } from 'date-fns';
import ReactHtmlParser from 'react-html-parser';

import { ISingleBlog } from '@/api/blog';

const SingleBlogPage: FC<ISingleBlog> = (props) => {
  const { author_id, content, created_at, title, meta_data, meta_description, meta_keywords, related_blogs, category_id, date } = props;
  return (
    <>
      <Head>
        <title>{meta_data}</title>
        <meta name="description" content={meta_description} />
        <meta name="keywords" content={meta_keywords?.join(", ")} />
      </Head>
      <div className="py_30 min-h-454">
        <div className="single_blog_section mx-auto mt_35">
          <div className="container">
            <h2 className="blog_title mb_20">{title}</h2>
            <div className="line mb_30 d-flex align-items-center">
              <p className="blog_author me-2">
                Posted on {formatDate(new Date(date || created_at), 'MMMM d, yyyy')} by{' '}
                <span style={{ color: "#314185", fontWeight: "600" }} >
                  {' '}
                  {author_id?.first_name} {author_id?.last_name}
                </span>
              </p>|
              {
                category_id.name && <p className='blog_author mx-2'>{category_id.name}</p>
              }
            </div>
            <div className="blog_text mb_20">{ReactHtmlParser(content)} </div>
            {related_blogs.length > 0 &&
              <div className='row'>
                <div className="related-posts my-3 mb-5 " >
                  <h2 className='text-uppercase' >Related Posts</h2>
                  <div className="border-line" />
                </div>

                {related_blogs.map((item: any) => (
                  <div className='col-md-4'>
                    <Link href={`/blog/${category_id.name?.replace(' ', '-').toLowerCase()}/${item.slug}`} className='text-decoration-none'>
                      <div className='post-card'>
                        <figure className='post-card-body' >
                          <div className='position-relative'>
                            <Image src={item.cover_image} alt={item.title} layout="responsive" width={100} height={124} />
                            <button type='button' className='common_btn sm_common_btn read-more-btn'>Read More</button>
                          </div>
                          <Link href="">{item.title}</Link>
                          <div className="post_text mb_20">{ReactHtmlParser(item.content)} </div>
                        </figure>
                      </div>
                    </Link>
                  </div>
                ))
                }
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlogPage;

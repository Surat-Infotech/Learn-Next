import Image from 'next/image';
import { useState, useEffect } from 'react';

import { signOut } from 'next-auth/react';

import { Group, Center, Pagination } from '@mantine/core';

import { IBlog } from '@/api/blog';
import { blogApi } from '@/api/blog/blog';

import { TBreadcrumbs } from '@/components/ui/breadcrumbs';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';

import BlogCard from '../BlogCard';

interface BlogData {
  totalPages: number;
  data: IBlog[];
  page: number;
}

export default function BlogList({ breadcrumbs }: any) {
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState<BlogData | any>(null);
  const [status, setStatus] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setData(null);
      setStatus('loading' as any);
      try {
        const { data: res, status: __status } = await blogApi.getAll(pageNumber);
        setData(res.data as any);
        setStatus(__status as any);
      } catch (error) {
        if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
        setStatus(400 as any);
      }
    };

    fetchData();
  }, [pageNumber]);

  return (
    <div>
      <TBreadcrumbs items={breadcrumbs} />
      <div className="mt_60 py_30 min-h-454">
        <div className="loosgrown-blog">
          <div className="container-fluid">
            {status === 400 && (
              <div className="text-center my-5 text-danger">
                <div>Oops! Something went wrong. Please try again.</div>
              </div>
            )}
            {status === 'loading' && (
              <div className="py_40">
                <div className="text-center">
                  <Image src={LoadingImage} alt="loader" width={30} height={30} />
                </div>
              </div>
            )}
            {status === 200 && data && (
              <>
                <div className="row gy-5">
                  {data &&
                    (data?.data as any).map((item: any) => <BlogCard key={item._id} {...item} />)}
                </div>
                <Center m={24} mb={50} mt={80}>
                  <Pagination.Root
                    value={pageNumber}
                    onChange={setPageNumber}
                    total={data && (data?.totalPages as any)}
                    siblings={1}
                    defaultValue={data.page as number | any}
                    className="custom-pagination"
                  >
                    <Group gap={5} justify="center">
                      <Pagination.First onClick={() => setPageNumber((p) => Math.max(1, p - 1))} />
                      <Pagination.Items />
                      <Pagination.Last
                        onClick={() => setPageNumber((p) => Math.min(data.totalPages, p + 1))}
                      />
                    </Group>
                  </Pagination.Root>
                </Center>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';

import { collectionApi } from '@/api/collection';
import { inventoriesQuery } from '@/api/inventory/inventory';

import { InventoryProvider } from '@/stores/inventory.context';

import { withSsrProps } from '@/utils/page';

import DiamondCollection from '@/sections/collections/view/DiamondCollection';
import SettingCollection from '@/sections/collections/view/SettingCollection';

// ----------------------------------------------------------------------

export type IMetaFields = {
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  title: string;
  sub_title: string;
};

const CollectionSlugPage: NextPage = () => {
  const router = useRouter();
  const { query } = useRouter();
  const [metaDetails, setMetaDetails] = useState<IMetaFields | null>(null);
  const { data: rangeDetails } = useQuery(inventoriesQuery.range());

  const heading = metaDetails?.title || '';
  const content = metaDetails?.sub_title || '';

  useEffect(() => {
    const { Slug, ...restQuery } = query;
    if (!query.c_type)
      router.replace(
        {
          pathname: window.location.pathname,
          query: {
            ...restQuery,
            c_type: window.location.pathname?.includes('/engagement-ring') ? 'setting' : 'diamond',
          },
        },
        undefined,
        { shallow: true }
      );
  }, [query, query.c_type, router]);

  useEffect(() => {
    (async () => {
      if (query.Slug && typeof query.Slug === 'string') {
        const { data, status } = await collectionApi.getMetaDetailsBySlugs({
          slugs: [query.Slug],
          fields: ['meta_title', 'meta_description', 'meta_keywords', 'title', 'sub_title'],
        });
        if (status === 200) setMetaDetails(data.data?.[0]);
      }
    })();
  }, [query.Slug]);

  return (
    <>
      <Head>
        <title>{metaDetails?.meta_title || 'Collection'}</title>
        <meta name="description" content={metaDetails?.meta_description || ''} />
        <meta name="keywords" content={metaDetails?.meta_keywords?.join(', ') || ''} />
      </Head>
      <div className="min-h-454">
        {query?.c_type === 'diamond' ? (
          <InventoryProvider>
            <DiamondCollection heading={heading} content={content} range={rangeDetails} />
          </InventoryProvider>
        ) : (
          query?.c_type === 'setting' && (
            <InventoryProvider>
              <SettingCollection heading={heading} content={content} />
            </InventoryProvider>
          )
        )}
      </div>
    </>
  );
};

export default CollectionSlugPage;

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q }) => {
    await q.fetchQuery(inventoriesQuery.range());
  },
});

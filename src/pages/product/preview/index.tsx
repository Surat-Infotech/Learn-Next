'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { NextPage } from 'next';

import { previewApi } from '@/api/preview';

import { withSsrProps } from '@/utils/page';

import { ProductDetailView } from '@/sections/product-category/view';

import LoadingImage from '@/assets/image/Loading.gif';

// -----------------------------------------------------------------------

const ProductPreview: NextPage = () => {
  const [previewData, setPreviewData] = useState<null | any>(null);
  const searchParams = useSearchParams();
  const user_id = searchParams.get('user_id');

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    {
      title: previewData?.name ?? '',
      isActive: true,
    },
  ].filter((b) => b !== null) as any;

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const { data } = await previewApi.get(user_id as string);
        if (data.isSuccess) {
          setPreviewData(data.data?.product_json);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user_id) fetchPreviewData();
  }, [user_id]);

  return (
    <div>
      {previewData ? (
        <ProductDetailView
          product={previewData}
          breadcrumbs={breadcrumbs}
          enableRingBuilder={previewData?.product_type === 'ring_setting'}
        />
      ) : (
        <div className="min-h-454">
          <div className="py_40 mb-5 mt-4 mt-sm-0">
            <div className="text-center">
              <Image src={LoadingImage} alt="loader" width={30} height={30} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default ProductPreview;

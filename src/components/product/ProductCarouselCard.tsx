/* eslint-disable import/no-extraneous-dependencies */
import { useRouter } from 'next/router';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import { IMatchingProducts } from '@/api/product';

import { useRingBuilderContext } from '@/stores/ring-builder.context';

import { paths } from '@/routes/paths';

import ProductCard from './ProductCard';

interface ProductCarouselProps {
  matching_product: IMatchingProducts[];
  category: any[];
  showCart: number;
}

const ProductCarousel = ({ matching_product, showCart, category }: ProductCarouselProps) => {
  const { pathname } = useRouter();
  const { ringSetting } = useRingBuilderContext();

  const getURL = (category_slug: any[]) => {
    const categoriesArr = category_slug?.map((c) => c.slug) || [];

    if (categoriesArr.includes('melee-diamond')) {
      return 'product/lab-created-melee-diamond';
    }
    if (categoriesArr.includes('round-shape-diamonds')) {
      return 'product/round-shape-calibrated-diamonds';
    }
    if (categoriesArr.includes('princess-cut-diamonds')) {
      return 'product/princess-shape-cvd-type-lla-diamonds';
    }
    if (categoriesArr.includes('pear-shape-diamonds')) {
      return 'product/pear-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr.includes('oval-cut-diamonds')) {
      return 'product/oval-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr.includes('oval-cut-diamonds')) {
      return 'product/oval-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr.includes('marquise-shape-diamonds')) {
      return 'product/marquise-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr.includes('heart-shape-diamonds')) {
      return 'product/heart-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr.includes('emerald-cut-diamonds')) {
      return 'product/emerald-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr.includes('fancy-pink-diamonds')) {
      return 'product/pink-color-diamond';
    }
    if (categoriesArr.includes('intense-pink-diamonds')) {
      return 'product/intense-pink-color-diamond';
    }
    if (categoriesArr.includes('fancy-yellow-diamonds')) {
      return 'product/yellow-color-diamond';
    }
    if (categoriesArr.includes('light-green-diamonds')) {
      return 'product/green-color-diamond';
    }
    if (categoriesArr.includes('fancy-purple-diamonds')) {
      return 'product/purple-color-diamond';
    }
    if (categoriesArr.includes('fancy-blue-diamonds')) {
      return 'product/blue-color-diamond';
    }
    if (categoriesArr?.includes('cushion-cut-diamonds')) {
      return 'product/cushion-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr?.includes('baguette-cut-diamonds')) {
      return 'product/baguette-shape-lab-grown-hpht-diamond';
    }
    if (categoriesArr?.includes('old-mine-cut-diamonds')) {
      return 'product/old-mine-cut-lab-grown-hpht-diamonds';
    }
    if (categoriesArr?.includes('old-european-cut-diamonds')) {
      return 'product/old-european-cut-lab-grown-hpht-diamonds';
    }
    if (categoriesArr?.includes('shield-shape–lab-grown-hpht-diamonds')) {
      return 'product/shield-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr?.includes('hexagon-shape–lab-grown-hpht-diamonds')) {
      return 'product/hexagon-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr?.includes('trapezoid-shape–lab-grown-hpht-diamonds')) {
      return 'product/trapezoid-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr?.includes('tapper-baguette-shape–lab-grown-hpht-diamonds')) {
      return 'product/tapper-baguette-shape-lab-grown-hpht-diamonds';
    }
    if (categoriesArr?.includes('triangle-shape-diamonds')) {
      return 'product/triangle-shape-lab-grown-hpht-diamonds';
    }

    const findParentSlug: any = (category as any[])?.find(
      (item) => categoriesArr.includes(item.slug) && item.slug
    );
    const findSubCategorySlug: any = categoriesArr.filter((item) => item !== findParentSlug?.slug);
    const viewSlug =
      findParentSlug?.slug !== undefined
        ? `${findParentSlug.slug}/${findSubCategorySlug?.[1] || findSubCategorySlug?.[0] || ''}`
        : `${findSubCategorySlug?.[1] || findSubCategorySlug?.[0] || ''}`;
    if (viewSlug.includes('engagement-rings')) {
      return `engagement-rings/${viewSlug.split('/')?.[1]}/${viewSlug.split('/').pop()}`;
    }
    return viewSlug;
  };

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={showCart}
      navigation
      pagination={false}
      loop={false}
    >
      {matching_product.map((item) => {
        const url = getURL(item?.category);
        return (
          <SwiperSlide key={item._id}>
            <ProductCard
              productUrl={(slug: string) => `/${url}/${paths.product.details(slug)}`}
              product={item}
              isSimilarProduct
              settingPrice={pathname.startsWith(paths.buildRing.root)}
              isSelected={ringSetting?.product?._id === item._id}
              {...item}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ProductCarousel;

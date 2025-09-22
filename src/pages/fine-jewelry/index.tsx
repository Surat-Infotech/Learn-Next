import { useQuery } from '@tanstack/react-query';
import { NextPage, InferGetServerSidePropsType } from 'next';

import { IProductCategory, productCategoriesQuery } from '@/api/product-category';

import { withSsrProps } from '@/utils/page';

import { ProductCategoryView } from '@/sections/product-category/view';

// ----------------------------------------------------------------------

const FineJewelry: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const { data: category } = useQuery({
    ...productCategoriesQuery.all(),
    select: (data) => data.filter((item) => !item.parent_id),
  });

  const dynamicCategories: any = {};
  const mainCategories: IProductCategory[] | any = category;

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: 'Fine Jewelry', isActive: true },
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const i of mainCategories) {
    const { slug, name } = i;
    if (
      ['earrings', 'pendants', 'wedding-rings', 'bracelets', 'chains', 'necklaces'].includes(slug)
    ) {
      dynamicCategories[slug] = { url: i.thumbnail, name, slug };
    }
  }

  const subcategories = [
    {
      heading: dynamicCategories?.earrings?.name,
      backgroundImageSrc: dynamicCategories?.earrings?.url,
      showMore: {
        href: `/${dynamicCategories?.earrings?.slug}`,
      },
    },
    {
      heading: dynamicCategories?.pendants?.name,
      backgroundImageSrc: dynamicCategories?.pendants?.url,
      showMore: {
        href: `/${dynamicCategories?.pendants?.slug}`,
      },
    },
    {
      heading: dynamicCategories?.['wedding-rings']?.name,
      backgroundImageSrc: dynamicCategories?.['wedding-rings']?.url,
      showMore: {
        href: `/${dynamicCategories?.['wedding-rings']?.slug}`,
      },
    },
    {
      heading: dynamicCategories?.bracelets?.name,
      backgroundImageSrc: dynamicCategories?.bracelets?.url,
      showMore: {
        href: `/${dynamicCategories?.bracelets?.slug}/diamond-tennis-bracelets`,
      },
    },
    {
      heading: dynamicCategories?.chains?.name,
      backgroundImageSrc: dynamicCategories?.chains?.url,
      showMore: {
        href: `/${dynamicCategories?.chains?.slug}`,
      },
    },
    {
      heading: dynamicCategories?.necklaces?.name,
      backgroundImageSrc: dynamicCategories?.necklaces?.url,
      showMore: {
        href: `/${dynamicCategories?.necklaces?.slug}/diamond-necklaces`,
      },
    },
  ];

  // category?.map((c) => ({
  //   heading: c.name,
  //   backgroundImageSrc: !isEmpty(c.thumbnail) ? c.thumbnail : FallbabkImg.src,
  //   showMore: { href: paths.productCategory.details(c.slug) },
  // })) ?? [];

  return (
    <ProductCategoryView
      heading="Shop Fine Jewelry"
      content={`Browse through our fine jewelry collection of lab-grown/lab-created diamonds.
    Pick your favorite pair of diamond earrings, bracelets, rings, and more among our carefully
    curated selection, promising timeless elegance with great value and exquisite quality.`}
      breadcrumbs={breadcrumbs}
      categories={subcategories}
    />
  );
};

export default FineJewelry;

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q }) => {
    await q.fetchQuery(productCategoriesQuery.all());
  },
});

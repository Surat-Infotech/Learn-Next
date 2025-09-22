import Head from 'next/head';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { NextPage, InferGetServerSidePropsType } from 'next';

import { productApi } from '@/api/product';
import { productCategoriesQuery } from '@/api/product-category';

import { withSsrProps } from '@/utils/page';

import { ProductSubCategoryView } from '@/sections/product-category/view';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

const ProductSubCategory: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const { query } = useRouter();
  const pathname = usePathname();
  const categorySlug = query.category as string;
  const subCategorySlug = query.subCategory as string;

  const { data: category } = useQuery(productCategoriesQuery.get(categorySlug));

  const subCategory = category?.subCategories.find((c) => c.slug === subCategorySlug);

  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: category?.name ?? '', href: paths.productCategory.details(categorySlug) },
    { title: subCategory?.name ?? '', isActive: true },
  ];

  if (!category || !subCategory) {
    return null;
  }

  const getTitle = () => {
    switch (subCategorySlug) {
      case `diamond-stud-earrings`:
        return {
          title: 'Diamond Stud Earrings for Women | Lab Grown Stud Earrings',
          description:
            'Simple yet stunning, these stud earrings showcase brilliant gemstones, offering a classic look for daily wear or special occasions. Buy Now!!',
        };
      case `hoops-and-drops`:
        return {
          title: 'Hoops and Drops Earrings | Drop Earrings | Infinity Hoop Diamond Earrings',
          description:
            'Elevate your style with sleek hoops and drop earrings, combining modern elegance and versatility for any occasion. Perfect for everyday wear or special events.',
        };
      case `halo-earrings`:
        return {
          title: 'Buy Lab Grown Diamond Halo Earrings | Halo Diamond Earrings',
          description:
            'Halo earrings offer timeless beauty, with a striking central stone encircled by dazzling diamonds, perfect for adding extra brilliance to your style.',
        };
      case `cluster-earrings`:
        return {
          title: 'Diamond Cluster Earrings | Small Diamond Earrings For Women',
          description:
            'Add sparkle to your style with elegant cluster earrings, featuring multiple stones set together for a dazzling effect that adds elegance and sophistication to any outfit.',
        };
      case `diamond-rings`:
        return {
          title: 'Diamond Wedding Bands at Loose Grown Wholesale Price',
          description:
            'A diamond band offers timeless elegance, featuring rows of sparkling diamonds set in sleek metal, Perfect for weddings, anniversaries, or adding a touch of special occasions.',
        };
      case `anniversary-rings`:
        return {
          title: 'Anniversary Rings | Lab Grown Diamond Anniversary Band',
          description:
            'Celebrate your love with our exquisite anniversary rings. Each design features timeless elegance and superior craftsmanship, symbolizing the enduring bond between you and your partner.',
        };
      case `eternity-rings`:
        return {
          title: 'Diamond Eternity Band | Buy Lab Diamond Wedding Band',
          description:
            'Our eternity rings blend contemporary design with brilliant diamonds, offering a chic and radiant choice to signify enduring love and everlasting beauty.',
        };
      case `stackable-rings`:
        return {
          title: 'Shop Diamond Stackable Rings | Stackable Wedding Bands',
          description:
            'Our stackable rings offer endless possibilities for creating a custom, layered look. Choose from various styles to express your individuality and enhance any outfit.',
        };
      case `solitaire-pendants`:
        return {
          title: 'Diamond Solitaire Pendants | Latest Lab Diamond Pendant Designs',
          description:
            'Discover our collection of exquisite solitaire pendants. Simple yet striking, each pendant showcases a single, dazzling gem, making it an ideal choice for a refined and elegant accessory.',
        };
      case `halo-pendants`:
        return {
          title: 'Diamond Halo Pendants | Shop Best Halo Diamond Pendants Online',
          description:
            'Shop online for attractive halo pendants from Wholesale Labground Diamonds. A halo pendant has a central gemstone surrounded by smaller stones that gives it a striking look.',
        };
      case `diamond-pendants`:
        return {
          title: 'Lab Diamond Pendant | Buy White Yellow Rose Gold & Platinum Pendant',
          description: `Create your own unique pendant with wholsale labgrowndiamond's customizable pendant settings.Which perfect for adding a touch of luxury to your look.`,
        };
      case `diamond-tennis-bracelets`:
        return {
          title: 'Lab Grown Diamond Tennis Bracelets | CVD Diamond Bracelet',
          description: `Tennis bracelets feature a stunning line of sparkling diamonds or gemstones. Choose your favourite look with a tennis bracelet. Available in white gold, yellow gold, rose gold, and platinum.`,
        };
      case `diamond-necklaces`:
        return {
          title: 'Shop Lab Grown Diamond Tennis Necklaces ',
          description: `Tennis necklaces offer a sleek, elegant design featuring a continuous line of sparkling diamonds or gems, perfect for adding timeless sophistication to any outfit.`,
        };
      default:
        return { title: '', description: '' };
    }
  };

  return (
    <>
      <Head>
        <title>{getTitle().title || `${subCategory?.name}`}</title>
        <meta name="description" content={getTitle().description || ''} />
      </Head>
      <div className="min-h-454">
        <ProductSubCategoryView
          heading={subCategory.name}
          styleFilterHide
          content={subCategory.description}
          breadcrumbs={breadcrumbs}
          categorySlug={subCategorySlug}
          enableFilter={!pathname.startsWith('/product-category/melee_diamond')}
          //
          productUrl={(customSlug) =>
            paths.productCategory.subCategory.details(categorySlug, subCategorySlug, customSlug)
          }
        />
      </div>
    </>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
  prefetch: async ({ q, ctx }) => {
    const categorySlug = ctx.params?.category as string;
    const subCategorySlug = ctx.params?.subCategory as string;

    await q.fetchQuery(productCategoriesQuery.get(categorySlug));

    const filter = { slug: subCategorySlug };
    const initialPageParam = 1;
    const pageSize = 20;
    const sort = { sale_price: -1 };

    await q.fetchInfiniteQuery({
      queryKey: [
        '_products',
        'filter',
        {
          filter,
          page: initialPageParam,
          pageSize,
          sort,
        },
      ],
      queryFn: async ({ pageParam: page = 1 }) => {
        const { data: _data } = await productApi.filter({
          filter,
          page,
          pageSize,
          sort,
        });
        return _data.data;
      },
      initialPageParam,
    });
  },
});

export default ProductSubCategory;

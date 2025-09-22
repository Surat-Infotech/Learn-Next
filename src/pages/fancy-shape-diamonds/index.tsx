import React from 'react'

import { useQuery } from '@tanstack/react-query';
import { NextPage, InferGetServerSidePropsType } from 'next';

import { IProductCategory, productCategoriesQuery } from '@/api/product-category';

import { withSsrProps } from '@/utils/page';

import { ProductCategoryView } from '@/sections/product-category/view'

import { paths } from '@/routes/paths';

const ColorMeleeDiamonds: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
    const { data: allSubCategory } = useQuery({
        ...productCategoriesQuery.all(),
        select: (data) => data.filter((item) => item.parent_id),
    });

    const dynamicCategories: any = {};
    const subCategories: IProductCategory[] | any = allSubCategory;

    // eslint-disable-next-line no-restricted-syntax
    for (const i of subCategories) {
        const { slug, name, thumbnail } = i;
        if (['princess-cut-diamonds', 'cushion-cut-diamonds', 'heart-shape-diamonds', 'marquise-shape-diamonds', 'pear-shape-diamonds', 'oval-cut-diamonds', 'emerald-cut-diamonds', 'baguette-cut-diamonds', 'old-mine-cut-diamonds', 'old-european-cut-diamonds', 'triangle-shape-diamonds', 'shield-shape-diamonds', 'hexagon-shape-diamonds', 'trapezoid-shape-diamonds', 'tapper-baguette-diamonds'].includes(slug)) {
            dynamicCategories[slug] = { url: thumbnail, name, slug }
        }
    }

    const breadcrumbs = [
        { title: 'Home', href: '/' },
        { title: 'Fancy Shape Diamonds', isActive: true },
    ];

    const fancyShapesDiamonds = [
        {
            heading: dynamicCategories?.["princess-cut-diamonds"]?.name,
            backgroundImageSrc: dynamicCategories?.["princess-cut-diamonds"]?.url,
            showMore: {
                href: `${paths.product.root}/princess-shape-cvd-type-lla-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['pear-shape-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['pear-shape-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/pear-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['oval-cut-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['oval-cut-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/oval-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['marquise-shape-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['marquise-shape-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/marquise-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['heart-shape-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['heart-shape-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/heart-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['emerald-cut-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['emerald-cut-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/emerald-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['cushion-cut-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['cushion-cut-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/cushion-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['baguette-cut-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['baguette-cut-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/baguette-shape-lab-grown-hpht-diamond`,
            },
        },
        {
            heading: dynamicCategories?.['old-mine-cut-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['old-mine-cut-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/old-mine-cut-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['old-european-cut-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['old-european-cut-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/old-european-cut-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['shield-shape-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['shield-shape-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/shield-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['hexagon-shape-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['hexagon-shape-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/hexagon-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['trapezoid-shape-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['trapezoid-shape-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/trapezoid-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['triangle-shape-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['triangle-shape-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/triangle-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.['tapper-baguette-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['tapper-baguette-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/tapper-baguette-shape-lab-grown-hpht-diamonds`,
            },
        },
    ]

    return (
        <div>
            <ProductCategoryView
                heading="Melee Fancy Shape Lab Created Diamonds"
                content="Looking for a ‘not so mainstream’ stone to stand out and radiate elegance? These melee fancy shaped diamonds will get the work done for you."
                breadcrumbs={breadcrumbs}
                categories={fancyShapesDiamonds}
            />
        </div>
    )
}

export default ColorMeleeDiamonds;

export const getServerSideProps = withSsrProps({
    isProtected: false,
    prefetch: async ({ q }) => {
        await q.fetchQuery(productCategoriesQuery.all());
    },
});

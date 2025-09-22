

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

    const breadcrumbs = [
        { title: 'Home', href: '/' },
        { title: 'Color Melee Diamonds', isActive: true },
    ];
    const dynamicCategories: any = {};
    const subCategories: IProductCategory[] | any = allSubCategory;

    // eslint-disable-next-line no-restricted-syntax
    for (const i of subCategories) {
        const { slug, name, thumbnail } = i;
        if (['fancy-blue-diamonds', 'fancy-pink-diamonds', 'fancy-purple-diamonds', 'fancy-yellow-diamonds', 'light-green-diamonds', 'intense-pink-diamonds'].includes(slug)) {
            dynamicCategories[slug] = { url: thumbnail, name, slug }
        }
    }

    const colorMeleeCategories = [
        {
            heading: dynamicCategories?.['fancy-pink-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['fancy-pink-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/pink-color-diamond`,
            },
        },
        {
            heading: dynamicCategories?.['intense-pink-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['intense-pink-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/intense-pink-color-diamond`,
            },
        },
        {
            heading: dynamicCategories?.['fancy-yellow-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['fancy-yellow-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/yellow-color-diamond`,
            },
        },
        {
            heading: dynamicCategories?.['light-green-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['light-green-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/green-color-diamond`,
            },
        },
        {
            heading: dynamicCategories?.['fancy-purple-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['fancy-purple-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/purple-color-diamond`,
            },
        },
        {
            heading: dynamicCategories?.['fancy-blue-diamonds']?.name,
            backgroundImageSrc: dynamicCategories?.['fancy-blue-diamonds']?.url,
            showMore: {
                href: `${paths.product.root}/blue-color-diamond`,
            },
        },
    ]

    return (
        <div>
            <ProductCategoryView
                heading="Shop Fancy Color Melee Diamonds"
                content="Loose Lab Grown fancy color diamonds are available in multiple fancy colors like pink, yellow, blue, green, and purple. These Lab-Grown color melee diamonds can be equipped with the main gem to give it an alluring appearance."
                breadcrumbs={breadcrumbs}
                categories={colorMeleeCategories}
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


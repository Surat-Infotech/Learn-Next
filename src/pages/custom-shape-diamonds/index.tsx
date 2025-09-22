/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { IProductCategory, productCategoriesQuery } from '@/api/product-category';

import { ProductCategoryCard, ProductCategoryWrapper } from '@/components/product';

import { paths } from '@/routes/paths';

const CustomShapeDiamonds = () => {
    const router = useRouter();

    const { data: allSubCategory } = useQuery({
        ...productCategoriesQuery.all(),
        select: (data) => data.filter((item) => item.parent_id),
    });

    const dynamicCategories: any = {};
    const subCategories: IProductCategory[] | any = allSubCategory;

    // eslint-disable-next-line no-restricted-syntax
    for (const i of subCategories || []) {
        const { slug, name, thumbnail } = i;
        if (['triangle-shape-diamonds', 'shield-shape-diamonds', 'hexagon-shape-diamonds', 'trapezoid-shape-diamonds', 'tapper-baguette-diamonds'].includes(slug)) {
            dynamicCategories[slug] = { url: thumbnail, name, slug }
        }
    }

    const customShapesDiamonds = [
        {
            heading: dynamicCategories?.["triangle-shape-diamonds"]?.name,
            backgroundImageSrc: dynamicCategories?.["triangle-shape-diamonds"]?.url,
            showMore: {
                href: `${paths.product.root}/triangle-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.["shield-shape-diamonds"]?.name,
            backgroundImageSrc: dynamicCategories?.["shield-shape-diamonds"]?.url,
            showMore: {
                href: `${paths.product.root}/shield-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.["hexagon-shape-diamonds"]?.name,
            backgroundImageSrc: dynamicCategories?.["hexagon-shape-diamonds"]?.url,
            showMore: {
                href: `${paths.product.root}/hexagon-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.["trapezoid-shape-diamonds"]?.name,
            backgroundImageSrc: dynamicCategories?.["trapezoid-shape-diamonds"]?.url,
            showMore: {
                href: `${paths.product.root}/trapezoid-shape-lab-grown-hpht-diamonds`,
            },
        },
        {
            heading: dynamicCategories?.["tapper-baguette-diamonds"]?.name,
            backgroundImageSrc: dynamicCategories?.["tapper-baguette-diamonds"]?.url,
            showMore: {
                href: `${paths.product.root}/tapper-baguette-shape-lab-grown-hpht-diamonds`,
            },
        },
    ]

    return (
        <>
            <div className='bc-type-1'>
                <div className='container-fluid position-relative'>
                    <h4 className='text-center fw-600 text-uppercase'>Custom Shape Diamonds</h4>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 justify-content-center">
                            <li className='breadcrumb-item'>
                                <Link href="/" className='text-black text-decoration-none'>Home</Link>
                            </li>
                            <li className='breadcrumb-item'>Custom Shape Diamonds</li>
                        </ol>
                    </nav>
                    <p onClick={() => router.back()} className='back-history cursor-pointer text-decoration-none d-none d-md-block'>Return to Previous Page</p>
                </div>
            </div>

            <div className='py_65'>
                <div className='container-fluid'>
                    <h2 className='fs-30 text-center mb_50 fw-400'>Custom Shape Lab Created Diamonds</h2>
                    <ProductCategoryWrapper>
                        {customShapesDiamonds.map((category, idx) => (
                            <ProductCategoryCard key={idx} {...category} />
                        ))}
                    </ProductCategoryWrapper>

                    <div className='rrp-desc mt-4 mt-md-5'>
                        <h6 className="fw-600">Loose Grown Diamond: Fancy Cut Lab Grown Diamond Manufacturer and Wholesaler</h6>
                        <p>Are you looking for lab-grown fancy cut diamonds manufacturer and wholesaler? At loose grown diamond, we are providing various types of fancy shape lab grown
                            diamonds such as princess cut lab grown diamonds, cushion cut lab grown diamonds, heart cut lab created diamonds, pear shape lab grown diamonds, oval cut lab created diamonds, and so many at our platform.
                            Buy lab created diamonds from us at wholesale prices as {`you're`} buying from the manufacturer directly.</p>

                        <h6 className="fw-600">Princess Cut Diamonds:</h6>
                        <p>Princess cut diamonds are the most popular fancy cut diamonds. The princess cut diamond was first created in 1980 by Betzalel Ambar and Israel Itzkowitz, buy princess cut diamonds at wholesale price from the manufacturer directly.</p>

                        <h6 className="fw-600">Cushion Cut Diamonds:</h6>
                        <p>Cushion cut diamonds are referred as old mine cut. Cushion cut diamonds have great fire and {`it's`} a solid combination of square cut diamonds with round corners.  Buy cushion cut diamonds at wholesale price for your engagement ring.</p>

                        <h6 className="fw-600">Heart-Shaped Diamonds:</h6>
                        <p>Heart shaped diamonds are more expensive than other fancy cut shape diamonds. Heart cut diamonds are rarest, pure and difficult cut shapes. Buy heart cut diamonds at wholesale price for your pendant.</p>

                        <h6 className="fw-600">Marquise Shape Diamonds:</h6>
                        <p>Marquise shape diamonds are the most vintage cut diamonds. It is also known as a boat-shaped diamond or an eye-shaped diamond.</p>

                        <h6 className="fw-600">Pear Shaped Diamonds:</h6>
                        <p>Pear shaped diamonds are a combination of round and marquise shapes together with a tapered point on one end. Buy pear shaped diamonds from manufacturer at wholesale price for your engagement ring.</p>

                        <h6 className="fw-600">Oval Cut Diamonds:</h6>
                        <p>Oval cut diamonds are the modified version along with brilliant cut of round shape diamonds. Buy Oval cut diamonds at wholesale price for your engagement ring.</p>

                        <h6 className="fw-600">Emerald Cut Diamonds:</h6>
                        <p>The emerald cut is the best suited for high-quality diamonds. {`It's `}also called one of the luxurious shapes for its long lines of facets and long rectangular shape. Make your emerald cut engagement ring by purchasing diamonds at wholesale price from us.</p>

                        <h6 className="fw-600">Baguette Cut Diamonds:</h6>
                        <p className='mb-0'>The baguette cut is the best suited for high quality diamonds. It looks like an emerald cut. Make your emerald cut engagement ring by purchasing baguette diamonds at wholesale price from us which will bring beautiful shapes to all types of your jewelry.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomShapeDiamonds

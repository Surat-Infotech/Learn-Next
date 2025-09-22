import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { paths } from '@/routes/paths'

// eslint-disable-next-line import/no-cycle
import { diamondShape } from './DiamondProduct'

const ShopByShape = () => (
    <div className="py-80" style={{ background: '#eee' }}>
        <div className="container-fluid">
            <div className="row row-gap-3">
                <p className="d-flex justify-content-center melee-shop-title">SHOP BY SHAPE</p>
                <div
                    className="d-flex justify-content-center column-gap-2 column-gap-md-3 column-gap-lg-4 row-gap-2 row-gap-md-3 row-gap-lg-5 diamond-shape-div"
                    style={{ flexWrap: 'wrap' }}
                >
                    {diamondShape.map((items) => (
                        <Link
                            href={`${paths.whiteDiamondInventory.root}?shape=${items.defaultValue}`}
                            className="melee-shop-box"
                        >
                            <Image src={items.img.src} alt={items.img.alt} width={80} height={80} />
                            <div className="mt-0 mt-md-2">
                                <span>{items.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

export default ShopByShape
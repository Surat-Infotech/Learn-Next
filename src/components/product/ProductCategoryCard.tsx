import Link from 'next/link';
import { FC, ReactNode, HTMLAttributes } from 'react';

import clsx from 'clsx';

// ----------------------------------------------------------------------

export type IProductCategoryCardItem = {
  heading: ReactNode;
  backgroundImageSrc: string;
  showMore: {
    title?: string;
    href: string;
  };
};

export type IProductCategoryCardProps = HTMLAttributes<HTMLDivElement> & IProductCategoryCardItem;

const ProductCategoryCard: FC<IProductCategoryCardProps> = (props) => {
  const { heading, backgroundImageSrc, showMore, className, ...other } = props;

  return (
    <div className={clsx('col-md-6', className)} {...other}>
      <div className="fancy_diamond_box" style={{ backgroundImage: `url(${backgroundImageSrc})` }}>
        <h2 className="fw-700 mb_40" >{heading}</h2>
        <Link href={showMore.href} className="btn">
          {showMore.title || 'Shop Now'}
        </Link>
      </div>
    </div>
  );
};

export default ProductCategoryCard;

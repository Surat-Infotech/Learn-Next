import { FC, HTMLAttributes } from 'react';

import clsx from 'clsx';

// ----------------------------------------------------------------------

export type IProductCategoryWrapperProps = HTMLAttributes<HTMLDivElement>;

const ProductCategoryWrapper: FC<IProductCategoryWrapperProps> = (props) => {
  const { children, className, ...other } = props;

  return (
    <div className={clsx('container-fluid mb-4', className)} {...other}>
      <div className="row gy-35 gx-30">{children}</div>
    </div>
  );
};

export default ProductCategoryWrapper;

import { FC, HTMLAttributes } from 'react';

import { clsx } from 'clsx';

// ----------------------------------------------------------------------

export type IProductHeaderWrapperProps = HTMLAttributes<HTMLDivElement>;

const ProductHeaderWrapper: FC<IProductHeaderWrapperProps> = (props) => {
  const { children, className, ...other } = props;

  return (
    <div className={clsx('banner_section', className)} {...other}>
      {children}
    </div>
  );
};

export default ProductHeaderWrapper;

import { FC, ReactNode, HTMLAttributes } from 'react';

import { clsx } from 'clsx';

// ----------------------------------------------------------------------

export type IProductHeaderProps = HTMLAttributes<HTMLDivElement> & {
  heading: string;
  content: ReactNode;
};

const ProductHeader: FC<IProductHeaderProps> = (props) => {
  const { heading, content, className, ...other } = props;

  return (
    <div className={clsx('container-fluid', className)} {...other}>
      <div className="engagement_rings_banner text-center">
        <h2 className="fw-600 font_montserrat" style={{ fontSize: "32px" }} >{heading}</h2>
        <p className="font_size_15">{content}</p>
      </div>
    </div>
  );
};

export default ProductHeader;

import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';

import clsx from 'clsx';

// ----------------------------------------------------------------------

export type IBreadcrumbItem = {
  title: string;
  href?: string;
  isActive?: boolean;
};

export type ITBreadcrumbsProps = HTMLAttributes<HTMLDivElement> & {
  items: IBreadcrumbItem[];
};

const TBreadcrumbs: FC<ITBreadcrumbsProps> = (props) => {
  const { items, className, ...other } = props;

  return (
    <div className={clsx('page_heading mb-3 mb-md-4', className)} {...other}>
      <div className="container-fluid">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            {items.map((item, index) => (
              <li
                key={index}
                className={clsx('breadcrumb-item', item.isActive && 'active pe-none')}
              >
                {item.isActive ? (
                  item.title
                ) : (
                  <Link href={item.href ?? ''} className="text-decoration-none text-black">
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default TBreadcrumbs;

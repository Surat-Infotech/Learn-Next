import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';

import clsx from 'clsx';

import { Menu, MenuProps } from '@mantine/core';

// ----------------------------------------------------------------------

export type IMenuItem = HTMLAttributes<HTMLLIElement> & {
  label: string;
  url: string;
  menuProps?: MenuProps;
};

const MenuItem: FC<IMenuItem> = (props) => {
  const { label, url, children, className, menuProps: _menuProps = {}, ...other } = props;

  const { zIndex = 1100, offset = 0, ...menuProps } = _menuProps;

  return (
    <li className={clsx('nav-item', className)} {...other}>
      <Menu shadow="md" trigger="hover" zIndex={zIndex} offset={offset} {...menuProps}>
        {/* Menu title */}
        <Menu.Target>
          <Link className="nav-link dropdown-toggle navTitle" href={url}>
            {label}

            {!!children && <i className="fa-solid fa-angle-down ms-1" />}
          </Link>
        </Menu.Target>

        {children}
      </Menu>
    </li>
  );
};

export default MenuItem;

import { FC } from 'react';
import Link from 'next/link';

import { Menu } from '@mantine/core';

import { useNavigation } from '@/hooks/useNavigation';

// ----------------------------------------------------------------------

export type IMenuLabDiamondsDropdownProps = {};

const MenuLabDiamondsDropdown: FC<IMenuLabDiamondsDropdownProps> = () => {
  const { labDiamondsMenu } = useNavigation();

  return (
    <Menu.Dropdown className="menu-wrapper">
      <ul className="text_widget mb-3 mb-lg-0 menu-list">
        {labDiamondsMenu.subMenu.map((link, index) => (
          <li key={index} className="menu-list-item">
            <Link href={link.link}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </Menu.Dropdown>
  );
};

export default MenuLabDiamondsDropdown;

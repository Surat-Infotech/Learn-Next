import { FC } from 'react';
import Link from 'next/link';

import { Menu } from '@mantine/core';

import { useNavigation } from '@/hooks/useNavigation';

// ----------------------------------------------------------------------

export type IMenuEducationDropdownProps = {};

const MenuEducationDropdown: FC<IMenuEducationDropdownProps> = () => {
  const { educationMenu } = useNavigation();

  const { diamondMenu, diamondGuideMenu, helpfulGuidesMenu, ringCollectionMenu } = educationMenu;

  return (
    <Menu.Dropdown className="menu-wrapper center-dropdown">
      <div className="row mx-0">
        {/* Diamond 4C’s */}
        <div className="col-3 border-right">
          {/* Menu label */}
          <h6 className="menu-list-title">{diamondMenu.label}</h6>

          {/* Sub-menu list */}
          <ul className="text_widget mb-3 mb-lg-0 menu-list">
            {diamondMenu.subMenu.map((sm) => (
              <li key={sm.label} className="menu-list-item">
                <Link href={sm.link} className="d-flex">
                  {sm.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Diamond Guide */}
        <div className="col-3 border-right">
          {/* Menu label */}
          <h6 className="menu-list-title">{diamondGuideMenu.label}</h6>

          {/* Sub-menu list */}
          <ul className="text_widget mb-3 mb-lg-0 menu-list">
            {diamondGuideMenu.subMenu.map((sm) => (
              <li key={sm.label} className="menu-list-item">
                <Link href={sm.link} className="d-flex">
                  {sm.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Helpful Guides */}
        <div className="col-3 border-right">
          {/* Menu label */}
          <h6 className="menu-list-title">{helpfulGuidesMenu.label}</h6>

          {/* Sub-menu list */}
          <ul className="text_widget mb-3 mb-lg-0 menu-list">
            {helpfulGuidesMenu.subMenu.map((sm) => (
              <li key={sm.label} className="menu-list-item">
                <Link href={sm.link} className="d-flex">
                  {sm.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ring Collections By Carat */}
        <div className="col-3 border-right">
          {/* Menu label */}
          <h6 className="menu-list-title">{ringCollectionMenu.label}</h6>

          {/* Sub-menu list */}
          <ul className="text_widget mb-3 mb-lg-0 menu-list">
            {ringCollectionMenu.subMenu.map((sm) => (
              <li key={sm.label} className="menu-list-item">
                <Link href={sm.link} className="d-flex">
                  {sm.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Menu.Dropdown>
  );
};

export default MenuEducationDropdown;

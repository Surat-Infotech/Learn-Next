import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Menu } from '@mantine/core';

import { useNavigation } from '@/hooks/useNavigation';

// ----------------------------------------------------------------------

export type IMenuFineJewelryDropdownProps = {};

const MenuFineJewelryDropdown: FC<IMenuFineJewelryDropdownProps> = () => {
  const { fineJewelryMenu } = useNavigation();

  return (
    <Menu.Dropdown className="menu-wrapper center-dropdown">
      <div className="row mx-0">
        {fineJewelryMenu.menuItems?.slice(0, 3).map((menuData, index) => (
          <div key={index} className="col-3 border-right">
            <h6 className="menu-list-title">
              <Link href={`${menuData.link}`}>{menuData.label}</Link>
            </h6>
            <ul className="text_widget mb-3 mb-lg-0 menu-list">
              {menuData.subMenu?.map((subMenuData) => (
                <li key={subMenuData.label} className="menu-list-item fine-menu-list-item">
                  <Link href={subMenuData.link} className="d-flex align-items-center">
                    <Image
                      src={subMenuData.src}
                      alt={subMenuData.label}
                      style={{ width: '30px', height: 'auto' }}
                    />
                    <span className="ms-1">{subMenuData.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-3">
          {fineJewelryMenu.menuItems?.slice(3, 5).map((menuData, index) => (
            <div key={index} className={`${index === 0 && 'mb-2'}`}>
              <h6 className="menu-list-title">
                <Link href={`${menuData.link}`}>{menuData.label}</Link>
              </h6>
              <ul className="text_widget mb-3 mb-lg-0 menu-list">
                {menuData.subMenu?.map((subMenuData) => (
                  <li key={subMenuData.label} className="menu-list-item fine-menu-list-item">
                    <Link href={subMenuData.link} className="d-flex align-items-center">
                      <Image
                        src={subMenuData.src}
                        alt={subMenuData.label}
                        style={{ width: '30px', height: 'auto' }}
                      />
                      <span className="ms-1">{subMenuData.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Menu.Dropdown>
  );
};

export default MenuFineJewelryDropdown;

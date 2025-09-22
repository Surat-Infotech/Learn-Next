import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { slice } from 'lodash';
import { useLocalStorage } from 'usehooks-ts';

import { Menu } from '@mantine/core';

import { useNavigation } from '@/hooks/useNavigation';

// ----------------------------------------------------------------------

export type IMenuDiamondCollectionsDropdownProps = {};

const MenuDiamondCollectionsDropdown: FC<IMenuDiamondCollectionsDropdownProps> = () => {
  const { diamondCollectionsMenu } = useNavigation();
  const { yourDiamondRing, shopByCarat, shopByShape } = diamondCollectionsMenu;
  const [diamondCollectionReset, setDiamondCollectionReset] = useLocalStorage<boolean>('diamondCollectionReset', false);
  return (
    <Menu.Dropdown className="menu-wrapper center-dropdown">
      <div className='menu-padding'>
        <div className="row gx-5">
          {/* Create your diamond ring */}
          <div className="col-3 border-right">
            {/* Menu label */}
            <h6 className="menu-list-title">{yourDiamondRing.label}</h6>

            {/* Sub-menu list */}
            <ul className="text_widget mb-3 mb-lg-0 menu-list">
              {yourDiamondRing.subMenu.map((sm) => (
                <li key={sm.label} className="menu-list-item">
                  <Link href={sm.link} className="d-flex align-items-center">
                    {sm.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop by shape */}
          <div className="col-5 border-right px-2">
            {/* Menu label */}
            <h6 className="menu-list-title">{shopByShape.label}</h6>

            {/* Sub-menu list */}
            <div className="d-flex">
              <div className="col-5">
                <ul className="text_widget mb-3 mb-lg-0 menu-list">
                  {slice(shopByShape.subMenu, 0, 5).map((sm) => (
                    <li key={sm.label} className="menu-list-item">
                      <Link href={sm.link} onClick={() => { setDiamondCollectionReset(true); }} className="d-flex align-items-center">
                        <Image
                          src={sm.src}
                          alt={sm.label}
                          width={20}
                          height={20}
                          style={{ width: '20px', height: 'auto' }}
                        />
                        <span className="ms-2">{sm.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-5">
                <ul className="text_widget mb-3 mb-lg-0 menu-list">
                  {slice(shopByShape.subMenu, 5, 10).map((sm) => (
                    <li key={sm.label} className="menu-list-item">
                      <Link href={sm.link} onClick={() => { setDiamondCollectionReset(true); }} className="d-flex align-items-center">
                        <Image
                          src={sm.src}
                          alt={sm.label}
                          width={20}
                          height={20}
                          style={{ width: '20px', height: 'auto' }}
                        />
                        <span className="ms-2">{sm.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Shop by carat */}
          <div className="col-4 px-2">
            {/* Menu label */}
            <h6 className="menu-list-title">{shopByCarat.label}</h6>

            {/* Sub-menu list */}
            <div className="d-flex">
              <div className="col-12">
                <ul className="text_widget mb-3 mb-lg-0 menu-list">
                  {slice(shopByCarat.subMenu, 0, 5).map((sm) => (
                    <li key={sm.label} className="menu-list-item">
                      <Link href={sm.link} onClick={() => { setDiamondCollectionReset(true); }} className="d-flex align-items-center">
                        <span className="ms-1">{sm.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Menu.Dropdown>
  );
};

export default MenuDiamondCollectionsDropdown;

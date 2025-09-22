
import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { slice } from 'lodash';
import { useLocalStorage } from 'usehooks-ts';

import { Menu } from '@mantine/core';

import { useNavigation } from '@/hooks/useNavigation';

// ----------------------------------------------------------------------

export type IMenuEngagementRingsDropdownProps = {};

const MenuEngagementRingsDropdown: FC<IMenuEngagementRingsDropdownProps> = () => {
  const { engagementRingsMenu } = useNavigation();
  const { yourDiamondRing, shopByStyle, shopByShape, shopByMetal } = engagementRingsMenu;
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

          {/* Shop by style */}
          <div className="col-3 border-right px-1 pe-4">
            {/* Menu label */}
            <h6 className="menu-list-title">{shopByStyle.label}</h6>

            {/* Sub-menu list */}
            <div className="d-flex">
              <div className="col-6">
                <ul className="text_widget mb-3 mb-lg-0 menu-list">
                  {slice(shopByStyle.subMenu, 0, 5).map((sm) => (
                    <li key={sm.label} className="menu-list-item">
                      <Link href={sm.link} onClick={() => { setDiamondCollectionReset(true); }} className="d-flex align-items-center">
                        <Image
                          src={sm.src}
                          alt={sm.label}
                          width={30}
                          height={30}
                          style={{ width: '30px', height: 'auto' }}
                        />
                        <span className="ms-1">{sm.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6">
                <ul className="text_widget mb-3 mb-lg-0 menu-list">
                  {slice(shopByStyle.subMenu, 5, 10).map((sm) => (
                    <li key={sm.label} className="menu-list-item">
                      <Link href={sm.link} onClick={() => { setDiamondCollectionReset(true); }} className="d-flex align-items-center">
                        <Image
                          src={sm.src}
                          alt={sm.label}
                          width={30}
                          height={30}
                          style={{ width: '30px', height: 'auto' }}
                        />
                        <span className="ms-1">{sm.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Shop by shape */}
          <div className="col-3 border-right  px-1">
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
                          width={30}
                          height={30}
                          style={{ width: '20px', height: 'auto' }}
                        />
                        <span className="ms-2">{sm.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-4">
                <ul className="text_widget mb-3 mb-lg-0 menu-list">
                  {slice(shopByShape.subMenu, 5, 10).map((sm) => (
                    <li key={sm.label} className="menu-list-item">
                      <Link href={sm.link} onClick={() => { setDiamondCollectionReset(true); }} className="d-flex align-items-center">
                        <Image
                          src={sm.src}
                          alt={sm.label}
                          width={30}
                          height={30}
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

          {/* Shop by metal */}
          <div className="col-3  px-1">
            {/* Menu label */}
            <h6 className="menu-list-title">{shopByMetal.label}</h6>

            {/* Sub-menu list */}
            <div className="d-flex">
              <div className="col-5">
                <ul className="text_widget mb-3 mb-lg-0 menu-list">
                  {slice(shopByMetal.subMenu, 0, 5).map((sm) => (
                    <li key={sm.label} className="menu-list-item">
                      <Link href={sm.link} onClick={() => { setDiamondCollectionReset(true); }} className="d-flex align-items-center">
                        <span className="ms-2">{sm.label}</span>
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

export default MenuEngagementRingsDropdown;





// import { FC } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// import { slice } from 'lodash';

// import { Menu } from '@mantine/core';

// import { useNavigation } from '@/hooks/useNavigation';

// // ----------------------------------------------------------------------

// export type IMenuEngagementRingsDropdownProps = {};

// const MenuEngagementRingsDropdown: FC<IMenuEngagementRingsDropdownProps> = () => {
//   const { engagementRingsMenu } = useNavigation();

//   const { yourDiamondRing, shopByStyle, shopByShape, shopByMetal } = engagementRingsMenu;

//   return (
//     <Menu.Dropdown className="menu-wrapper center-dropdown">
//       <div className='menu-padding'>
//         <div className="row gx-5">
//           {/* Create your diamond ring */}
//           <div className="col-3 border-right">
//             {/* Menu label */}
//             <h6 className="menu-list-title">{yourDiamondRing.label}</h6>

//             {/* Sub-menu list */}
//             <ul className="text_widget mb-3 mb-lg-0 menu-list">
//               {yourDiamondRing.subMenu.map((sm) => (
//                 <li key={sm.label} className="menu-list-item">
//                   <Link href={sm.link} className="d-flex align-items-center">
//                     {sm.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Shop by style */}
//           <div className="col-4 border-right px-2">
//             {/* Menu label */}
//             <h6 className="menu-list-title">{shopByStyle.label}</h6>

//             {/* Sub-menu list */}
//             <div className="d-flex">
//               <div className="col-6">
//                 <ul className="text_widget mb-3 mb-lg-0 menu-list">
//                   {slice(shopByStyle.subMenu, 0, 5).map((sm) => (
//                     <li key={sm.label} className="menu-list-item">
//                       <Link href={sm.link} className="d-flex align-items-center">
//                         <Image
//                           src={sm.src}
//                           alt={sm.label}
//                           style={{ width: '30px', height: 'auto' }}
//                         />
//                         <span className="ms-1">{sm.label}</span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="col-6">
//                 <ul className="text_widget mb-3 mb-lg-0 menu-list">
//                   {slice(shopByStyle.subMenu, 5, 10).map((sm) => (
//                     <li key={sm.label} className="menu-list-item">
//                       <Link href={sm.link} className="d-flex align-items-center">
//                         <Image
//                           src={sm.src}
//                           alt={sm.label}
//                           style={{ width: '30px', height: 'auto' }}
//                         />
//                         <span className="ms-1">{sm.label}</span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Shop by shape */}
//           <div className="col-5 px-2">
//             {/* Menu label */}
//             <h6 className="menu-list-title">{shopByShape.label}</h6>

//             {/* Sub-menu list */}
//             <div className="d-flex">
//               <div className="col-5">
//                 <ul className="text_widget mb-3 mb-lg-0 menu-list">
//                   {slice(shopByShape.subMenu, 0, 5).map((sm) => (
//                     <li key={sm.label} className="menu-list-item">
//                       <Link href={sm.link} className="d-flex align-items-center">
//                         <Image
//                           src={sm.src}
//                           alt={sm.label}
//                           style={{ width: '20px', height: 'auto' }}
//                         />
//                         <span className="ms-2">{sm.label}</span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="col-5">
//                 <ul className="text_widget mb-3 mb-lg-0 menu-list">
//                   {slice(shopByShape.subMenu, 5, 10).map((sm) => (
//                     <li key={sm.label} className="menu-list-item">
//                       <Link href={sm.link} className="d-flex align-items-center">
//                         <Image
//                           src={sm.src}
//                           alt={sm.label}
//                           style={{ width: '20px', height: 'auto' }}
//                         />
//                         <span className="ms-2">{sm.label}</span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Menu.Dropdown>
//   );
// };

// export default MenuEngagementRingsDropdown;


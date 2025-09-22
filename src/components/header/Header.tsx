/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState, useEffect, useCallback } from 'react';

import { useSession } from 'next-auth/react';
import { useLocalStorage } from 'usehooks-ts';

import { Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { searchApi } from '@/api/search';
import { IWhiteDiamond } from '@/api/inventory/types';
import { IColorDiamond } from '@/api/lab-created-colored-diamonds/types';

import { useNavigation } from '@/hooks/useNavigation';
import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { useProductContext } from '@/stores/product.context';

import { paths } from '@/routes/paths';
import UserImg from '@/assets/image/icon/user.svg';
import xIconSVG from '@/assets/image/x-symbol.svg';
import LoadingImage from '@/assets/image/Loading.gif';
import overNightImage from '@/assets/image/overNight.svg';
import ShippingImg from '@/assets/image/logo/Ship_icon.svg';
import ShoppingCartImg from '@/assets/image/icon/shopping_cart.svg';
import LogoImg from '@/assets/image/logo/loosegrowndiamond_logo.svg';

import MenuItem from './menu/MenuItem';
import NavModal from './mobile-menu/NavModal';
import AnnouncementBar from './AnnouncementBar';
import { getURLForProduct } from '../common-functions';
import MenuLabDiamondsDropdown from './menu/MenuLabDiamondsDropdown';
import MenuFineJewelryDropdown from './menu/MenuFineJewelryDropdown';
import MenuDiamondCollectionsDropdown from './menu/MenuCollectionDropdown';
import MenuEngagementRingsDropdown from './menu/MenuEngagementRingsDropdown';

// ----------------------------------------------------------------------

export type IHeaderProps = {};

const Header: FC<IHeaderProps> = () => {
  const router = useRouter();

  const [cartLength, setClientCartLength] = useState<number | any>(0);
  const [localCardLength] = useLocalStorage<number | any>('cartLength', 0);

  const { REAL_COLOR_OPTIONS, cutFilters, clarityFilters, colorFilters } = useInventoryFilter();
  const { data: auth } = useSession();
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [showMobileSearchField, setShowMobileSearchField] = useState(false);
  const [groupedByResultType, setGroupedByResultType] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  const { category } = useProductContext();
  const {
    labDiamondsMenu,
    inventoryMenu,
    readyToShipMenu,
    fineJewelryMenu,
    engagementRingsMenu,
    diamondCollectionsMenu,
  } = useNavigation();

  const [user_name, _set_user_name] = useLocalStorage(
    'displayName',
    auth?.user?.name?.trim()?.split(' ')?.[0]
  );

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  useEffect(() => {
    if (auth?.user?.name) {
      _set_user_name(auth?.user?.name?.trim()?.split(' ')?.[0]);
    }
  }, [_set_user_name, auth?.user?.name]);

  const findDiamondImg = (diamond_schema: any, shape: string) => {
    const colorName = diamond_schema?.intensity
      ? REAL_COLOR_OPTIONS.find((_c) => _c.value === Number(diamond_schema?.color))?.label_view
      : '';
    let diamondImage;
    if (colorName) {
      diamondImage = `https://rrp-diamond.s3.us-east-1.amazonaws.com/diamonds/colorDiamond/${shape.toLowerCase()}/${colorName?.charAt(0)?.toUpperCase()}${colorName?.slice(1)}.png`;
    } else {
      diamondImage = `https://rrp-diamond.s3.us-east-1.amazonaws.com/diamonds/whiteDiamond/${shape.toLowerCase()}.png`;
    }
    return diamondImage;
  };

  const getDiamondTitle = useCallback(
    (diamond: IWhiteDiamond | IColorDiamond, diamond_type: string, needIcons?: boolean) => (
      <p className="text-capitalize text-start m-0">
        {`${diamond?.shape?.replaceAll('_', ' ')} Shape ${cutFilters.find((_c) => _c.value === Number(diamond?.cut))?.label_view
          } Cut ${diamond?.carat} Carat ${((diamond as any)?.intensity ? REAL_COLOR_OPTIONS : colorFilters).find(
            (_c) => _c.value === Number(diamond?.color)
          )?.label_view
          } Color ${clarityFilters.find((_c) => _c.value === Number(diamond?.clarity))?.label_view
          } Clarity Lab Grown Diamond - ${diamond?.sku}`}{' '}
        {needIcons && diamond.is_overnight ? (
          <img
            className="mb-1 ms-1"
            src={overNightImage.src}
            alt="overnight"
            style={{ width: '20px', height: '20px' }}
          />
        ) : (
          needIcons &&
          diamond.express_shipping && (
            <img
              className="mb-1 ms-1"
              src={ShippingImg.src}
              alt="express"
              style={{ width: '20px', height: '20px' }}
            />
          )
        )}
      </p>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const redirectUrlFn = (result_type: 'product' | 'white_diamond' | 'color_diamond', item: any) => {
    const urlMap = {
      product: `/${getURLForProduct(item?.categories, item?.display_slug, category)}`,
      white_diamond: `${paths.whiteDiamondInventory.root}?sku=${item?.sku}`,
      color_diamond: `${paths.colorDiamondInventory.root}?sku=${item?.sku}`,
    };
    const url = urlMap[result_type];
    if (url) {
      router.push(url);
      setTimeout(() => {
        setSearch('');
        setSearchData([]);
        setLoader(false);
      }, 1500);
    }
  };

  const globalSearchFn = async (q: string) => {
    try {
      setLoader(true);
      const { data } = await searchApi.globalSearch(q);
      if (data) {
        setSearchData(data?.popularSearches);
        setGroupedByResultType(
          data?.popularSearches.reduce(
            (acc: { [x: string]: any[] }, item: { result_type: any }) => {
              const key = item.result_type;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(item);
              return acc;
            },
            {}
          )
        );
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return ''; // handle empty string
    return name
      .split(' ')
      .filter(Boolean) // remove extra spaces
      .map((word) => word[0]) // get first letter
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    _set_user_name(auth?.user?.name?.trim()?.split(' ')?.[0]);
  }, [_set_user_name, auth]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set the cart items length from local storage
  useEffect(() => {
    setClientCartLength(localCardLength);
  }, [localCardLength]);

  return (
    <>
      {!['/login', '/register', '/forgot-password'].includes(router.pathname) && (
        <>
          <AnnouncementBar />
          <header className="header_wrap">
            <nav className="navbar navbar-expand-lg">
              <div className="container-fluid">
                {/* Brand logo */}
                <Link className="navbar-brand" href="/">
                  <Image src={LogoImg} alt="loosegrowndiamond_logo" priority />
                </Link>

                {/* Menu toggle for small device */}
                <button
                  className="navbar-toggler p-0 border-0 shadow-none"
                  type="button"
                  onClick={openModal}
                >
                  <span className="navbar-toggler-icon" />
                </button>

                {/* Navbar */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {/* Lab Diamonds */}
                    <MenuItem label={labDiamondsMenu.label} url={labDiamondsMenu.link}>
                      <MenuLabDiamondsDropdown />
                    </MenuItem>

                    {/* Inventory */}
                    <MenuItem label={inventoryMenu.label} url={inventoryMenu.link} />

                    {/* Diamond Collections */}
                    <MenuItem
                      label={diamondCollectionsMenu.label}
                      url={diamondCollectionsMenu.link}
                      menuProps={{ width: 980 }}
                    >
                      <MenuDiamondCollectionsDropdown />
                    </MenuItem>

                    {/* Engagement rings */}
                    <MenuItem
                      label={engagementRingsMenu.label}
                      url={engagementRingsMenu.link}
                      menuProps={{ width: 980 }}
                    >
                      <MenuEngagementRingsDropdown />
                    </MenuItem>

                    {/* Fine Jewelry */}
                    <MenuItem
                      label={fineJewelryMenu.label}
                      url={fineJewelryMenu.link}
                      menuProps={{ width: 980 }}
                    >
                      <MenuFineJewelryDropdown />
                    </MenuItem>

                    {/* Education */}
                    {/* <MenuItem
                  label={educationMenu.label}
                  url={educationMenu.link}
                  menuProps={{ width: 980 }}
                >
                  <MenuEducationDropdown />
                </MenuItem> */}

                    {/* Ready to ship */}
                    <MenuItem label={readyToShipMenu.label} url={readyToShipMenu.link} />
                  </ul>
                </div>
                {/* Search, User, Cart */}
                <div className="d-flex align-items-center gap-3">
                  <div className="search-box">
                    <input
                      className="form-control me-2"
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          globalSearchFn(search);
                          setLoader(true);
                          setShowMobileSearchField(false);
                        }
                      }}
                      onFocus={() => {
                        window?.scrollTo(0, 0);
                      }}
                      placeholder="Search"
                      aria-label="Search"
                    />

                    <i
                      className="fa-solid fa-magnifying-glass"
                      onClick={() => {
                        globalSearchFn(search);
                        setLoader(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    {loader ? (
                      <div className="search-results">
                        <div className="ldmr_loading text-center m-5">
                          <Image src={LoadingImage} alt="loader" width={50} height={50} />
                        </div>
                      </div>
                    ) : (
                      Array.isArray(searchData) &&
                      searchData.length > 0 && (
                        <div className="search-results">
                          <div className="cursor-pointer py-1 m-0 d-flex justify-content-end">
                            <Image
                              src={xIconSVG.src}
                              onClick={() => {
                                setSearch('');
                                setSearchData([]);
                                setLoader(false);
                              }}
                              alt="X"
                              height={11}
                              width={11}
                            />
                          </div>

                          {Object.entries(groupedByResultType).map(
                            ([key, items]) =>
                              Array.isArray(items) &&
                              items.length > 0 && (
                                <div key={key} className="d-flex flex-column mb-3">
                                  <h5 className="text-capitalize">{key.split('_').join(' ')}</h5>
                                  <div className="d-flex flex-column gap-3">
                                    {items.map((item: any, index: number) => (
                                      <div
                                        key={item?.id || index}
                                        className="diamond-sell-info p-2"
                                        onClick={() => redirectUrlFn(item?.result_type, item)}
                                      >
                                        <div className="diamond-info d-flex align-items-center">
                                          <img
                                            decoding="async"
                                            className="cursor-pointer"
                                            width="40"
                                            height="40"
                                            src={
                                              key?.includes('product')
                                                ? item?.default_image
                                                : findDiamondImg(item, item?.shape)
                                            }
                                            alt={item.name ? 'product_img' : 'diamond_img'}
                                            title=""
                                          />
                                          <p className="product-name-results mb-0 ms-2 cursor-pointer">
                                            {item.name || getDiamondTitle(item, '', true)}
                                          </p>
                                        </div>
                                        <p className="product-price-results mb-0 ms-2">
                                          ${item.sale_price || item.price}
                                          <span className="ms-2 fw-400">
                                            <del>${item.regular_price}</del>
                                          </span>
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      )
                    )}
                  </div>
                  <div className="d-lg-none search-icon">
                    <i
                      className="fa-solid fa-magnifying-glass"
                      onClick={() => {
                        setShowMobileSearchField((bool) => !bool);
                        setSearch('');
                        setSearchData([]);
                        setLoader(false);
                      }}
                    />
                    {showMobileSearchField && (
                      <div className="search-box search-box-mobile">
                        <input
                          className="form-control"
                          type="text"
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              globalSearchFn(search);
                              setShowMobileSearchField(false);
                              setLoader(true);
                            }
                          }}
                          onFocus={() => {
                            window?.scrollTo(0, 0);
                          }}
                          placeholder="Search"
                          aria-label="Search"
                        />

                        <button
                          type="button"
                          className="lscartbtn ls_add_to_cart d-flex align-items-center justify-content-center w-100"
                          onClick={() => {
                            globalSearchFn(search);
                            setLoader(true);
                            setShowMobileSearchField(false);
                          }}
                          style={{ whiteSpace: 'nowrap', cursor: 'pointer', minWidth: '100px' }}
                        >
                          Search
                        </button>
                      </div>
                    )}
                  </div>

                  <Link
                    style={{ textDecoration: 'none' }}
                    className="text-black"
                    href={paths.order.root}
                  >
                    <div className="d-flex align-items-center justify-center flex-column gap-1">
                      {/* <Image src={UserImg} alt="user" className='d-block' /> */}
                      <Avatar color="black" size="sm" radius="xl">
                        {getInitials(user_name || '')}
                      </Avatar>
                      {screenWidth > 575 && (
                        <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{user_name}</span>
                      )}
                    </div>
                  </Link>

                  <Link href={paths.cart.root}>
                    <div className="position-relative cart-badge">
                      <Image src={ShoppingCartImg} alt="shopping_cart" />

                      {Number(cartLength) > 0 && <span>{cartLength}</span>}
                    </div>
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <NavModal zIndex="1100" opened={modalOpened} onClose={closeModal} />
        </>
      )}
    </>
  );
};

export default Header;

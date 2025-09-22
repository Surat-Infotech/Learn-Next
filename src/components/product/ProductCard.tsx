/* eslint-disable import/no-extraneous-dependencies */
import Link from 'next/link';
import Image from 'next/image';
import { FC, useState, HTMLAttributes } from 'react';

import clsx from 'clsx';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// import { Carousel } from '@mantine/carousel';

import { useRouter } from 'next/router';

import Swal from 'sweetalert2';
import { signOut, useSession } from 'next-auth/react';

import { IProduct } from '@/api/product';
import { wishlistApi } from '@/api/wishlist';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------
export type IProductUrl = (productId: string) => string;

export type IProductCardProps = HTMLAttributes<HTMLDivElement> &
  IProduct & {
    productUrl: IProductUrl;
    product: IProduct;
    isSelected?: boolean;
    isSimilarProduct?: boolean;
    settingPrice: boolean;
  } & any;

const ProductCard: FC<IProductCardProps> = (props) => {
  const [autoPlay, setAutoPlay] = useState(false);
  const [showWishListIcon, setShowWishListIcon] = useState<boolean>(false);
  const { data: auth, status: authStatus } = useSession();
  const { pathname, push, query } = useRouter();

  const {
    // _id,
    name,
    images,
    regular_price,
    sale_price,
    className,
    settingPrice,
    //
    productUrl,
    slug,
    display_slug,
    isSelected,
    product,
    isSimilarProduct,
    //
    ...other
  } = props;

  const [productDetails, setProductDetails] = useState<IProduct>(product);

  const renderImage = (imageUrl: string, idx: number) =>
    imageUrl && (
      <Image
        src={imageUrl}
        alt="product-image"
        key={idx}
        height={229}
        width={264}
        style={{ width: '100%' }}
      />
    );

  // eslint-disable-next-line consistent-return
  const handleWishlist = async (type: String) => {
    try {
      if (!auth && authStatus === 'unauthenticated') {
        return await Swal.fire({
          title: 'You need to be logged in!',
          text: "You won't be able to add this product to your wishlist!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Login',
        }).then((result) => {
          if (result.isConfirmed) {
            push(paths.order.root);
          }
        });
      }
      const payloadWishlist = {
        is_ring:
          product?.product_type === 'ring_setting' && pathname.includes(paths.buildRing.root),
        product_id: product?._id,
        variation_id: product?.variation_id || undefined,
        // bracelet_size: product?.product_type === 'bracelet' ? '6.00' : undefined,
        back_setting: product?.product_type === 'earring' ? 'Push Back' : undefined,
        // ring_size: ['wedding_ring', 'ring_setting'].includes(productDetails?.product_type)
        //   ? '6.0'
        //   : undefined,
      };
      if (type === 'add') {
        setShowWishListIcon(true);
        setProductDetails((prev) => ({
          ...prev,
          wishlist_id: 'temp_id',
          isWishlist: true,
        }));
        await wishlistApi.addWishlist(payloadWishlist).then((res: any) => {
          setProductDetails((prev) => ({
            ...prev,
            wishlist_id: res.data?.data?._id,
          }));
        });
      } else if (type === 'remove') {
        setShowWishListIcon(false);
        setProductDetails((prev) => ({
          ...prev,
          wishlist_id: undefined,
          isWishlist: false,
        }));
        if ((productDetails as any)?.wishlistDetails?._id !== 'temp_id')
          await wishlistApi.removeWishlist({ wishlists: [productDetails?.wishlist_id as string] });
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.login.root });
      localStorage.clear();
      console.error(error);
    }
  };

  return (
    <div
      className={clsx(
        '',
        { 'col-lg-3 col-md-4 col-6 px-8': !isSimilarProduct },
        { className: !isSimilarProduct }
      )}
      {...other}
    >
      <div className="product_image_wrapper position-relative">
        {/* Images */}
        <div onMouseEnter={() => setAutoPlay(true)} onMouseLeave={() => setAutoPlay(false)}>
          <Link
            href={
              // eslint-disable-next-line no-nested-ternary
              query.c_type
                ? `${productUrl(display_slug)}?c_type=${query.c_type}&shape=${query.shape}`
                : query.type
                  ? `${productUrl(display_slug)}?type=${query.type}`
                  : `${productUrl(display_slug)}` || '#'
            }
            target={isSimilarProduct && '_blank'}
          >
            {images?.length > 1 ? (
              <Carousel
                className="custom-indicators custom-indicators1"
                infiniteLoop
                autoPlay={autoPlay}
                showThumbs={false}
                showStatus={false}
                showIndicators={autoPlay}
                showArrows={false}
                interval={1200}
                transitionTime={500}
              >
                {images.map((image: string, idx: number) => renderImage(image, idx))}
              </Carousel>
            ) : (
              // Single image
              renderImage(images?.[0], 1)
            )}
          </Link>
        </div>
        <div className="product_details">
          <Link href={productUrl(display_slug)} target={isSimilarProduct && '_blank'}>
            {name}
          </Link>
          <div className="ls_stng_price">
            <span className="ls_rglr_price">${regular_price}</span>
            <span className="ls_sale_price ms-1">${sale_price}</span>
          </div>
          {settingPrice && <span className="ls_stng_txt">(Setting Price)</span>}
          {isSelected && <span className="selected_rb">Currently Selected</span>}
        </div>
        {!isSimilarProduct && (
          <div>
            {productDetails?.isWishlist || showWishListIcon ? (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <i
                className="fa-solid fa-heart"
                style={{ fontSize: '20px', color: 'red', position: 'absolute', top: 14, right: 14 }}
                onClick={() => handleWishlist('remove')}
              />
            ) : (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <i
                className="fa-regular fa-heart"
                style={{ fontSize: '20px', position: 'absolute', top: 14, right: 14 }}
                onClick={() => handleWishlist('add')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

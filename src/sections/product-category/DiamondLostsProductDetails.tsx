/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useMemo, useState, useCallback, HTMLAttributes } from 'react';

import Swal from 'sweetalert2';
import { signOut, useSession } from 'next-auth/react';

import { cartApi } from '@/api/cart';
import { IProduct } from '@/api/product';
import { wishlistApi } from '@/api/wishlist';

import { ICartAttribute, useCartContext } from '@/stores/cart.context';

import DiamondStaticDetails from '@/components/product/DiamondProduct';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

export type IProductDetailProps = HTMLAttributes<HTMLDivElement> & {
  product: IProduct;
  //
};

const DiamondProduct: FC<IProductDetailProps> = (props) => {
  const { product } = props;
  const { push } = useRouter();
  const [addToBagLoader, setAddToBagLoader] = useState<boolean>(false);
  const [qty, setQty] = useState(1);
  const { setCartItems } = useCartContext();
  const [productDetails, setProductDetails] = useState<IProduct>(product);
  const [showWishListIcon, setShowWishListIcon] = useState<boolean>(false);

  const isFancyShapeProduct = product.category.map((i) => i.slug).includes('fancy-shape-diamond');
  const { data: auth, status } = useSession();

  const [attributes, setAttributes] = useState<
    Record<
      string,
      {
        attribute: string | null;
        attribute_value: string;
        attribute_value_name: string;
      }
    >
  >(
    product.attributes?.reduce(
      (acc, attribute) => ({
        ...acc,
        [attribute.attribute.slug]: {
          attribute: attribute.attribute._id,
          attribute_value: attribute.attribute_value[0]._id,
          attribute_value_name: attribute.attribute_value[0].name,
        },
      }),
      {}
    ) ?? {}
  );

  const selectedVariant = useMemo(
    () =>
      product.variations?.find((variation) =>
        Object.entries(variation.name).every(([, value]) =>
          Object.entries(attributes).some(([, v]) => v.attribute_value === value.key)
        )
      ),
    [attributes, product.variations]
  );

  const cartAttributeValue = useMemo(() => {
    const attributeValue: ICartAttribute = {};

    if (attributes?.size?.attribute_value_name) {
      attributeValue.Size = attributes?.size?.attribute_value_name;
    }
    if (attributes?.available_colors?.attribute_value_name) {
      attributeValue['Available Colors'] = attributes?.available_colors?.attribute_value_name;
    }
    if (attributes?.purity?.attribute_value_name) {
      attributeValue.Purity = attributes?.purity?.attribute_value_name;
    }

    return attributeValue;
  }, [attributes]);

  const productRegularPrice = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.regular_price;
    }

    return product.regular_price;
  }, [product.regular_price, selectedVariant]);

  const productSalePrice = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.sale_price;
    }

    return product.sale_price;
  }, [product.sale_price, selectedVariant]);

  const productDescription = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.description;
    }

    return null;
  }, [selectedVariant]);

  useMemo(() => {
    if (qty === 0) setQty(Number(1));
  }, [qty]);

  const payload = useMemo(
    () => ({
      product_id: product._id ? product._id : undefined,
      variation_id: selectedVariant && selectedVariant._id ? selectedVariant._id : undefined,
      quantity: qty,
    }),
    [product._id, qty, selectedVariant]
  );

  const onAddToCart = useCallback(async () => {
    // localStorage.removeItem('coupon');
    // localStorage.removeItem('couponName');
    if (!auth && status === 'unauthenticated') {
      setAddToBagLoader(true);
      setCartItems((prev: any) => {
        const existingVariantIdx = prev.findIndex(
          (item: { product: { _id: string }; variant: { _id: string | undefined } }) =>
            item.product?._id === product._id && item.variant?._id === selectedVariant?._id
        );

        if (existingVariantIdx === -1) {
          const newItem = {
            type: 'product' as 'product' | 'diamond',
            product_schema: product,
            attribute: cartAttributeValue,
            variation_schema: selectedVariant,
            quantity: qty,
          };
          return [...prev, newItem];
        }

        return prev.map((item: { qty: any }, index: any) =>
          index === existingVariantIdx
            ? {
                ...item,
                qty: (item.qty ?? 1) + 1,
              }
            : item
        );
      });
      push(paths.cart.root);
      return;
    }
    setAddToBagLoader(true);
    try {
      await cartApi.add(payload);
      push(paths.cart.root);
    } catch (error) {
      if (error.response.data.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  }, [
    auth,
    cartAttributeValue,
    payload,
    product,
    push,
    qty,
    selectedVariant,
    setCartItems,
    status,
  ]);

  // eslint-disable-next-line consistent-return
  const handleWishlist = async (type: String) => {
    try {
      if (!auth && status === 'unauthenticated') {
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
        is_ring: productDetails.product_type === 'ring_setting',
        product_id: productDetails._id,
        variation_id: selectedVariant && selectedVariant._id ? selectedVariant._id : undefined,
      };
      if (type === 'add') {
        setShowWishListIcon(true);
        setProductDetails((prev) => ({
          ...prev,
          wishlistDetails: {
            _id: 'temp_id',
          },
        }));
        await wishlistApi.addWishlist(payloadWishlist).then((res: any) => {
          setProductDetails((prev) => ({
            ...prev,
            wishlistDetails: res.data?.data,
          }));
        });
      } else if (type === 'remove') {
        setShowWishListIcon(false);
        setProductDetails((prev) => ({
          ...prev,
          wishlistDetails: undefined,
        }));
        if ((productDetails as any)?.wishlistDetails?._id !== 'temp_id')
          await wishlistApi.removeWishlist({ wishlists: [productDetails.wishlistDetails?._id] });
      }
    } catch (error) {
      if (error.response.data.status === 401) signOut({ callbackUrl: paths.login.root });
      localStorage.clear();
      console.error(error);
    }
  };

  return (
    <div className=" pt-0">
      <div className="container-fluid">
        <div className="row pt_60 pt_0">
          <div
            className="col-lg-6 col-12 mx-auto"
            style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
          >
            <Image
              src={product?.images[0]}
              alt="melee-image"
              width={555}
              height={555}
              className="img-fluid melee-img-responsive"
            />
            {(auth?.user.id === (productDetails as any)?.wishlistDetails?.customer_id ||
              showWishListIcon) &&
            auth?.user.id ? (
              <i
                className="fa-solid fa-heart"
                style={{ fontSize: '20px', color: 'red', position: 'absolute', top: 18, right: 28 }}
                onClick={() => handleWishlist('remove')}
              />
            ) : (
              <i
                className="fa-regular fa-heart"
                style={{ fontSize: '20px', position: 'absolute', top: 18, right: 28 }}
                onClick={() => handleWishlist('add')}
              />
            )}
          </div>
          <div className="col-lg-6 col-12 melee-res">
            <h1 className="melee-title">{product?.name}</h1>
            <span
              className="fs_13 fw-500 text-black lh-base d-block"
              style={{ paddingTop: '-16px' }}
            >
              4 interest-free payments or as low as $11/mo with Affirm.
            </span>
            <p className="fs_13 fw-400 text-gray mb-2 mb-md-3">{productDescription}</p>

            <div className="melee-form row row-gap-2 row-gap-md-4">
              {product.attributes?.map((attribute, index) => (
                <div className="common_select_dropdown col-lg-6 col-md-6 col-12 " key={index}>
                  <label htmlFor={attribute.attribute.slug}>{attribute.attribute.name} </label>
                  <select
                    id={attribute.attribute.slug}
                    className="form-select text-capitalize"
                    key={attribute.attribute._id}
                    value={attributes[attribute.attribute.slug].attribute_value}
                    onChange={(e) =>
                      setAttributes({
                        ...attributes,
                        [attribute.attribute.slug]: {
                          attribute: attribute.attribute._id,
                          attribute_value: e.target.value,
                          attribute_value_name:
                            attribute.attribute_value.find((value) => value._id === e.target.value)
                              ?.name ?? '',
                        },
                      })
                    }
                  >
                    {attribute.attribute_value.map((value) => (
                      <option value={value._id} key={value._id}>
                        {value.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="col-12 my-3 my-md-4">
              <strong className="melee-price">${productSalePrice}</strong>
              <span className="melee-was-price ps-1">was ${productRegularPrice}</span>
              <span> / {isFancyShapeProduct ? 'Per Diamond' : 'Per Carat'}</span>
            </div>
            <div className="col-12 d-flex pt-0 pt-md-3">
              <input
                type="number"
                min="1"
                max="1000"
                onFocus={(e) => e.target.select()}
                style={{ minWidth: '60px', marginRight: '16px' }}
                className="melee-qty p-1 p-sm-2"
                // className="product_quantity_increment px-2 fw-500 mb-0"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
              <button
                type="button"
                disabled={addToBagLoader}
                className="common_btn common_btn_custom_p  me-3"
                onClick={() => onAddToCart()}
              >
                {addToBagLoader ? (
                  <div className="spinner-border text-light auth_loader" role="status">
                    <span className="visually-hidden ">Loading...</span>
                  </div>
                ) : (
                  'Add to bag'
                )}
              </button>
              <div
                className="rounded"
                style={{
                  background: '#37b456',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Link
                  href="https://api.whatsapp.com/send?phone=19299195214"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <i
                    className="fa-brands fa-whatsapp d-flex justify-content-center align-items-center"
                    style={{ fontSize: '30px', width: '50px', color: 'black' }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-100">
        <DiamondStaticDetails />
      </div>
    </div>
  );
};

export default DiamondProduct;

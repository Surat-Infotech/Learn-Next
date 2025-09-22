/* eslint-disable react/no-danger */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { orderQuery } from '@/api/order';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import HtmlContent from '@/utils/html-content';
import { fDateTime } from '@/utils/formate-time';

import LoadingImage from '@/assets/image/Loading.gif';
import overNightImage from '@/assets/image/overNight.svg';
import ShippingImg from '@/assets/image/logo/Ship_icon.svg';
import LooseGroundLogo from '@/assets/image/whole-sale/loosegrowndiamond_logo.svg';

const OrderThankYouPage = () => {
  const { query } = useRouter();
  const [orderData, setOrderData] = useState<any>(null);

  const { data, isLoading } = useQuery(orderQuery.get(query?.order_no as string));

  useEffect(() => {
    if (data) {
      setOrderData(data);
    }
  }, [data]);

  const { cutFilters, colorFilters, clarityFilters, certificateFilters, colorDaimondFilters, REAL_COLOR_OPTIONS } = useInventoryFilter();

  const findDiamodImg = (items: any, shape: string) => {
    const colorName = items?.diamond_schema?.intensity ? REAL_COLOR_OPTIONS.find(
      (_c) => _c.value === Number(items?.diamond_schema?.color)
    )?.label_view : ''
    let diamondImage;
    if (colorName) {
      diamondImage = `https://rrp-diamond.s3.us-east-1.amazonaws.com/diamonds/colorDiamond/${shape.toLowerCase()}/${colorName?.charAt(0)?.toUpperCase()}${colorName?.slice(1)}.png`;
    } else {
      diamondImage = `https://rrp-diamond.s3.us-east-1.amazonaws.com/diamonds/whiteDiamond/${shape.toLowerCase()}.png`;
    }
    return diamondImage;
  }

  if (isLoading) {
    return <div className="py_40 min-h-454 ">
      <div className="text-center">
        <Image src={LoadingImage} alt="loader" width={30} height={30} />
      </div>
    </div>;
  }
  return (
    <>
      <Head>
        <title>{`Thank you for your Order: (${orderData?.order_no})`}</title>
        <meta name="description" content='Thank you for your purchase! We appreciate your business and look forward to serving you again. For any queries or support, feel free to contact us' />
      </Head>
      {/* new design */}
      {!isLoading && orderData !== null &&
        <div className='order_confirmation_section pb-0 py-sm-4 pb-lg-5'>
          <div className='pb_30 d-none d-lg-block'>
            <Image
              src={LooseGroundLogo}
              alt="loosegrowndiamond_logo"
              className="d-block mx-auto"
            />
          </div>
          <div className='thankyou_page'>
            <div className='header-section text-center'>
              <div className='d-flex justify-content-center' ><h3>Thank you for your order</h3><h3 className='text-capitalize ms-1'>{`${orderData.customer_schema?.name?.split(' ')?.[0]}`}</h3></div>
              <h6 className='mb-0'>Order <span>#{orderData?.order_no}</span></h6>
            </div>
          </div>
          <div className='order_confirmation_deatil'>
            <div className='d-flex justify-content-between d-none d-sm-flex'>
              <div className=''>
                <span className='mb-2'>Order Date</span>
                <p className='mb_30'>{fDateTime(orderData.order_date, 'MMM dd, yyyy')}</p>
              </div>
              <div className=''>
                <span className='mb-2'>Order ID</span>
                <p className='mb_30'>#{orderData.order_no}</p>
              </div>
              <div className=''>
                <span className='mb-2'>Payment</span>
                <p className='mb_30 text-capitalize'>{orderData.payment_method}</p>
              </div>
            </div>
            <div className='d-sm-none'>
              <div className='d-flex justify-content-between'>
                <span className='mb-2'>Order Date</span>
                <p className='mb_30'>{fDateTime(orderData.order_date, 'MMM dd, yyyy')}</p>
              </div>
              <div className='d-flex justify-content-between'>
                <span className='mb-2'>Order ID</span>
                <p className='mb_30'>#{orderData.order_no}</p>
              </div>
              <div className='d-flex justify-content-between'>
                <span className='mb-2'>Payment</span>
                <p className='mb_30'>{orderData.payment_method}</p>
              </div>
            </div>
            {orderData && orderData?.order_notes?.[0]?.message &&
              <div className=''>
                <span className='mb-2'>Note</span>
                <p className='mb-0'>{orderData.order_notes?.[0]?.message}</p>
              </div>
            }
            <div className={orderData && orderData?.order_notes?.[0]?.message ? 'my_50' : 'mb_50'}>
              <div className='container-fluid px-0'>
                <div className='row'>
                  <div className='col-sm-6'>
                    <div className='shipping_address'>
                      <span className='d-block mb_20' style={{ color: '#777' }}>Shipping Address</span>
                      <span className='' >{orderData.address_schema?.shipping?.first_name}{' '}
                        {orderData.address_schema?.shipping?.last_name}<br />
                        {orderData.address_schema?.shipping?.address}<br />
                        {orderData.address_schema?.shipping?.address_second && orderData.address_schema?.shipping?.address_second}{orderData.address_schema?.shipping?.address_second && <br />}
                        {orderData.address_schema?.shipping?.city}{', '}
                        {orderData.address_schema?.shipping?.postcode} <br className='d-none d-sm-block' />
                        {orderData.address_schema?.shipping?.state}{orderData.address_schema?.shipping?.state && ', '}
                        {orderData.address_schema?.shipping?.country}
                        <br /><br className='d-none d-sm-block' />
                        {orderData.address_schema?.shipping?.phone}<br />
                        {orderData.address_schema?.shipping?.email}</span>
                    </div>
                    <hr className='border_color_gray d-sm-none' />
                  </div>
                  <div className='col-sm-6'>
                    <div className='shipping_address'>
                      <span className='d-block mb_20' style={{ color: '#777' }}>Billing Address</span>
                      <span className='' > {orderData.address_schema?.billing?.first_name}{' '}
                        {orderData.address_schema?.billing?.last_name}<br />
                        {orderData.address_schema?.billing?.address}<br />
                        {orderData.address_schema?.billing?.address_second && orderData.address_schema?.billing?.address_second}{orderData.address_schema?.billing?.address_second && <br />}
                        {orderData.address_schema?.billing?.city}{' '}
                        {orderData.address_schema?.billing?.postcode} <br className='d-none d-sm-block' />
                        {orderData.address_schema?.billing?.state}{orderData.address_schema?.billing?.state && ', '}
                        {orderData.address_schema?.billing?.country}<br className='d-none d-sm-block' /><br /></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='product_detail'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th className='text-center'>Qty.</th>
                    <th className='text-end'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData && orderData?.product_details &&
                    orderData?.product_details.map((item: any) => (
                      <>
                        {!(item.diamond_schema && item.product_schema) ? (
                          <tr>
                            <td>
                              <div className='d-flex gap-10'>
                                <Image
                                  src={
                                    item?.diamond_schema ?
                                      findDiamodImg(item, item?.diamond_schema?.shape)
                                      : item.variation_schema?.image ?? item.variation_schema?.gallery_img?.[0] ?? item.product_schema?.images?.[0]
                                  }
                                  width={50}
                                  height={50}
                                  alt="loosegrowndiamond_logo"
                                />
                                <div className='details text-capitalize'>
                                  {item.diamond_schema
                                    ? `${item.diamond_schema.shape?.replaceAll('_', ' ')} Shape ${cutFilters.find(
                                      (_c) => _c.value === Number(item?.diamond_schema?.cut)
                                    )?.label_view
                                    } Cut ${item.diamond_schema.carat} Carat ${item.diamond_schema.intensity ?
                                      colorDaimondFilters.find((_c) => _c.defaultValue === Number(item?.diamond_schema?.color))
                                        ?.color
                                      : colorFilters.find(
                                        (_c) => _c.value === Number(item?.diamond_schema?.color)
                                      )?.label_view
                                    } Color ${clarityFilters.find(
                                      (_c) => _c.value === Number(item?.diamond_schema?.clarity)
                                    )?.label_view
                                    } Clarity Lab Grown Diamond`
                                    : item.product_schema?.name}
                                  {item.diamond_schema?.is_overnight ? <img className='ms-1' src={overNightImage.src} alt="overnight" style={{ width: '20px', height: '20px' }} /> : item.diamond_schema?.express_shipping && <img className='ms-1' src={ShippingImg.src} alt='express' style={{ width: '20px', height: '20px' }} />}
                                  {/* <b className="fw-600 ms-1">× {item?.quantity ?? 1}</b> */}
                                  <div className='mt-2' />
                                  {item.product_schema?.product_type === 'custom' && (
                                    <p className="m-0">
                                      <div className='description-cart'>
                                        <HtmlContent html={item.product_schema.long_description || item.product_schema.short_description} />
                                      </div>
                                    </p>
                                  )}
                                  {item.diamond_schema && (
                                    <p className="m-0">
                                      <span className="me-1">SKU:</span>
                                      <span>{item.diamond_schema.sku}</span>
                                    </p>
                                  )}
                                  {item.diamond_schema && (
                                    <>
                                      <p className="m-0">
                                        <span className="me-1">Certificate Type:</span>
                                        <span>{item.diamond_schema.certificate_type &&
                                          certificateFilters.find(
                                            (_c) =>
                                              _c.value === Number(item?.diamond_schema?.certificate_type)
                                          )?.label}</span>
                                      </p>
                                      {item?.diamond_schema?.certificate && (
                                        <p className="m-0">
                                          <span className="text_black_secondary">Certificate: </span>
                                          <Link
                                            href={item.diamond_schema.certificate ?? ''}
                                            target="_blank"
                                            style={{ opacity: "0.8", fontWeight: "400", color: "black" }}
                                          >
                                            {/* <i
                                           className="fa fa-file-pdf"
                                           style={{ color: 'black', textAlign: 'center' }}
                                         /> */}
                                            {item.diamond_schema.certificate_no || item.diamond_schema.certificate.split('=')[1] || item.diamond_schema.sku || ''}
                                          </Link>
                                        </p>
                                      )}
                                      {item?.diamond_schema?.video_url && (
                                        <p className="m-0">
                                          <span className="text_black_secondary">Video : </span>
                                          <Link
                                            href={item?.diamond_schema?.video_url ?? ''}
                                            target="_blank"
                                            style={{ opacity: "0.7" }}
                                          >
                                            <i
                                              className="fa fa-video"
                                              style={{ color: 'black', textAlign: 'center' }}
                                            />
                                          </Link>
                                        </p>
                                      )}
                                    </>
                                  )}
                                  {item.variation_schema &&
                                    item.product_schema.product_type !== 'diamond' ? (
                                    <>
                                      {item.variation_schema && <p className="m-0">
                                        <span className="me-1">SKU:</span>
                                        <span>{item.variation_schema.sku}</span>
                                      </p>}
                                      <p className="m-0 text-capitalize ">
                                        <span className="text_black_secondary ">Metal: </span>
                                        {item.variation_schema?.name.length > 1 && ['14k', '18k', 'platinum'].some((keyword) => item.variation_schema?.name[1].value?.includes(keyword)) ? (
                                          <span className='text-capitalize'>
                                            {item.variation_schema?.name[1].value?.replace(/[-_]/g, ' ')}
                                          </span>
                                        )
                                          : (
                                            <span className='text-capitalize'>
                                              {item.variation_schema?.name[0].value?.replace(/[-_]/g, ' ')}
                                            </span>
                                          )}
                                      </p>
                                      <p className="mb-0">
                                        <span className="text_black_secondary ">Carat Weight: </span>
                                        {item.variation_schema?.name.length > 1 && ['14k', '18k', 'platinum'].some((keyword) => item.variation_schema?.name[1].value?.includes(keyword)) ? (
                                          <span className='text-capitalize'>
                                            {item.variation_schema?.name[0].value?.replace(/[-_]/g, '.')}
                                          </span>
                                        )
                                          : (
                                            <span className='text-capitalize'>
                                              {item.variation_schema?.name[1].value?.replace(/[-_]/g, '.')}
                                            </span>
                                          )}
                                      </p>
                                      {item.back_setting && (
                                        <p className="mb-0">
                                          <span className="text_black_secondary ">Back Setting: </span>
                                          <span>
                                            {item.back_setting}
                                          </span>
                                        </p>
                                      )}
                                      {item.ring_size && (
                                        <p className="mb-0">
                                          <span className="text_black_secondary ">Ring Size: </span>
                                          <span>
                                            {item.ring_size}
                                          </span>
                                        </p>
                                      )}
                                      {item.bracelet_size && (
                                        <p className="mb-0">
                                          <span className="text_black_secondary ">Bracelet Length: </span>
                                          <span>
                                            {item.bracelet_size}
                                          </span>
                                        </p>
                                      )}
                                    </>
                                  ) : (!item.diamond_schema &&
                                    <>
                                      {item?.variation_schema?.name?.map((ele: any) => (
                                        <div key={ele.value}>
                                          {/MM/i.test(ele.value) ? (
                                            ele.value && <p className="m-0 text-capitalize">
                                              <span className="text_black_secondary">Size: </span>
                                              <span>{ele.value?.replaceAll('_', ' ')}</span>
                                            </p>
                                          ) : ['GHI', 'DEF'].includes(ele.value?.toUpperCase()) ? (
                                            ele.value && <p className="m-0 text-capitalize">
                                              <span className="text_black_secondary">Available Colors: </span>
                                              <span className='text-uppercase' >{ele.value}</span>
                                            </p>
                                          ) : (
                                            ele.value && <p className="m-0 text-capitalize">
                                              <span className="text_black_secondary">Purity: </span>
                                              <span className='text-uppercase' >{ele.value}</span>
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{item.quantity} qty.</td>
                            <td className='text-end'>${item.diamond_schema
                              ? ((item.diamond_schema.price) * ((item.variation_schema || item.product_schema) && item.diamond_schema ? 1 : item.quantity)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              : ((item.variation_schema
                                ? (item?.variation_schema?.sale_price as number)
                                : item.product_schema.sale_price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ) : (
                          <>
                            <tr>
                              <td className='border-bottom-0'>
                                <div className='d-flex gap-10'>
                                  {
                                    item.product_schema &&
                                    <Image
                                      src={
                                        item.variation_schema?.image ?? item.variation_schema?.gallery_img?.[0] ?? item.product_schema?.images?.[0]
                                      }
                                      alt="loosegrowndiamond_logo"
                                      width={50}
                                      height={50}
                                    />
                                  }
                                  <div className='details'>
                                    {item.product_schema?.name}
                                    {/* <b className="fw-600 ms-1">× {item?.quantity ?? 1}</b> */}
                                    <div className='mt-2' />
                                    {item.variation_schema && <p className="m-0">
                                      <span className="me-1">SKU:</span>
                                      <span>{item.variation_schema.sku}</span>
                                    </p>}
                                    {item.variation_schema && (
                                      <>
                                        <p className="m-0 text-capitalize ">
                                          <span className="text_black_secondary ">Metal: </span>
                                          {item.variation_schema?.name.length > 1 && ['14k', '18k', 'platinum'].some((keyword) => item.variation_schema?.name[1].value?.includes(keyword)) ? (
                                            <span className='text-capitalize'>
                                              {item.variation_schema?.name[1].value?.replace(/[-_]/g, ' ')}
                                            </span>
                                          )
                                            : (
                                              <span className='text-capitalize'>
                                                {item.variation_schema?.name[0].value?.replace(/[-_]/g, ' ')}
                                              </span>
                                            )}
                                        </p>
                                        <p className="mb-0">
                                          <span className="text_black_secondary ">Carat Weight: </span>
                                          {item.variation_schema?.name.length > 1 && ['14k', '18k', 'platinum'].some((keyword) => item.variation_schema?.name[1].value?.includes(keyword)) ? (
                                            <span className='text-capitalize'>
                                              {item.variation_schema?.name[0].value?.replace(/[-_]/g, '.')}
                                            </span>
                                          )
                                            : (
                                              <span className='text-capitalize'>
                                                {item.variation_schema?.name[1].value?.replace(/[-_]/g, '.')}
                                              </span>
                                            )}
                                        </p>
                                        {item.back_setting && (
                                          <p className="mb-0">
                                            <span className="text_black_secondary ">Back Setting: </span>
                                            <span>
                                              {item.back_setting}
                                            </span>
                                          </p>
                                        )}
                                        {item.ring_size && (
                                          <p className="mb-0">
                                            <span className="text_black_secondary ">{(item.variation_schema || item.product_schema) && item.diamond_schema ? 'Setting Size: ' : 'Ring Size: '}</span>
                                            <span>
                                              {item.ring_size}
                                            </span>
                                          </p>
                                        )}
                                        {item.bracelet_size && (
                                          <p className="mb-0">
                                            <span className="text_black_secondary ">Bracelet Length: </span>
                                            <span>
                                              {item.bracelet_size}
                                            </span>
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className='border-bottom-0'>{(item.variation_schema || item.product_schema) && item.diamond_schema ? '1' : item.quantity} qty.</td>
                              <td className='text-end border-bottom-0'> $
                                {(item.variation_schema
                                  ? item.variation_schema.sale_price * item.quantity
                                  : item.product_schema.sale_price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className='d-flex gap-10'>
                                  {item?.diamond_schema &&
                                    <Image
                                      src={
                                        item?.diamond_schema &&
                                        findDiamodImg(item, item?.diamond_schema?.shape)
                                      }
                                      alt="loosegrowndiamond_logo"
                                      width={50}
                                      height={50}
                                    />
                                  }
                                  <div className='details text-capitalize'>
                                    {item.diamond_schema &&
                                      `${item.diamond_schema.shape?.replaceAll('_', ' ')} Shape ${cutFilters.find(
                                        (_c) => _c.value === Number(item?.diamond_schema?.cut)
                                      )?.label_view
                                      } Cut ${item.diamond_schema.carat} Carat ${item.diamond_schema.intensity ?
                                        colorDaimondFilters.find((_c) => _c.defaultValue === Number(item?.diamond_schema?.color))
                                          ?.color
                                        : colorFilters.find(
                                          (_c) => _c.value === Number(item?.diamond_schema?.color)
                                        )?.label_view
                                      } Color ${clarityFilters.find(
                                        (_c) => _c.value === Number(item?.diamond_schema?.clarity)
                                      )?.label_view} Clarity Lab Grown Diamond`}
                                    {item.diamond_schema.is_overnight ? <img className='ms-1' src={overNightImage.src} alt="overnight" style={{ width: '20px', height: '20px' }} /> : item.diamond_schema.express_shipping && <img className='ms-1' src={ShippingImg.src} alt='express' style={{ width: '20px', height: '20px' }} />}
                                    {/* <b className="fw-600 ms-1">× {item?.quantity ?? 1}</b> */}
                                    <div className='mt-2' />
                                    {item.diamond_schema && (
                                      <p className="m-0">
                                        <span className="me-1">SKU:</span>
                                        <span>{item.diamond_schema.sku}</span>
                                      </p>
                                    )}
                                    {item.diamond_schema && (
                                      <>
                                        <p className="m-0">
                                          <span className="me-1">Certificate Type:</span>
                                          <span>{item.diamond_schema.certificate_type &&
                                            certificateFilters.find(
                                              (_c) =>
                                                _c.value === Number(item?.diamond_schema?.certificate_type)
                                            )?.label}</span>
                                        </p>
                                        {item?.diamond_schema?.certificate && (
                                          <p className="m-0">
                                            <span className="text_black_secondary">Certificate: </span>
                                            <Link
                                              href={item.diamond_schema.certificate ?? ''}
                                              target="_blank"
                                              style={{ opacity: "0.8", fontWeight: "400", color: "black" }}
                                            >
                                              {/* <i
                                              className="fa fa-file-pdf"
                                              style={{ color: 'black', textAlign: 'center' }}
                                            /> */}
                                              {item.diamond_schema.certificate_no || item.diamond_schema.certificate.split('=')[1] || item.diamond_schema.sku || ''}
                                            </Link>
                                          </p>
                                        )}
                                        {item?.diamond_schema?.video_url && (
                                          <p className="m-0">
                                            <span className="text_black_secondary">Video : </span>
                                            <Link
                                              href={item?.diamond_schema?.video_url ?? ''}
                                              target="_blank"
                                              style={{ opacity: "0.7" }}
                                            >
                                              <i
                                                className="fa fa-video"
                                                style={{ color: 'black', textAlign: 'center' }}
                                              />
                                            </Link>
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>{(item.variation_schema || item.product_schema) && item.diamond_schema ? '1' : item.quantity} qty.</td>
                              <td className='text-end'>$
                                {(item.diamond_schema.sale === true
                                  ? (item.diamond_schema.price) * ((item.variation_schema || item.product_schema) && item.diamond_schema ? 1 : item.quantity)
                                  : item.diamond_schema.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          </>
                        )}
                      </>
                    ))}
                </tbody>
              </table>
              <div className='total_box'>
                <div className=''>
                  <div className='d-flex align-items-center justify-content-between'>
                    <p className='fw-normal'>Subtotal</p>
                    <p className='fw-medium'> ${(orderData.order_base_price as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className='d-flex align-items-center justify-content-between'>
                    <p className='fw-normal'>Shipping
                      <br />
                      {/* {express_shipping && <span>Express Shipping (1 week)</span>} */}
                    </p>
                    <p className='fw-medium'>{Number(orderData.shipping_cost) === 0 ? 'FREE' : `$${Number(orderData.shipping_cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                  </div>
                  {
                    orderData?.extra_charges !== 0 &&
                    <div className='d-flex align-items-center justify-content-between'>
                      <p className='fw-normal'>Transaction Fees</p>
                      <p className='fw-medium'> ${Number(orderData.extra_charges || orderData?.orderData?.extra_charges).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  }
                  {
                    orderData.discount !== 0 && <div className='d-flex align-items-center justify-content-between'>
                      <p className='fw-normal'>Discount</p>
                      <p className='green_text'>- ${Number(orderData.discount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  }
                </div>
                <div className='border_bottom_gray' />
                <div className='d-flex align-items-center justify-content-between'>
                  <p className='fw-bold mb-0'>Total</p>
                  <p className='fw-bold mb-0'>${((orderData.order_base_price as number) +
                    (Number(orderData.shipping_cost)) + Number(orderData.extra_charges) - Number(orderData.discount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>

              <p className='track_text'>We'll send you shipping confirmation when your item(s) are on the way. Additionally you can <span className='fw-bold'>track your order.</span> We appreciate your business, and hope you enjoy your purchase.</p>
            </div>
          </div>
        </div>
        // :
        // <h1 className="text-center min-h-454 my-5"> Thank you. Order Summary has been received.</h1>
      }
    </>
  );
};

export default OrderThankYouPage;

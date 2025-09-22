/* eslint-disable no-nested-ternary */
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import React, { FC } from 'react';

import { format, addDays } from 'date-fns';

import { ISingleOrder } from '@/api/order';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import HtmlContent from '@/utils/html-content';
import { fDateTime } from '@/utils/formate-time';

import overNightImage from '@/assets/image/overNight.svg';
import ShippingImg from '@/assets/image/logo/Ship_icon.svg';

const OrderDetailsView: FC<ISingleOrder> = (props) => {
  const {
    shipping_cost,
    payment_method,
    address_schema,
    order_base_price,
    purchase_note,
    order_notes,
    order_no,
    order_date,
    product_details,
    discount,
    created_at,
    updated_at,
    order_status,
    extra_charges,
    customer_schema,
  } = props;

  const {
    cutFilters,
    colorFilters,
    clarityFilters,
    certificateFilters,
    colorDaimondFilters,
    REAL_COLOR_OPTIONS,
  } = useInventoryFilter();

  const isRingAvailable = product_details.some(
    (item) =>
      item.product_schema?.product_type === 'ring_setting' ||
      item.variation_schema?.product_type === 'ring_setting'
  );
  const isProductAvailable = product_details
    .map(
      (item) =>
        item.product_schema?.product_type !== 'ring_setting' &&
        (item.product_schema || item.variation_schema)
    )
    .find((i) => i);
  const isDiamondAvailable = product_details
    .map((item) => item.product_schema?.product_type !== 'ring_setting' && item.diamond_schema)
    .find((i) => i);

  const statusMapForProduct: Record<string, string> = {
    on_hold: 'Order Received',
    pending: 'Order Received',
    processing: 'Order Received',
    draft: 'Order Received',
    order_received: 'Order Received',
    order_confirmed: 'Order Confirmed',
    cad_3d_design: 'CAD & 3D Design',
    crafting: 'Crafting',
    quality_check: 'Quality Check (QC)',
    dispatched_from_factory: 'Dispatched From Factory',
    shipped: 'Shipped',
    shipped_shiv: 'Shipped',
    completed: 'Delivered',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    failed: 'Failed',
  };

  const statusMapForDiamond: Record<string, string> = {
    on_hold: 'Order Received',
    pending: 'Order Received',
    processing: 'Order Received',
    draft: 'Order Received',
    order_received: 'Order Received',
    order_confirmed: 'Order Confirmed',
    cad_3d_design: 'Order Confirmed',
    crafting: 'Order Confirmed',
    quality_check: 'Order Confirmed',
    dispatched_from_factory: 'Dispatched From Factory',
    shipped: 'Shipped',
    shipped_shiv: 'Shipped',
    completed: 'Delivered',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    failed: 'Failed',
  };

  const findOrderStatus = (status: string) => {
    if (
      isRingAvailable ||
      (typeof isProductAvailable === 'object' && Object.keys(isProductAvailable).length > 0)
    ) {
      return statusMapForProduct[status] || '';
    }
    if (typeof isDiamondAvailable === 'object' && Object.keys(isDiamondAvailable).length > 0) {
      return statusMapForDiamond[status] || '';
    }
    return '';
  };

  const findDiamodImg = (items: any, shape: string) => {
    const colorName = items?.diamond_schema?.intensity
      ? REAL_COLOR_OPTIONS.find((_c) => _c.value === Number(items?.diamond_schema?.color))
          ?.label_view
      : '';
    let diamondImage;
    if (colorName) {
      diamondImage = `https://rrp-diamond.s3.us-east-1.amazonaws.com/diamonds/colorDiamond/${shape.toLowerCase()}/${colorName?.charAt(0)?.toUpperCase()}${colorName?.slice(1)}.png`;
    } else {
      diamondImage = `https://rrp-diamond.s3.us-east-1.amazonaws.com/diamonds/whiteDiamond/${shape.toLowerCase()}.png`;
    }
    return diamondImage;
  };

  const getCustomerOrderNote = () => {
    const c_id = customer_schema?._id;
    const note = order_notes?.find((n) => n?.customer_id === c_id);
    return note?.message;
  };

  return (
    <>
      <Head>
        <title>My account</title>
        <meta name="" content="" />
      </Head>
      <p className="font_size_13 mb_20">
        Order <mark>#{order_no}</mark> was placed on{' '}
        <mark>{order_date && fDateTime(order_date)}</mark> and is currently{' '}
        <mark className="text-capitalize">{findOrderStatus(order_status)}</mark>.
      </p>
      <h3 className="fw-600 text_black_secondary ">Order Details</h3>
      {order_status !== 'cancelled' &&
      (isRingAvailable ||
        (typeof isProductAvailable === 'object' && Object.keys(isProductAvailable).length > 0)) ? (
        <>
          <ul className="list-unstyled multi-steps mt-4">
            <li
              className={
                ['on_hold', 'pending', 'processing', 'draft'].includes(order_status)
                  ? 'is-active'
                  : ''
              }
            >
              <span>Order Received</span>
              <p>
                {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                  format(addDays(new Date(created_at), 0), 'd MMM, yyyy')}
              </p>
            </li>
            <li className={order_status === 'order_received' ? 'is-active' : ''}>
              <span>Order Confirmed</span>
              <p>
                {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                  format(addDays(new Date(created_at), 4), 'd MMM, yyyy')}
              </p>
            </li>
            <li className={order_status === 'order_confirmed' ? 'is-active' : ''}>
              <span>CAD & 3D Design</span>
              <p>
                {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                  format(addDays(new Date(created_at), 6), 'd MMM, yyyy')}
              </p>
            </li>
            <li className={order_status === 'cad_3d_design' ? 'is-active' : ''}>
              <span>Crafting</span>
              <p>
                {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                  format(addDays(new Date(created_at), 20), 'd MMM, yyyy')}
              </p>
            </li>
            <li className={order_status === 'crafting' ? 'is-active' : ''}>
              <span>Quality Check (QC)</span>
              <p>
                {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                  format(addDays(new Date(created_at), 21), 'd MMM, yyyy')}
              </p>
            </li>
            <li className={order_status === 'quality_check' ? 'is-active' : ''}>
              <span>Dispatched From Factory</span>
              <p>
                {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                  format(addDays(new Date(created_at), 22), 'd MMM, yyyy')}
              </p>
            </li>
            <li className={order_status === 'dispatched_from_factory' ? 'is-active' : ''}>
              <span>Shipped</span>
              <p>
                {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                  format(addDays(new Date(created_at), 26), 'd MMM, yyyy')}
              </p>
            </li>
            <li className={['shipped', 'shipped_shiv'].includes(order_status) ? 'is-active' : ''}>
              <span>Delivered</span>
              <p>
                {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                  format(addDays(new Date(created_at), 28), 'd MMM, yyyy')}
              </p>
            </li>
            {/* {order_status === 'cancelled' && <li> <span>Cancelled</span> <p>{format(new Date(updated_at), 'd MMM, yyyy')}</p></li>}
              {order_status === 'refunded' && <li> <span>Refunded</span> <p>{format(new Date(updated_at), 'd MMM, yyyy')}</p></li>}
              {order_status === 'failed' && <li> <span>Failed</span> <p>{format(new Date(updated_at), 'd MMM, yyyy')}</p></li>} */}
          </ul>
          <b className="list-unstyled multi-steps fw-700" style={{ fontSize: '13px' }}>
            Note: The delivery timeline may differ with express shipping.
          </b>
        </>
      ) : (
        order_status !== 'cancelled' &&
        typeof isDiamondAvailable === 'object' &&
        Object.keys(isDiamondAvailable).length > 0 && (
          <>
            <ul className="list-unstyled multi-steps mt-4">
              <li
                className={
                  ['on_hold', 'pending', 'processing', 'draft'].includes(order_status)
                    ? 'is-active'
                    : ''
                }
              >
                <span>Order Received</span>
                <p>
                  {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                    format(addDays(new Date(created_at), 0), 'd MMM, yyyy')}
                </p>
              </li>
              <li className={['order_received'].includes(order_status) ? 'is-active' : ''}>
                <span>Order Confirmed</span>
                <p>
                  {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                    format(addDays(new Date(created_at), 3), 'd MMM, yyyy')}
                </p>
              </li>
              <li
                className={
                  ['order_confirmed', 'cad_3d_design', 'crafting', 'quality_check'].includes(
                    order_status
                  )
                    ? 'is-active'
                    : ''
                }
              >
                <span>Dispatched From Factory</span>
                <p>
                  {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                    format(addDays(new Date(created_at), 7), 'd MMM, yyyy')}
                </p>
              </li>
              <li className={order_status === 'dispatched_from_factory' ? 'is-active' : ''}>
                <span>Shipped</span>
                <p>
                  {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                    format(addDays(new Date(created_at), 11), 'd MMM, yyyy')}
                </p>
              </li>
              <li className={['shipped', 'shipped_shiv'].includes(order_status) ? 'is-active' : ''}>
                <span>Delivered</span>
                <p>
                  {!['cancelled', 'refunded', 'failed'].includes(order_status) &&
                    format(addDays(new Date(created_at), 14), 'd MMM, yyyy')}
                </p>
              </li>
              {order_status === 'cancelled' && (
                <li>
                  {' '}
                  <span>Cancelled</span> <p>{format(new Date(updated_at), 'd MMM, yyyy')}</p>
                </li>
              )}
              {order_status === 'refunded' && (
                <li>
                  {' '}
                  <span>Refunded</span> <p>{format(new Date(updated_at), 'd MMM, yyyy')}</p>
                </li>
              )}
              {order_status === 'failed' && (
                <li>
                  {' '}
                  <span>Failed</span> <p>{format(new Date(updated_at), 'd MMM, yyyy')}</p>
                </li>
              )}
            </ul>
            <b className="list-unstyled multi-steps fw-500" style={{ fontSize: '13px' }}>
              Note: The timeline will differ for express shipping.
            </b>
          </>
        )
      )}
      {purchase_note?.length > 0 && (
        <div className="d-flex gap-2 mt-4 justify-content-start align-items-start">
          <h6 className="fw-600 text_black_secondary" style={{ whiteSpace: 'nowrap' }}>
            Order Update:
          </h6>
          <h6 className="fw-400">{purchase_note}</h6>
        </div>
      )}
      <div className="order_confirmation_section py-4" style={{ background: '#fff' }}>
        <div className="product_detail">
          <table className="table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th className="text-center">Qty.</th>
                <th className="text-end">Price</th>
              </tr>
            </thead>
            <tbody>
              {product_details &&
                product_details.map((item: any) => (
                  <>
                    {!(item.diamond_schema && item.product_schema) ? (
                      <tr>
                        <td>
                          <div className="d-flex gap-10">
                            <Image
                              src={
                                item.diamond_schema
                                  ? findDiamodImg(item, item.diamond_schema?.shape)
                                  : item.variation_schema?.image ??
                                    item.variation_schema?.gallery_img?.[0] ??
                                    item.product_schema?.images?.[0]
                              }
                              width={50}
                              height={50}
                              alt="loosegrowndiamond_logo"
                            />
                            <div className="details text-capitalize">
                              {item.diamond_schema
                                ? `${item.diamond_schema.shape?.replaceAll('_', ' ')} Shape ${
                                    cutFilters.find(
                                      (_c) => _c.value === Number(item.diamond_schema?.cut)
                                    )?.label_view
                                  } Cut ${item.diamond_schema.carat} Carat ${
                                    item.diamond_schema.intensity
                                      ? colorDaimondFilters.find(
                                          (_c) =>
                                            _c.defaultValue === Number(item.diamond_schema?.color)
                                        )?.color
                                      : colorFilters.find(
                                          (_c) => _c.value === Number(item.diamond_schema?.color)
                                        )?.label_view
                                  } Color ${
                                    clarityFilters.find(
                                      (_c) => _c.value === Number(item.diamond_schema?.clarity)
                                    )?.label_view
                                  } Clarity Lab Grown Diamond`
                                : item.product_schema?.name}
                              {item.diamond_schema?.is_overnight ? (
                                <img
                                  className="ms-1"
                                  src={overNightImage.src}
                                  alt="overnight"
                                  style={{ width: '20px', height: '20px' }}
                                />
                              ) : (
                                item.diamond_schema?.express_shipping && (
                                  <img
                                    className="ms-1"
                                    src={ShippingImg.src}
                                    alt="express"
                                    style={{ width: '20px', height: '20px' }}
                                  />
                                )
                              )}
                              {/* <b className="fw-600 ms-1">× {item?.quantity ?? 1}</b> */}
                              <div className="mt-2" />
                              {item.product_schema?.product_type === 'custom' && (
                                <p className="m-0">
                                  <div className="description-cart">
                                    <HtmlContent
                                      html={
                                        item.product_schema.long_description ||
                                        item.product_schema.short_description
                                      }
                                    />
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
                                    <span>
                                      {item.diamond_schema.certificate_type &&
                                        certificateFilters.find(
                                          (_c) =>
                                            _c.value ===
                                            Number(item.diamond_schema?.certificate_type)
                                        )?.label}
                                    </span>
                                  </p>
                                  {item.diamond_schema?.certificate && (
                                    <p className="m-0">
                                      <span className="text_black_secondary">Certificate: </span>
                                      <Link
                                        href={item.diamond_schema.certificate ?? ''}
                                        target="_blank"
                                        style={{
                                          opacity: '0.8',
                                          fontWeight: '400',
                                          color: 'black',
                                        }}
                                      >
                                        {/* <i
                       className="fa fa-file-pdf"
                       style={{ color: 'black', textAlign: 'center' }}
                     /> */}
                                        {item.diamond_schema.certificate_no ||
                                          item.diamond_schema.certificate.split('=')[1] ||
                                          item.diamond_schema.sku ||
                                          ''}
                                      </Link>
                                    </p>
                                  )}
                                  {item.diamond_schema?.video_url && (
                                    <p className="m-0">
                                      <span className="text_black_secondary">Video : </span>
                                      <Link
                                        href={item.diamond_schema?.video_url ?? ''}
                                        target="_blank"
                                        style={{ opacity: '0.7' }}
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
                                  {item.variation_schema && (
                                    <p className="m-0">
                                      <span className="me-1">SKU:</span>
                                      <span>{item.variation_schema.sku}</span>
                                    </p>
                                  )}
                                  <p className="m-0 text-capitalize ">
                                    <span className="text_black_secondary ">Metal: </span>
                                    {item.variation_schema?.name.length > 1 &&
                                    ['14k', '18k', 'platinum'].some((keyword) =>
                                      item.variation_schema?.name[1]?.value?.includes(keyword)
                                    ) ? (
                                      <span className="text-capitalize">
                                        {item.variation_schema?.name[1]?.value?.replace(
                                          /[-_]/g,
                                          ' '
                                        )}
                                      </span>
                                    ) : (
                                      <span className="text-capitalize">
                                        {item.variation_schema?.name[0].value?.replace(
                                          /[-_]/g,
                                          ' '
                                        )}
                                      </span>
                                    )}
                                  </p>
                                  {item.variation_schema?.name.length > 1 && (
                                    <p className="mb-0">
                                      <span className="text_black_secondary ">Carat Weight: </span>
                                      {['14k', '18k', 'platinum'].some((keyword) =>
                                        item.variation_schema?.name[1]?.value?.includes(keyword)
                                      ) ? (
                                        <span className="text-capitalize">
                                          {item.variation_schema?.name[0].value?.replace(
                                            /[-_]/g,
                                            '.'
                                          )}
                                        </span>
                                      ) : (
                                        <span className="text-capitalize">
                                          {item.variation_schema?.name[1]?.value?.replace(
                                            /[-_]/g,
                                            '.'
                                          )}
                                        </span>
                                      )}
                                    </p>
                                  )}
                                  {item.back_setting && (
                                    <p className="mb-0">
                                      <span className="text_black_secondary ">Back Setting: </span>
                                      <span>{item.back_setting}</span>
                                    </p>
                                  )}
                                  {item.ring_size && (
                                    <p className="mb-0">
                                      <span className="text_black_secondary ">Ring Size: </span>
                                      <span>{item.ring_size}</span>
                                    </p>
                                  )}
                                  {item.bracelet_size && (
                                    <p className="mb-0">
                                      <span className="text_black_secondary ">
                                        Bracelet Length:{' '}
                                      </span>
                                      <span>{item.bracelet_size}</span>
                                    </p>
                                  )}
                                  {item.product_schema?.engraving_details?.text?.length > 0 && (
                                    <p className="mb-0">
                                      <span className="text_black_secondary ">
                                        Engraving Text:{' '}
                                      </span>
                                      <span
                                        style={{
                                          fontFamily: item.product_schema?.engraving_details?.font,
                                        }}
                                      >
                                        {item.product_schema?.engraving_details?.text}
                                      </span>
                                    </p>
                                  )}
                                </>
                              ) : (
                                !item.diamond_schema && (
                                  <>
                                    {item.variation_schema?.name?.map((ele: any) => (
                                      <div key={ele.value}>
                                        {/MM/i.test(ele.value)
                                          ? ele.value && (
                                              <p className="m-0 text-capitalize">
                                                <span className="text_black_secondary">Size: </span>
                                                <span>{ele.value?.replaceAll('_', ' ')}</span>
                                              </p>
                                            )
                                          : ['GHI', 'DEF'].includes(ele.value?.toUpperCase())
                                            ? ele.value && (
                                                <p className="m-0 text-capitalize">
                                                  <span className="text_black_secondary">
                                                    Available Colors:{' '}
                                                  </span>
                                                  <span className="text-uppercase">
                                                    {ele.value}
                                                  </span>
                                                </p>
                                              )
                                            : ele.value && (
                                                <p className="m-0 text-capitalize">
                                                  <span className="text_black_secondary">
                                                    Purity:{' '}
                                                  </span>
                                                  <span className="text-uppercase">
                                                    {ele.value}
                                                  </span>
                                                </p>
                                              )}
                                      </div>
                                    ))}
                                  </>
                                )
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{item.quantity} qty.</td>
                        <td className="text-end">
                          $
                          {(item.diamond_schema
                            ? item.diamond_schema.price *
                              ((item.variation_schema || item.product_schema) && item.diamond_schema
                                ? 1
                                : item.quantity)
                            : (item.variation_schema
                                ? (item.variation_schema?.sale_price as number)
                                : item.product_schema.sale_price) * item.quantity
                          ).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr>
                          <td className="border-bottom-0">
                            <div className="d-flex gap-10">
                              {item.product_schema && (
                                <Image
                                  src={
                                    item.variation_schema?.image ??
                                    item.variation_schema?.gallery_img?.[0] ??
                                    item.product_schema?.images?.[0]
                                  }
                                  alt="loosegrowndiamond_logo"
                                  width={50}
                                  height={50}
                                />
                              )}
                              <div className="details">
                                {item.product_schema?.name}
                                {/* <b className="fw-600 ms-1">× {item?.quantity ?? 1}</b> */}
                                <div className="mt-2" />
                                {item.variation_schema && (
                                  <p className="m-0">
                                    <span className="me-1">SKU:</span>
                                    <span>{item.variation_schema.sku}</span>
                                  </p>
                                )}
                                {item.variation_schema && (
                                  <>
                                    <p className="m-0 text-capitalize ">
                                      <span className="text_black_secondary ">Metal: </span>
                                      {item.variation_schema?.name.length > 1 &&
                                      ['14k', '18k', 'platinum'].some((keyword) =>
                                        item.variation_schema?.name[1]?.value?.includes(keyword)
                                      ) ? (
                                        <span className="text-capitalize">
                                          {item.variation_schema?.name[1]?.value?.replace(
                                            /[-_]/g,
                                            ' '
                                          )}
                                        </span>
                                      ) : (
                                        <span className="text-capitalize">
                                          {item.variation_schema?.name[0].value?.replace(
                                            /[-_]/g,
                                            ' '
                                          )}
                                        </span>
                                      )}
                                    </p>
                                    {item.variation_schema?.name.length > 1 && (
                                      <p className="mb-0">
                                        <span className="text_black_secondary ">
                                          Carat Weight:{' '}
                                        </span>
                                        {['14k', '18k', 'platinum'].some((keyword) =>
                                          item.variation_schema?.name[1]?.value?.includes(keyword)
                                        ) ? (
                                          <span className="text-capitalize">
                                            {item.variation_schema?.name[0].value?.replace(
                                              /[-_]/g,
                                              '.'
                                            )}
                                          </span>
                                        ) : (
                                          <span className="text-capitalize">
                                            {item.variation_schema?.name[1]?.value?.replace(
                                              /[-_]/g,
                                              '.'
                                            )}
                                          </span>
                                        )}
                                      </p>
                                    )}
                                    {item.back_setting && (
                                      <p className="mb-0">
                                        <span className="text_black_secondary ">
                                          Back Setting:{' '}
                                        </span>
                                        <span>{item.back_setting}</span>
                                      </p>
                                    )}
                                    {item.ring_size && (
                                      <p className="mb-0">
                                        <span className="text_black_secondary ">
                                          {(item.variation_schema || item.product_schema) &&
                                          item.diamond_schema
                                            ? 'Setting Size: '
                                            : 'Ring Size: '}
                                        </span>
                                        <span>{item.ring_size}</span>
                                      </p>
                                    )}
                                    {item.bracelet_size && (
                                      <p className="mb-0">
                                        <span className="text_black_secondary ">
                                          Bracelet Length:{' '}
                                        </span>
                                        <span>{item.bracelet_size}</span>
                                      </p>
                                    )}
                                    {item.product_schema?.engraving_details?.text?.length > 0 && (
                                      <p className="mb-0">
                                        <span className="text_black_secondary ">
                                          Engraving Text:{' '}
                                        </span>
                                        <span
                                          style={{
                                            fontFamily:
                                              item.product_schema?.engraving_details?.font,
                                          }}
                                        >
                                          {item.product_schema?.engraving_details?.text}
                                        </span>
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="border-bottom-0">
                            {(item.variation_schema || item.product_schema) && item.diamond_schema
                              ? '1'
                              : item.quantity}{' '}
                            qty.
                          </td>
                          <td className="text-end border-bottom-0">
                            {' '}
                            $
                            {(item.variation_schema
                              ? item.variation_schema.sale_price * item.quantity
                              : item.product_schema.sale_price * item.quantity
                            ).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex gap-10">
                              {item.diamond_schema && (
                                <Image
                                  src={
                                    item.diamond_schema &&
                                    findDiamodImg(item, item.diamond_schema?.shape)
                                  }
                                  alt="loosegrowndiamond_logo"
                                  width={50}
                                  height={50}
                                />
                              )}
                              <div className="details text-capitalize">
                                {item.diamond_schema &&
                                  `${item.diamond_schema.shape?.replaceAll('_', ' ')} Shape ${
                                    cutFilters.find(
                                      (_c) => _c.value === Number(item.diamond_schema?.cut)
                                    )?.label_view
                                  } Cut ${item.diamond_schema.carat} Carat ${
                                    item.diamond_schema.intensity
                                      ? colorDaimondFilters.find(
                                          (_c) =>
                                            _c.defaultValue === Number(item.diamond_schema?.color)
                                        )?.color
                                      : colorFilters.find(
                                          (_c) => _c.value === Number(item.diamond_schema?.color)
                                        )?.label_view
                                  } Color ${
                                    clarityFilters.find(
                                      (_c) => _c.value === Number(item.diamond_schema?.clarity)
                                    )?.label_view
                                  } Clarity Lab Grown Diamond`}
                                {item.diamond_schema.is_overnight ? (
                                  <img
                                    className="ms-1"
                                    src={overNightImage.src}
                                    alt="overnight"
                                    style={{ width: '20px', height: '20px' }}
                                  />
                                ) : (
                                  item.diamond_schema.express_shipping && (
                                    <img
                                      className="ms-1"
                                      src={ShippingImg.src}
                                      alt="express"
                                      style={{ width: '20px', height: '20px' }}
                                    />
                                  )
                                )}
                                {/* <b className="fw-600 ms-1">× {item?.quantity ?? 1}</b> */}
                                <div className="mt-2" />
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
                                      <span>
                                        {item.diamond_schema.certificate_type &&
                                          certificateFilters.find(
                                            (_c) =>
                                              _c.value ===
                                              Number(item.diamond_schema?.certificate_type)
                                          )?.label}
                                      </span>
                                    </p>
                                    {item.diamond_schema?.certificate && (
                                      <p className="m-0">
                                        <span className="text_black_secondary">Certificate: </span>
                                        <Link
                                          href={item.diamond_schema.certificate ?? ''}
                                          target="_blank"
                                          style={{
                                            opacity: '0.8',
                                            fontWeight: '400',
                                            color: 'black',
                                          }}
                                        >
                                          {/* <i
                                              className="fa fa-file-pdf"
                                              style={{ color: 'black', textAlign: 'center' }}
                                            /> */}
                                          {item.diamond_schema.certificate_no ||
                                            item.diamond_schema.certificate.split('=')[1] ||
                                            item.diamond_schema.sku ||
                                            ''}
                                        </Link>
                                      </p>
                                    )}
                                    {item.diamond_schema?.video_url && (
                                      <p className="m-0">
                                        <span className="text_black_secondary">Video : </span>
                                        <Link
                                          href={item.diamond_schema?.video_url ?? ''}
                                          target="_blank"
                                          style={{ opacity: '0.7' }}
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
                          <td>
                            {(item.variation_schema || item.product_schema) && item.diamond_schema
                              ? '1'
                              : item.quantity}{' '}
                            qty.
                          </td>
                          <td className="text-end">
                            $
                            {(item.diamond_schema.sale === true
                              ? item.diamond_schema.price *
                                ((item.variation_schema || item.product_schema) &&
                                item.diamond_schema
                                  ? 1
                                  : item.quantity)
                              : item.diamond_schema.price * item.quantity
                            ).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      </>
                    )}
                  </>
                ))}
            </tbody>
          </table>
          <div className="total_box">
            <div className="">
              <div className="d-flex align-items-center justify-content-between">
                <p className="fw-normal">Subtotal</p>
                <p className="fw-medium">
                  {' '}
                  $
                  {(order_base_price as number).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <p className="fw-normal">
                  Shipping
                  <br />
                  {/* {express_shipping && <span>Express Shipping (1 week)</span>} */}
                </p>
                <p className="fw-medium">
                  {Number(shipping_cost) === 0
                    ? 'FREE'
                    : `$${Number(shipping_cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
              </div>
              {Number(extra_charges) !== 0 && (
                <div className="d-flex align-items-center justify-content-between">
                  <p className="fw-normal">Transaction Fees</p>
                  <p className="fw-medium">
                    {' '}
                    $
                    {Number(extra_charges || extra_charges).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              )}
              {discount !== 0 && (
                <div className="d-flex align-items-center justify-content-between">
                  <p className="fw-normal">Discount</p>
                  <p className="green_text">
                    - $
                    {Number(discount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <p className="fw-normal">
                Payment Method
                <br />
              </p>
              <p className="fw-medium">
                {payment_method === 'wire' ? 'Direct Bank Transfer' : payment_method}
              </p>
            </div>
            <div className="border_bottom_gray" />
            <div className="d-flex align-items-center justify-content-between">
              <p className="fw-bold mb-0">Total</p>
              <p className="fw-bold mb-0">
                $
                {(
                  (order_base_price as number) +
                  Number(shipping_cost) +
                  Number(extra_charges) -
                  Number(discount)
                ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        {getCustomerOrderNote()?.length > 0 && (
          <div className="d-flex gap-2 mt-4 justify-content-start align-items-start">
            <h6 className="fw-600 text_black_secondary" style={{ whiteSpace: 'nowrap' }}>
              Order Note:
            </h6>
            <h6 className="fw-400">{getCustomerOrderNote()}</h6>
          </div>
        )}
        <table className="w-100 mt-4 table-bordered table order-address-table">
          <thead>
            <tr>
              <th className="w-50">Shipping Address</th>
              <th className="w-50">Billing Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="w-50">
                <span className="">
                  {address_schema?.shipping?.first_name} {address_schema?.shipping?.last_name}
                  <br />
                  {address_schema?.shipping?.address}
                  <br />
                  {address_schema?.shipping?.address_second &&
                    address_schema?.shipping?.address_second}
                  {address_schema?.shipping?.address_second && <br />}
                  {address_schema?.shipping?.city}
                  {', '}
                  {address_schema?.shipping?.postcode} <br className="d-none d-sm-block" />
                  {address_schema?.shipping?.state}
                  {address_schema?.shipping?.state && ', '}
                  {address_schema?.shipping?.country}
                  <br />
                  <br className="d-none d-sm-block" />
                  <i className="fa-solid fa-phone" /> {address_schema?.shipping?.phone}
                  <br />
                  <i className="fa-solid fa-envelope" /> {address_schema?.shipping?.email}
                </span>
              </td>
              <td className="w-50">
                <span className="">
                  {' '}
                  {address_schema?.billing?.first_name} {address_schema?.billing?.last_name}
                  <br />
                  {address_schema?.billing?.address}
                  <br />
                  {address_schema?.billing?.address_second &&
                    address_schema?.billing?.address_second}
                  {address_schema?.billing?.address_second && <br />}
                  {address_schema?.billing?.city} {address_schema?.billing?.postcode}{' '}
                  <br className="d-none d-sm-block" />
                  {address_schema?.billing?.state}
                  {address_schema?.billing?.state && ', '}
                  {address_schema?.billing?.country}
                  <br className="d-none d-sm-block" />
                  <br />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderDetailsView;

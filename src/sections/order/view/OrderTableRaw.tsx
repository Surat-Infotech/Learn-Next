import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from '@mantine/core';

import { IOrderList } from '@/api/order';

import { fDateTime } from '@/utils/formate-time';

import { paths } from '@/routes/paths';

const OrderTableRaw = ({ Orderdetails }: { Orderdetails: IOrderList }) => {
  const { push } = useRouter();
  const {
    _id,
    order_no,
    order_date,
    order_status,
    payment_status,
    order_base_price,
    products,
    shipping_cost,
    tracking_details,
    extra_charges,
  } = Orderdetails;

  const isRingAvailable = products?.some(
    (item) =>
      item.product_schema?.product_type === 'ring_setting' ||
      item.variation_schema?.product_type === 'ring_setting'
  );
  const isProductAvailable = products
    .map(
      (item) =>
        item.product_schema?.product_type !== 'ring_setting' &&
        (item.product_schema || item.variation_schema)
    )
    .find((i) => i);
  const isDiamondAvailable = products
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

  return (
    <tr>
      <td>#{order_no}</td>
      <td>{fDateTime(order_date)}</td>
      <td className="text-capitalize">
        {order_status !== 'cancelled' && payment_status.replaceAll('_', ' ') === 'failed'
          ? 'Pending payment'
          : findOrderStatus(order_status)}
      </td>
      <td className="fw-500">
        ${(Number(order_base_price) + Number(shipping_cost) + Number(extra_charges)).toFixed(2)}
      </td>
      <td className="text-center">
        {products.some((item) => item?.diamond_schema?.certificate)
          ? products.map((item, index) => {
              const videoUrl = item?.diamond_schema?.certificate;
              return (
                <span key={index}>
                  {videoUrl ? (
                    <Link href={videoUrl} target="_blank">
                      <i
                        className="fa fa-file-pdf"
                        style={{ color: 'black', textAlign: 'center', marginRight: '5px' }}
                      />
                    </Link>
                  ) : null}
                </span>
              );
            })
          : '-'}
      </td>
      <td className="text-center">
        {products.some((item) => item?.diamond_schema?.video_url)
          ? products.map((item, index) => {
              const videoUrl = item?.diamond_schema?.video_url;
              return (
                <span key={index}>
                  {videoUrl ? (
                    <Link href={videoUrl} target="_blank">
                      <i className="fa fa-video" style={{ color: 'black', marginRight: '5px' }} />
                    </Link>
                  ) : null}
                </span>
              );
            })
          : '-'}
      </td>
      <td className="text-center max_w_250">
        <div className="d-flex align-items-center justify-content-center flex-wrap gap-1">
          {order_status !== 'cancelled' &&
            ['failed', 'pending'].includes(payment_status?.replaceAll('_', ' ')) && (
              <Button
                type="button"
                className="common_btn me-0"
                onClick={() => push(`${paths.checkout.root}?order_id=${_id}`)}
              >
                Pay
              </Button>
            )}
          <Button
            type="button"
            className="common_btn me-0"
            onClick={() => push(paths.order.details(order_no))}
          >
            View
          </Button>
          {tracking_details?.map((i: any) => {
            const fedex = `https://www.fedex.com/wtrk/track/?trknbr=${i.tracking_number}`;
            const aramex = `https://www.aramex.com/us/en/track/shipments?ShipmentNumber=${i.tracking_number}`;
            const usps = `https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=${i.tracking_number}`;
            const ups = `https://www.ups.com/track?track=yes&trackNums=${i.tracking_number}&loc=en_US&requester=ST/trackdetails`;

            // eslint-disable-next-line consistent-return
            const findTrackingPath = (shipping_company_name: string) => {
              if (shipping_company_name === 'fedex') {
                return fedex;
              }
              if (shipping_company_name === 'aramex') {
                return aramex;
              }
              if (shipping_company_name === 'usps') {
                return usps;
              }
              if (shipping_company_name === 'ups') {
                return ups;
              }
            };
            return (
              <Link href={`${findTrackingPath(i.shipping_company)}`} target="_blank" className="">
                <Button type="button" className="common_btn me-0">
                  Track
                </Button>
              </Link>
            );
          })}
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRaw;

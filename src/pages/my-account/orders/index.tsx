import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';

import { orderQuery } from '@/api/order';

import ProfileSidebar from '@/components/profile/profileSideBar';

import { OrderTableRaw } from '@/sections/order/view';
import MyAccountAuthView from '@/sections/my-account-auth/view/MyAccountAuthView';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';

const OrderPage = () => {
  const { data: order, status, isSuccess, isFetching } = useQuery(orderQuery.all({}));

  if (isFetching) {
    return (
      <div className="ldmr_loading text-center p-5 min-h-454">
        <Image src={LoadingImage} alt="loader" width={30} height={30} />
      </div>
    );
  }
  return (
    <div className="min-h-454 account-form">
      <div className="container-fluid">
        <h1 className="h4 text-center fw-600 text_black_secondary mb_30">My Account</h1>
        {status === 'error' && !isSuccess ? (
          <>
            <Head>
              <title>
                Register - Wholesale Lab Grown Diamonds: Buy Certified Diamonds | Engagement Rings &
                Jewelry
              </title>
              <meta name="description" content="Get started with ease on our registration page." />
            </Head>
            <MyAccountAuthView />
          </>
        ) : (
          <>
            <Head>
              <title>My account</title>
              <meta name="description" content="" />
            </Head>
            <div className="row gy-4 gy-md-5 mt-0 justify-content-center justify-content-sm-start">
              <div className="col-lg-3">
                <ProfileSidebar />
              </div>
              <div className="col-lg-9">
                {order && order.length > 0 ? (
                  <div className="table-responsive">
                    <table className="order-table w-100">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Total</th>
                          <th>Certificate</th>
                          <th>Video</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order &&
                          order.map((item) => (
                            <OrderTableRaw key={item?._id} Orderdetails={item} />
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center align-items-center flex-column h-100">
                    <h2 className="text-center">No Orders</h2>{' '}
                    <Link href={paths.whiteDiamondInventory.root} className="common_btn p-3">
                      Go To Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// export const getServerSideProps = withSsrProps({
//   isProtected: true,
//   prefetch: async ({ q, accessToken }) => {
//     if (accessToken) {
//       await q.fetchQuery(orderQuery.all({ accessToken }));
//     }
//   },
// });

export default OrderPage;

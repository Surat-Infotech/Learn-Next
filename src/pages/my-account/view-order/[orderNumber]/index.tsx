import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useQuery } from '@tanstack/react-query';

import { orderQuery } from '@/api/order';

import { withSsrProps } from '@/utils/page';

import ProfileSidebar from '@/components/profile/profileSideBar';

import OrderDetailsView from '@/sections/order/order-details-view';

import LoadingImage from '@/assets/image/Loading.gif';

const OrderDetailsPage = () => {
    const { query } = useRouter();

    const orderNumber = query.orderNumber as string;

    const { data: order, isLoading } = useQuery(orderQuery.get(orderNumber));

    if (!order || isLoading) {
        return (
            <div className="py_40 mt_60">
                <div className="ldmr_loading text-center min-h-454">
                    <Image src={LoadingImage} alt="loader" width={50} height={50} />
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-454 account-form'>
            <div className="container-fluid">
                <h1 className="h4 text-center fw-600 text_black_secondary mb_30">My Account</h1>
                <div className="row gy-4 gy-md-5">
                    <div className="col-lg-3">
                        <ProfileSidebar />
                    </div>
                    <div className="col-lg-9">
                        <OrderDetailsView {...order} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = withSsrProps({
    isProtected: true,
});

export default OrderDetailsPage;

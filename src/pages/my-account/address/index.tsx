import React from 'react';

import { pick } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { addressDiarysQuery } from '@/api/address-diary';

import { withSsrProps } from '@/utils/page';

import ProfileSidebar from '@/components/profile/profileSideBar';

import { BillingAddressViewPage, ShippingAddressViewPage } from '@/sections/address/view';

const defaultAddressFiles = [
  '_id',
  'first_name',
  'last_name',
  'address_second',
  'phone',
  'email',
  'address',
  'city',
  'state',
  'address_type',
  'country',
  'postcode',
  'place_type',
];
const AddressPage = () => {
  const { data: addressDiary } = useQuery(addressDiarysQuery.all({}));

  const defaultShippingAddress = pick(
    addressDiary?.find((a) => a.is_default && a.address_type === 'shipping'),
    defaultAddressFiles
  );
  const defaultBillingAddress = pick(
    addressDiary?.find((a) => a.is_default && a.address_type === 'billing'),
    defaultAddressFiles
  );
  return (
    <div className='min-h-454 account-form'>
      <div className="container-fluid">
        <h1 className="h4 text-center fw-600 text_black_secondary mb-2 mb-md-4">My Account</h1>
        <div className="row gy-4 gy-md-5">
          <div className="col-lg-3">
            <ProfileSidebar />
          </div>
          <div className="col-lg-9">
            <div className='address-section'>
              <h3 className="fw-600 text_black_secondary">My Addresses</h3>
              <p className="mb_30 font_size_13">
                The following addresses will be used on the checkout page by default.
              </p>
              <div className="row row-gap-3">
                <div className="col-md-6">
                  <ShippingAddressViewPage shipping={defaultShippingAddress} />
                </div>
                <div className="col-md-6">
                  <BillingAddressViewPage billing={defaultBillingAddress} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const getServerSideProps = withSsrProps({
  isProtected: true,
  prefetch: async ({ q, accessToken }) => {
    await q.fetchQuery(addressDiarysQuery.all({ accessToken }));
  },
});

export default AddressPage;

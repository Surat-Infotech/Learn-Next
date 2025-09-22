import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useQuery } from '@tanstack/react-query';

import { addressDiarysQuery } from '@/api/address-diary';

import { withSsrProps } from '@/utils/page';

import ProfileSidebar from '@/components/profile/profileSideBar';

import AddressEditForm from '@/sections/address/address-edit-form';

import LoadingImage from '@/assets/image/Loading.gif';

const AddressEdit = () => {
  const { query } = useRouter();

  const addressId = query.addressId as string;

  const {
    data: address,
    isLoading,
    isError,
    isFetching,
  } = useQuery(addressDiarysQuery.get(addressId));

  if (isLoading || !address || isFetching) {
    return (
      <div className="ldmr_loading text-center p-5 min-h-454">
        <Image src={LoadingImage} alt="loader" width={30} height={30} />
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
          <div
            className={
              isError ? 'col-lg-9 d-flex align-items-center justify-content-center' : 'col-lg-9'
            }
          >
            {isError ? (
              <div className=" my-5 text-danger ">
                <div>Oops! Something went wrong. Please try again.</div>
              </div>
            ) : (
              <AddressEditForm address={address} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default AddressEdit;

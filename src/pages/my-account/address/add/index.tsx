import React from 'react';

import ProfileSidebar from '@/components/profile/profileSideBar';

import AddressEditForm from '@/sections/address/address-edit-form';

const AddressNew = () => (
  <div className='min-h-454 account-form'>
    <div className="container-fluid">
      <h1 className="h4 text-center fw-600 text_black_secondary mb_30">My Account</h1>
      <div className="row gy-4 gy-md-5">
        <div className="col-lg-3">
          <ProfileSidebar />
        </div>
        <div className="col-lg-9">
          <AddressEditForm />
        </div>
      </div>
    </div>
  </div>
);

export default AddressNew;

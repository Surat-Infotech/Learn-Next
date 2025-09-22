import Link from 'next/link';
import React, { FC } from 'react';

import { paths } from '@/routes/paths';

export type IBillingAddressViewProps = {
  billing: any;
};
const BillingAddressViewPage: FC<IBillingAddressViewProps> = (props) => {
  const { billing } = props;
  return (
    <div className="address-box">
      <div>
        <h4 className="fw-600 text_black_secondary mb-0">Billing page</h4>
        {Object.keys(billing).length > 0 ? (
          <Link href={paths.address.details(`edit/${billing?._id}`)}>Edit</Link>
        ) : (
          <Link href={paths.address.details(`add?type=billing`)}>Add</Link>
        )}
      </div>
      {Object.keys(billing).length > 0 ? (
        <>
          <span className='d-flex' ><span className='fw-700' >Name:</span><span className='ms-1' >{billing.first_name} {billing.last_name}</span></span>
          <span className='d-flex' ><span className='fw-700' >Address:</span><span className='ms-1' >{billing?.address}</span></span>
          <span className='d-flex' ><span className='fw-700' >Address 2:</span><span className='ms-1' >{billing?.address_second}</span></span>
          <span className='d-flex' ><span className='fw-700' >Country:</span><span className='ms-1' >{billing.country}</span></span>
          <span className='d-flex' ><span className='fw-700' >State:</span><span className='ms-1' >{billing.state}</span></span>
          <span className='d-flex' ><span className='fw-700' >City:</span><span className='ms-1' >{billing.city}</span></span>
        </>
      ) : (
        <p className="">You have not set up this type of address yet.</p>
      )}
    </div>
  );
};

export default BillingAddressViewPage;

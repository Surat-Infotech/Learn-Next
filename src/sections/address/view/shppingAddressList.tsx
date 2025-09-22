import Link from 'next/link';
import React, { FC } from 'react';

import { paths } from '@/routes/paths';

export type IShippingAddressViewProps = {
  shipping: any;
};
const ShppingAddressViewPage: FC<IShippingAddressViewProps> = (props) => {
  const { shipping } = props;
  return (
    <div className="address-box">
      <div>
        <h4 className="fw-600 text_black_secondary mb-0">Shipping page</h4>
        {Object.keys(shipping).length > 0 ? (
          <Link href={paths.address.details(`edit/${shipping?._id}`)}>Edit</Link>
        ) : (
          <Link href={paths.address.details(`add?type=shipping`)}>Add</Link>
        )}
      </div>
      {Object.keys(shipping).length > 0 ? (
        <>
          <span className='d-flex' ><span className='fw-700' >Name:</span><span className='ms-1' >{shipping.first_name} {shipping.last_name}</span></span>
          <span className='d-flex' ><span className='fw-700' >Address:</span><span className='ms-1' >{shipping?.address}</span></span>
          <span className='d-flex' ><span className='fw-700' >Address 2:</span><span className='ms-1' >{shipping?.address_second}</span></span>
          <span className='d-flex' ><span className='fw-700' >Country:</span><span className='ms-1' >{shipping.country}</span></span>
          <span className='d-flex' ><span className='fw-700' >State:</span><span className='ms-1' >{shipping.state}</span></span>
          <span className='d-flex' ><span className='fw-700' >City:</span><span className='ms-1' >{shipping.city}</span></span>
        </>
      ) : (
        <p className="">You have not set up this type of address yet.</p>
      )}
    </div>
  );
};

export default ShppingAddressViewPage;

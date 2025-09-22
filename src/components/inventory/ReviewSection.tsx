import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import TrustPailotLogo from '@/assets/image/trustpilot-logo.svg';
import TrustPailotRating from '@/assets/image/stars-5-trustpilot.svg';

const ReviewSection = () => (
  <div className="review-section d-flex flex-wrap justify-content-center align-items-center">
    <p className="mb-0 me-1">See what our customers say about us. </p>
    <div className="d-flex align-items-center">
      <Image src={TrustPailotRating} alt="TrustPilot" width={100} height={20} />
      <p className="mb-0 ms-1"> 5.0 out of 5.0 </p>
    </div>
    <div className="d-flex align-items-center">
      <Link
        href="https://www.trustpilot.com/review/www.loosegrowndiamond.com"
        target="_blank"
        className="read-all-reviews"
      >
        Read all reviews on
      </Link>
      <Link href="https://www.trustpilot.com/review/www.loosegrowndiamond.com" target="_blank">
        <Image src={TrustPailotLogo} alt="TrustPilot" width={100} height={20} />
      </Link>
    </div>
  </div>
);

export default ReviewSection;

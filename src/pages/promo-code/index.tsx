/* eslint-disable jsx-a11y/no-static-element-interactions */
import Image from 'next/image';
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useState, useEffect } from 'react';

import { withSsrProps } from '@/utils/page';

const PromoCodePage: FC = () => {
  const [copiedLOVE20, setCopiedLOVE20] = useState(false);
  const [copiedLGD20, setCopiedLGD20] = useState(false);

  useEffect(() => {
    if (copiedLOVE20) {
      setTimeout(() => {
        setCopiedLOVE20(false);
      }, 2000);
    }
    if (copiedLGD20) {
      setTimeout(() => {
        setCopiedLGD20(false);
      }, 2000);
    }
  }, [copiedLOVE20, copiedLGD20]);
  return (
    <div className="promo_code_section mx-auto">
      <div className="banner_section">
        <div className="py_60">
          <div className="container first_section mx-auto">
            <div className="row">
              <div className="text-center mb_50">
                <h2 className="fw-400  ">Current Offers and Promo Code</h2>
                <p className="mb-0">
                  Hey there! Looking for the freshest info on Loose Grown Diamond special discounts,
                  promotions, coupon codes, and exclusive offers? Look no further! Weve got your back.
                  Were all about transparency! Get a list of online discounts and let us help you find
                  the best deal.
                </p>
              </div>
              <div className="deal_box">
                <div className="box">
                  <div className="text-center">
                    <h2 className="mb_20 fw-400">Save on your Diamond, Ring and Jewelry</h2>
                    <p>
                      Save 2% on your Lab Diamond, Engagement Ring and Jewelry purchase of $1500 or
                      more with code LOVE20 or LGD20. Offer cannot be combined with any other
                      promotions. Offer valid through December 31, 2025.
                    </p>
                    <div className="crpto_ads ">
                      <span className="code">LOVE20</span>
                      <span className="copy_code" onClick={() => { window.navigator.clipboard.writeText('LOVE20'); setCopiedLOVE20(true) }} >{copiedLOVE20 ? 'Copied' : 'Copy code'}</span>
                    </div>
                    <div className="crpto_ads mx-auto my-0">
                      <span className="code">LGD20</span>
                      <span className="copy_code" onClick={() => { window.navigator.clipboard.writeText('LGD20'); setCopiedLGD20(true) }} >{copiedLGD20 ? 'Copied' : 'Copy code'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flower_image p-0">
                <Image
                  src="https://cdn.loosegrowndiamond.com/wp-content/uploads/2023/08/Loose-Grown-Diamond-Promo-Code.png"
                  alt="image"
                  className="img-fluid"
                  width={750}
                  height={250}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default PromoCodePage;

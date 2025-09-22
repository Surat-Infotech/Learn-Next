import Image from 'next/image';
import { FC, useState, useEffect } from 'react';

import { useLocalStorage } from 'usehooks-ts';

import { withSsrProps } from '@/utils/page';

import Handmade from '@/assets/image/icon/handmade.svg';
import Guarantee from '@/assets/image/icon/guarantee.png';
import RightHands from '@/assets/image/icon/right-hands.svg';
import Certification from '@/assets/image/icon/certified.svg';
import HappyCustomers from '@/assets/image/icon/happy-customers.svg';
import WorldwideDelivery from '@/assets/image/icon/worldwide_delivery.svg';

const WhyChooseUsPage: FC = () => {
  const [formattedNumber, setFormattedNumber] = useState<any>('950,000');
  const [_totalWhiteDiamond,] = useLocalStorage<number>('totalDiamond', 0);
  const a = Number(_totalWhiteDiamond);
  const divisor = 10 ** (String(a).length - 2);
  const rounded = Math.round(a / divisor) * divisor;

  useEffect(() => {
    if (rounded > 0) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const formattedNumber = new Intl.NumberFormat('en-US').format(rounded);
      setFormattedNumber(formattedNumber);
    }
  }, [_totalWhiteDiamond, rounded]);

  return (
    <div className="why_choose_us">
      <div className="banner_section">
        <div className="py_60">
          <div className="container-fluid">
            <h1 className="text-center main_title mb_30">Why Choose Us</h1>
            <div className="why_quote">
              <h3 className="mb-0">
                Over 40% savings on retail prices of LAB GROWN DIAMOND! No inventory costs, store
                costs, and overhead costs. Diamonds shipped directly from the manufacturer to your
                doorstep.
              </h3>
            </div>
            <video
              className="img-fluid"
              src="https://www.loosegrowndiamond.com/wp-content/uploads/ls_custom/loose-grown-diamond-banner-video.mp4"
              autoPlay
              muted
              loop
            />
            <div className="row row_gap_30">
              <div className="col-lg-4 col-md-6">
                <div className="box">
                  <Image src={Certification} alt="certified" />
                  <h4>{formattedNumber}+ GIA/IGI/GCAL Certified Lab Grown Diamonds</h4>
                  <p className="mb-0">
                    {`Diamonds directly from those that cut and polish the stones - Direct to the
                  factory, we're uniquely placed to offer you the world's most luxurious stones at a
                  price that's affordable.`}
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="box">
                  <Image src={Handmade} alt="handmade" />
                  <h4>Fancy Cut Diamonds are handmade to order by our master craftsmen</h4>
                  <p className="mb-0">
                    We strongly believe that as no two diamonds are alike, neither should the jewelry
                    and we make each piece to order which in turn keeps our costs down and therefore
                    the price you pay. we will make the custom shape lab grown diamonds just for you.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="box">
                  <Image src={RightHands} alt="right-hands" />
                  <h4>{`You're in the right hands`}</h4>
                  <p className="mb-0">
                    With a company founder that is a third-generation diamond manufacturer and a
                    combined experience within our workshops of over 41+ years, we know what it takes
                    to make your unique purchase extra special.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="box">
                  <Image src={HappyCustomers} alt="happy-customers" />
                  <h4>Thousands of happy customers</h4>
                  <p className="mb-0">
                    {`Don't just take our word for it, we have made so many dreams come true with our
                  Lab grown diamonds and you can read online from those that have experienced our
                  products and customer service.`}
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="box">
                  <Image src={Guarantee} alt="guarantee" width={40} style={{ height: "38px" }} />
                  <h4>Manufacturer Warranty</h4>
                  <p className="mb-0">
                    All our items are covered against our manufacturer warranty such as a production
                    warranty that addresses any manufacturing issues within 7 days.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="box">
                  <Image src={WorldwideDelivery} alt="worldwide_delivery" />
                  <h4>Worldwide Delivery</h4>
                  <p className="mb-0">
                    We ship Worldwide. Wherever you are, we will dispatch your item to you fully
                    insured by us until the item has reached your address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default WhyChooseUsPage;

import { FC } from 'react';
import Image from 'next/image';

import { withSsrProps } from '@/utils/page';

import business from '@/assets/image/icon/business.svg';
import manufacturing from '@/assets/image/manufactring.jpg';
import attachMoney from '@/assets/image/icon/attach_money.svg';
import secureShopping from '@/assets/image/icon/secure-shopping.svg';

const AboutUsPage: FC = () => (
  <div className="about_us px-2">
    <div className="banner_section">
      <div className="py_60">
        <div className="container-fluid">
          <div className="text-center">
            <h2 className="text_black_secondary fw-600 mb-0">Our Story</h2>
          </div>
        </div>
      </div>
    </div>
    <div className="container-fluid">
      <div className="row flex-lg-row-reverse row_gap_30">
        <div className="col-lg-6">
          <Image
            src={manufacturing}
            alt="manufactring"
            className="d-block mx-auto ms-lg-auto img-fluid main_img"
          />
        </div>
        <div className="col-lg-6">
          <h3 className="main_title">41+ Years of Experience in the Diamond Industry</h3>
          <p className="text_p mb_40">
            Loose Grown Diamond was established in 1984, For over 41+ years, we have been trying to
            save the earth. We believe that diamonds should not cost our planet. thus, we proudly
            manufacture laboratory-grown diamonds.
          </p>
          <p className="text_p mb_40">
            Loose Grown Diamond is a trend-forward supplier of Lab Grown Diamonds and 100% GIA, IGI
            & GCAL certified Lab Grown Diamonds.
          </p>
          <p className="text_p mb_35">
            We begin telling your diamond purchase quick and affordable by offering IGI & GIA
            certified customized eco-friendly Lab created diamonds – HPHT diamonds, CVD diamonds,
            Synthetic diamonds, Melee diamonds, Loose diamonds, Fancy shape lab created diamonds
            such as round, marquise, princess, heart, oval, pear, radiant, Asscher, emerald,
            baguette, and custom shape lab created diamonds.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <p className="text_p mb_20">
            Our Lab Grown Diamonds are 100% Conflict-Free, Ethically Made, and Recyclable. 100%
            Customizable to size, shape, color, clarity, cut, and carat.
          </p>
        </div>
      </div>
    </div>
    <div className="container-fluid pt-4 pt-md-5 mb_135">
      <h2 className="mb_70 text-center">WHY BUY LAB CREATED DIAMONDS FROM US?</h2>
      <div className="row row_gap_30">
        <div className="col-lg-4">
          <div className="about_box">
            <Image src={business} alt="business" />
            <h4>Own Manufacturing Unit</h4>
            <p className="mb-0">
              We have our own diamond manufacturing unit called Loose Grown Diamond in India which
              deals Globally with wholesale customers.
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="about_box">
            <Image src={attachMoney} alt="attach_money" />
            <h4>Lowest Prices</h4>
            <p className="mb-0">
              We craft diamonds at our own manufacturing unit so you will get diamonds at a
              wholesale price than other platforms.
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="about_box">
            <Image src={secureShopping} alt="secure-shopping" />
            <h4>Secure Shopping</h4>
            <p className="mb-0">
              Our site uses SSL encryption technology. This is the most advanced security software
              currently available for online transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default AboutUsPage;

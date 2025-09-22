import Link from 'next/link';
import Image from 'next/image';

import Trustpilot from '@/assets/image/logo/trustpilot_logo.svg';
import ReviewCustomerFirstImg from '@/assets/image/icon/review_client_img_1.svg';
import ReviewCustomerThirdImg from '@/assets/image/icon/review_client_img_3.svg';
import ReviewCustomerSecondImg from '@/assets/image/icon/review_client_img_2.svg';

const TrustPilotReviewSection = () => (
  <div className="section">
    <div className="container-fluid">
      <div className="text-center py_60 pt-0">
        <h1 className="text_black_secondary font_literata mb-3 text-capitalize">
          What Our Customers Say
        </h1>
        <h5 className="text_black_secondary fw-400 mb-0">
          We have served 19,987+ customers worldwide and counting
        </h5>
      </div>
      <div className="row justify-content-center row-gap-3 row-gap-sm-4 px-12 px-xl-0">
        <div className="col-lg-4 col-sm-6">
          <div className="review_box">
            <h5 className="text-light-blue fw-600 mb-0">Reliable, definitely recommend!</h5>
            <p>
              I was really scared to make this kind of purchase online. I read all the positive
              reviews and decided to give them a chance. I’m so glad I did!! My diamond is
              beautiful! The payment process was quick and easy, my diamond was delivered 10 days
              after my order was placed..
            </p>
            <div className="review_client_img_box d-flex align-items-center">
              <Image src={ReviewCustomerFirstImg} alt="review_client_img_1" className="img-fluid" />
              <div className="d-flex justify-content-center flex-column">
                <p className="mb-1">
                  Anuschka Grobler <i className="fa-solid fa-circle-check" />
                </p>
                <span>Kentucky</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6">
          <div className="review_box">
            <h5 className="text-light-blue fw-600 mb-0">I had an extremely positive experience…</h5>
            <p>
              I was looking for rings online and nothing came up within my style/budget until I came
              across this site. I was skeptical from it being online, but I was always notified of
              what was happening behind the scenes. I couldn’t be happier with this company.
            </p>
            <div className="review_client_img_box d-flex align-items-center">
              <Image
                src={ReviewCustomerSecondImg}
                alt="review_client_img_2"
                className="img-fluid"
              />
              <div className="d-flex justify-content-center flex-column">
                <p className="mb-1">
                  Evan Onuskanych <i className="fa-solid fa-circle-check" />
                </p>
                <span>New York</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6">
          <div className="review_box">
            <h5 className="text-light-blue fw-600 mb-0">Great prices, great customer service!</h5>
            <p>
              The prices on this site are significantly lower than other retailers for the exact
              same diamond. Shipping does take longer than expected, but it was worth the wait, and
              Sarah did keep me updated the entire process.
            </p>
            <div className="review_client_img_box d-flex align-items-center">
              <Image src={ReviewCustomerThirdImg} alt="review_client_img_3" className="img-fluid" />
              <div className="d-flex justify-content-center flex-column">
                <p className="mb-1">
                  Samantha A<i className="fa-solid fa-circle-check" />
                </p>
                <span>Massachusetts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <Link
          href="https://www.trustpilot.com/review/www.loosegrowndiamond.com"
          className="common_btn green_btn"
          target="_blank"
        >
          More Reviews on
          <Image src={Trustpilot} alt="trustpilot_logo" className="img-fluid ms-1" style={{ marginBottom: "6px" }} />
        </Link>
      </div>
    </div>
  </div>
);

export default TrustPilotReviewSection;

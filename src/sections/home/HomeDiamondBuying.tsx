import Link from 'next/link';
import Image from 'next/image';

import { paths } from '@/routes/paths';
import mobileLabGrownColorDiamond from '@/assets/image/mobile-Lab-Grown-Color-Diamond-1-1.webp';

import TrustPilotReviewSection from './TrustPilotReviewSection';

export default function HomePageDiamondBuying() {
  return (
    <div className="bg_light_gray">
      {/* <div className="section">
        <div className="container-fluid">
          <h1 className="font_literata text_black_secondary text-center mb-0 py_60 pt-0">
            Diamond Buying Resources
          </h1>
          <div className="row row_gap_30 justify-content-center">
            <div className="col-sm-6 px-15">
              <div className="resources_section">
                <Image src={ResourceFirstImg} alt="resources_1" className="w-100" />
                <div className="resources_section_content">
                  <h3 className="mb-0">Why Choose Lab-Created Diamonds?</h3>
                  <h6 className="mb-0">
                    Lab-grown diamonds are environmentally friendly and cost-efficient. They undergo
                    the same processing and grading standards as mined diamonds, based on the 4Cs of
                    diamond certification.
                  </h6>
                  <a href="#">Read More</a>
                </div>
              </div>
            </div>
            <div className="col-sm-6 px-15">
              <div className="resources_section">
                <Image src={ResourceSecondImg} alt="resources_2" className="w-100" />
                <div className="resources_section_content">
                  <h3 className="mb-0">What are Lab Grown Diamonds?</h3>
                  <h6 className="mb-0">
                    Lab-grown diamonds are created in a lab using two methods: High-Pressure
                    High-Temperature and Chemical Vapor Deposition, and differ from mined diamonds
                    which are extracted from the earth.
                  </h6>
                  <a href="#">Read More</a>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-6">
              <div className="resources_section">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <Image src={ResourceThirdImg} alt="resources_3" className="w-100" />
                  </div>
                  <div className="col-md-6">
                    <div className="resources_section_content">
                      <h3 className="mb-0">Lab Created Diamonds Grading & Certification</h3>
                      <h6 className="mb-0">
                        We send all of our lab-grown diamonds for inspection to renowned
                        institutions such as GIA, IGI, and GCAL.
                      </h6>
                      <a href="#">Read More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Shop Colored Lab Diamonds */}
      <div className="bg_lab_diamond">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="lab_diamond_text">
                <h1 className="text_white_primary font_literata mb_10">
                  Shop Colored Lab Diamonds
                </h1>
                <p className="text_white_primary fw-400 mb_40">
                  Select your perfect fancy color lab created diamond from thousands of{' '}
                  <br className="d-none d-xl-block" />
                  ethically sourced diamonds.
                </p>
                <Link href={`${paths.colorDiamondInventory.root}`} className="common_btn white_btn">
                  Shop Colored Lab Grown Diamonds
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lab_diamond_sm">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <Image
                src={mobileLabGrownColorDiamond}
                alt="bg_lab_diamond_img"
                className="img-fluid"
                width={mobileLabGrownColorDiamond.width}
                height={mobileLabGrownColorDiamond.height}
              />
              <div className="lab_diamond_text pt-4">
                <h2 className="text_white_primary font_literata mb_10">
                  Shop Colored Lab Diamonds
                </h2>
                <p className="text_white_primary fw-400 mb_40">
                  Select your perfect fancy color lab created diamond from thousands of{' '}
                  <br className="d-none d-lg-block" />
                  ethically sourced diamonds.
                </p>
                <Link href={`${paths.colorDiamondInventory.root}`} className="common_btn white_btn">
                  Shop Colored Lab Grown Diamonds
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrustPilotReviewSection />
    </div>
  );
}

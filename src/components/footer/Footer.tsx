import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { paths } from '@/routes/paths';
import PaymentImg from '@/assets/image/payments.svg';
import GoogleRatingImg from '@/assets/image/gr1.svg';
import TrustPilotReviewImg from '@/assets/image/trustpilot-review.svg';
import DmcaProtectedSmlImg from '@/assets/image/dmca_protected_sml_120m.png';

// --------------------------------------------------------------------------------

const Footer: FC = () => {
  const router = useRouter();
  return (
    <>
      {!['/login', '/register', '/forgot-password'].includes(router.pathname) && (
        <footer>
          <div className="container-fluid">
            <div className="row justify-content-between">
              <div className="col-xl-4 col-lg-4 col-md-12">
                <div>
                  <p className="text_white_primary text-uppercase mb-0 footer_title">
                    Connnect with us
                  </p>
                  <ul className="soical_links">
                    <li>
                      <Link href="https://twitter.com/grown_diamond" target="_blank">
                        <i className="fa-brands fa-x-twitter" />
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.facebook.com/LooseGrownDiamond" target="_blank">
                        <i className="fa-brands fa-facebook-f" />
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.instagram.com/loosegrown_diamond/" target="_blank">
                        <i className="fa-brands fa-instagram" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.youtube.com/channel/UCwlJvdgFUqw2wUyW5rAGxmw"
                        target="_blank"
                      >
                        <i className="fa-brands fa-youtube" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.tiktok.com/@loosegrowndiamond?lang=en"
                        target="_blank"
                      >
                        <i className="fa-brands fa-tiktok" />
                      </Link>
                    </li>
                    <li>
                      <Link href="https://in.pinterest.com/LooseGrownDiamond" target="_blank">
                        <i className="fa-brands fa-pinterest" />
                      </Link>
                    </li>
                  </ul>
                  <Link
                    href="https://www.trustpilot.com/review/www.loosegrowndiamond.com"
                    target="_blank"
                  >
                    <Image
                      src={TrustPilotReviewImg}
                      alt="TrustPilotReviewImg"
                      width={TrustPilotReviewImg.width}
                      height={TrustPilotReviewImg.height}
                      className="d-block mb-sm-2 mt-3 mt-lg-0 img-fluid"
                    />
                  </Link>
                  <Link href={paths.googleMap.root} target="_blank">
                    <Image
                      src={GoogleRatingImg}
                      width={GoogleRatingImg.width}
                      height={GoogleRatingImg.height}
                      alt="google_rating"
                      className="d-block "
                      priority
                    />
                  </Link>
                  <div className="fa_icon">
                    <i className="fa fa-phone" />
                    <a href="tel:+1 646-288-0810 " className="text-decoration-none">
                      +1 646-288-0810
                    </a>
                    <br />
                    <i className="fa fa-map-marker" />{' '}
                    <span style={{ fontSize: '14px' }}>55W 47th St., Suite #790</span>
                    <br />
                    <span style={{ fontSize: '14px' }}>New York, NY-10036, USA</span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-3 col-sm-5">
                <p className="text_white_primary text-uppercase mb_30 footer_title">
                  Diamond Categories
                </p>
                <div className="row">
                  <div className="col-12">
                    <ul className="widget_links">
                      <li>
                        <Link href={paths.colorMeleeDiamonds.root}>Color Melee Diamonds</Link>
                      </li>
                      {/* <li>
                        <Link href={paths.meleeDiamonds.root}>Round Melee Diamonds</Link>
                      </li> */}
                      <li>
                        <Link href={paths.calibratedDiamonds.root}>Round Calibrated Diamonds</Link>
                      </li>
                      <li>
                        <Link
                          href={`${paths.whiteDiamondInventory.root}?certificate=IGI&view=true`}
                        >
                          IGI Certified Diamonds
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`${paths.whiteDiamondInventory.root}?certificate=GIA&view=true`}
                        >
                          GIA Certified Diamonds
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`${paths.whiteDiamondInventory.root}?certificate=GCAL&view=true`}
                        >
                          GCAL Certified Diamonds
                        </Link>
                      </li>
                      <li>
                        <Link href={paths.fancyShapesDiamonds.root}>Fancy Shape Diamonds</Link>
                      </li>
                      <li>
                        <Link href={paths.customeShapeDiamond.root}>Custom Shape Diamonds</Link>
                      </li>
                      <li>
                        <Link href={paths.labcreatedDiamondRing.root}>
                          Lab Grown Diamond Engagement Rings
                        </Link>
                      </li>
                      <li>
                        <Link href={paths.diamondPriceCalculator.root}>
                          Diamond Price Calculator
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-5 col-sm-7">
                <div className="row">
                  <div className="col-6">
                    <p className="text_white_primary text-uppercase mb_30 footer_title">Help</p>
                    <ul className="widget_links">
                      <li>
                        <Link href={paths.aboutUs.root}>About Us</Link>
                      </li>
                      {/* <li>
                        <Link href={paths.comparison.root}>Compare Us</Link>
                      </li> */}
                      <li>
                        <Link href={paths.whyChooseUs.root}>Why Choose Us</Link>
                      </li>
                      <li>
                        <Link href={paths.diamondSizeChart.root}>Diamond Size Chart</Link>
                      </li>
                      <li>
                        <Link
                          href="https://www.loosegrowndiamond.com/wp-content/uploads/2021/08/LGD-RING-SIZER.pdf"
                          target="_blank"
                        >
                          Ring Sizer
                        </Link>
                      </li>
                      <li>
                        <Link href={paths.faq.root}>FAQ</Link>
                      </li>
                      <li>
                        <Link href={paths.blog.root}>Blog</Link>
                      </li>
                      <li>
                        <Link href={paths.wholesale.root}> Wholesale Inquiries</Link>
                      </li>
                      <li>
                        <Link href={paths.contactUs.root}>Contact Us</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-6">
                    <p className="text_white_primary footer_title">Privacy</p>
                    <ul className="widget_links">
                      <li>
                        <Link href={paths.cryptoPayment.root}>Crypto Payment</Link>
                      </li>
                      <li>
                        <Link href={paths.shipping.root}>Shipping Policy</Link>
                      </li>
                      <li>
                        <Link href={paths.returnPolicy.root}>Return/Refund Policy</Link>
                      </li>
                      <li>
                        <Link href={paths.diamondPriceMatch.root}> Price Match Policy</Link>
                      </li>
                      <li>
                        <Link href={paths.jewelryInsurance.root}> Jewelry Insurance</Link>
                      </li>
                      <li>
                        <Link href={paths.promoCode.root}>Promo Code</Link>
                      </li>
                      <li>
                        <Link href={paths.feedbackForm.root}>Feedback Form</Link>
                      </li>
                      <li>
                        <Link href={paths.privacyPolicy.root}>Privacy Policy</Link>
                      </li>
                      <li>
                        <Link href={paths.termOfUse.root}>Terms Of Use</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom_footer">
              <div className="d-md-flex d-block">
                <div className="col-sm-6 mx-auto mx-md-0">
                  <p className="mb-0 text-center mx-auto text-md-start">
                    Copyright Loose Grown Diamond {new Date().getFullYear()}. All Rights Reserved.
                  </p>
                  <Link
                    href={paths.DMCAProtected.root}
                    className="d-flex d-md-block mt-2 justify-content-center"
                    target="_blank"
                  >
                    <Image
                      src={DmcaProtectedSmlImg}
                      alt="dmca_protected_sml"
                      width={DmcaProtectedSmlImg.width}
                      height={DmcaProtectedSmlImg.height}
                    />
                  </Link>
                </div>
                <div className="col-sm-6 mx-auto mx-md-0 mt-2">
                  <div className="widget_media_image d-flex float-md-end d-md-block justify-content-center mt-3 mt-sm-0">
                    <Image
                      src={PaymentImg}
                      alt="paypal"
                      width={PaymentImg.width}
                      height={PaymentImg.height}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;

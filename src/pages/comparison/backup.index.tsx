import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { withSsrProps } from '@/utils/page';

import { paths } from '@/routes/paths';
import Banner3 from '@/assets/image/banner-3.png';
import LogoImg from '@/assets/image/logo/loosegrowndiamond_logo.svg';

const ComparisonPage: FC = () => {
  const router = useRouter();
  return (
    <div className="comparison">
      <div className="banner_section">
        <div className="main_sec">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <h1>How do we compare?</h1>
            </div>
            <div className="col-lg-9 col-md-6">
              <div>
                <Image src={Banner3} alt="banner-3" className="img-fluid  d-md-block d-none " />
                <p>
                  Loose Grown Diamond delivers the very best value. We believe we can
                  <br className="d-none d-md-block" />
                  make a difference by more carats and less prices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="yellow_box">
        <div className="loose-table">
          <div className="container pt_35">
            <div className="text-center">
              <h1 className="text-center comparing_title ">Comparing Price</h1>
              <h3 className="text-center comparing_text ">
                1.50 ct round stone in F color <br />
                and VS2 clarity and minimum <br />
                very good cut grade.
              </h3>
              <div className="d-flex pt_35 ml_20 h_200">
                <div className="compare_box ">
                  <div className="main">
                    <Image src={LogoImg} alt="loosegrowndiamond_logo" />
                    <span>
                      Lab Grown <br /> Diamond
                    </span>
                  </div>
                  <div className="price_box bg-dark">
                    <span className="text-white">$2,814.00</span>
                  </div>
                </div>

                <div className="table-responsive hideScrollbar">
                  <table>
                    <tbody>
                      <tr>
                        <th>
                          <strong>CLEAN ORIGIN</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>MIADONNA</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>RITANI</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br /> Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>1215 DIAMONDS</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>BRILLIANT EARTH</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>JAMES ALLEN</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>WITH CLARITY</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td>$3,000.00</td>
                        <td>$4,568.00</td>
                        <td>$3,237.00</td>
                        <td>$3,407.00</td>
                        <td>$4,230.00</td>
                        <td>$4,630.00</td>
                        <td>$3,276.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="loose-table">
          <div className="container">
            <div className="col-10 mx-auto my_30 ">
              <div className="hr_line" />
            </div>
            <div className="text-center pt_15">
              <h3 className="text-center comparing_text ">
                2.00 ct round stone in H color <br />
                and VS1 clarity and minimum <br />
                very good cut grade.
              </h3>
              <p className="mt_25 mb-0">(Miadonna Price stands for 2.01 ct stone)</p>
              <div className="d-flex pt_35 ml_20 h_200">
                <div className="compare_box ">
                  <div className="main">
                    <Image src={LogoImg} alt="loosegrowndiamond_logo" />
                    <span>
                      Lab Grown <br /> Diamond
                    </span>
                  </div>
                  <div className="price_box bg-dark">
                    <span className="text-white">$2,814.00</span>
                  </div>
                </div>

                <div className="table-responsive hideScrollbar">
                  <table>
                    <tbody>
                      <tr>
                        <th>
                          <strong>CLEAN ORIGIN</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>MIADONNA</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>RITANI</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br /> Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>1215 DIAMONDS</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>BRILLIANT EARTH</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>JAMES ALLEN</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>WITH CLARITY</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td>$4,783.00</td>
                        <td>$7,857.00</td>
                        <td>$6,095.00</td>
                        <td>$6,573.00</td>
                        <td>$5,790.00</td>
                        <td>$5,470.00</td>
                        <td>$6,922.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content_box">
          <div className="container ">
            <div className="col-12">
              <p className="mb_35 text">
                Prices shown are for round, lab-created diamonds listed on LooseGrownDiamond.com for
                specified characteristics vs. lowest priced round lab-created diamonds (as noted)
                listed on competitors’ websites as of July 5, 2021
              </p>
            </div>
            <div className="second_box">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-md-4 ">
                    <h1 className="comparison_heading">So, why is our pricing so amazing?</h1>
                  </div>
                  <div className="col-md-8">
                    <p>
                      We have over 41+ years of diamond jewelry experience. We are diamond
                      manufacturers. We believe we can make a difference by giving more carats at less
                      prices
                    </p>
                    <p>
                      The diamond jewelry industry is a global business with ethical and environmental
                      impact around the world. The folks at Loose Grown Diamond believe that we, as
                      consumers, have an obligation to consider this impact when purchasing any
                      diamond.
                    </p>
                    <p>
                      By using 100% lab-grown diamonds in all of our product we ensure that your
                      purchase is 100% conflict free giving you the choice to make a difference!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="white_section">
        <div className="container">
          <div className="row">
            <div className="text-center">
              <h1 className="text-center comparing_title pt_35">Comparing Sourcing</h1>
              <h3 className="text-center comparing_text ">100% Conflict Free vs Ethically Sourced</h3>
              <div className="d-flex pt_35 ml_20 h_200">
                <div className="compare_box ">
                  <div className="main">
                    <Image src={LogoImg} alt="loosegrowndiamond_logo" />
                    <span>
                      Lab Grown <br /> Diamond
                    </span>
                  </div>
                  <div className="price_box bg-dark">
                    <span className="text-white">100% Conflict Free</span>
                  </div>
                </div>

                <div className="table-responsive hideScrollbar">
                  <table>
                    <tbody>
                      <tr>
                        <th>
                          <strong>BRILLIANT EARTH</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>MIADONNA</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>ADA DIAMONDS</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>BLUE NILE</strong> <br />
                          <span className="diamonds fw-normal">
                            Mined <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>BRILLIANT EARTH</strong> <br />
                          <span className="diamonds fw-normal">
                            Mined <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>JAMES ALLEN</strong> <br />
                          <span className="diamonds fw-normal">
                            Mined <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>RITANI</strong> <br />
                          <span className="diamonds fw-normal">
                            Mined <br />
                            Diamonds
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td>100% Conflict Free</td>
                        <td>100% Conflict Free</td>
                        <td>100% Conflict Free</td>
                        <td>100% Conflict Free</td>
                        <td>100% Conflict Free</td>
                        <td>100% Conflict Free</td>
                        <td>100% Conflict Free</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="last_section">
          <div className="container">
            <p className="">
              LGD diamonds are guaranteed conflict free, because our diamonds are created in a lab and
              are independently verified as lab-created diamonds so that we can certify that they are
              guaranteed to not fund conflict. We provide IGI/GIA Certificate for each lab created
              diamond.
            </p>
          </div>
        </div>
      </div>
      <div className="yellow_box">
        <div className="loose-table">
          <div className="container pt_35">
            <div className="text-center">
              <h1 className="text-center comparing_title ">Comparing Return Policies</h1>
              <h3 className="text-center comparing_text ">
                Loose Grown Diamond return windows vs competitors.
              </h3>
              <div className="d-flex pt_35 ml_20 h_200">
                <div className="compare_box">
                  <div className="main">
                    <Image src={LogoImg} alt="loosegrowndiamond_logo" />
                    <span>
                      Lab Grown <br /> Diamond
                    </span>
                  </div>
                  <div className="price_box bg-dark">
                    <span className="text-white">
                      7 Days <sup>1</sup>
                    </span>
                  </div>
                </div>

                <div className="table-responsive hideScrollbar">
                  <table>
                    <tbody>
                      <tr>
                        <th>
                          <strong>CLEAN ORIGIN</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>MIADONNA</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>RITANI</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br /> Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>1215 DIAMONDS</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>BRILLIANT EARTH</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>JAMES ALLEN</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                        <th>
                          <strong>WITH CLARITY</strong> <br />
                          <span className="diamonds fw-normal">
                            Lab Grown <br />
                            Diamonds
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td>100 Days</td>
                        <td>30 Days</td>
                        <td>30 Days</td>
                        <td>30 Days</td>
                        <td>30 Days</td>
                        <td>30 Days</td>
                        <td>30 Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="third_section mx-auto">
          <div className="container ">
            <p>
              1. Day counting starts once you receive the product. <br />
              Return policies as posted as of July 5, 2021.
            </p>
            <p>
              As we are both diamond manufacturers and sellers it should be noted that we in no way
              include any extra charges to our final prices, like ‘middle-men fee’. Something which is
              commonly billed when purchasing from a diamond retailer. With a minimal profit margin we
              are giving you the best quality diamonds as swiftly as we can, hence we keep a 7-day
              return policy to ensure maximum efficiency for all our customers.
            </p>
            <p>
              Many times 3-4 customers end up liking the same diamond/diamond jewelry, if we sell it
              to someone and they want to return it within 7-days we are then able to sell that
              diamond to another interested buyer. This helps us maintain the market balance.
            </p>
          </div>
        </div>
      </div>
      <div className="last_section ">
        <div className="container " id="diamond_image_container">
          <div className="row">
            <h2 className="text-center mt-4 pt-2 ">Create your own ring</h2>
            <div className="col-md-6 first_color">
              <div className="diamond_box pt_35 text-center">
                <Image
                  src="https://cdn.loosegrowndiamond.com/wp-content/uploads/2021/07/diamond-2.png"
                  alt="daimond_image"
                  className="img-fluid mb_35"
                  width={300}
                  height={240}
                />
                <p>
                  Configure the perfect engagement ring the purest way with our lab-grown diamonds.
                </p>
                <button type="button" onClick={() => router.push(paths.buildDiamondToRing.root)} className="btn mb_35">
                  START WITH A DIAMOND
                </button>
              </div>
            </div>
            <div className="col-md-6 second_color">
              <div className="diamond_box pt_35 text-center">
                <Image
                  src="https://cdn.loosegrowndiamond.com/wp-content/uploads/2021/07/ring-2.png"
                  alt="daimond_image"
                  className="img-fluid mb_35"
                  width={300}
                  height={240}
                />
                <p>Start with the ring design that suits your partner the best.</p>
                <button type="button" onClick={() => router.push(paths.buildRing.root)} className="btn mb_35">
                  START WITH A SETTING
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default ComparisonPage;

import { FC } from 'react';

import { withSsrProps } from '@/utils/page';

const DiamondPriceMatchPage: FC = () => (
  <div className="diamond_price_match_section mx-auto">
    <div className="banner_section">
      <div className="py_60">
        <div className="container first_section mx-auto">
          <div className="row">
            <h2 className="text_black_secondary fw-600 mb_25 text-center">
              The Diamond Price Match Guarantee
            </h2>
            <h6 className="fw-600">
              Here are the simplified terms and conditions for the Loose-Grown Diamond Price Match
              Guarantee:
            </h6>
            <div>
              <ol>
                <li>
                  Price match is for certified loose lab diamonds only, and not
                  setting/finished/complete pieces of jewelry.
                </li>
                <li>
                  To qualify for our price match, the competitor’s diamond must have the same
                  certificate number and diamond attributes as ours visible on the webpage. To
                  verify, provide a certificate and a link to the competitor’s URL.
                </li>
                <li>
                  Competitor’s diamond must be in stock, in the same currency, and available to the
                  public.
                </li>
                <li>
                  The price match is available before you place your order, and no new discounts can
                  be applied afterward. If approved, the new price will be honored for 48 hours.
                </li>
                <li>
                  The price match is a free service and cannot be used multiple times on the same
                  diamond.
                </li>
                <li>
                  The diamond must be from a legitimate certified retailer and not an individual or
                  private seller. Price Match Guarantee is not eligible for resale or commercial
                  uses.
                </li>
                <li>Auction websites and pawn shops or B2B platforms are not eligible.</li>
                <li>Price matches cannot be combined with other discounts.</li>
                <li>The lower price must be in effect at the time of your order.</li>
                <li>Pricing errors do not qualify for the price match.</li>
                <li>Returns are not accepted for price match orders.</li>
                <li>Email us at support@loosegrowndiamond.com with proof of the lower price.</li>
                <li>
                  We reserve the right to change these terms and conditions or cancel the program at
                  any time. If we are unable to price match your purchase, we will refund the full
                  amount.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default DiamondPriceMatchPage;

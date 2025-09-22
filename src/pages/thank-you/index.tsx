import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { withSsrProps } from '@/utils/page';

const ThankYouPage = () => (
  <>
    <Head>
      <title>Thank You for your enquiry</title>
      <meta name="description" content='Thank you for your enquiry about wholesale loose-grown diamonds.' />
    </Head>
    <div className="thankyou-my-65">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h1 className="thank-you-title">THANK YOU</h1>
            <h6 className="thank-you-text">
              Thank you for your enquiry. We will be in touch shortly.
            </h6>
            <p className="thank-you-email-line ">
              For faster reply email at support@loosegrowndiamond.com or contact via Whatsapp at +1
              646-288-0810
            </p>
            <Link href="/" className="common_btn">
              GO TO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
);

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default ThankYouPage;

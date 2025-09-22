'use client';

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */

import Image from 'next/image';
import { FC, useState, useEffect } from 'react';

import { Accordion } from '@mantine/core';

import { faqsApi, FaqDetail, SingleFaqResponse } from '@/api/faqs';

import { useFAQsContext } from '@/stores/faqs.context';

import { withSsrProps } from '@/utils/page';
import HtmlContent from '@/utils/html-content';

import { TTooltip } from '@/components/ui/tooltip';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';

const CryptoPaymentPage: FC = () => {
  const { faqs, setFaqs } = useFAQsContext();
  const [copied, setCopied] = useState(false);
  const [paymentsFAQs, setPaymentsFAQs] = useState<FaqDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset copy tooltip after 3 sec
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

  // Fetch or use context FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const res = await faqsApi.getAll();
        const data = res.data.data as SingleFaqResponse[];
        setFaqs(data);
        const paymentFaq = data.find((faq) => faq.faqCategory === 'payments');
        setPaymentsFAQs(paymentFaq?.detail_json || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!faqs) {
      fetchFAQs();
    } else {
      const paymentFaq = faqs.find(
        (faq: { faqCategory: string }) => faq.faqCategory === 'payments'
      );
      setPaymentsFAQs(paymentFaq?.detail_json || []);
    }
  }, [faqs, setFaqs]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(paths.cryptoUSDTAddress.root);
    setCopied(true);
  };

  return (
    <div className="cryto_payment mx-auto">
      <div className="banner_section py_60">
        <div className="container mb_50 first_section">
          <div className="row">
            <h2 className="text_black_secondary fw-600 mb_25 text-center">Crypto Payment</h2>
            <div className="col-md-8">
              <p className="mb-0">TRC20 Address :</p>
              <div className="d-flex mb_20 align-items-center">
                <p className="me-2 mb-0">{paths.cryptoUSDTAddress.root}</p>
                <TTooltip label={copied ? 'Copied' : 'Copy Address'} position="bottom" color="gray">
                  <i
                    className={`fa ${copied ? 'fa-check' : 'fa-clone'}`}
                    onClick={handleCopyAddress}
                    role="button"
                  />
                </TTooltip>
              </div>
              <ul>
                <li>Send only USDT to this deposit address.</li>
                <li>Ensure the network is Tron (TRC20).</li>
                <li>Do not send NFTs to this address.</li>
              </ul>
            </div>
            <div className="col-md-4">
              <Image
                src="https://cdn.loosegrowndiamond.com/wp-content/plugins/woo-lgd-crypto-gateway/images/USDTCode.png"
                alt="USDT QR Code"
                className="img-fluid qr_image"
                width={160}
                height={160}
              />
            </div>
          </div>
        </div>

        <div className="container second_section">
          <div className="row">
            <h2 className="text_black_secondary fw-600 mb_25 text-center">Payment FAQs</h2>
            {isLoading ? (
              <div className="col-md-12 py_40 mt_60">
                <div className="ldmr_loading text-center min-h-454">
                  <Image src={LoadingImage} alt="Loading" width={50} height={50} />
                </div>
              </div>
            ) : (
              <>
                <div className="faq_accordion">
                  <Accordion multiple variant="contained">
                    {paymentsFAQs.map((faq: FaqDetail) => (
                      <Accordion.Item key={faq._id} value={faq.question}>
                        <Accordion.Control>
                          <span>{faq.question}</span>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <HtmlContent html={faq.answer} />
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
                {/* Help Box */}
                <div className="accordion accordion-order" id="accordionorderExample">
                  <div className="help_box">
                    <h3 className="text-center">We’re Here To Help</h3>
                    <div className="row  text-center">
                      <div className="col-lg-4">
                        <a href="tel:+1 646-288-0810 " className="helperLink">
                          <i className="fa-solid fa-mobile-screen" />
                          <b> Call us</b> +1 646-288-0810
                        </a>
                      </div>
                      <div className="col-lg-4" id="border">
                        <a href="#" className="helperLink">
                          Chat with us
                          <br />
                          <span>
                            <b>AVAILABLE NOW</b>
                          </span>
                        </a>
                      </div>
                      <div className="col-lg-4">
                        <a
                          href="mailto:support@loosegrowndiamond.com"
                          className="text-decoration-none helperLink"
                        >
                          <i className="fa-solid fa-envelope" />
                          <b> Email us</b> Customer service
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* End Help Box */}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default CryptoPaymentPage;

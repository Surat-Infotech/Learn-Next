import Link from 'next/link';
import Image from 'next/image';
import { FC, useState, useEffect } from 'react';

import { Accordion } from '@mantine/core';

import { faqsApi, FaqDetail, SingleFaqResponse } from '@/api/faqs';

import { useFAQsContext } from '@/stores/faqs.context';

import { withSsrProps } from '@/utils/page';
import HtmlContent from '@/utils/html-content';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';

const ReturnPolicyPage: FC = () => {
  const { faqs, setFaqs } = useFAQsContext();
  const [returnPolicyFAQs, setReturnPolicyFAQs] = useState<FaqDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch or use context FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const res = await faqsApi.getAll();
        const data = res.data.data as SingleFaqResponse[];
        setFaqs(data);
        const _returnPolicyFAQs = data.find((faq) => faq.faqCategory === 'returns-refund');
        setReturnPolicyFAQs(_returnPolicyFAQs?.detail_json || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!faqs) {
      fetchFAQs();
    } else {
      const _returnPolicyFAQs = faqs.find(
        (faq: { faqCategory: string }) => faq.faqCategory === 'returns-refund'
      );
      setReturnPolicyFAQs(_returnPolicyFAQs?.detail_json || []);
    }
  }, [faqs, setFaqs]);
  return (
    <div className="return_section mx-auto">
      <div className="banner_section">
        <div className="py_60">
          <div className="container mb_35 first_section">
            <div className="row">
              <h2 className="text_black_secondary fw-600 mb_10 text-center">Return/Refund</h2>
              <p className="ls_subtxt fw-400 mb-2 mb-md-3">
                Thanks for shopping at Loose Grown Diamond.
              </p>
              <p className="ls_subtxt fw-400 mb-2 mb-md-3">
                If you are not entirely satisfied with your purchase, we’re here to help.
              </p>
              <p className="ls_subtxt fw-400 mb-2 mb-md-3">
                You will have to send us an email on support@loosegrowndiamond.com along with the
                order number & the reason for your return.
              </p>
              <p>
                <span>Note: Two items/returns/exchanges are allowed per customer, per year.</span>
              </p>
              <div className="mb_50">
                <h4 className=" fw-600 mb-2 mb-md-3">Return</h4>
                <ul>
                  <li className="fw-400 ls_subtxt">
                    You have 7 calendar days to return an item from the date you received it.
                  </li>
                  <li className="fw-400 ls_subtxt">
                    To be eligible for a return, your item must be unused and in the same condition
                    that you received it. All returned items must be returned with all documentation
                    (including Lab grown diamonds certificate).
                  </li>
                  <li className="fw-400 ls_subtxt">
                    {' '}
                    Your item must be in the original packaging.{' '}
                  </li>
                </ul>
              </div>
              <div className="mb_50">
                <h4 className=" fw-600 mb-2 mb-md-3">Refunds</h4>
                <ul>
                  <li className="fw-400 ls_subtxt">
                    Once we receive your item, we will inspect it and notify you that we have
                    received your returned item.
                  </li>
                  <li className="fw-400 ls_subtxt">
                    We will immediately notify you of the status of your refund after inspecting the
                    item.
                  </li>
                  <li className="fw-400 ls_subtxt">
                    If your return is approved, we will initiate a refund to your original method of
                    payment. <br /> You will receive the credit within 1-3 working days, depending
                    on your card issuer’s policies.
                  </li>
                </ul>
              </div>
              <div className="mb_50">
                <h4 className=" fw-600 mb-2 mb-md-3">Shipping</h4>
                <ul>
                  <li className="fw-400 ls_subtxt">
                    US returns are free and include a pre-paid, insured FedEx shipping label. Print
                    the return label, repack items in original packaging, add diamond
                    certifications, and arrange a FedEx pickup or drop-off at the nearest FedEx
                    location. Note: A $150 fee applies for not returning the diamond certificate.
                  </li>
                  <li className="fw-400 ls_subtxt">
                    For international orders, we cover up to $50 for return shipping. We’ll provide
                    the shipping address; you just need to ship the items there. We have shipping
                    agents in Canada, Germany, Australia, Dubai, and Hong Kong. You will receive the
                    specific local address from our company over the email.
                  </li>
                </ul>
              </div>
              <div>
                <h4 className=" fw-600 mb-2 mb-md-3">Contact Us</h4>
                <ul className="mb-0">
                  <li className="ls_subtxt">
                    If you have any questions on how to return your item to us, contact us.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="container second_section">
            <div className="row">
              <h2 className="text_black_secondary fw-600 mb_25 text-center">Return/Refund FAQs</h2>
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
                      {returnPolicyFAQs?.length > 0 &&
                        returnPolicyFAQs.map((shipping: FaqDetail) => (
                          <Accordion.Item key={shipping._id} value={shipping.question}>
                            <Accordion.Control>
                              <span>{shipping.question}</span>
                            </Accordion.Control>
                            <Accordion.Panel>
                              <HtmlContent html={shipping.answer} />
                            </Accordion.Panel>
                          </Accordion.Item>
                        ))}
                    </Accordion>
                  </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default ReturnPolicyPage;

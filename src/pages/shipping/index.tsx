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

const ShippingPage: FC = () => {
  const { faqs, setFaqs } = useFAQsContext();
  const [shippingFAQs, setShippingFAQs] = useState<FaqDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch or use context FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const res = await faqsApi.getAll();
        const data = res.data.data as SingleFaqResponse[];
        setFaqs(data);
        const _shippingFAQs = data.find((faq) => faq.faqCategory === 'shipping');
        setShippingFAQs(_shippingFAQs?.detail_json || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!faqs) {
      fetchFAQs();
    } else {
      const _shippingFAQs = faqs.find(
        (faq: { faqCategory: string }) => faq.faqCategory === 'shipping'
      );
      setShippingFAQs(_shippingFAQs?.detail_json || []);
    }
  }, [faqs, setFaqs]);

  return (
    <div className="shipping_section mx-auto">
      <div className="banner_section">
        <div className="py_60">
          <div className="container mb_50 first_section">
            <div className="row">
              <h2 className="text_black_secondary fw-600 mb_10 text-center">Shipping</h2>
              <p className="ls_subtxt">
                Thank you for visiting and shopping at Loose Grown Diamond. Following are the terms
                and conditions that constitute our Shipping Policy.
              </p>
              <div className="mb_50">
                <h4 className=" fw-600 mb_20">Shipment processing time</h4>
                <ul className="mb-0">
                  <li className="fw-400 ls_subtxt">
                    All orders are dispatched within 3-7 business days.
                  </li>
                  <li className="fw-400 ls_subtxt">
                    Orders are not shipped or delivered on weekends or on holidays.
                  </li>
                  <li className="fw-400 ls_subtxt">
                    If we are experiencing a high volume of orders, shipments may be delayed by a
                    few days. Please allow additional days in transit for delivery. If we expect a
                    significant delay in the shipment of your order, we will contact you via email
                    or telephone to inform you.
                  </li>
                  <li className="fw-400 ls_subtxt">We do not ship to PO boxes.</li>
                </ul>
              </div>
              <div className="mb_50">
                <h4 className=" fw-600 mb_20">Shipping rates & delivery estimates</h4>
                <p className="ls_subtxt mb_20">
                  Please note that all of our shipments are
                  <strong className="ms-1">
                    insured and will be delivered by one of our delivery partners, FedEx, UPS,
                    Aramex, or USPS.
                  </strong>
                </p>
                <table className="table-bordered table shipping-table">
                  <thead>
                    <tr>
                      <th className="ls_subtxt fw-700">Shipment method</th>
                      <th className="ls_subtxt fw-700">Estimated dispatch time</th>
                      <th className="ls_subtxt fw-700">Shipment cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Free Shipping</td>
                      <td>3-7 business days</td>
                      <td>Free</td>
                    </tr>
                    <tr>
                      <td>Express Shipping</td>
                      <td>2-5 business days</td>
                      <td>$120</td>
                    </tr>
                  </tbody>
                </table>
                <ul className="mb-0">
                  <li className="ls_subtxt">
                    Once it dispatched You will get the delivery within 5-8 business days. (Ring &
                    Fine Jewelry crafting time does not include in this timeframe.
                    {/* <strong className="ms-1">
                      (Kindly be aware that if the shipment is dispatched via DHL, it may experience
                      extended delivery times, as DHL operates on its unique system, which could
                      potentially result in delays of 3-7 working days within the EU.)
                    </strong> */}
                  </li>
                  <li className="ls_subtxt">
                    Orders up to $500 will incur a shipping fee of $35 USD.
                  </li>
                </ul>
              </div>
              <div className="mb_50">
                <h4 className=" fw-600 mb_20">Shipment confirmation & Order tracking</h4>
                <span className="ls_subtxt">
                  You will receive a Shipment Confirmation email once your order has shipped
                  containing your tracking number(s). The tracking number will be active within
                  24-48 hours. If you want to check on your order status simply{' '}
                  <a href=""> click here.</a>
                </span>
              </div>
              <div className="mb_50">
                <h4 className=" fw-600 mb_20">Customs, Duties, and Taxes</h4>
                <span className="ls_subtxt">
                  <strong>
                    If you are from the United States you don’t need to pay any customs duties/fees.
                  </strong>
                  <br />
                  Loose Grown Diamond is not responsible for any customs and taxes applied to your
                  order. All fees imposed during or after shipping are the responsibility of the
                  customer (tariffs, taxes, etc.).
                </span>
              </div>
              <div>
                <h4 className=" fw-600 mb_20">Lost/Stolen</h4>
                <span className="ls_subtxt">
                  Loose Grown Diamond takes every precaution to ensure that your order arrives
                  safely. Your order is fully insured during transit, and we require a signature for
                  all packages. If its get lost you will get full refund.
                </span>
              </div>
            </div>
          </div>
          <div className="container second_section">
            <div className="row">
              <h2 className="text_black_secondary fw-600 mb_25 text-center">Shipping FAQs</h2>
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
                      {shippingFAQs?.length > 0 &&
                        shippingFAQs.map((shipping: FaqDetail) => (
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

export default ShippingPage;

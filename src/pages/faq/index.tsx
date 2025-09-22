import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState, useEffect } from 'react';

import { Select, Accordion } from '@mantine/core';

import { faqsApi, FaqDetail, SingleFaqResponse } from '@/api/faqs';

import { useFAQsContext } from '@/stores/faqs.context';

import { withSsrProps } from '@/utils/page';
import HtmlContent from '@/utils/html-content';

import LoadingImage from '@/assets/image/Loading.gif';

// -------------------------------------------------------------------------

const dropDownSideBox = [
  { value: 'About_Us', label: 'About Us', slug: 'about-us' },
  { value: 'Insurance_Care', label: 'Insurance & Care', slug: 'insurance-care' },
  { value: 'Orders_RingSizes', label: 'Orders & Ring Sizes', slug: 'orders-ring-sizes' },
  { value: 'Our_Diamond_Jewelry', label: 'Our Diamond & Jewelry', slug: 'our-diamond-jewelry' },
  { value: 'Lab_Created_diamonds', label: 'Lab Created diamonds', slug: 'lab-created-diamonds' },
  { value: 'Payments', label: 'Payments', slug: 'payments' },
  { value: 'Shipping', label: 'Shipping', slug: 'shipping' },
  { value: 'Return_Refund_Policy', label: 'Returns/Refund', slug: 'returns-refund' },
  // { value: 'lab_grown_engagement_rings', label: 'Lab Grown Engagement Rings', slug: 'lab-grown-engagement-rings' },
  // { value: 'lab_grown_diamonds', label: 'Lab Grown Diamonds', slug: 'lab-grown-diamonds' },
];

const FaqPage: FC = () => {
  const path = useRouter();
  const { faqs, setFaqs } = useFAQsContext();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFAQ, setSelectedFAQ] = useState<string>(path.asPath.split('#')[1]);

  useEffect(() => {
    if (!selectedFAQ) return;
    window.location.hash = selectedFAQ;
  }, [selectedFAQ]);

  useEffect(() => {
    const fetchFAQs = async () => {
      setIsLoading(true);
      await faqsApi
        .getAll()
        .then((res) => {
          setIsLoading(false);
          setFaqs(res.data.data);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    };
    if (!faqs) fetchFAQs();
  }, [faqs, setFaqs]);

  return (
    <div className="faq">
      <div className="banner_section">
        <div className="py_60">
          <div className="container-fluid">
            <h1 className="text-center main_title fw-600 mb-0">Frequently Asked Questions</h1>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="sideBox col-md-3">
            <ul className="title_list ps-0 ps-xl-4" style={{ position: 'sticky', top: '100px' }}>
              <li>
                <a className="linkHover" href="#About_Us">
                  About Us
                </a>
              </li>
              <li>
                <a className="linkHover" href="#Insurance_Care">
                  Insurance & Care
                </a>
              </li>
              <li>
                <a className="linkHover" href="#Orders_RingSizes">
                  Orders & Ring Sizes
                </a>
              </li>
              <li>
                <a className="linkHover" href="#Our_Diamond_Jewelry">
                  Our Diamond & Jewelry
                </a>
              </li>
              <li>
                <a className="linkHover" href="#Lab_Created_diamonds">
                  Lab Created diamonds
                </a>
              </li>
              <li>
                <a className="linkHover" href="#Payments">
                  Payments
                </a>
              </li>
              <li>
                <a className="linkHover" href="#Shipping">
                  Shipping
                </a>
              </li>
              <li>
                <a className="linkHover" href="#Return_Refund_Policy">
                  Returns/Refund
                </a>
              </li>
            </ul>
          </div>
          <div className="search-sideBox mb-3 mb-lg-0">
            <Select
              withCheckIcon={false}
              data={dropDownSideBox}
              placeholder="Pick value"
              defaultValue={dropDownSideBox[0].value}
              onChange={(value, option) => setSelectedFAQ(option?.value)}
              value={selectedFAQ}
            />
          </div>
          {isLoading || !faqs ? (
            <div className="col-md-9">
              <div className="py_40 mt_60">
                <div className="ldmr_loading text-center min-h-454">
                  <Image src={LoadingImage} alt="loader" width={50} height={50} />
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-9">
              <div className="faq_list">
                {faqs?.length > 0 &&
                  faqs.map((faq: SingleFaqResponse, idx: number) => {
                    const currentFAQ = dropDownSideBox.find((i) => i.slug === faq.faqCategory);
                    if (!currentFAQ) return null;
                    return (
                      <>
                        <h3
                          className={idx > 0 ? 'main_faq' : 'main_faq_top'}
                          id={currentFAQ?.value}
                        >
                          {currentFAQ?.label}
                        </h3>
                        <div className="faq_accordion">
                          <Accordion multiple variant="contained">
                            {faq.detail_json.map((d: FaqDetail) => (
                              <Accordion.Item key={d._id} value={d.question}>
                                <Accordion.Control>
                                  <span>{d.question}</span>
                                </Accordion.Control>
                                <Accordion.Panel>
                                  <HtmlContent html={d.answer} />
                                </Accordion.Panel>
                              </Accordion.Item>
                            ))}
                          </Accordion>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default FaqPage;

import { FC, HTMLAttributes } from 'react';

import clsx from 'clsx';

import { Accordion } from '@mantine/core';

import { ICategoryFaq } from '@/api/product';

import HtmlContent from '@/utils/html-content';
// ----------------------------------------------------------------------

export type IProductFAQProps = HTMLAttributes<HTMLDivElement> & {
  faqCategories: ICategoryFaq[] | undefined;
};

const ProductFAQ: FC<IProductFAQProps> = (props) => {
  const { faqCategories, className, ...other } = props;

  if (
    faqCategories === undefined ||
    faqCategories.length === 0 ||
    !faqCategories[0].category_faq_details.detail_json.length
  ) {
    return null;
  }
  return (
    <div className={clsx('container-fluid mb-2 mb-md-5', className)} {...other}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h3 className="text-center mb_50 fw-600">FAQs</h3>
          <div className="faq_accordion">
            <Accordion multiple variant="contained">
              {faqCategories.map((faqCategorie) =>
                faqCategorie.category_faq_details.detail_json.map((faq) => (
                  <Accordion.Item key={faq._id} value={faq._id}>
                    <Accordion.Control>
                      <div className='d-flex justify-content-start align-items-center'>
                        <span>{faq.question}</span>
                        {faq.answer.startsWith("<iframe") && <i className="fa-brands fa-youtube ms-2 text-danger" style={{ fontSize: "24px" }} />}
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <HtmlContent html={faq.answer} />
                    </Accordion.Panel>
                  </Accordion.Item>
                ))
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFAQ;

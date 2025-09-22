import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Accordion } from '@mantine/core';

import { faqsApi, FaqDetail, SingleFaqResponse } from '@/api/faqs';

import { useFAQsContext } from '@/stores/faqs.context';

import HtmlContent from '@/utils/html-content';

import ShopByDiamondShape from '@/sections/collections/view/ShopByDiamondShape';
import CollectionPageFineJewelry from '@/sections/collections/view/CollectionPageFineJewelry';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';
import Labcreatedmark from '@/assets/image/collection-page/buying-resource-3.png';
import redDiamond from '@/assets/image/collection-page/colured-shaped-diamond-4.png';
import Labcreateresource from '@/assets/image/collection-page/buying-resource-2.png';
import pinkDiamond from '@/assets/image/collection-page/colured-shaped-diamond-2.png';
import blueDiamond from '@/assets/image/collection-page/colured-shaped-diamond-5.png';
import Labcreateddiamonds from '@/assets/image/collection-page/buying-resource-1.png';
import greenDiamond from '@/assets/image/collection-page/colured-shaped-diamond-6.png';
import brownDiamond from '@/assets/image/collection-page/colured-shaped-diamond-8.png';
import blackDiamond from '@/assets/image/collection-page/colured-shaped-diamond-9.png';
import grayDiamond from '@/assets/image/collection-page/colured-shaped-diamond-10.png';
import yellowDiamond from '@/assets/image/collection-page/colured-shaped-diamond-1.png';
import purpleDiamond from '@/assets/image/collection-page/colured-shaped-diamond-3.png';
import orangeDiamond from '@/assets/image/collection-page/colured-shaped-diamond-7.png';
import craftengagementring from '@/assets/image/collection-page/craft-your-engagement-ring.png';
import craftdiamondring from '@/assets/image/collection-page/craft-your-diamond-collection.png';

// --------------------------------------------------------------------

const Collection = () => {
  const router = useRouter();
  const { faqs, setFaqs } = useFAQsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [collectionFAQs, setCollectionFAQs] = useState<FaqDetail[]>([]);

  // Fetch or use context FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const res = await faqsApi.getAll();
        const data = res.data.data as SingleFaqResponse[];
        setFaqs(data);
        const _collectionFAQs = data.find((faq) => faq.faqCategory === 'lab-grown-diamonds');
        setCollectionFAQs(_collectionFAQs?.detail_json || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!faqs) {
      fetchFAQs();
    } else {
      const _collectionFAQs = faqs.find(
        (faq: { faqCategory: string }) => faq.faqCategory === 'lab-grown-diamonds'
      );
      setCollectionFAQs(_collectionFAQs?.detail_json || []);
    }
  }, [faqs, setFaqs]);

  return (
    <div>
      <div className="diamond-collection-banner">
        <div className="container">
          <div className="diamond-collection-content">
            <h1 className="text-white diamond-heading font_literata">Loose Diamonds</h1>
            <p className="text-white diamond-customize-option">
              Design your timeless treasure for your big days. Turn your idea of perfection with our
              customizable options for diamonds.
            </p>

            <Link href={paths.whiteDiamondInventory.root} className="common_btn white_btn">
              Shop Lab Grown Diamonds
            </Link>
          </div>
        </div>
      </div>

      <div className="craft-enagagement-collection">
        <div className="row mx-0 justify-content-center align-items-center">
          <div className="col-md-6 px-0">
            <Image src={craftengagementring} alt="craft-engagement-ring" className="w-100 h-100" />
          </div>
          <div className="col-md-6 px-0">
            <div className="enagagement-colection-content mx-auto">
              <h2 className="collection-engagement-heading font_literata">
                Craft Your Engagement Ring
              </h2>
              <p className="collection-engagement-info">
                Build your ideal engagement ring with our premium and endless ring settings and
                diamond options. Now, enjoy the privilege of designing and selecting a diamond ring
                from our impeccable collection for the love of your life.
              </p>
              <Link href={paths.buildRing.root} className="common_btn black_btn">
                Start With A Setting
              </Link>
            </div>
          </div>
        </div>
        <div className="row mx-0 flex-md-row flex-column-reverse justify-content-center align-items-center">
          <div className="col-md-6 px-0">
            <div className="enagagement-colection-content mx-auto">
              <h2 className="collection-engagement-heading font_literata">
                Pick Your Ideal Diamond
              </h2>
              <p className="collection-engagement-info mw-510">
                We offer you the option to choose your unique diamond from our limitless range. Shop
                for a Diamond that perfectly symbolizes your unique love story at the best value.
              </p>
              <Link href={paths.buildDiamondToRing.root} className="common_btn black_btn">
                Start With A Diamond
              </Link>
            </div>
          </div>
          <div className="col-md-6 px-0">
            <Image src={craftdiamondring} alt="craft-engagement-ring" className="w-100 h-100" />
          </div>
        </div>
      </div>

      <ShopByDiamondShape />
      <CollectionPageFineJewelry />

      <div className="colored-shaped-diamond">
        <div className="container">
          <h1 className="font_literata mb-3 text-center">Shop Colored Lab Diamonds</h1>
          <h5 className="ethitically-sourced-diamond text-center">
            Select your perfect fancy color lab created diamond from thousands of ethically sourced
            diamonds.
          </h5>
          <div className="d-flex flex-wrap justify-content-center color-shaped-collection">
            <Link
              href="/lab-created-colored-diamonds?colored=Yellow"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={yellowDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Yellow</p>
            </Link>
            <Link
              href="/lab-created-colored-diamonds?colored=Pink"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={pinkDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Pink</p>
            </Link>
            <Link
              href="/lab-created-colored-diamonds?colored=Purple"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={purpleDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Purple</p>
            </Link>
            <Link
              href="/lab-created-colored-diamonds?colored=Red"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={redDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Red</p>
            </Link>
            <Link
              href="/lab-created-colored-diamonds?colored=Blue"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={blueDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Blue</p>
            </Link>
            <Link
              href="/lab-created-colored-diamonds?colored=Green"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={greenDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Green</p>
            </Link>
            <Link
              href="/lab-created-colored-diamonds?colored=Orange"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={orangeDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Orange</p>
            </Link>
            <Link
              href="/lab-created-colored-diamonds?colored=Brown"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={brownDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Brown</p>
            </Link>
            <Link
              href="/lab-created-colored-diamonds?colored=Black"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={grayDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Black</p>
            </Link>
            <Link
              href="/lab-created-colored-diamonds?colored=Gray"
              className="cursor-pointer text-decoration-none"
            >
              <Image
                src={blackDiamond}
                alt="craft-engagement-ring"
                width={100}
                height={100}
                className="mb-1"
                style={{ mixBlendMode: 'darken' }}
              />
              <p className="color-named mb-0 text-center">Gray</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="engagement-faq">
        <div className="container">
          <h2 className="text_black_secondary fw-600 mb_25 text-center">
            Frequently Asked Questions
          </h2>
          {isLoading ? (
            <div className="col-md-12 py_40 mt_60">
              <div className="ldmr_loading text-center min-h-454">
                <Image src={LoadingImage} alt="Loading" width={50} height={50} />
              </div>
            </div>
          ) : (
            <div className="faq_accordion">
              <Accordion multiple variant="contained">
                {collectionFAQs?.length > 0 &&
                  collectionFAQs.map((shipping: FaqDetail) => (
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
          )}
        </div>
      </div>

      <div className="buying-resource-collection">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="card border-0">
                <Image
                  src={Labcreateddiamonds}
                  alt="craft-engagement-ring"
                  className="w-100 h-100"
                />
                <div className="card-body">
                  <h3 className="card-title font_roboto_slab fw-400">
                    Why Choose Lab-Created Diamonds?
                  </h3>
                  <h6 className="card-text fw-400">
                    Lab-grown diamonds are environmentally friendly and cost-efficient. They undergo
                    the same processing and grading standards as mined diamonds, based on the 4Cs of
                    diamond certification.
                  </h6>
                  <a
                    href="#"
                    className="btn btn-transparent collection-buying-read p-0 rounded-0 fw-500"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0">
                <Image
                  src={Labcreateresource}
                  alt="craft-engagement-ring"
                  className="w-100 h-100"
                />
                <div className="card-body">
                  <h3 className="card-title font_roboto_slab fw-400">
                    What are Lab Grown Diamonds?
                  </h3>
                  <h6 className="card-text fw-400">
                    Lab-grown diamonds are created in a lab using two methods: High-Pressure
                    High-Temperature and Chemical Vapor Deposition, and differ from mined diamonds
                    which are extracted from the earth.
                  </h6>
                  <a
                    href="#"
                    className="btn btn-transparent collection-buying-read p-0 rounded-0 fw-500"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-6 mx-auto mx-0">
              <div className="card border-0 d-flex flex-column flex-lg-row align-items-center card-3">
                <Image
                  src={Labcreatedmark}
                  alt="craft-engagement-ring"
                  className="w-100 w-md-50 h-100"
                />
                <div className="card-body w-100 w-md-50">
                  <h3 className="card-title font_roboto_slab fw-400">
                    Lab Created Diamonds Grading & Certification
                  </h3>
                  <h6 className="card-text fw-400">
                    We send all of our lab-grown diamonds for inspection to renowned institutions
                    such as GIA, IGI, and AGS.
                  </h6>
                  <a
                    href="#"
                    className="btn btn-transparent collection-buying-read p-0 rounded-0 fw-500"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;

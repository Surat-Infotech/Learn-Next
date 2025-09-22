import Image from 'next/image';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { signOut } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { Accordion } from '@mantine/core';

import { productApi } from '@/api/product';
import { faqsApi, FaqDetail, SingleFaqResponse } from '@/api/faqs';

import { useDebouncedFn } from '@/hooks/useDebounce';

import { useFAQsContext } from '@/stores/faqs.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import HtmlContent from '@/utils/html-content';

import { ProductCard } from '@/components/product';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';
import EnggagementRing from '@/assets/image/lab-grown-engagement-rings/enggagement-rings.png';
import BookEnggagementRing from '@/assets/image/lab-grown-engagement-rings/book_enggagement_ring.png';

const LabGrownEngagementRingsPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { ringSetting } = useRingBuilderContext();
  const { faqs, setFaqs } = useFAQsContext();

  const productUrl = (slug: string) => `/engagement-rings/${paths.product.details(slug)}`;

  const [engagementRingsFAQS, setEngagementRingsFAQS] = useState<FaqDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(0);
  const pageSize = 8;

  // Fetch or use context FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const res = await faqsApi.getAll();
        const data = res.data.data as SingleFaqResponse[];
        setFaqs(data);
        const _engagementRingsFAQS = data.find(
          (faq) => faq.faqCategory === 'lab-grown-engagement-rings'
        );
        setEngagementRingsFAQS(_engagementRingsFAQS?.detail_json || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!faqs) {
      fetchFAQs();
    } else {
      const _engagementRingsFAQS = faqs.find(
        (faq: { faqCategory: string }) => faq.faqCategory === 'lab-grown-engagement-rings'
      );
      setEngagementRingsFAQS(_engagementRingsFAQS?.detail_json || []);
    }
  }, [faqs, setFaqs]);

  const { data, isFetching, isError, refetch, fetchNextPage } = useInfiniteQuery({
    queryKey: ['product', {}],
    queryFn: async ({ pageParam = page }) => {
      try {
        setPage((n) => n + 1);
        const { data: _data } = await productApi.getCollectionProduct(
          `?page=${pageParam}&pageSize=${pageSize}`
        );
        return _data;
      } catch (error) {
        if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.login.root });
        localStorage.clear();
        console.error(error);
        return null;
      }
    },
    getNextPageParam: (lastPage: any, pages: any) =>
      lastPage?.page !== lastPage?.totalPages ? pages.length + 1 : undefined,
    getPreviousPageParam: (firstPage: any, pages: any) =>
      firstPage?.page !== 1 ? pages.length - 1 : undefined,
    initialPageParam: 1,
    enabled: true,
  });

  // New function to combine current and previous page data
  const getAllProducts = () => data?.pages?.flatMap((p) => p?.data) || [];

  const refetchInventory = useDebouncedFn(refetch);

  useEffect(() => {
    refetchInventory();
  }, [refetchInventory]);

  return (
    <div>
      <div className="page-content-engagement mx-auto">
        <div className="engagement-rings-banner">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="d-flex align-items-center h-100">
                  <div className="engagement-text">
                    <h1 className="fw-600 mb-2 mb-sm-4">Lab Grown Diamond Rings</h1>
                    <p className="fw-normal">
                      Looking for the best engagement ring? Decided on what you want but are not
                      able to find it? Browse through our engagement ring catalog and select lab
                      grown diamond engagement rings that best suit your taste.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push(paths.buildRing.root)}
                      className="btn btn-dark fw-700"
                    >
                      Start with a Setting
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <img src={EnggagementRing.src} alt="Enggagement Ring" />
              </div>
            </div>
          </div>
        </div>

        <div className="stuning-diamond-rings">
          <div className="container">
            <h2 className="text-center fw-600">
              Check Our Stunning Collection of Lab Diamond Rings
            </h2>
            <div className="container custom_container px-12 px-md-0">
              <div className="row gy-3 gy-sm-4 gy-xl-5">
                {getAllProducts().length > 0 &&
                  getAllProducts()?.map((item: { _id: any }, index: any) => (
                    <ProductCard
                      key={index}
                      productUrl={productUrl}
                      {...item}
                      product={item}
                      settingPrice={pathname.startsWith(paths.buildRing.root)}
                      isSelected={ringSetting?.product?._id === item?._id}
                    />
                  ))}
                {/* {isError && (
                  <div className="text-center my-5 text-danger">
                    <div>Oops! Something went wrong. Please try again.</div>
                  </div>
                )} */}
                <div className="load-more-button text-center">
                  <div className="button-mode ls_ldmrsec">
                    {isFetching && (
                      <div
                        className="ldmr_loading flex align-items-center justify-content-center"
                        style={{ minHeight: 200 }}
                      >
                        <Image src={LoadingImage} alt="loader" width={30} height={30} />
                      </div>
                    )}

                    {data?.pages?.[0]?.totalPages > page && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => fetchNextPage()}
                          className="btn btn-dark fw-700"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="book-in-store">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <img src={BookEnggagementRing.src} alt="Enggagement Ring" />
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-items-center h-100">
                  <div className="engagement-text">
                    <h1 className="fw-600 mb-2 mb-sm-4">Book an In-store or Virtual Appointment</h1>
                    <p className="fw-normal">
                      Contact our expert gemologists at Loose Grown Diamond to get better clarity of
                      the diamond you seek. Set a virtual appointment, today!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(paths.contactUs.root);
                      }}
                      className="btn btn-dark fw-700"
                    >
                      Book an Appointment
                    </button>
                  </div>
                </div>
              </div>
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
                  {engagementRingsFAQS?.length > 0 &&
                    engagementRingsFAQS.map((shipping: FaqDetail) => (
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
      </div>
    </div>
  );
};

export default LabGrownEngagementRingsPage;

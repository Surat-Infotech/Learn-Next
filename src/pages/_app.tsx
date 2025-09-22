/* eslint-disable react/no-danger */
import Head from 'next/head';
import Script from 'next/script';
import { AppType } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// styles
import { setLocale } from 'yup';
import { Session } from 'next-auth';
import Hotjar from '@hotjar/browser';
import { ToastContainer } from 'react-toastify';
import { signOut, SessionProvider } from 'next-auth/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';

import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

import AxiosWrapper from '@/api/AxiosWrapper';
import { hotjarSettingApi } from '@/api/hotjar';
import { redirectURLsApi } from '@/api/redirect-urls';
import { scriptSettingApi } from '@/api/script-setting';

import { CartProvider } from '@/stores/cart.context';
import { FAQsProvider } from '@/stores/faqs.context';
import { OrderProvider } from '@/stores/order.context';
import { ProductProvider } from '@/stores/product.context';
import { RingBuilderProvider } from '@/stores/ring-builder.context';

import { createQueryClient } from '@/utils/query-client';

import MainLayout from '@/components/layout/main';

import '@/styles/app.css';
import '@/styles/wishlist.css';
import { paths } from '@/routes/paths';
import { getAxiosAuthToken } from '@/api';

// ----------------------------------------------------------------------

const theme = createTheme({
  /** Put your mantine theme override here */
});

const App: AppType<{ dehydratedState: unknown; session: Session }> = ({
  // eslint-disable-next-line react/prop-types
  Component,
  // eslint-disable-next-line react/prop-types
  pageProps: { dehydratedState, session, ...pageProps },
}) => {
  const [queryClient] = useState(() => createQueryClient());
  const [scriptData, setScriptData] = useState('');

  const token =
    typeof session === 'undefined'
      ? getAxiosAuthToken()
      : // eslint-disable-next-line react/prop-types
      (session?.user?.accessToken as string) || getAxiosAuthToken();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await hotjarSettingApi.get();
        if (data.data.value.id) {
          // Initialize Hotjar
          const siteId = data.data.value.id;
          const hotjarVersion = 6;

          Hotjar.init(siteId, hotjarVersion);

          Hotjar.init(siteId, hotjarVersion, {
            debug: true,
          });
        }
      } catch (error) {
        if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await scriptSettingApi.get();
        if (data.data.value.script_data) {
          setScriptData(data.data.value.script_data);
        }
      } catch (error: any) {
        if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await redirectURLsApi.getAll();
        if (data.data) {
          document.cookie = `redirectTo=${encodeURIComponent(JSON.stringify(data.data))}; path=/`;
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  // Set yup locale for form validation
  setLocale({
    mixed: {
      required: 'This field is required',
    },
  });

  const router = useRouter();

  const getTitle = () => {
    switch (router.pathname) {
      case `${paths.home.root}`:
        return {
          title:
            'Buy IGI/GIA Certified Lab Grown Diamonds, Engagement Rings & Jewelry at Wholesale Price',
          description:
            'Shop IGI/GIA certified lab diamonds at unbeatable wholesale prices. Explore our large collection, enjoy exceptional quality, and receive top-notch service.',
        };
      case `${paths.whiteDiamondInventory.root}`:
        return {
          title: 'Buy Certified Lab Grown Diamonds & Colored Diamonds | Conflict-Free Diamond',
          description:
            'Shop certified lab diamonds from classic cuts to modern styles, find high-quality diamonds in various shapes, sizes, and grades to suit your needs.',
        };
      case `${paths.colorDiamondInventory.root}`:
        return { title: 'Certified Colored Diamonds', description: '' };
      case `${paths.fineJewelry.root}`:
        return {
          title: 'Lab Grown Diamond Fine Jewelry | Shop Affordable Fine Jewelry',
          description:
            'Discover our fine jewelry collection, featuring timeless designs crafted with precious metals and gemstones. Elevate your style with elegant pieces for every special occasion.',
        };
      case `${paths.bespoke.root}`:
        return { title: 'Engagement Rings', description: '' };
      case `${paths.buildRing.root}`:
        return {
          title:
            'Buy Lab Grown Diamond Engagement Rings | By Best Style, Diamond Shape, Or Custom ',
          description:
            'Create your perfect engagement ring at loose grown diamond. Choose from a variety of settings, metals, and center stone to design a unique piece that matches your style.',
        };
      case `${paths.fancyShapesDiamonds.root}`:
        return {
          title: 'Buy Fancy Shape Diamonds | Loose Melee Diamond',
          description:
            'Melee Fancy Shape Lab Created Diamonds, like a Pear, Oval, Princess, Marquise, Heart and Emerald  have unique shapes that give jewelry a special and stylish look.',
        };
      case `${paths.colorMeleeDiamonds.root}`:
        return {
          title: 'Buy Fancy Color Melee Lab Grown Diamonds: Small Diamonds Wholesale',
          description:
            'Buy our color melee diamonds for vibrant, tiny stones perfect for adding jewelry. Available in multiple fancy colors like pink, yellow, blue, green, and purple.',
        };
      case `${paths.checkout.root}`:
        return {
          title: 'Checkout - Loose Grown Diamond',
          description:
            'Confirm your loose ground diamond and jewelry selection, enter shipping details, and choose payment options. Review and complete your purchase smoothly.',
        };
      case `${paths.profile.root}`:
        return { title: 'My account', description: '' };
      case `${paths.wishlist.root}`:
        return { title: 'My account', description: '' };
      case `${paths.address.root}`:
        return { title: 'My account', description: '' };
      case `${paths.passwordChange.root}`:
        return { title: 'My account', description: '' };
      case `${paths.account.root}`:
        return { title: 'My account', description: '' };
      case `${paths.faq.root}`:
        return { title: 'FAQs', description: '' };
      case `${paths.cryptoPayment.root}`:
        return { title: 'Crypto Payment', description: '' };
      case `${paths.shipping.root}`:
        return { title: 'Shipping Policy', description: '' };
      case `${paths.returnPolicy.root}`:
        return { title: 'Return & Refund Policy', description: '' };
      case `${paths.feedbackForm.root}`:
        return { title: 'Feedback Form', description: '' };
      case `${paths.privacyPolicy.root}`:
        return { title: 'Privacy Policy', description: '' };
      case `${paths.termOfUse.root}`:
        return { title: 'Terms of use', description: '' };
      case `${paths.aboutUs.root}`:
        return { title: 'About Us', description: '' };
      case `${paths.contactUs.root}`:
        return { title: 'Contact Us', description: '' };
      case `${paths.whyChooseUs.root}`:
        return { title: 'Why Choose Us', description: '' };
      case `${paths.blog.root}`:
        return { title: 'Blog', description: '' };
      default:
        return { title: '', description: '' };
    }
  };

  return (
    <>
      {/* <Head> */}
      {/* TODO: @devendra_k - Need to import these files */}
      {/* <Script src="src/assets/js/jquery.min.js" lazyOnload />
        <Script src="src/assets/js/popper.min.js" lazyOnload />
        <Script src="src/assets/js/bootstrap.min.js" lazyOnload />
        <Script src="src/assets/js/myscript.js" lazyOnload /> */}

      <Head>
        <title>{getTitle().title}</title>
        <link rel="icon" href="/assets/favicon/favicon.png" />
        <meta name="description" content={getTitle().description} />
        {/* {scriptData && (
          <Script
            id="dynamic-script"
            dangerouslySetInnerHTML={{
              __html: scriptData,
            }}
          />
        )} */}
      </Head>

      {/* @jquery v3.6.0 */}
      <Script src="https://code.jquery.com/jquery-3.6.4.min.js" strategy="beforeInteractive" />
      {/* @popperjs/core v2.11.8 */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js"
        strategy="beforeInteractive"
      />
      {/* @bootstrap v5.3.1 */}
      <Script
        src="https://stackpath.bootstrapcdn.com/bootstrap/5.3.1/js/bootstrap.min.js"
        strategy="beforeInteractive"
      />
      <Script src="https://scripts.sirv.com/sirvjs/v3/sirv.js" />

      {/*  */}
      <Script src="src/assets/js/myscript.js" />

      {/* 360-image */}
      <Script src="https://scaleflex.cloudimg.io/v7/plugins/js-cloudimage-360-view/latest/js-cloudimage-360-view.min.js?func=proxy" />

      {/* Splitit FlexForm Script */}
      <Script
        src="https://flex-form.splitit.com/flex-form.js"
        strategy="beforeInteractive"
        onError={(e) => console.error('Failed to load SplitIt script', e)}
        async
      />

      {/* Klarna Script */}
      <Script src="https://x.klarnacdn.net/kp/lib/v1/api.js" strategy="beforeInteractive" async />

      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-2S140KTSCF"
      />

      <Script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2S140KTSCF');`,
        }}
      />

      <Script
        id="tawk-to-script"
        strategy="afterInteractive"
        src="https://embed.tawk.to/5de66fa043be710e1d205a97/default"
        onLoad={() => {
          window.Tawk_API = window.Tawk_API || {};
          window.Tawk_LoadStart = new Date();
        }}
      />

      {/* </Head> */}
      <MantineProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            <SessionProvider
              session={session}
              refetchInterval={
                10 * 60 // 10 minutes
              }
              refetchOnWindowFocus={false}
            >
              <AxiosWrapper session={session}>
                <ProductProvider>
                  <MainLayout>
                    <CartProvider>
                      <RingBuilderProvider>
                        <OrderProvider>
                          <FAQsProvider>
                            <Component {...pageProps} />
                          </FAQsProvider>
                        </OrderProvider>
                      </RingBuilderProvider>
                    </CartProvider>
                  </MainLayout>
                </ProductProvider>
                <ToastContainer />
                <ReactQueryDevtools initialIsOpen={false} />
              </AxiosWrapper>
            </SessionProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
};

export default App;

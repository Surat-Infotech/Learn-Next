/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-intl-tel-input/dist/main.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import IntlTelInput from 'react-intl-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import { Textarea, TextInput } from '@mantine/core';

import { imageApi } from '@/api/image';
import { inquiryApi } from '@/api/inquiry';

import { withSsrProps } from '@/utils/page';

import Input from '@/components/ui/input/input';

import TrustPilotReviewSection from '@/sections/home/TrustPilotReviewSection';

import { paths } from '@/routes/paths';
import review1 from '@/assets/image/review1.jpg';
import review2 from '@/assets/image/review2.jpg';
import review3 from '@/assets/image/review3.jpg';
import review4 from '@/assets/image/review4.jpg';
import BuyersImg from '@/assets/image/buyers.svg';
import logo3 from '@/assets/image/logo/asian.png';
import Arrow from '@/assets/image/logo/arrow_1.svg';
import logo1 from '@/assets/image/logo/deccans.png';
import CallImg from '@/assets/image/logo/call_icon.svg';
import logo2 from '@/assets/image/logo/checkersaga.png';
import OrderImg from '@/assets/image/logo/order_icon.svg';
import ShippingImg from '@/assets/image/logo/Ship_icon.svg';
import Logo from '@/assets/image/logo/loosegrowndiamond_logo.svg';

const fields = {
  first_name: 'First Name*',
  last_name: 'Last Name*',
  mobile: 'Mobile Number',
  email: 'Email*',
  reference_url: 'Reference URL ',
  description: 'Description',
  sku: 'SKU',
  metal: 'Metal',
  size: 'Size',
};

const BeSpokePage = () => {
  const Schema = Yup.object({
    first_name: Yup.string().trim().required('This field is required').label(fields.first_name),
    last_name: Yup.string().trim().required('This field is required').label(fields.last_name),
    email: Yup.string().email('Please enter valid email').trim().required('This field is required'),
    reference_url: Yup.string().trim().optional().label(fields.reference_url),
    description: Yup.string().optional().label(fields.description),
    sku: Yup.string().trim().optional().label(fields.sku),
    metal: Yup.string().trim().optional().label(fields.metal),
    size: Yup.string().trim().optional().label(fields.size),
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(Schema),
    mode: 'onChange',
  });
  const { push } = useRouter();

  const [mobile, setMobile] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [countryCode, setCountryCode] = useState('');
  const [alertShow, setAlertShow] = useState(false);
  const [imageAlert, setImageAlert] = useState('');
  const [mobileAlert, setMobileAlert] = useState('');
  const [imageError, setImageError] = useState('');
  const [formError, setFormError] = useState('');
  const [isImageSubmitting, setIsImageSubmitting] = useState(false);
  const [DefaultRemoveImages, setDefaultRemoveImages] = useState(false);
  const [ipCountryCode, setIpCountryCode] = useState('');

  // Fetch user country code using their IP address
  useEffect(() => {
    const fetchCountryCodeFromIP = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        const countryData = response.data;
        setIpCountryCode(countryData.country_code.toLowerCase());
      } catch (err) {
        console.error('Error fetching country from IP', err);
      }
    };

    fetchCountryCodeFromIP();
  }, []);

  const handleImage = async (event: any) => {
    try {
      const selectedFilesIn2MB: any[] = [];
      setImageError('');
      setIsImageSubmitting(true);

      const selectedFiles = Array.from(event.target.files).map((file: any) => ({
        file,
      }));
      // eslint-disable-next-line no-restricted-syntax
      for (const image of selectedFiles) {
        if (image.file?.size < 2097152) {
          selectedFilesIn2MB.push(image);
        }
      }
      const response = await imageApi.create({ file: selectedFilesIn2MB, folder_name: 'inquiry' });
      if (response.status === 201) {
        const newImages = response.data.data;
        setImages((prevImages) => [...prevImages, ...newImages]);
        setIsImageSubmitting(false);
        setImageError('');
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      if (error.message) {
        setImageError(error.message);
        setImages([]);
      } else {
        setImageError(error.response.data.message);
        setImages([]);
      }
      setIsImageSubmitting(false);
    } finally {
      setIsImageSubmitting(false);
    }
  };

  const handleDeleteImage = async (image: string) => {
    setIsImageSubmitting(true);
    const response = await imageApi.delete({ urls: [image] });
    if (response.status === 200) {
      const update = images.filter((data) => data !== image);
      setImages(update);
      setIsImageSubmitting(false);
    }
  };
  const formValidation = () => {
    if (!mobile) {
      return setMobileAlert('This field is required');
    }
    if (mobile.length < 8 || mobile.length > 16) {
      return setMobileAlert('Mobile number must be between 8 to 16 digit');
    }
    if (images.length > 3) {
      return setImageAlert('Maximum Three Image Upload');
    }
    setMobileAlert('');
    setImageAlert('');

    return true;
  };

  const onSubmit = async (data: any) => {
    try {
      setAlertShow(false);
      setFormError('');
      setImageAlert('');
      if (!formValidation()) {
        return;
      }
      const payload = {
        ...data,
        mobile: mobile.replaceAll('-', ''),
        reference_url: data.reference_url || undefined,
        description: data.description || undefined,
        images: images || undefined,
        country_code: countryCode,
        size: data?.size?.trim() || undefined,
        metal: data?.metal?.trim() || undefined,
        sku: data?.sku?.trim() || undefined,
      };

      const response = await inquiryApi.sendcustomEngagementRingInquiry(payload, 'custom_setting');
      if (response.status === 201) {
        reset();
        setAlertShow(true);
        setMobile('');
        setCountryCode('');
        setTimeout(() => {
          setAlertShow(false);
          push(paths.thankYou.root);
        }, 3000);
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      if (error.message) {
        setFormError(error.message);
      } else {
        setFormError(error.response.data.message);
      }
    }
  };
  const handlePhoneNumberChange = (isValid: boolean, value: string, countryData: any) => {
    const number = value.replace(/[^\d-]/g, '');
    if (number.length < 8 || number.length > 16) {
      setMobileAlert('Mobile number must be between 8 to 16 digit');
    } else {
      setMobileAlert('');
    }
    setMobile(number);
    if (countryData.dialCode !== countryCode) {
      setCountryCode(countryData.dialCode);
    }
  };
  const handleSelectFlag = (_mobile: string, country: any) => {
    setCountryCode(country.dialCode);
  };

  useEffect(() => {
    (async () => {
      if (DefaultRemoveImages === true && images?.length > 0) {
        await imageApi.delete({ urls: images });
        setImages([]);
      }
      if (images.length <= 3) {
        setImageAlert('');
      } else {
        setImageAlert('Maximum Three Image Upload');
      }
    })();
    setDefaultRemoveImages(false);
  }, [DefaultRemoveImages, images]);

  return (
    <>
      <section className="lcdr_banner_section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <h1>
                Looking for a Ring at <span>lowest rate</span> in the world?
              </h1>
              <h2>You`re at the right Place.</h2>
            </div>
          </div>
        </div>
      </section>
      <section className="lcbr_featured_section text-center">
        <div className="container-fluid">
          <h3 className="mb_50">WE`VE BEEN FEATURED IN</h3>
          <div className="row align-items-center gy-5">
            <div className="col-md-4 col-6">
              <Image src={logo1} alt="logo" />
            </div>
            <div className="col-md-4 col-6">
              <Image src={logo2} alt="logo" />
            </div>
            <div className="col-md-4 col-6">
              <Image src={logo3} alt="logo" />
            </div>
          </div>
        </div>
      </section>
      <section className="lcbr_video_section">
        <video
          src="https://www.loosegrowndiamond.com/wp-content/uploads/ls_custom/loose-grown-diamond-banner-video.mp4"
          autoPlay
          muted
          loop
        />
      </section>
      <section className="cer_form_section">
        <div className="container-fluid">
          <h3 className="text-center">ASK FOR A FREE QUOTE FOR YOUR RING</h3>
          <span className="text-center d-block mb-3">
            Fill in the form below and we will give you a quote, It`s Free
          </span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <Input
                  placeholder={fields.first_name}
                  name="first_name"
                  className="mb_20"
                  control={control}
                  withAsterisk
                />
              </div>
              <div className="col-lg-6">
                <Input
                  placeholder={fields.last_name}
                  name="last_name"
                  className="mb_20"
                  control={control}
                  withAsterisk
                />
              </div>
              <div className="col-lg-6 ">
                {/* <label htmlFor="Mobile " style={{ fontSize: '15px', fontWeight: 500 }}>
                {fields.mobile}
              </label> */}
                <div className="mb_20">
                  <IntlTelInput
                    placeholder={fields.mobile}
                    containerClassName="intl-tel-input"
                    inputClassName="form-control"
                    defaultCountry={ipCountryCode}
                    separateDialCode
                    value={mobile}
                    onPhoneNumberChange={handlePhoneNumberChange}
                    onSelectFlag={handleSelectFlag}
                  />
                  {mobileAlert && <p className="ErrorInput">{mobileAlert}</p>}
                </div>
              </div>
              <div className="col-lg-6 ">
                <Input
                  placeholder={fields.email}
                  name="email"
                  className="mb_20"
                  control={control}
                  withAsterisk
                />
              </div>
              <div className="col-lg-12">
                <Input
                  className="mb_20"
                  placeholder={fields.reference_url}
                  name="reference_url"
                  control={control}
                  withAsterisk
                />
              </div>
              <div className="col-lg-12 ">
                <TextInput
                  placeholder="Image"
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  multiple
                  onChange={handleImage}
                />
                <p className="note">
                  Note: Maximum 3 photos are allowed to upload (Size should be less than 2 mb)
                </p>
                {imageAlert && <p className="text-danger">{imageAlert}</p>}
                <div className="d-flex flex-wrap mb_20">
                  {images.length > 0 &&
                    images.map((image, index) => (
                      <div className="image-container">
                        <Image
                          key={index}
                          src={image}
                          alt={`Resized ${index}`}
                          width={60}
                          height={60}
                          style={{ margin: '0px 5px' }}
                        />

                        <i className="fa fa-close" onClick={() => handleDeleteImage(image)} />
                      </div>
                    ))}
                </div>
                {imageError && (
                  <div
                    className="alert alert-danger mb-0 justify-content-center d-flex align-items-center"
                    role="alert"
                    style={{ height: '40px' }}
                  >
                    <svg
                      className="bi flex-shrink-0 me-2"
                      role="img"
                      aria-label="Danger:"
                      style={{ width: '20px' }}
                    >
                      <use xlinkHref="#exclamation-triangle-fill" />
                    </svg>
                    <div>Image Sizes Too Large!!</div>
                  </div>
                )}
              </div>
              <div className="col-lg-12">
                {/* <Input placeholder={fields.description} name="description" control={control} withAsterisk /> */}
                <Textarea
                  // name="shipping_address.message"
                  rows={5}
                  className="mb_20"
                  {...register('description')}
                  withAsterisk
                  placeholder="Please share the Metal (Including Gold Color/Karat), Ring Size and Center Stone SKU, so we can make the CAD & 3D for you."
                  error={<span className="ErrorInput">{errors.description?.message}</span>}
                />
              </div>
              <div className="col-md-4 col-12 mb-md-0 ">
                <Input
                  className="mb-3"
                  name="size"
                  placeholder={fields.size}
                  control={control}
                  withAsterisk
                />
              </div>
              <div className="col-md-4 mb-md-0">
                <Input
                  className="mb-3"
                  name="metal"
                  placeholder={fields.metal}
                  control={control}
                  withAsterisk
                />
              </div>
              <div className="col-md-4 mb-3">
                <Input
                  className="mb-3"
                  name="sku"
                  placeholder={fields.sku}
                  control={control}
                  withAsterisk
                />
              </div>
              <div className="col-lg-12 text-end">
                <button
                  className="common_btn"
                  type="submit"
                  onClick={formValidation}
                  disabled={isSubmitting}
                >
                  {isSubmitting || isImageSubmitting ? (
                    <div className="spinner-border text-light auth_loader" role="status">
                      <span className="visually-hidden ">Loading...</span>
                    </div>
                  ) : (
                    'SUBMIT'
                  )}
                </button>
              </div>
            </div>
          </form>
          {alertShow && (
            <p className="text-success text-center">
              {' '}
              Thank you for your enquiry. We will be in touch shortly.
            </p>
          )}
        </div>
      </section>
      <section className="cer_made_by_section text-center">
        <h3>JEWELRY MADE BY US</h3>
        <span className="mb_50 d-block">
          Here are some of the jewelry pieces made by us for our international customers
        </span>
        <div className="d-flex gap-0 gap-lg-2 flex-wrap flex-md-nowrap">
          <div className="flex-1">
            <Image src={review1} alt="review-1" />
          </div>
          <div className="flex-1">
            <Image src={review2} alt="review-2" />
          </div>
          <div className="flex-1">
            <Image src={review3} alt="review-3" />
          </div>
          <div className="flex-1">
            <Image src={review4} alt="review-4" />
          </div>
        </div>
      </section>
      <div className="bg_light_gray mb-4 mt-3 my-md-5">
        <TrustPilotReviewSection />
        <div className="container-fluid pb-5">
          <h3 className="text_black_secondary text-center mb_50">
            OUR PRICES ARE LOWER THAN THE REGULAR SELLERS BECAUSE WE DIRECTLY GIVE YOU DIAMONDS FROM
            OUR FACTORY. NO MIDDLEMAN.
          </h3>
          <div className="row text-center align-items-center gy-4 pb-5">
            <div className="col-md-6">
              <div className="manufacturer_card">
                <Image src={Logo} alt="arrow" />
                <h5>Loose Grown Diamond</h5>
                <p>(Manufacturer)</p>
              </div>
            </div>
            <div className="col-md-3">
              <Image src={Arrow} alt="Arrow" />
            </div>
            <div className="col-md-3">
              <div className="manufacturer_card">
                <Image src={BuyersImg} alt="Byuers" />
                <h5>Our Buyers</h5>
                <p>Jewelry Owners, Diamond Traders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="lcbr_order_section text-center">
        <div className="container-fluid">
          <h3 className="text_black_secondary mb_50">HOW TO ORDER</h3>
          <div className="row gy-4">
            <div className="col-md-4">
              <Image src={OrderImg} alt="Shipping" />
              <h5>Ask for Free Quote</h5>
              <p>
                Ask us for a free quote with your desired jewelry design and we will send it to you.
              </p>
            </div>
            <div className="col-md-4">
              <Image src={CallImg} alt="Shipping" />
              <h5>Make a Payment</h5>
              <p>
                Once you have finalized the design and agree with the price, proceed to make the
                payment.
              </p>
            </div>
            <div className="col-md-4">
              <Image src={ShippingImg} alt="Shipping" />
              <h5>Relax while we Ship</h5>
              <p>Once the payment has been made, relax and track your ring.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default BeSpokePage;

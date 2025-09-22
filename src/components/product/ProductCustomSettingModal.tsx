/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState, useEffect } from 'react';

import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-intl-tel-input/dist/main.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import IntlTelInput from 'react-intl-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Textarea, TextInput, ModalProps } from '@mantine/core';

import { imageApi } from '@/api/image';
import { inquiryApi } from '@/api/inquiry';

import Input from '@/components/ui/input/input';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

export type IProductCustomSettingModalProps = ModalProps;
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
const Schema = Yup.object({
  first_name: Yup.string().trim().required('This field is required').label(fields.first_name),
  last_name: Yup.string().trim().required('This field is required').label(fields.last_name),
  email: Yup.string()
    .trim()
    .email('Please enter valid email')
    .trim()
    .required('This field is required'),
  reference_url: Yup.string().trim().optional().label(fields.reference_url),
  description: Yup.string().trim().optional().label(fields.description),
  sku: Yup.string().trim().optional().label(fields.sku),
  metal: Yup.string().trim().optional().label(fields.metal),
  size: Yup.string().trim().optional().label(fields.size),
});
const ProductCustomSettingModal: FC<IProductCustomSettingModalProps> = (props) => {
  const { title = 'Custom Setting Request', onClose, ...other } = props;
  const {
    control,
    register,
    reset,
    handleSubmit,
    getValues,
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
      // if (images.length > 0) {
      //   await imageApi.delete({ urls: images });
      //   const selectedFiles = Array.from(event.target.files).map((file: any) => ({
      //     file,
      //   }));
      //   // eslint-disable-next-line no-restricted-syntax
      //   for (const image of selectedFiles) {
      //     if (image.file?.size < 2097152) {
      //       selectedFilesIn2MB.push(image)
      //     }
      //   }
      //   const response = await imageApi.create({ file: selectedFilesIn2MB, folder_name: 'inquiry' });
      //   if (response.status === 201) {
      // setImages(response.data.data)
      //     setIsImageSubmitting(false);
      //     setImageError('');
      //   }
      // } else {
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
      // }
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
    <Modal
      title={title}
      onClose={() => [onClose(), setDefaultRemoveImages(true)]}
      {...other}
      centered
    >
      <div className="row justify-content-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          {formError && (
            <div
              className="alert alert-danger d-flex align-items-center mt-3"
              role="alert"
              style={{ height: 'auto', minHeight: '50px', padding: '10px' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
                viewBox="0 0 16 16"
                role="img"
                aria-label="Warning:"
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
              <div style={{ lineHeight: '1.2', fontSize: '14px' }}>{formError}</div>
            </div>
          )}
          <div className="row form-spacing">
            <div className="col-lg-6">
              <Input
                placeholder={fields.first_name}
                name="first_name"
                control={control}
                withAsterisk
              />
            </div>
            <div className="col-lg-6">
              <Input
                placeholder={fields.last_name}
                name="last_name"
                control={control}
                withAsterisk
              />
            </div>
            <div className="col-lg-6 mobileInput">
              {/* <label htmlFor="Mobile " style={{ fontSize: '15px', fontWeight: 500 }}>
                {fields.mobile}
              </label> */}
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
            <div className="col-lg-6 ">
              <Input placeholder={fields.email} name="email" control={control} withAsterisk />
            </div>
            <div className="col-lg-12">
              <Input
                placeholder={fields.reference_url}
                name="reference_url"
                control={control}
                withAsterisk
              />
            </div>
            <div className="col-lg-12">
              <TextInput
                placeholder="Image"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                multiple
                onChange={handleImage}
              />
              <p className="note lh-base pt-2 mb-0">
                Note: Maximum 3 photos are allowed to upload (Size should be less than 2 mb)
              </p>
              {imageAlert && <p className="text-danger">{imageAlert}</p>}
              <div className="d-flex flex-wrap mb-3">
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
                  className="alert alert-danger mb-4 justify-content-center d-flex align-items-center"
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
                {...register('description')}
                withAsterisk
                defaultValue={getValues('description')}
                placeholder="Please share the Metal (Including Gold Color/Karat), Ring Size and Center Stone SKU, so we can make the CAD & 3D for you."
                error={<span className="ErrorInput">{errors?.description?.message}</span>}
              />
            </div>
            <div className="col-md-4 col-12 mb-md-0 ">
              <label htmlFor="size">{fields.size}</label>
              <Input name="size" control={control} withAsterisk />
            </div>
            <div className="col-md-4 mb-md-0">
              <label htmlFor="size">{fields.metal}</label>
              <Input name="metal" control={control} withAsterisk />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="size">{fields.sku}</label>
              <Input name="sku" control={control} withAsterisk />
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
          <div
            className="alert alert-success justify-content-center d-flex align-items-center mt-4"
            role="alert"
            style={{ height: '40px' }}
          >
            <svg
              className="bi flex-shrink-0 me-2"
              role="img"
              aria-label="Success:"
              style={{ width: '20px' }}
            >
              <use xlinkHref="#check-circle-fill" />
            </svg>
            <div> Thank You for Successfully Submit Your Inquiry </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProductCustomSettingModal;

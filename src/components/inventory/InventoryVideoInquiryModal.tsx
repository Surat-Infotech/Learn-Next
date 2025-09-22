import { FC, useState, useEffect } from 'react';

import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
import 'react-intl-tel-input/dist/main.css';
import IntlTelInput from 'react-intl-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from '@mantine/core';

import { inquiryApi } from '@/api/inquiry';

import Input from '@/components/ui/input/input';

import { paths } from '@/routes/paths';

const fields = {
  name: 'Name',
  mobile: 'Mobile Number',
  email: 'Email',
};
export type IInventoryVideoModalProps = {
  opened: boolean;
  onClose: () => void;
  centered: true;
  size: 'md';
  sku: string;
  title?: string;
};

const InventoryVideoModal: FC<IInventoryVideoModalProps> = (props) => {
  const { title = 'ASK FOR A VIDEO REQUEST', sku, onClose, ...other } = props;
  const [showAlert, setShowAlert] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [mobileAlert, setMobileAlert] = useState('');
  const [ipCountryCode, setIpCountryCode] = useState('');

  const Schema = Yup.object({
    name: Yup.string().trim().required().label(fields.name),
    email: Yup.string().trim().email('Please enter valid email').required().label(fields.email),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(Schema),
    mode: 'onChange',
  });

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

  const formValidation = () => {
    if (!mobileNumber) {
      return setMobileAlert('This field is required');
    }
    if (mobileNumber.length < 8 || mobileNumber.length > 16) {
      return setMobileAlert('Mobile number must be between 8 to 16 digit');
    }
    setMobileAlert('');

    return true;
  };

  const handlePhoneNumberChange = (isValid: boolean, value: string, countryData: any) => {
    const number = value.replace(/[^\d-]/g, '');
    if (number.length < 8 || number.length > 16) {
      setMobileAlert('Mobile number must be between 8 to 16 digit');
    } else {
      setMobileAlert('');
    }
    setMobileNumber(number);
    if (countryData.dialCode !== countryCode) {
      setCountryCode(countryData.dialCode);
    }
  };
  const handleSelectFlag = (_mobile: string, country: any) => {
    setCountryCode(country.dialCode);
  };
  const onSubmit = async (data: any) => {
    try {
      setShowAlert(false);
      if (!formValidation()) {
        return;
      }
      const payload = {
        ...data,
        sku,
        mobile: mobileNumber.replaceAll('-', ''),
        country_code: countryCode,
      };
      const response = await inquiryApi.sendVideoInquiry(payload, 'video_request');
      if (response.status === 201) {
        setShowAlert(true);
        reset();
        setMobileNumber('');
        setCountryCode('');
        setTimeout(() => {
          setShowAlert(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  };
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
        <symbol id="check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
        </symbol>
        <symbol id="info-fill" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </symbol>
        <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </symbol>
      </svg>
      <Modal title={title} onClose={onClose} {...other}>
        <form onSubmit={handleSubmit(onSubmit)} className="form-spacing-video">
          <Input placeholder={fields.name} name="name" control={control} withAsterisk />
          <Input placeholder={fields.email} name="email" control={control} withAsterisk />
          <IntlTelInput
            containerClassName="intl-tel-input"
            inputClassName="form-control"
            value={mobileNumber}
            defaultCountry={ipCountryCode}
            separateDialCode
            onPhoneNumberChange={handlePhoneNumberChange}
            onSelectFlag={handleSelectFlag}
          />
          {mobileAlert && <p className="ErrorInput">{mobileAlert}</p>}

          <p className="note">
            {' '}
            You want to request information about {sku}. You will get all the updates via email once
            we have information.
          </p>
          <div style={{ marginTop: '28px' }}>
            <button
              type="submit"
              className="common_btn  d-block ms-auto"
              disabled={isSubmitting}
              onClick={formValidation}
            >
              {isSubmitting ? (
                <div className="spinner-border text-light auth_loader" role="status">
                  <span className="visually-hidden ">Loading...</span>
                </div>
              ) : (
                'SUBMIT'
              )}
            </button>
          </div>
        </form>
        {showAlert && (
          <p className="text-success text-center">
            {' '}
            Thank you for your enquiry. We will be in touch shortly.
          </p>
        )}
      </Modal>
    </>
  );
};

export default InventoryVideoModal;

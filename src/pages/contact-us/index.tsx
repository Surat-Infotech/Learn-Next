import { useRouter } from 'next/router';
import { FC, useState, useEffect } from 'react';

import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
import 'react-intl-tel-input/dist/main.css';
import IntlTelInput from 'react-intl-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import { inquiryApi } from '@/api/inquiry';

import { withSsrProps } from '@/utils/page';

import { paths } from '@/routes/paths';

const fields = {
  name: 'Name*',
  email: 'Email*',
  mobile: 'Mobile*',
  message: 'Message.',
};
const ContactPage: FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [formError, setFormError] = useState('');

  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [mobileAlert, setMobileAlert] = useState('');
  const [ipCountryCode, setIpCountryCode] = useState('');

  const { push } = useRouter();

  const Schema = Yup.object({
    name: Yup.string().trim().required().label(fields.name),
    email: Yup.string().trim().email('Please enter a valid email').required().label(fields.email),
    message: Yup.string().min(1, 'This field is required').trim().required().label(fields.message),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
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

  const handleSelectFlag = (_mobile: string, country: any) => {
    setCountryCode(country.dialCode);
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

  const onSubmit = async (data: any) => {
    try {
      setShowAlert(false);
      if (!formValidation()) {
        return;
      }
      const payload = {
        ...data,
        mobile: mobileNumber,
        country_code: countryCode,
      };
      const res = await inquiryApi.sendcontactInquiry(payload, 'contact');
      if (res.status === 201) {
        setCountryCode('');
        setMobileNumber('');
        setTimeout(() => {
          push(paths.thankYou.root);
        }, 2000);
      }
      reset();
      setShowAlert(true);
    } catch (err) {
      if (err.response.data.status === 401) signOut({ callbackUrl: paths.order.root }); localStorage.clear();
      setShowAlert(false);
      if (err.response?.data) {
        setFormError(err.response.data.message);
      } else {
        setFormError(err.message);
      }
    }
  };

  return (
    <div className="contact_us">
      <div className="banner_section">
        <div className="py_60">
          <div className="container-fluid">
            <div>
              <h2 className="text_black_secondary fw-400 mb_20 text-center">Get in Touch </h2>
              <h3 className="text-center mb_20">
                Fill out the form below or email us at<br className='d-block d-sm-none' />
                <a href="mailto:support@loosegrowndiamond.com" className="ms-1">
                  <b>support@loosegrowndiamond.com</b>
                </a>
              </h3>
              <h3 className="text-center mb_20">
                <b>Business Phone Number (Whatsapp): <br className='d-block d-sm-none' /> </b> +1 646-288-0810
              </h3>
              <h3 className="text-center mb_70">
                <b>Office Address: <br className='d-block d-sm-none' /></b> 55W 47th St., Suite#790 New York, NY-10036 USA
              </h3>

              <form className="form_box mx-auto mb-0 pb_0" onSubmit={handleSubmit(onSubmit)}>
                <div className="row row-gap-3 row-gap-md-2">
                  <div className="col-md-6">
                    <input
                      {...register('name', { required: true })}
                      type="text"
                      className="form-control"
                      placeholder="Your name"
                    />
                    {errors?.name && <span className="ErrorInput">{errors.name.message}</span>}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      className="form-control"
                      placeholder="Your email"
                    />
                    {errors?.email && <span className="ErrorInput">{errors.email.message}</span>}
                  </div>
                  <div className="col-12">
                    <IntlTelInput
                      placeholder="Your mobile*"
                      containerClassName="intl-tel-input"
                      inputClassName="form-control"
                      defaultCountry={ipCountryCode}
                      value={mobileNumber}
                      separateDialCode
                      onPhoneNumberChange={handlePhoneNumberChange}
                      onSelectFlag={handleSelectFlag}
                    />
                    {mobileAlert && <p className="ErrorInput">{mobileAlert}</p>}
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      {...register('message', { required: true })}
                      rows={3}
                      placeholder="Your message"
                    />
                    {errors?.message && <span className="ErrorInput">{errors.message.message}</span>}
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={formValidation}
                  className="btn btn-primary common_btn float-right text-uppercase mt-4"
                >
                  {isSubmitting ? (
                    <div className="spinner-border text-light auth_loader" role="status">
                      <span className="visually-hidden ">Loading...</span>
                    </div>
                  ) : (
                    "Let's talk"
                  )}
                </button>
              </form>
              {showAlert && (
                <p className="text-success text-center mt-2">
                  {' '}
                  Thank you for your enquiry. We will be in touch shortly.
                </p>
              )}
              {formError && <p className="text-danger text-center"> {formError}</p>}
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

export default ContactPage;

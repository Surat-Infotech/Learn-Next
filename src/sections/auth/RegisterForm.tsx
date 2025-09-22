import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState, useEffect, HTMLAttributes } from 'react';

import axios from 'axios';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-intl-tel-input/dist/main.css';
import { useLocalStorage } from 'usehooks-ts';
// eslint-disable-next-line import/no-extraneous-dependencies
import IntlTelInput from 'react-intl-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import { customerApi } from '@/api/customer';

import { paths } from '@/routes/paths';
import GreenCheckImg from '@/assets/image/whole-sale/check_green.svg';
import WholeSaleBackGround from '@/assets/image/whole-sale/wholesale_bg.svg';
import LooseGroundLogo from '@/assets/image/whole-sale/loosegrowndiamond_logo.svg';

// ----------------------------------------------------------------------

const fields = {
  name: 'Name',
  email: 'Email', // required
  password: 'Password', // required
  mobile_no: 'Mobile Number', // optional
  website: 'Website', // optional
};

type IRegisterData = {
  email: string;
  name: string;
  password: string;
  website?: string;
};

export type IRegisterFormProps = HTMLAttributes<HTMLFormElement>;

const RegisterForm: FC<IRegisterFormProps> = () => {
  const [_totalWhiteDiamond,] = useLocalStorage<number>('totalDiamond', 0);
  const [formattedNumber, setFormattedNumber] = useState<string>('950k');

  function formatNumberWithSuffix(num: number) {
    // Convert the number to a proper format by rounding it
    const a = Number(num);
    const divisor = 10 ** (String(a).length - 2);
    const rounded = Math.round(a / divisor) * divisor;

    // Format the rounded number with suffixes
    if (rounded >= 1_000_000) {
      const millionValue = (rounded / 1_000_000).toFixed(1);
      return millionValue.endsWith('.0') ? `${parseInt(millionValue, 10)}M` : `${millionValue}M`;
    } if (rounded >= 1_000) {
      const thousandValue = (rounded / 1_000).toFixed(1);
      return thousandValue.endsWith('.0') ? `${parseInt(thousandValue, 10)}k` : `${thousandValue}k`;
    }
    return rounded.toString();
  }

  useEffect(() => {
    const formatted = formatNumberWithSuffix(_totalWhiteDiamond);
    setFormattedNumber(formatted);
  }, [_totalWhiteDiamond]);

  const { push } = useRouter();
  const [error, setError] = useState('');
  const [mobile, setMobile] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [success, setSuccess] = useState(false);
  const [mobileAlert, setMobileAlert] = useState('');
  const [ipCountryCode, setIpCountryCode] = useState('');

  const schema = object().shape({
    name: string().required().label(fields.name).max(50).trim(),
    email: string()
      .email('Please enter valid email')
      .required()
      .trim()
      .max(100)
      .label(fields.email),
    website: string().optional().trim().label(fields.website),
    password: string().required().trim().min(6).max(50).label(fields.password),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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
    if (!mobile) {
      return setMobileAlert('This field is required');
    }
    if (mobile.length < 8 || mobile.length > 16) {
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
    setMobile(number);
    if (countryData.dialCode !== countryCode) {
      setCountryCode(countryData.dialCode);
    }
  };

  const handleSelectFlag = (_mobile: string, country: any) => {
    setCountryCode(country.dialCode);
  };

  const onSubmit = async (formData: IRegisterData) => {
    setIsSubmitting(true);
    setSuccess(false);
    try {
      if (!formValidation()) {
        return;
      }
      const payload = {
        ...formData,
        website: formData.website || undefined,
        mobile_no: mobile.replaceAll('-', '') || undefined,
        country_code: countryCode || undefined,
      };

      await customerApi.create(payload);

      setSuccess(true);
      setIsSubmitting(false);
      setError('');
      push(paths.registerThankYou.root);
      reset();
    } catch (e) {
      setError(e.response.data.message);
    } finally {
      setIsSubmitting(false);
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

      <div className="wholesale_page">
        <div className="container-fluid ">
          <div className="row main_row ">
            <div className="col-lg-6">
              <Image src={LooseGroundLogo} alt="loosegrowndiamond_logo" className='losse-ground-logo' />
              <div className="main_box ">
                <div className="sub_title">💎 Over {Number(_totalWhiteDiamond) > 0 ? formattedNumber : '950k'}+ Certified Diamonds</div>
                <h1>Explore our vast collection of lab-grown diamonds</h1>
                <p className="text_p">
                  Get the best deals on certified lab-grown diamonds, fancy shapes melee diamonds
                  and fine jewelry. Customize selected diamonds and jewelry to fit your unique
                  needs.
                </p>
                <ul className="list-unstyled">
                  <li>
                    <Image src={GreenCheckImg} alt="green-check" width={20} height={20} />
                    <span>7 Days Return Policy</span>
                  </li>
                  <li>
                    <Image src={GreenCheckImg} alt="green-check" width={20} height={20} />
                    <span>Custom Cut Diamonds</span>
                  </li>
                  <li>
                    <Image src={GreenCheckImg} alt="green-check" width={20} height={20} />
                    <span>Insured Shipping</span>
                  </li>
                  <li>
                    <Image src={GreenCheckImg} alt="green-check" width={20} height={20} />
                    <span>Wholesale Prices</span>
                  </li>
                </ul>
              </div>
              <Image src={WholeSaleBackGround} alt="loosegrowndiamond" className="main_img" />
            </div>
            <div className="col-lg-6">
              <form onSubmit={handleSubmit(onSubmit)} className="form_box mx-auto ms-lg-auto">
                <h3 className="text-center">Get a access for over {Number(_totalWhiteDiamond) > 0 ? formattedNumber : '950k'}+ Certified Diamonds</h3>
                <p className="text-center">
                  Maximize profitability for your business with wholesale prices and the luxury of
                  custom-cut fancy diamonds.
                </p>
                <div className="row">
                  <div className='d-flex flex-column gap-3 gap-12'>
                    <div className="col-12">
                      <label htmlFor="name" className="form-label">
                        Your name<span className="text-danger">*</span>
                      </label>
                      {/* <Input name="name" control={control} withAsterisk className="form-register-control" placeholder='Enter your name' /> */}
                      <input
                        type="text"
                        {...register('name')}
                        className="form-control"
                        placeholder="Enter your name"
                      />
                      <p className="mb-0 ErrorInput">{errors.name?.message}</p>
                    </div>
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        Your email<span className="text-danger">*</span>
                      </label>
                      {/* <Input name="email" control={control} withAsterisk className="form-register-control" placeholder='Enter your email'/> */}
                      <input
                        type="text"
                        {...register('email')}
                        className="form-control"
                        placeholder="Enter your email"
                      />
                      <p className="mb-0 ErrorInput">{errors.email?.message}</p>
                    </div>
                    <div className="col-12">
                      <label htmlFor="phone" className="form-label">
                        Your phone<span className="text-danger">*</span>
                      </label>
                      {/* <Input name="mobile_no" control={control} withAsterisk className="form-register-control" placeholder='Enter your phone number'/> */}
                      <IntlTelInput
                        containerClassName="intl-tel-input"
                        inputClassName="form-control register_input"
                        value={mobile}
                        separateDialCode
                        defaultCountry={ipCountryCode}
                        onPhoneNumberChange={handlePhoneNumberChange}
                        onSelectFlag={handleSelectFlag}
                        style={{ borderRadius: '5px' }}
                      />
                      {mobileAlert && <p className="ErrorInput">{mobileAlert}</p>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="url" className="form-label">
                        Your website/social media
                      </label>
                      {/* <Input
                      name="website"
                      control={control}
                      withAsterisk
                      className="form-control"
                      id="url"
                      placeholder='www.domain.com'
                    /> */}
                      <input
                        type="text"
                        {...register('website')}
                        className="form-control"
                        placeholder="www.domain.com"
                      />
                      <p className="mb-0 ErrorInput">{errors.website?.message}</p>
                    </div>
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">
                        Password<span className="text-danger">*</span>
                      </label>
                      {/* <InputPassword
                      className="form-register-control"
                      name="password"
                      type="password"
                      control={control}
                      withAsterisk
                      placeholder='•••••••'
                    /> */}
                      <input
                        type="password"
                        {...register('password')}
                        className="form-control"
                        placeholder="•••••••"
                      />
                      <p className="mb-0 ErrorInput">{errors.password?.message}</p>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="common_btn w-100 mb-4"
                        disabled={isSubmitting}
                        onClick={formValidation}
                      >
                        {isSubmitting ? (
                          <div className="spinner-border text-light auth_loader" role="status">
                            <span className="visually-hidden ">Loading...</span>
                          </div>
                        ) : (
                          'Join Now'
                        )}
                      </button>
                    </div>
                  </div>

                  {error && !isSubmitting && !success && (
                    <div
                      className="alert alert-danger justify-content-center d-flex align-items-center mt-3"
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
                      <div>{error}</div>
                    </div>
                  )}
                </div>
                <p className="text-center mb-0">
                  Already have access? <Link href={paths.login.root}> Sign In</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;

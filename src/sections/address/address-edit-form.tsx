/* eslint-disable no-nested-ternary */
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useMemo, useState, useEffect } from 'react';

import axios from 'axios';
import * as Yup from 'yup';
import countryData from 'countries.json';
import { useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
import 'react-intl-tel-input/dist/main.css';
import IntlTelInput from 'react-intl-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import { Switch } from '@mantine/core';

import { IAddressDiary, addressDiaryApi } from '@/api/address-diary';

import Input from '@/components/ui/input/input';
import SelectUI from '@/components/ui/select/select';

import { paths } from '@/routes/paths';
import { dialCode } from '@/_mock/dial-code';

const fields = {
  first_name: 'First Name',
  last_name: 'Last Name',
  email: 'Email',
  country: 'Country',
  state: 'State',
  city: 'City',
  phone: 'Phone',
  is_default: 'is_default',
  postcode: 'Postcode',
  address: 'Address Line 1',
  address_second: 'Address Line 2',
};

const schema = Yup.object({
  first_name: Yup.string().required().label(fields.first_name),
  last_name: Yup.string().required().label(fields.last_name),
  email: Yup.string().email().required().label(fields.last_name),
  country: Yup.string().required().label(fields.country),
  state: Yup.string().required().label(fields.state),
  city: Yup.string().required().label(fields.city),
  phone: Yup.string().optional().label(fields.phone),
  postcode: Yup.string().required().label(fields.postcode),
  is_default: Yup.boolean().required().label(fields.is_default),
  address: Yup.string().required().label(fields.address),
  address_second: Yup.string().optional().label(fields.address_second),
});

const AddressEditForm = ({ address }: { address?: IAddressDiary }) => {
  const { push, query } = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const address_type = address?.address_type ?? (query.type as string);
  const [checked, setChecked] = useState(address?.is_default ?? true);
  const [successMSG, setSuccessMSG] = useState('');

  const [ipCountryCode, setIpCountryCode] = useState('');
  const [mobileAlert, setMobileAlert] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [mobile, setMobile] = useState<string>('');
  const [mobileError, setMobileError] = useState<boolean>(false);

  const defaultValues = {
    first_name: address?.first_name ?? '',
    email: address?.email ?? '',
    last_name: address?.last_name ?? '',
    country: address?.country ?? '',
    state: '',
    city: address?.city ?? '',
    phone: address?.phone ?? '',
    postcode: address?.postcode ?? '',
    address: address?.address ?? '',
    address_second: address?.address_second ?? '',
    is_default: address?.is_default ?? true,
  };
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    getValues,
    setFocus,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const selectedCountry = watch('country' as any);
  const selectedState = watch('state' as any);

  // eslint-disable-next-line @typescript-eslint/no-shadow
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

  // Fetch user country code using their IP address
  useEffect(() => {
    const fetchCountryCodeFromIP = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const countryData = response.data;
        if (address?.country_code) {
          const countryCodeByDialCode = dialCode
            ?.find((item: any) => item.dial_code === `+${address?.country_code}`)
            ?.code?.toLowerCase();
          setIpCountryCode((countryCodeByDialCode as string) || address?.country_code);
        } else {
          setIpCountryCode(countryData.country_code.toLowerCase());
        }
        setMobile(address?.phone ?? defaultValues.phone ?? '');
      } catch (err) {
        if (err.response.data.status === 401) signOut({ callbackUrl: paths.order.root });
        localStorage.clear();
        console.error('Error fetching country from IP', err);
      }
    };

    fetchCountryCodeFromIP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const hasErrors = errors && Object.keys(errors).length > 0;

    if (!mobileAlert && mobile.length >= 1) {
      setMobileError(false);
      return;
    }
    if (!hasErrors && mobileAlert && mobile.length >= 1) {
      setMobileError(false);
      return;
    }
    if (hasErrors && !mobileAlert && mobile.length >= 0) {
      setMobileError(true);
    }
  }, [mobile, mobileAlert, errors]);

  const mobileValidation = () => {
    if (!mobileAlert && mobile.length <= 0) {
      setMobileError(true);
      return true;
    }
    if (mobileAlert) return true;
    return false;
  };

  useMemo(() => {
    // for reset state when country is onChanging
    if (selectedState) {
      setValue('state', null as any);
      if (errors?.state || errors?.country)
        setError('state', { type: 'custom', message: 'This Field is Required' });
    }

    // for reset state when country is null
    if (!selectedCountry && selectedState) {
      setValue('state', null as any);
      if (errors?.state || errors?.country)
        setError('state', { type: 'custom', message: 'This Field is Required' });
      setFocus('country');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  useMemo(() => {
    if (selectedCountry && !selectedState && address?.state) {
      setValue('state', address.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const onSubmit = async (data: any) => {
    try {
      // Phone validation
      if (mobileValidation()) return;
      setShowAlert(false);
      setSuccessMSG('');
      const payload = {
        ...data,
        address_type: address?._id ? address_type : [address_type],
        phone: mobile,
        country_code: countryCode || ipCountryCode,
      };
      if (address?._id) {
        const { data: updateData } = await addressDiaryApi.update(address?._id, payload);
        if (updateData.message) setSuccessMSG(updateData.message);
      } else {
        const { data: addData } = await addressDiaryApi.post(payload);
        if (addData.message) setSuccessMSG(addData.message);
      }
      setShowAlert(true);
      setTimeout(() => {
        push(paths.address.root);
      }, 1000);
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      setSuccessMSG('');
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>My account</title>
        <meta name="" content="" />
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row account_details">
          <div className="col-lg-12">
            <h3 className="fw-600 text_black_secondary mb-30">
              {address_type && address_type.charAt(0).toUpperCase() + address_type.slice(1)}
            </h3>
          </div>
          <div className="col-lg-6">
            <Input
              className="form-group"
              label={fields.first_name}
              name="first_name"
              control={control}
              withAsterisk
            />
          </div>
          <div className="col-lg-6">
            <Input
              className="form-group"
              label={fields.last_name}
              name="last_name"
              control={control}
              withAsterisk
            />
          </div>
          <div className="col-lg-12">
            <Input
              className="form-group"
              label={fields.email}
              name="email"
              control={control}
              withAsterisk
            />
          </div>
          <div className="col-lg-12">
            <Input
              className="form-group"
              label={fields.address}
              name="address"
              control={control}
              withAsterisk
            />
          </div>
          <div className="col-lg-12">
            <Input
              className="form-group"
              label={fields.address_second}
              name="address_second"
              control={control}
              withAsterisk
            />
          </div>
          <div className="col-lg-12">
            <SelectUI
              className="form-group"
              label={fields.country}
              name="country"
              placeholder="Select a country..."
              allowDeselect={false}
              control={control as any}
              checkIconPosition="right"
              nothingFoundMessage="Nothing found..."
              data={countryData?.map((item) => ({
                value: item.name,
                label: item.name,
              }))}
              clearable
              searchable
              withAsterisk
            />
          </div>
          <div className="col-lg-12">
            <SelectUI
              className="form-group"
              label={fields.state}
              name="state"
              placeholder="Select a state..."
              nothingFoundMessage="Nothing found..."
              control={control as any}
              allowDeselect={false}
              checkIconPosition="right"
              data={
                watch('country')
                  ? countryData
                      .find((item) => item.name === (getValues('country') || address?.country))
                      ?.states?.map((item: any) => ({ value: item.name, label: item.name }))
                  : []
              }
              clearable
              searchable
              withAsterisk
            />
          </div>
          <div className="col-lg-12">
            <Input
              className="form-group"
              label={fields.city}
              name="city"
              control={control}
              withAsterisk
            />
          </div>
          <div className="col-lg-12 mb-4">
            {/* <Input
              className="form-group"
              label={fields.phone}
              name="phone"
              control={control}
              withAsterisk
            /> */}
            <label htmlFor="phone" className="form-label fw-300" style={{ fontSize: '14px' }}>
              Phone<span className="text-danger ms-1">*</span>
            </label>
            <IntlTelInput
              containerClassName="intl-tel-input"
              inputClassName="form-control register_input"
              value={mobile}
              separateDialCode
              defaultCountry={ipCountryCode}
              onPhoneNumberChange={handlePhoneNumberChange}
              onSelectFlag={handleSelectFlag}
              style={{ borderRadius: '0px' }}
            />
            {mobileAlert && <p className="ErrorInput">{mobileAlert}</p>}
            {mobileError && !mobileAlert && <p className="ErrorInput">This field is required</p>}
          </div>
          <div className="col-lg-12">
            <Input
              className="form-group"
              label={fields.postcode}
              name="postcode"
              control={control}
              withAsterisk
            />
          </div>
          <div className="col-lg-12">
            <div className="d-flex align-items-center">
              <label htmlFor="default-address" className="mb-0 me-3">
                Default Address
              </label>
              <Switch
                color="rgba(0, 0, 0, 1)"
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />
            </div>
          </div>
          <div className="col-lg-12 mt-4">
            <button type="submit" className="common_btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="spinner-border text-light auth_loader" role="status">
                  <span className="visually-hidden ">Loading...</span>
                </div>
              ) : address?._id ? (
                'Update'
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </form>
      {showAlert && (
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
          <div>{successMSG}</div>
        </div>
      )}
    </>
  );
};

export default AddressEditForm;

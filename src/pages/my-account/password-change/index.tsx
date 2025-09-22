import React, { useState } from 'react';
import { useRouter } from 'next/router';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { authApi } from '@/api/auth';

import { withSsrProps } from '@/utils/page';

import Input from '@/components/ui/input/input';
import ProfileSidebar from '@/components/profile/profileSideBar';

import { paths } from '@/routes/paths';

const fields = {
  oldPassword: 'Current Password',
  // (leave blank to leave unchanged)
  newPassword: 'New Password',
  // (leave blank to leave unchanged)
  confimPassword: 'Confirm new Password',
};
const schema = Yup.object({
  oldPassword: Yup.string().required().label(fields.oldPassword),
  newPassword: Yup.string().required().label(fields.newPassword),
  confimPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required()
    .label(fields.confimPassword),
});
const AccountPage = () => {
  const { push } = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: any) => {
    try {
      setShowAlert(false);
      const response = await authApi.updatePassword(data);
      if (response.status === 200) {
        setShowAlert(true);
        setTimeout(() => {
          push('/');
        }, 2000);
      }
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      console.error(error);
    }
  };

  return (
    <div className="min-h-454 account-form">
      <div className="container-fluid">
        <h1 className="h4 text-center fw-600 text_black_secondary mb_30">My Account</h1>
        <div className="row gy-4 gy-md-5">
          <div className="col-lg-3">
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
            <ProfileSidebar />
          </div>
          <div className="col-lg-9 account_details">
            <h3 className="fw-600 text_black_secondary mb-30">Password Change</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-lg-12">
                  <Input
                    className="form-group"
                    label={fields.oldPassword}
                    name="oldPassword"
                    control={control}
                    withAsterisk
                  />
                </div>
                <div className="col-lg-12">
                  <Input
                    className="form-group"
                    label={fields.newPassword}
                    name="newPassword"
                    control={control}
                    withAsterisk
                  />
                </div>
                <div className="col-lg-12">
                  <Input
                    className="form-group"
                    label={fields.confimPassword}
                    name="confimPassword"
                    control={control}
                    withAsterisk
                  />
                </div>
                <div className="col-lg-12">
                  <button type="submit" className="common_btn me-0" disabled={isSubmitting}>
                    Update Password
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
                <div>Password changed successfully!!</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: true,
});

export default AccountPage;

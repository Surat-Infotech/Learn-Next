import React, { FC } from 'react';
import { useRouter } from 'next/router';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { authApi } from '@/api/auth';

import { paths } from '@/routes/paths';

import InputPassword from '../ui/input-password/input-password';

const Schema = Yup.object({
  newPassword: Yup.string()
    .trim()
    .min(6, 'New Password must be at least 6 characters')
    .max(20, 'New Password must be at most 20 characters')
    .required('This field is required'),
  confimPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('newPassword')], 'New Password and Confirm Password should be same.')
    .required('This field is required'),
});

type IEmailProps = {
  setResetSuccess: (value: boolean) => void;
  setResetErrorMessage: (value: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
};
const ResetPassword: FC<IEmailProps> = (props) => {
  const { setResetErrorMessage, setIsSubmitting, setResetSuccess, isSubmitting } = props;
  const { push, query } = useRouter();
  const { reset, control, handleSubmit } = useForm({
    resolver: yupResolver(Schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await authApi.resetPassword(data, query.token);

      setResetSuccess(true);
      setIsSubmitting(false);
      setResetErrorMessage('');
      reset();
      setTimeout(() => {
        push(paths.order.root);
      }, 1000);
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      if (error.response.data) {
        setResetErrorMessage(error.response.data.message);
      } else {
        setResetErrorMessage(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row gap-3">
          <div className="col-12 mt-0">
            <label htmlFor="text" className="form-label">
              New Password<span className="text-danger">*</span>
            </label>
            <InputPassword
              className="form-register-control"
              name="newPassword"
              type="password"
              size="lg"
              control={control}
              withAsterisk
              placeholder="•••••••"
            />
          </div>
          <div className="col-12 mt-0">
            <label htmlFor="text" className="form-label">
              Confirm Password<span className="text-danger">*</span>
            </label>
            <InputPassword
              className="form-register-control"
              name="confimPassword"
              type="password"
              control={control}
              size="lg"
              withAsterisk
              placeholder="•••••••"
            />
          </div>
          <div className="mt-2">
            <button type="submit" className="common_btn w-100 me-3" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="spinner-border text-light auth_loader" role="status">
                  <span className="visually-hidden ">Loading...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;

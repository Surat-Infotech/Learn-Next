import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { authApi } from '@/api/auth';

import { paths } from '@/routes/paths';

import Input from '../ui/input/input';

const fields = {
  email: 'Enter your email',
};

type IEmailProps = {
  setSuccess: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
};

const Email = (Props: IEmailProps) => {
  const { setSuccess, setErrorMessage, setIsSubmitting } = Props;
  const { query } = useRouter();
  const [email, setEmail] = React.useState<string>((query.email as string) || '');
  const Schema = Yup.object({
    email: Yup.string().required().trim().email('Please enter valid email'),
  });

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  useEffect(() => {
    setValue('email', email);
  }, [email, setValue]);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await authApi.sendLink(data);

      setSuccess(true);
      setIsSubmitting(false);
      setErrorMessage('');
      reset();
    } catch (error) {
      if (error?.response?.data?.status === 401) signOut({ callbackUrl: paths.order.root });
      localStorage.clear();
      if (error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="col-12 mt-0">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row gap-1">
          <div className="col-12 mt-0">
            <label htmlFor="email" className="form-label">
              Email address<span className="text-danger">*</span>
            </label>
            <Input
              placeholder={fields.email}
              value={email}
              className="mb_20"
              name="email"
              size="lg"
              withAsterisk
              onChange={(e) => setEmail(e.target.value)}
              control={control}
            />
          </div>
          <div>
            <button type="submit" className="common_btn w-100 me-3" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="spinner-border text-light auth_loader" role="status">
                  <span className="visually-hidden ">Loading...</span>
                </div>
              ) : (
                'SEND RESET LINK'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Email;

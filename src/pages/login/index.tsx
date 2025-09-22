import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState, type HTMLAttributes } from 'react';

import { object, string } from 'yup';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { withSsrProps } from '@/utils/page';

import { paths } from '@/routes/paths';
import LooseGroundLogo from '@/assets/image/whole-sale/loosegrowndiamond_logo.svg';

// ----------------------------------------------------------------------

const fields = {
  email: 'Email Address',
  password: 'Password',
};

const defaultValues = {
  email: '',
  password: '',
};

export type ILoginFormProps = HTMLAttributes<HTMLFormElement>;

const LoginForm: FC<ILoginFormProps> = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { push } = useRouter();

  const schema = object().shape({
    email: string().required().email().trim().max(100).label(fields.email),
    password: string().required().trim().min(6).max(50).label(fields.password),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (formData: typeof defaultValues) => {
    setIsSubmitting(true);
    setSuccess(false);
    try {
      const payload = {
        ...formData,
      };

      const response = await signIn('credentials', {
        redirect: false,
        ...payload,
      });
      if (response?.status === 200) {
        setSuccess(true);
        setIsSubmitting(false);
        setTimeout(() => {
          push(paths.whiteDiamondInventory.root);
        }, 800);
      } else if (response?.error === 'Request failed with status code 401') {
        setError('Invalid details!');
      } else if (response?.error === 'Request failed with status code 403') {
        setError('You are not verified, please contact support team.');
      }
    } catch (e) {
      setError(e.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="top_bar">
        <div className="container-fluid">
          <ul>
            <li>Insured Shipping with 7 days Free Returns*</li>
          </ul>
        </div>
      </div>
      <div className="login-back">
        <div className="bg_soft">
          <div className="wholesale_page">
            <div className="container-fluid ">
              <form onSubmit={handleSubmit(onSubmit)} className="form_box mx-auto">
                <Image
                  src={LooseGroundLogo}
                  alt="loosegrowndiamond_logo"
                  className="d-block mx-auto mb_30"
                />

                <div className="row gap-3 gap-12">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email address<span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      {...register('email')}
                    />
                    <p className="mb-0 ErrorInput">{errors.email?.message}</p>
                  </div>
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">
                      Password<span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      {...register('password')}
                    />
                    <p className="mb-0 ErrorInput">{errors.password?.message}</p>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="common_btn w-100" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="spinner-border text-light auth_loader" role="status">
                          <span className="visually-hidden ">Loading...</span>
                        </div>
                      ) : (
                        'Get Access Now'
                      )}
                    </button>
                  </div>
                  <Link
                    href={paths.forgetPassword.root}
                    className="text-decoration-none d-flex justify-content-end mt-2 fs-14"
                    style={{ color: '#000' }}
                  >
                    Forgot Password?
                  </Link>
                  {success && (
                    <div
                      className="alert alert-success justify-content-center d-flex align-items-center mt-3"
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
                      <div className='fs-14'>Login successfully!!</div>
                    </div>
                  )}
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
                      <div className="py-2 fs-14">{error}</div>
                    </div>
                  )}
                  <p className="text-center mb-0">
                    Not a member? <Link href={paths.register.root}>Join Now</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="footer">
            <p className="text-center mb-0 fs-12">© Loose Grown Diamond {new Date().getFullYear()}. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withSsrProps({
  onlyGuest: true,
});

export default LoginForm;

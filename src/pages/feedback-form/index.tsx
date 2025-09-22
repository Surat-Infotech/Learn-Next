import { FC, useState } from 'react';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { signOut } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { inquiryApi } from '@/api/inquiry';

import { withSsrProps } from '@/utils/page';

import { paths } from '@/routes/paths';

const fields = {
  name: 'Name',
  email: 'Email',
  message: 'Message.',
};
const FeedbackFormPage: FC = () => {
  const [formError, setFormError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const Schema = Yup.object({
    name: Yup.string().trim().required().label(fields.name),
    email: Yup.string().trim().email('Please enter valid email').required().label(fields.email),
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

  const onSubmit = async (data: any) => {
    try {
      setShowAlert(false);
      const payload = {
        ...data,
      };
      await inquiryApi.sendcontactInquiry(payload, 'feedback');
      reset();
      setShowAlert(true);
    } catch (err) {
      if (err.response.data.status === 401) signOut({ callbackUrl: paths.order.root }); localStorage.clear();
      setShowAlert(false);
      if (err.response.data) {
        setFormError(err.response.data.message);
      } else {
        setFormError(err.message);
      }
    }
  };
  return (
    <div className="feedback_section mx-auto">
      <div className="banner_section">
        <div className="py_60">
          <div className="container first_section ">
            <div className="row">
              <div className="col-md-11 mx-auto">
                <div className="text-center mb_35">
                  <h2 className="fw-400  ">Feedback Form</h2>
                  <p className="mb-0">
                    Let us know how we can improve the website. Are there pages that you use often
                    that are not listed on Current pages? Tell us, and we’ll try to include them.
                    Can’t find a page? Tell us, and we’ll work on the navigation to make it easier
                    to find.
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="feedback_box mx-auto">
                  <div className='mb-3 mb-md-4'>
                    <input
                      {...register('name', { required: true })}
                      type="text"
                      className="form-control"
                      placeholder="Your name"
                    />
                    {errors?.name && <span className="ErrorInput">{errors.name.message}</span>}
                  </div>
                  <div className='mb-3 mb-md-4'>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      className="form-control"
                      placeholder="Your email"
                    />
                    {errors?.email && <span className="ErrorInput">{errors.email.message}</span>}
                  </div>
                  <div className='mb-3 mb-md-4'>
                    <textarea
                      className="form-control"
                      {...register('message', { required: true })}
                      rows={3}
                      placeholder="Your message"
                    />
                    {errors?.message && <span className="ErrorInput">{errors.message.message}</span>}
                  </div>
                  <button type="submit" className="btn">
                    {isSubmitting ? (
                      <div className="spinner-border text-light auth_loader" role="status">
                        <span className="visually-hidden ">Loading...</span>
                      </div>
                    ) : (
                      'SUBMIT FORM'
                    )}
                  </button>
                </div>
              </form>
              {showAlert && (
                <p className="text-success text-center mt-2"> Thank you for your feedback.</p>
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

export default FeedbackFormPage;

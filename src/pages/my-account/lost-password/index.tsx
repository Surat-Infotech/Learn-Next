
import { FC, useState } from 'react';
import { useRouter } from 'next/router';

import { withSsrProps } from '@/utils/page';

import Email from '@/components/forgot-password/email';
import ResetPassword from '@/components/forgot-password/password';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

const ForgotPasswordPage: FC = () => {
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetErrorMessage, setResetErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { query } = useRouter();

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
            <div className='min-h-454 account-form'>
                <div className="container-fluid">
                    <h1 className="h4 text-center fw-600 text_black_secondary">My Account</h1>
                    <div className="row gy-4 gy-md-5 mt-0 justify-content-center justify-content-sm-start">
                        <div className="col-12">
                            {((errorMessage && !isSubmitting) || (resetErrorMessage && !isSubmitting)) && (
                                <div
                                    className="alert alert-danger  d-flex align-items-center"
                                    role="alert"
                                    style={{ height: '55px', borderRadius: '0' }}
                                >
                                    <svg
                                        className="bi flex-shrink-0 me-2"
                                        role="img"
                                        aria-label="Danger:"
                                        style={{ width: '20px' }}
                                    >
                                        <use xlinkHref="#exclamation-triangle-fill" />
                                    </svg>
                                    <div style={{ fontSize: '13px', lineHeight: '24px' }}>
                                        {query.token ? resetErrorMessage : errorMessage}
                                    </div>
                                </div>
                            )}
                            {(success || resetSuccess) && (
                                <div
                                    className="alert alert-success  d-flex align-items-center"
                                    role="alert"
                                    style={{ height: '55px', borderRadius: '0' }}
                                >
                                    <svg
                                        className="bi flex-shrink-0 me-2"
                                        role="img"
                                        aria-label="Success:"
                                        style={{ width: '20px' }}
                                    >
                                        <use xlinkHref="#check-circle-fill" />
                                    </svg>
                                    <div style={{ fontSize: '13px', lineHeight: '24px' }}>
                                        {query.token
                                            ? 'Your password is changed!'
                                            : 'Please check your mail. (If you not get then check over spam.)'}
                                    </div>
                                </div>
                            )}

                            {!query.token && (
                                <p className="lost_text mb-20">
                                    {success
                                        ? 'A password reset email has been sent to the email address on file for your account, but may take several minutes to show up in your inbox. Please wait at least 10 minutes before attempting another reset.'
                                        : 'Lost your password? Please enter your Email address. You will receive a link to create a new password via email.'}
                                </p>
                            )}

                            {!query.token && !success && (
                                <Email
                                    setSuccess={setSuccess}
                                    setErrorMessage={setErrorMessage}
                                    isSubmitting={isSubmitting}
                                    setIsSubmitting={setIsSubmitting}
                                />
                            )}
                            {query.token && (
                                <ResetPassword
                                    setResetSuccess={setResetSuccess}
                                    setResetErrorMessage={setResetErrorMessage}
                                    isSubmitting={isSubmitting}
                                    setIsSubmitting={setIsSubmitting}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps = withSsrProps({
    onlyGuest: true,
});

export default ForgotPasswordPage;

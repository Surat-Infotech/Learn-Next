import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState, type HTMLAttributes } from 'react';

import clsx from 'clsx';
import { object, string } from 'yup';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from '@/components/ui/input/input';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

const fields = {
    email: 'Email address',
    password: 'Password',
};

const defaultValues = {
    email: '',
    password: '',
};

export type ILoginFormProps = HTMLAttributes<HTMLFormElement>;

const MyAccontLoginForm: FC<ILoginFormProps> = (props) => {
    const { className, ...other } = props;
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { push } = useRouter();

    const schema = object().shape({
        email: string().required().email().trim().max(100).label(fields.email),
        password: string().required().trim().min(6).max(50).label(fields.password),
    });

    const { control, handleSubmit } = useForm({
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
                    push(paths.order.root);
                    window.location.reload();
                }, 800);
            }

            if (!response?.ok) {
                setError('The username or password you entered is incorrect.');
            }
        } catch (e) {
            setError(e.response.data.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={clsx(className)} {...other}>
                <h1 className="h4 fw-600 text_black_secondary mb_10">Login</h1>
                <Input
                    label={fields.email}
                    name="email"
                    className="custom-mantine-Input-input form-group"
                    control={control}
                    withAsterisk
                />
                <Input
                    className="custom-mantine-Input-input form-group"
                    label={fields.password}
                    name="password"
                    type="password"
                    control={control}
                    withAsterisk
                />
                <div className="d-flex align-items-start align-items-sm-center flex-column flex-sm-row gap-2">
                    <button type="submit" className="common_btn me-0" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <div className="spinner-border text-light sm_auth_loader" role="status">
                                <span className="visually-hidden ">Loading...</span>
                            </div>
                        ) : (
                            'LOGIN'
                        )}
                    </button>
                    <span className="lost_text">
                        Lost your password?
                        <Link
                            href={paths.lostPassword.root}
                            className="ps-1 text-decoration-none forgot_password_link"
                        >
                            Remaind password
                        </Link>
                    </span>
                </div>
            </form>
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
                    <div>Login successfully!!</div>
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
                    <div>{error}</div>
                </div>
            )}
        </>
    );
};

export default MyAccontLoginForm;

import { FC } from 'react';

import { withSsrProps } from '@/utils/page';

import { AuthView } from '@/sections/auth/view';

// ----------------------------------------------------------------------

const AuthPage: FC = () => <AuthView />;

export const getServerSideProps = withSsrProps({
  onlyGuest: true,
});

export default AuthPage;

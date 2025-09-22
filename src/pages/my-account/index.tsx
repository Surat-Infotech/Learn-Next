import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { withSsrProps } from '@/utils/page';

import { paths } from '@/routes/paths';

const ProfilePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(paths.order.root);
  }, [router]);

  return null;
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default ProfilePage;

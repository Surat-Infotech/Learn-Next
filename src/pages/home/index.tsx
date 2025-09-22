import { withSsrProps } from '@/utils/page';

import { HomePageList } from '@/sections/home/view';

export default function HomePage() {
  return <HomePageList />;
}

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

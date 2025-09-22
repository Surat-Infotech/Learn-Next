import { Metadata } from 'next';
import { withSsrProps } from '@/utils/page';
import { HomePageList } from '@/sections/home/view';
 
export const metadata: Metadata = {
  title: 'Invoices | Acme Dashboard',
};

export default function HomePage() {
  return <HomePageList />;
}

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

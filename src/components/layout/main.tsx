import { FC, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

import NextProgress from 'next-progress';

import { Footer } from '../footer';
import { Header } from '../header';
import CheckOutFooter from '../footer/CheckOutFooter';
import CheckOutHeader from '../header/CheckOutHeader';
import { ScrollToTopButton } from '../ui/smoothScroll';

type MainLayoutProps = {
    children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const { query } = useRouter();

    const isCheckoutPage = query.order_no ? false : pathname?.includes('/checkout');
    const isAuthPage = pathname?.startsWith('/auth');

    return (
        <>
            <NextProgress delay={300} color="#78c8f7" height={3.5} options={{ showSpinner: false }} />

            {isCheckoutPage ? <CheckOutHeader /> : !isAuthPage && <Header />}

            {children}
            <ScrollToTopButton />
            {isCheckoutPage ? <CheckOutFooter /> : !isAuthPage && <Footer />}
        </>
    );
};

export default MainLayout;

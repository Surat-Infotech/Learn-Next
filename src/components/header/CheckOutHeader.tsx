import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useDisclosure } from '@mantine/hooks';

import LogoImg from '@/assets/image/logo/loosegrowndiamond_logo.svg';

import NavModal from './mobile-menu/NavModal';
import AnnouncementBar from './AnnouncementBar';

// ----------------------------------------------------------------------

export type IHeaderProps = {};

const CheckOutHeader: FC<IHeaderProps> = () => {
  const [modalOpened, { close: closeModal }] = useDisclosure(false);

  return (
    <>
      <AnnouncementBar />

      <header className="header_wrap">
        <nav className="container-fluid">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ height: '66px' }}
          >
            {/* Brand logo */}
            <Link className="" href="/">
              <Image src={LogoImg} alt="loosegrowndiamond_logo" priority />
            </Link>
            <p className="mb-0 nedd_help_header_text">
              Need help?{' '}
              <a href="tel:6462880810 " className="header_number text-decoration-none">
                {' '}
                1-646-288-0810{' '}
              </a>
            </p>

            {/* Menu toggle for small device */}
            {/* <button
              className="navbar-toggler p-0 border-0 shadow-none"
              type="button"
              onClick={openModal}
            >
              <span className="navbar-toggler-icon" />
            </button> */}
          </div>
        </nav>
      </header>

      <NavModal zIndex="1100" opened={modalOpened} onClose={closeModal} />
    </>
  );
};

export default CheckOutHeader;

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signOut } from 'next-auth/react';

import { Button } from '@mantine/core';

import { paths } from '@/routes/paths';

const ProfileSidebar = () => {
  const pathname = usePathname();
  const isActiveAddress = () => pathname.startsWith('/my-account/address');
  const isActiveOrder = () => pathname.startsWith('/my-account/orders') || pathname.startsWith('/my-account/view-order');
  return (
    <div className="account-tabs">
      <Link className={`tab ${isActiveOrder() ? 'active' : ''}`} href={paths.order.root}>
        orders
      </Link>
      <Link
        className={`tab ${pathname === '/my-account/wishlist' ? 'active' : ''}`}
        href={paths.wishlist.root}
      >
        Wishlist
      </Link>
      <Link className={`tab ${isActiveAddress() ? 'active' : ''}`} href={paths.address.root}>
        Addresses
      </Link>
      <Link
        className={`tab ${pathname === '/my-account/account' ? 'active' : ''}`}
        href={paths.account.root}
      >
        Account Details
      </Link>
      <Link
        className={`tab ${pathname === '/my-account/password-change' ? 'active' : ''}`}
        href={paths.passwordChange.root}
      >
        Password Change
      </Link>
      <Button
        type="button"
        className="tab"
        onClick={() => { signOut({ callbackUrl: paths.order.root }); localStorage.clear(); }}
      >
        Logout
      </Button>
    </div>
  );
};

export default ProfileSidebar;

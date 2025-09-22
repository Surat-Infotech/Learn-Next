import Link from 'next/link';
import Image from 'next/image';

import { paths } from '@/routes/paths';
import BannerImg from '@/assets/image/banner_md.svg';

export default function HomePageBannerSection() {
  return (
    <div className="banner_section">
      <div className="bg_img">
        <div className="container-fluid">
          <div className="banner_text text-center">
            <h1 className="mb-0">
              Beautiful, Certified <br className="d-block d-sm-none" /> Lab <br className="d-none d-md-block" /> Grown Diamonds
            </h1>
            <h4 className="fw-400 mb-0">Mining free. Direct to you. No middlemen</h4>
            <div className="d-flex align-items-center justify-content-center flex-wrap gap-3">
              <Link href={`${paths.whiteDiamondInventory.root}`} className="common_btn banner-btn">
                Shop Lab Grown Diamonds
              </Link>
              <Link href={`${paths.buildRing.root}`} className="common_btn banner-btn">
                Shop Engagement Rings
              </Link>
            </div>
          </div>
          <Image src={BannerImg} alt="banner_md" className="d-block d-lg-none mx-auto mt-4" />
        </div>
      </div>
      <div className="ls_btmheader text-center">Buy now, pay later with affirm.</div>
    </div>
  );
}

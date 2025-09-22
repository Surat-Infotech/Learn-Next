import Link from 'next/link';
import Image from 'next/image';

import { paths } from '@/routes/paths';
import EngagementRing1Img from '@/assets/image/engagement_rings_1.png';
import EngagementRing2Img from '@/assets/image/engagement_rings_2.png';

export default function HomePageShopEngagementRing() {
  return (
    <div className="section">
      <div className="container-fluid">
        <h4 className="text-center mb_40">SHOP ENGAGEMENT RINGS</h4>
        <div className="row">
          <div className="col-6">
            <Link
              href={`${paths.whiteDiamondInventory.root}?type=diamond-to-ring-builder`}
              className="engagement_rings text-decoration-none"
            >
              <Image
                src={EngagementRing1Img}
                alt="engagement_rings_1"
                className="img-fluid mb-2 mb-md-4"
              />
              <p className="fw-600 mb-0 cursor-pointer d-inline-block text-uppercase ">
                Start with Diamond
              </p>
            </Link>
          </div>
          <div className="col-6">
            <Link
              href={`${paths.buildRing.root}`}
              className="engagement_rings text-decoration-none"
            >
              <Image
                src={EngagementRing2Img}
                alt="engagement_2"
                className="img-fluid mb-2 mb-md-4"
              />
              <p className="fw-600 mb-0 cursor-pointer d-inline-block text-uppercase ">
                Start with Setting
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

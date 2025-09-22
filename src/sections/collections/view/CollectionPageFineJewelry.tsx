
import EarringsImg from '@/assets/image/collection-page/shop-jewelry-category-2.png';
import PendantsImg from '@/assets/image/collection-page/shop-jewelry-category-5.png';
import BraceletsImg from '@/assets/image/collection-page/shop-jewelry-category-4.png';
import NecklacesImg from '@/assets/image/collection-page/shop-jewelry-category-6.png';
import WeddingRingsImg from '@/assets/image/collection-page/shop-jewelry-category-3.png';
import EngagementRingImg from '@/assets/image/collection-page/shop-jewelry-category-1.png';

import FineJewelry from './FineJewelry';

const EngagementRingData = [
  {
    id: 1,
    name: 'Engagement Rings',
    link: '/build-a-ring ',
    img: {
      src: EngagementRingImg,
      alt: 'EngagementRingImg',
    },
  },
  {
    id: 2,
    name: 'Earrings',
    link: '/earrings',
    img: {
      src: EarringsImg,
      alt: 'EarringsImg',
    },
  },
  {
    id: 3,
    name: 'Wedding Rings',
    link: '/wedding-rings',
    img: {
      src: WeddingRingsImg,
      alt: 'WeddingRingsImg',
    },
  },
  {
    id: 4,
    name: 'Bracelets',
    link: '/bracelets',
    img: {
      src: BraceletsImg,
      alt: 'BraceletsImg',
    },
  },
  {
    id: 5,
    name: 'Pendants',
    link: '/pendants',
    img: {
      src: PendantsImg,
      alt: 'PendantsImg',
    },
  },
  {
    id: 6,
    name: 'Necklaces',
    link: '/necklaces',
    img: {
      src: NecklacesImg,
      alt: 'NecklacesImg',
    },
  },
];

export default function CollectionPageFineJewelry() {
  return (
    <div className="section">
      <div className="container-fluid">
        <h4 className="engagement-heading text_black_secondary mb_40 text-center lh-base text-capitalize">
          Shop Jewelry by Category
        </h4>
        <div className="row justify-content-center row_gap_50 px-12 px-xl-0">
          {EngagementRingData.map((engagementRing) => (
            <FineJewelry key={engagementRing.id} {...engagementRing} />
          ))}
        </div>
      </div>
    </div>
  );
}

import EarringsImg from '@/assets/image/earrings.png';
import PendantsImg from '@/assets/image/pendants.png';
import NecklacesImg from '@/assets/image/necklaces.png';
import BraceletsImg from '@/assets/image/bracelets.png';
import WeddingRingImg from '@/assets/image/wedding_rings.png';
import CustomJewelleryImg from '@/assets/image/custom_jewellery.png';

import FineJewellery from './FineJewellery';

const FineJewelleryData = [
  {
    id: 1,
    name: 'Wedding Rings',
    slug: 'wedding-rings',
    img: {
      src: WeddingRingImg,
      alt: 'wedding_rings',
    },
  },
  {
    id: 2,
    name: 'Necklaces',
    slug: 'necklaces',
    img: {
      src: NecklacesImg,
      alt: 'Necklaces',
    },
  },
  {
    id: 3,
    name: 'Earrings',
    slug: 'earrings',
    img: {
      src: EarringsImg,
      alt: 'Earrings',
    },
  },
  {
    id: 4,
    name: 'Bracelets',
    slug: 'bracelets',
    img: {
      src: BraceletsImg,
      alt: 'bracelets',
    },
  },
  {
    id: 5,
    name: 'Pendants',
    slug: 'pendants',
    img: {
      src: PendantsImg,
      alt: 'pendants',
    },
  },
  {
    id: 6,
    name: 'Custom Fine Jewelry',
    // slug:'',
    img: {
      src: CustomJewelleryImg,
      alt: 'custom_Jewelry',
    },
  },
];
export default function HomePageFineJewellery() {
  return (
    <div className="section">
      <div className="container-fluid">
        <h4 className="text-center text-uppercase lc mb_40">Fine jewelry</h4>
        <div className="row row_gap_60 px-12 px-xl-0">
          {FineJewelleryData.map((fineJewellery) => (
            <FineJewellery key={fineJewellery.id} {...fineJewellery} />
          ))}
        </div>
      </div>
    </div>
  );
}

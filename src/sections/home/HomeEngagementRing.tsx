import HaloImg from '@/assets/image/halo.png';
import BezelImg from '@/assets/image/bezel.png';
import UniqueImg from '@/assets/image/unique.png';
import DainatyImg from '@/assets/image/dainty.png';
import ClusterImg from '@/assets/image/cluster.png';
import SolitaireImg from '@/assets/image/solitaire.png';
import ThreeStoneImg from '@/assets/image/three_stone.png';
import HiddenHaloImg from '@/assets/image/hidden_halo.png';
import DiamondBandImg from '@/assets/image/diamond_band.png';
import VintageInspiredImg from '@/assets/image/vintage_inspired.png';

import EngagementRing from './EngagementRing';

const EngagementRingData = [
  {
    id: 1,
    name: 'Solitaire',
    slug: 'solitaire',
    img: {
      src: SolitaireImg,
      alt: 'Solitaire',
    },
  },
  {
    id: 2,
    name: 'Halo',
    slug: 'halo',
    img: {
      src: HaloImg,
      alt: 'Halo',
    },
  },
  {
    id: 3,
    name: 'Bezel',
    slug: 'bezel',
    img: {
      src: BezelImg,
      alt: 'Bezel',
    },
  },
  {
    id: 4,
    name: 'Cluster',
    slug: 'cluster',
    img: {
      src: ClusterImg,
      alt: 'Cluster',
    },
  },
  {
    id: 5,
    name: 'Three Stone',
    slug: 'three-stone',
    img: {
      src: ThreeStoneImg,
      alt: 'ThreeStone',
    },
  },
  {
    id: 6,
    name: 'Diamond Band',
    slug: 'diamond-band',
    img: {
      src: DiamondBandImg,
      alt: 'DiamondBand',
    },
  },
  {
    id: 7,
    name: 'Unique',
    slug: 'unique',
    img: {
      src: UniqueImg,
      alt: 'UniqueImg',
    },
  },
  {
    id: 8,
    name: 'Hidden Halo',
    slug: 'hidden-halo',
    img: {
      src: HiddenHaloImg,
      alt: 'HiddenHalo',
    },
  },
  {
    id: 9,
    name: 'Dainty',
    slug: 'dainty',
    img: {
      src: DainatyImg,
      alt: 'Dainty',
    },
  },
  {
    id: 10,
    name: 'Vintage Inspired',
    slug: 'vintage-inspired',
    img: {
      src: VintageInspiredImg,
      alt: 'VintageInspired',
    },
  },
];
export default function HomePageEngagementRing() {
  return (
    <div className="section pt-0">
      <div className="container-fluid">
        <h1 className="engagement-heading font_literata text_black_secondary text-center mb-4 mb-md-5 lh-base text-capitalize">
          Engagement rings by style
        </h1>
        <div className="row justify-content-center row_gap_50 px-12 px-xl-0">
          {EngagementRingData.map((engagementRing) => (
            <EngagementRing key={engagementRing.id} {...engagementRing} />
          ))}
        </div>
      </div>
    </div>
  );
}

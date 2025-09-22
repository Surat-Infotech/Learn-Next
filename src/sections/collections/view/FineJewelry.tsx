import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type FineJewelryType = {
  name: string;
  link: string;
  img: {
    src: any;
    alt: string;
  };
};

const FineJewelry: FC<FineJewelryType> = (props) => {
  const { name, img, link } = props;
  return (
    <div className="col-lg-2 col-md-3 col-sm-4 col-6">
      <Link href={link} className="text-decoration-none">
        <div className="mb-lg-0 engagement_ring_section">
          <Image src={img.src} alt={img.alt} className="w-100" />
        </div>
        <p className="fw-600 text-center engagement_ring_name text-uppercase">{name}</p>
      </Link>
    </div>
  );
};

export default FineJewelry;

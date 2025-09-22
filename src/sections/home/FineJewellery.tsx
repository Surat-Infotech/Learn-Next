/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useDisclosure } from '@mantine/hooks';

import ProductCustomSettingModal from '@/components/product/ProductCustomSettingModal';

import { paths } from '@/routes/paths';

type FineJewelleryType = {
  name: string;
  slug?: string | undefined | null;
  img: {
    src: any;
    alt: string;
  };
};

const FineJewellery: FC<FineJewelleryType> = (props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const { name, img, slug } = props;
  return (
    <div className="col-md-4 col-6 ">
      {slug ? (
        <Link
          href={`/${slug}`}
          className="text-decoration-none pointer"
        >
          <div className="fine_jewellery">
            <Image src={img.src} alt={img.alt} />
          </div>
          <p className=" mb-0 fine_jewelery_name fw-600 text-uppercase  ">{name}</p>
        </Link>
      ) : (
        <>
          <div onClick={open} className="pointer">
            <div className="fine_jewellery">
              <Image src={img.src} alt={img.alt} />
            </div>
            <p className="mb-0 fine_jewelery_name fw-600 text-uppercase ">{name}</p>
          </div>
          <ProductCustomSettingModal opened={opened} onClose={close} size="55%" />
        </>
      )}
    </div>
  );
};

export default FineJewellery;

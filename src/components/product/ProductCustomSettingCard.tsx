/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Image from 'next/image';
import { FC, HTMLAttributes } from 'react';

import clsx from 'clsx';

import { useDisclosure } from '@mantine/hooks';

import customImage from '@/assets/image/custome-1.png';
import custom2Image from '@/assets/image/custome-2.png';
import custom3Image from '@/assets/image/custome-3.png';

import ProductCustomSettingModal from './ProductCustomSettingModal';

// ----------------------------------------------------------------------

export type IProductCustomSettingCardProps = HTMLAttributes<HTMLDivElement> & {
  randomNum: number;
};

const ProductCustomSettingCard: FC<IProductCustomSettingCardProps> = (props) => {
  const { randomNum, className, ...other } = props;
  const Images = [customImage, custom2Image, custom3Image];
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {/* <div className={clsx('col-md-3 col-6', className)} {...other}>
        <div className="pcat_bg">
          <h4 className="text-center">Looking For Custom Setting?</h4>
          <button type="button" className="btn" onClick={open}>
            Yes, Please
          </button>
        </div>
      </div> */}
      <div className={clsx('col-lg-3 col-md-4 col-6', className)} {...other}>
        <div className="custome_setting_card" onClick={open}>
          <Image src={Images[randomNum]} alt="card-image" className="img-fluid" />
          <div>
            <h4 className="text-center">Looking For Custom Setting?</h4>
            <button type="button" className="btn">
              Yes, Please
            </button>
          </div>
        </div>
      </div>

      <ProductCustomSettingModal opened={opened} onClose={close} size="55%" />
    </>
  );
};

export default ProductCustomSettingCard;

import { FC } from 'react';
import Image from 'next/image';

type FeatureDataType = {
  img: {
    src: any;
    alt: string;
  };
};

const FeatureData: FC<FeatureDataType> = (props) => {
  const { img } = props;
  return (
    <div>
      <Image src={img.src} alt={img.alt} className="img-fluid" />
    </div>
  );
};

export default FeatureData;

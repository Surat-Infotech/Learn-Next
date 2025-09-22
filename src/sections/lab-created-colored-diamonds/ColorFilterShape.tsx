import { useRouter } from 'next/router';
import { FC, ChangeEvent } from 'react';

import clsx from 'clsx';

import { useInventoryContext } from '@/stores/inventory.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

// ----------------------------------------------------------------------

export type FilterShapeProps = {
  value: string[];
  setValue: (value: string[]) => void;
  //
  label: string;
  defaultValue: string;
  htmlFor: string;
  name: string;
  id: string;
  img: {
    src: string;
    alt: string;
  };
};

const ColorFilterShape: FC<FilterShapeProps> = (props) => {
  const { value, setValue, defaultValue, htmlFor, id, name, img, label } = props;
  const { setKeepSkuuSearch, setNotFetchFilter, setIsFilterLoading } = useInventoryContext();

  const { query } = useRouter();
  const { ringSetting, ringDiamond } = useRingBuilderContext();

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target;
    if (query.skuu && query.shape && Object.keys(query).length === 2) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setKeepSkuuSearch(false);
    setNotFetchFilter(false);
    setIsFilterLoading(true);
    if (value?.includes(newValue)) {
      setValue(value?.filter((item) => item !== newValue));
    } else {
      setValue([...(value as any), newValue]);
    }
  };

  return (
    <label
      className={clsx('shape-box', !!(query.shape && query.type) && 'pointer-event-none')}
      htmlFor={`shape-${htmlFor}`}
    >
      <input
        type="checkbox"
        name={name}
        defaultValue={defaultValue}
        id={`shape-${id}`}
        className="checkbox"
        checked={value?.includes(defaultValue)}
        onChange={handleCheckbox}
        disabled={
          (query.c_type || query.type) &&
          (ringDiamond?.diamond?.shape ?? ringSetting?.product?.diamond_type?.slug) &&
          (query.shape ??
            ringSetting?.product?.diamond_type?.slug ??
            ringDiamond?.diamond?.shape) !== defaultValue
        }
      />
      <img
        src={img.src}
        alt={img.alt}
        className={clsx(
          'shape-image',
          (query.c_type || query.type) &&
            (ringDiamond?.diamond?.shape ?? ringSetting?.product?.diamond_type?.slug) &&
            (query.shape ??
              ringSetting?.product?.diamond_type?.slug ??
              ringDiamond?.diamond?.shape) !== defaultValue &&
            'opacity-25'
        )}
      />
      <p style={{ lineHeight: '10px' }}>{label}</p>
    </label>
  );
};

export default ColorFilterShape;

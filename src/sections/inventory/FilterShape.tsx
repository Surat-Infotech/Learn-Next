import { useRouter } from 'next/router';
import { FC, useMemo, ChangeEvent } from 'react';

import clsx from 'clsx';

import { useRingBuilderContext } from '@/stores/ring-builder.context';

// ----------------------------------------------------------------------

export type FilterShapeProps = {
  value: string[];
  setValue: (value: string[]) => void;
  setKeepSkuuSearch?: any;
  shapeMatch?: string;
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

const FilterShape: FC<FilterShapeProps> = (props) => {
  const {
    value,
    setValue,
    defaultValue,
    htmlFor,
    id,
    name,
    img,
    label,
    setKeepSkuuSearch,
    shapeMatch,
  } = props;
  const { query } = useRouter();
  const { ringSetting, ringDiamond } = useRingBuilderContext();

  const _selected_shape =
    ringSetting?.product?.diamond_type?.slug ||
    ringSetting?.product?.diamond_type?.[0]?.slug ||
    ringDiamond?.diamond?.shape;

  const isShowChooseRing = useMemo(() => {
    // for collection inventory page
    // if (!query.c_type) return true;
    if (query.c_type && _selected_shape === (query.shape || shapeMatch)) return true;
    if (query.c_type && !shapeMatch) return true;
    return false;
  }, [_selected_shape, query.c_type, query.shape, shapeMatch]);

  if (query.type) {
    setValue(value);
    if (query.skuu) setKeepSkuuSearch(true);
  }

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target;
    if (value.includes(newValue)) {
      setValue(value.filter((item) => item !== newValue));
    } else {
      setValue([...value, newValue]);
    }
  };

  const __shape =
    ringSetting?.product?.diamond_type?.slug || ringSetting?.product?.diamond_type?.[0]?.slug;

  return (
    <label
      className={clsx(
        'shape-box',
        query.type && (ringDiamond?.diamond?.shape ?? __shape) && 'pointer-event-none',
        isShowChooseRing &&
          _selected_shape &&
          defaultValue &&
          (_selected_shape !== defaultValue || _selected_shape === defaultValue) &&
          'pointer-event-none'
      )}
      htmlFor={htmlFor}
    >
      <input
        type="checkbox"
        name={name}
        defaultValue={defaultValue}
        id={id}
        className="checkbox"
        checked={value?.includes(defaultValue)}
        onChange={handleCheckbox}
        disabled={
          isShowChooseRing && _selected_shape && defaultValue && _selected_shape === defaultValue
            ? false
            : query.type &&
              (ringDiamond?.diamond?.shape ?? __shape) &&
              (query.shape ?? __shape ?? ringDiamond?.diamond?.shape) !== defaultValue
        }
      />
      <img
        src={img.src}
        alt={img.alt}
        className={clsx(
          'shape-image',
          isShowChooseRing && _selected_shape && defaultValue && _selected_shape !== defaultValue
            ? 'opacity-25'
            : query.type &&
                (ringDiamond?.diamond?.shape ?? __shape) &&
                (query.shape ?? __shape ?? ringDiamond?.diamond?.shape) !== defaultValue &&
                'opacity-25'
        )}
      />
      <p style={{ lineHeight: '10px' }}>{label}</p>
    </label>
  );
};

export default FilterShape;

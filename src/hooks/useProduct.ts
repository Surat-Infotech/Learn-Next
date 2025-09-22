import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { trim, forEach } from 'lodash';

import { parseNumbersInString, useSearchParamsState } from '@/utils/query-string';

export const priceFilters = { min: 100, max: 10000 };

export const useProduct = () => {
  const { push, query } = useRouter();

  const styleFilters = [
    { label: 'Bezel', value: 'bezel' },
    { label: 'Cluster', value: 'cluster' },
    { label: 'Dainty', value: 'dainty' },
    { label: 'Diamond Band', value: 'diamond-band' },
    { label: 'Halo', value: 'halo' },
    { label: 'Hidden Halo', value: 'hidden-halo' },
    { label: 'Solitaire', value: 'solitaire' },
    { label: 'Three Stone', value: 'three-stone' },
    { label: 'Unique', value: 'unique' },
    { label: 'Vintage Inspired', value: 'vintage-inspired' },
  ];

  const shapeFilters = [
    { label: 'Asscher', value: 'asscher' },
    { label: 'Cushion', value: 'cushion' },
    { label: 'Emerald', value: 'emerald' },
    { label: 'Heart', value: 'heart' },
    { label: 'Marquise', value: 'marquise' },
    { label: 'Oval', value: 'oval' },
    { label: 'Pear', value: 'pear' },
    { label: 'Princess', value: 'princess' },
    { label: 'Radiant', value: 'radiant' },
    { label: 'Round', value: 'round' },
  ];

  const [style, setStyle] = useSearchParamsState('style', '', {
    serialize: (i) => trim(i),
    deserialize: (i) => trim(i ?? ''),
  });
  const [shape, setShape] = useSearchParamsState('shape', '', {
    serialize: (i) => trim(i),
    deserialize: (i) => trim(i ?? ''),
  });
  const [price, setPrice] = useSearchParamsState<number[]>(
    'price',
    [priceFilters.min, priceFilters.max],
    {
      serialize: (input) => input.join(','),
      deserialize: (input) => parseNumbersInString(input),
    }
  );

  const selectedFilters = useMemo(
    () => ({
      style,
      shape,
      price,
    }),
    [style, shape, price]
  );

  const resetFilters = (opt: { style?: boolean; shape?: boolean; price?: boolean }) => {
    const newQuery: {
      [x: string]: string | string[] | undefined;
    } = { ...query };

    forEach(selectedFilters, (v, key) => {
      if (opt && opt[key as keyof typeof opt] === true) {
        delete newQuery[key];
      }
    });

    push({ query: newQuery }, undefined, { shallow: true });
  };

  return {
    styleFilters,
    shapeFilters,
    priceFilters,
    style,
    setStyle,
    shape,
    setShape,
    price,
    setPrice,
    resetFilters,
  };
};

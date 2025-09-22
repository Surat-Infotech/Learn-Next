'use client';

import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import constate from 'constate';
import { isEmpty, debounce } from 'lodash';
import { useLocalStorage } from 'usehooks-ts';

// eslint-disable-next-line import/no-cycle
import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { paths } from '@/routes/paths';
import { IAppliedFilter } from '@/types';

import { useRingBuilderContext } from './ring-builder.context';

function cleanString(input: any) {
  if (typeof input !== 'string') return undefined;
  // Check if input starts with 'LGD-' or 'lgd-'
  if (/^(LGD13-|lgd13-|LGD14-|lgd14-|LGD-|lgd-)/.test(input)) {
    return input.trim();
  }
  // eslint-disable-next-line no-else-return
  else {
    return input.trim().replace(/^[A-Za-z-]+/, '');
  }
}

type Range = {
  min: number;
  max: number;
};

type IFilterRangeProperties = {
  carat: Range;
  depth: Range;
  lw_ratio: Range;
  price: Range;
  table: Range;
};

const useInventory = () => {
  const searchParams = useSearchParams();
  const { query } = useRouter();
  const {
    defaultSearch,
    defaultFilter,
    getRequestFilters,
    cutFilters,
    colorFilters,
    clarityFilters,
    certificateFilters,
    methodFilters,
    REAL_COLOR_OPTIONS,
    intensityFilters,
  } = useInventoryFilter();
  const { ringSetting, ringDiamond } = useRingBuilderContext();

  function convertAndReplaceVeryGood(input: string, target: string) {
    if (input.includes(target)) {
      const parts = target.split('-');
      const camelCase = parts
        .map((part: string, index: number) =>
          index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
        )
        .join('');
      return input.replace(target, camelCase);
    }
    return input;
  }

  const getRangeFromString = (value: string, valueFilter: any[], defaultArr: any[]) => {
    if (!value || typeof value !== 'string') {
      return defaultArr;
    }
    const labels = value.includes('very-good')
      ? convertAndReplaceVeryGood(value, 'very-good')?.split('-')
      : value?.toLocaleLowerCase()?.split('-');

    if (!Array.isArray(labels) || labels.length === 0) {
      return defaultArr;
    }

    const startIndex =
      valueFilter.findIndex(
        (filter: any) =>
          (value.includes('very-good')
            ? filter.convertedURL
            : filter.url_view?.toLocaleLowerCase()) === labels?.[0]
      ) + 1;

    // eslint-disable-next-line no-restricted-syntax
    for (const label of labels) {
      const labelIndex = valueFilter.findIndex(
        (filter: any) =>
          (value.includes('very-good')
            ? filter.convertedURL
            : filter.url_view?.toLocaleLowerCase()) === label
      );
      if (labelIndex === -1) {
        return defaultArr;
      }
    }

    // eslint-disable-next-line no-unsafe-optional-chaining
    const endIndex = startIndex + labels?.length;

    if (startIndex <= 0 || endIndex <= 0) {
      return defaultArr;
    }

    return [startIndex, endIndex];
  };

  const getRangeFromStringForCheckBox = (
    value: string,
    valueFilter: any[],
    defaultArr: any[],
    returnInArray: boolean
  ) => {
    if (!value || typeof value !== 'string') {
      return defaultArr;
    }

    const labels = value?.toLocaleLowerCase()?.split('-');

    if (!Array.isArray(labels) || labels.length === 0) {
      return defaultArr;
    }

    const digitArr: number[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const label of labels) {
      const index = valueFilter.findIndex(
        (filter: any) => filter.url_view?.toLocaleLowerCase() === label.toLocaleLowerCase()
      );
      if (index !== -1) {
        digitArr.push(index + 1);
      }
    }

    return returnInArray ? digitArr : digitArr?.[0];
  };

  const getArrToString = (valueFilters: any[], value: number[]) => {
    const labelArr: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const i of value) {
      const label = valueFilters[i - 1]?.url_view;
      if (label) {
        labelArr.push(label);
      }
    }
    return labelArr?.map(String)?.join('-');
  };

  const router = useRouter();
  const [range, setRange] = useState<IFilterRangeProperties>({
    carat: {
      min: 0,
      max: 35,
    },
    depth: {
      min: 46,
      max: 78,
    },
    lw_ratio: {
      min: 1,
      max: 2.75,
    },
    price: {
      min: 100,
      max: 100000,
    },
    table: {
      min: 50,
      max: 80,
    },
  });
  const [searchText, setSearchText] = useState(
    cleanString(searchParams.get('sku')) || defaultSearch
  );
  const [expressShipping, setExpressShipping] = useState<any>(
    searchParams.get('express') === 'true' ? true : defaultFilter.express_shipping
  );
  const [overNight, setOverNight] = useState<any>(
    searchParams.get('overnight') === 'true' ? true : defaultFilter.is_overnight
  );
  const [heartsAndArrows, setHeartsAndArrows] = useState(
    searchParams.get('heartsandarrows') === 'true' ? true : defaultFilter.hearts_and_arrows
  );
  const [shape, setShape] = useState<string[]>(
    searchParams.getAll('shape')?.[0]?.split('-').length > 0
      ? (searchParams.getAll('shape')?.[0]?.split('-').map(String) as [string, string])
      : (defaultFilter.shape as any)
  );
  const [colors, setColors] = useState(
    getRangeFromStringForCheckBox(
      searchParams.getAll('colored')?.[0],
      REAL_COLOR_OPTIONS,
      defaultFilter.colors as any,
      false
    ) || defaultFilter.colors
  );
  const [price, setPrice] = useState<[number, number]>(
    searchParams.getAll('price')?.[0]?.split('-').length > 0
      ? (searchParams.getAll('price')?.[0]?.split('-').map(Number) as [number, number])
      : (defaultFilter.price as any)
  );
  const [carat, setCarat] = useState<[number, number]>(
    searchParams.getAll('carat')?.[0]?.split('-').length > 0
      ? (searchParams.getAll('carat')?.[0]?.split('-').map(Number) as [number, number])
      : (defaultFilter.carat as any)
  );
  const [cut, setCut] = useState(
    getRangeFromString(searchParams.getAll('cut')?.[0], cutFilters, defaultFilter.cut) ||
    (defaultFilter.cut as any)
  );
  const [color, setColor] = useState(
    getRangeFromString(searchParams.getAll('color')?.[0], colorFilters, defaultFilter.color) ||
    (defaultFilter.color as any)
  );
  const [clarity, setClarity] = useState(
    getRangeFromString(
      searchParams.getAll('clarity')?.[0],
      clarityFilters,
      defaultFilter.clarity
    ) || (defaultFilter.clarity as any)
  );
  const [certificate, setCertificate] = useState(
    getRangeFromStringForCheckBox(
      searchParams.getAll('certificate')?.[0],
      certificateFilters,
      defaultFilter.certificate,
      true
    ) || (defaultFilter.certificate as any)
  );
  const [method, setMethod] = useState(
    getRangeFromStringForCheckBox(
      searchParams.getAll('method')?.[0],
      methodFilters,
      defaultFilter.method,
      true
    ) || (defaultFilter.method as any)
  );
  const [intensity, setIntensity] = useState(
    getRangeFromStringForCheckBox(
      searchParams.getAll('intensity')?.[0],
      intensityFilters,
      defaultFilter.intensity,
      true
    ) || (defaultFilter.intensity as any)
  );
  const [table, setTable] = useState<[number, number]>(
    searchParams.getAll('table')?.[0]?.split('-').length > 0
      ? (searchParams.getAll('table')?.[0]?.split('-').map(Number) as [number, number])
      : (defaultFilter.table as any)
  );
  const [depth, setDepth] = useState<[number, number]>(
    searchParams.getAll('depth')?.[0]?.split('-').length > 0
      ? (searchParams.getAll('depth')?.[0]?.split('-').map(Number) as [number, number])
      : (defaultFilter.depth as any)
  );
  const [lwratio, setLWRatio] = useState<[number, number]>(
    searchParams.getAll('lwratio')?.[0]?.split('-').length > 0
      ? (searchParams.getAll('lwratio')?.[0]?.split('-').map(Number) as [number, number])
      : (defaultFilter.lwratio as any)
  );
  const [totalDiamond, setTotalDiamond] = useState<number>(0);
  const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false);
  const [tableRowId, setTableRowId] = useState('');
  const [sort, setSort] = useState<{ [key: string]: 1 | -1 }>({});
  const [collectionSearchSku, setCollectionSearchSku] = useLocalStorage<string>(
    'collectionSearchSku',
    ''
  );
  const [keepSkuuSearch, setKeepSkuuSearch] = useState<boolean>(true);
  const [diamondCollectionReset, setDiamondCollectionReset] = useLocalStorage<boolean>(
    'diamondCollectionReset',
    false
  );
  const [notFetchFilter, setNotFetchFilter] = useState<boolean>(false);
  const [resetSearchText, setResetSearchText] = useState<boolean>(false);

  useEffect(() => {
    const {
      carat: _carat,
      depth: _depth,
      lw_ratio: _lw_ratio,
      price: _price,
      table: _table,
    } = range;
    const { pathname: _pathname } = window.location
    if (!(_pathname.includes(paths.collections.root) && _pathname.includes('price'))) {
      setPrice(
        searchParams.getAll('price')?.[0]?.split('-').length > 0
          ? (searchParams.getAll('price')?.[0]?.split('-').map(Number) as [number, number])
          : [_price.min, _price.max]
      );
    }
    if (!(_pathname.includes(paths.collections.root) && _pathname.includes('carat'))) {
      setCarat(
        searchParams.getAll('carat')?.[0]?.split('-').length > 0
          ? (searchParams.getAll('carat')?.[0]?.split('-').map(Number) as [number, number])
          : [_carat.min, _carat.max]
      );
    }
    setLWRatio(
      searchParams.getAll('lwratio')?.[0]?.split('-').length > 0
        ? (searchParams.getAll('lwratio')?.[0]?.split('-').map(Number) as [number, number])
        : [_lw_ratio.min, _lw_ratio.max]
    );
    setTable(
      searchParams.getAll('table')?.[0]?.split('-').length > 0
        ? (searchParams.getAll('table')?.[0]?.split('-').map(Number) as [number, number])
        : [_table.min, _table.max]
    );
    setDepth(
      searchParams.getAll('depth')?.[0]?.split('-').length > 0
        ? (searchParams.getAll('depth')?.[0]?.split('-').map(Number) as [number, number])
        : [_depth.min, _depth.max]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  useEffect(() => {
    if (shape === undefined || !shape || shape.includes('undefined') || shape === null) setShape([]);
  }, [setShape, shape]);

  const appliedFilters: IAppliedFilter = useMemo(
    () =>
      getRequestFilters(
        {
          shape,
          colors: colors as any,
          price,
          carat,
          cut,
          color,
          clarity,
          certificate,
          intensity,
          method,
          table,
          depth,
          lwratio,
          is_overnight: overNight,
          express_shipping: expressShipping,
          hearts_and_arrows: heartsAndArrows,
        },
        range
      ),
    [
      getRequestFilters,
      shape,
      colors,
      price,
      carat,
      cut,
      color,
      clarity,
      certificate,
      intensity,
      method,
      table,
      depth,
      lwratio,
      overNight,
      expressShipping,
      heartsAndArrows,
      range,
    ]
  );

  const isFilterApplied = useMemo(
    () => searchText !== '' || !isEmpty(appliedFilters) || !isEmpty(sort),
    [searchText, appliedFilters, sort]
  );

  const handleRemoveTableID = () => {
    setTableRowId('');

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('skuu');

    if (
      router.query.c_type &&
      typeof router.query.c_type === 'string' &&
      router.query.c_type.length > 0
    ) {
      newParams.set('c_type', router.query.c_type);
    }
    if (window.location.search.includes('c_type')) {
      newParams.set('c_type', router.query.c_type as string || 'diamond');
    }

    router.push(
      {
        pathname: window.location.pathname,
        query: Object.fromEntries(newParams.entries()),
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  function parseCollectionSlug(slug: string) {
    const caratMatch = slug.match(/(\d+(?:\.\d+)?)(?=-carat)/);
    const priceMatch = slug.match(/(\d+)-(\d+)-price/);
    const cutMatch = slug.match(/(good|very-good|excellent|ideal)(?=-cut)/);
    const certificateMatch = slug.match(/(igi|gia|gcal|non-certified|matching-pair)(?=-certified)/);
    const colorMatch = slug.match(/(m|l|k|j|i|h|g|f|e|d)(?=-color)/);
    const clarityMatch = slug.match(/(i2|i1|si3|si2|si1|vs2|vs1|vvs2|vvs1|if|fl)(?=-clarity)/);
    const shapeMatch = slug.match(
      /(round|princess|radiant|cushion|oval|emerald|pear|asscher|marquise|heart|rose-cut|old-european|half-moon|baguette-trapezoid|baguette|hexagon|kite|old-mine|trapezoid|triangular)(?=-shape)/
    );

    return {
      caratMatch: caratMatch ? caratMatch[1] : undefined,
      shapeMatch: shapeMatch ? shapeMatch[1] : undefined,
      cutMatch: cutMatch ? cutMatch[1] : undefined,
      colorMatch: colorMatch ? colorMatch[1] : undefined,
      clarityMatch: clarityMatch ? clarityMatch[1] : undefined,
      priceMatch: priceMatch ? [priceMatch[1], priceMatch[2]] : undefined,
      priceMatchMin: priceMatch ? priceMatch[1] : undefined,
      priceMatchMax: priceMatch ? priceMatch[2] : undefined,
      certificateMatch: certificateMatch ? certificateMatch[1] : undefined,
    };
  }

  const {
    caratMatch,
    shapeMatch,
    priceMatch,
    priceMatchMin,
    priceMatchMax,
    cutMatch,
    colorMatch,
    clarityMatch,
    certificateMatch,
  } = parseCollectionSlug((query.Slug as string) || '');

  const certifiedCollectionIndex =
    certificateFilters.findIndex(
      (filter: any) =>
        filter.url_view === certificateMatch?.toLocaleUpperCase().replaceAll('-', '_')
    ) + 1;

  const _selected_shape =
    ringSetting?.product?.diamond_type?.slug ||
    ringSetting?.product?.diamond_type?.[0]?.slug ||
    ringDiamond?.diamond?.shape;

  const isShowChooseRing = useMemo(() => {
    // if (!query.c_type) return true;
    if (query.c_type && _selected_shape === (query.shape || shapeMatch)) return true;
    if (query.c_type && !shapeMatch) return true
    return false;
  }, [_selected_shape, query.c_type, query.shape, shapeMatch]);

  const resetCommonFilters = (rangeFilters?: IFilterRangeProperties) => {
    setNotFetchFilter(false);
    setExpressShipping(false);
    setOverNight(false);
    setHeartsAndArrows(false);
    setColors(defaultFilter.colors as any);
    setIntensity(defaultFilter.intensity as any);
    setMethod([] as any);
    setSort({ sale: -1, price: 1 });
    setTableRowId('');

    if (
      certifiedCollectionIndex >= 1 &&
      !window.location.search.includes('sku') &&
      collectionSearchSku.length === 0
    ) {
      setCertificate([certifiedCollectionIndex]);
    } else {
      setCertificate([] as any);
    }

    if (!window.location.search.includes('sku') && collectionSearchSku.length === 0) {
      // for collection page only
      if (query.c_type && window.location.pathname.includes(paths.collections.root)) {
        if (isShowChooseRing && _selected_shape) {
          setShape([_selected_shape] as any)
        } else if (shapeMatch?.replaceAll('-', '_').length) {
          setShape([shapeMatch?.replaceAll('-', '_')] as any);
        } else {
          setShape([]);
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        // if (ringSetting?.product || ringDiamond?.diamond || shapeMatch?.replaceAll('-', '_').length) {
        //   setShape([
        //     ringSetting?.product?.diamond_type?.slug ||
        //     ringDiamond?.diamond?.shape ||
        //     shapeMatch?.replaceAll('-', '_')
        //   ] as any);
        // } else {
        setShape([] as any)
        // }
      }
    } else {
      setShape('' as any);
    }

    if (cutMatch && !window.location.search.includes('sku') && collectionSearchSku.length === 0) {
      setCut(
        getRangeFromString(cutMatch, cutFilters, defaultFilter.cut) || (defaultFilter.cut as any)
      );
    } else {
      setCut([1, 5] as any);
    }

    if (colorMatch && !window.location.search.includes('sku') && collectionSearchSku.length === 0) {
      setColor(
        getRangeFromString(colorMatch, colorFilters, defaultFilter.color) ||
        (defaultFilter.color as any)
      );
    } else {
      setColor([1, 11] as any);
    }

    if (
      clarityMatch &&
      !window.location.search.includes('sku') &&
      collectionSearchSku.length === 0
    ) {
      setClarity(
        getRangeFromString(clarityMatch, clarityFilters, defaultFilter.clarity) ||
        (defaultFilter.clarity as any)
      );
    } else {
      setClarity([1, 12] as any);
    }

    setTable(
      typeof rangeFilters === 'undefined' ?
        [range.table.min, range.table.max] :
        [rangeFilters.table.min, rangeFilters.table.max]
    );

    setDepth(
      typeof rangeFilters === 'undefined' ?
        [range.depth.min, range.depth.max] :
        [rangeFilters.depth.min, rangeFilters.depth.max]
    );

    setLWRatio(
      typeof rangeFilters === 'undefined' ?
        [range.lw_ratio.min, range.lw_ratio.max] :
        [rangeFilters.lw_ratio.min, rangeFilters.lw_ratio.max]
    );

    if (rangeFilters) {
      setPrice(
        typeof rangeFilters === 'undefined' ?
          [range.price.min, range.price.max] :
          [rangeFilters.price.min, rangeFilters.price.max]
      );
      setCarat(
        typeof rangeFilters === 'undefined' ?
          [range.carat.min, range.carat.max] :
          [rangeFilters.carat.min, rangeFilters.carat.max]
      )
    } else {
      if (priceMatch && !window.location.search.includes('sku') && collectionSearchSku.length === 0) {
        setPrice([Number(priceMatch[0]), Number(priceMatch[1])]);
      } else {
        setPrice([range.price.min, range.price.max]);
      }

      if (caratMatch && !window.location.search.includes('sku') && collectionSearchSku.length === 0) {
        setCarat([Number(caratMatch), Number(caratMatch) >= 35 ? 35 : Number(caratMatch) + 0.25]);
      } else {
        setCarat([range.carat.min, range.carat.max]);
      }
    }
  };

  const clearFilters = () => {
    resetCommonFilters();
    if (!diamondCollectionReset && window.location.pathname.includes('/collections')) {
      setSearchText(
        collectionSearchSku ??
        (window.location.search.split('sku=')[1]?.split('&')[0] as string) ??
        (query.sku as string) ??
        ''
      );
    } else {
      setSearchText('');
    }
  };

  const clearFiltersForRingBuilder = () => {
    resetCommonFilters();

    if (window.location.pathname.includes('/collections')) {
      setSearchText(
        collectionSearchSku ??
        (window.location.search.split('sku=')[1]?.split('&')[0] as string) ??
        (query.sku as string) ??
        ''
      );
    } else {
      setSearchText('');
    }
  };

  const clearUpperFilters = useCallback((rangeFilters: IFilterRangeProperties) => {
    resetCommonFilters(rangeFilters);

    if (window.location.pathname.includes('/collections')) {
      setSearchText(
        collectionSearchSku ??
        (window.location.search.split('sku=')[1]?.split('&')[0] as string) ??
        (query.sku as string) ??
        ''
      );
    } else {
      setSearchText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // for set collection filter and ring shape
  useEffect(() => {
    if (query.Slug && window.location.search === '?c_type=diamond') {
      clearFilters();
    }
    if (
      query.Slug &&
      window.location.search ===
      `?shape=${ringDiamond?.diamond?.shape || ringSetting?.product?.diamond_type?.slug}&c_type=diamond`
    ) {
      clearFilters();
    }
    if (
      query.Slug &&
      window.location.search ===
      `?c_type=diamond&shape=${ringDiamond?.diamond?.shape || ringSetting?.product?.diamond_type?.slug}`
    ) {
      clearFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.Slug, ringDiamond?.diamond?.shape, ringSetting?.product?.diamond_type?.slug, query]);

  // for clearing sku filter when ring setting shape is not available
  useEffect(() => {
    if (
      collectionSearchSku.length > 0 &&
      !(ringSetting?.product?.diamond_type?.slug || ringDiamond?.diamond?.shape)
    ) {
      if (collectionSearchSku) clearFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionSearchSku]);

  // set ring setting shape when ring setting shape is available
  useEffect(() => {
    if (
      (ringSetting?.product?.diamond_type?.slug || ringDiamond?.diamond?.shape) &&
      !shape &&
      !query.sku &&
      query.type
      // (query.type || query.c_type)
    ) {
      setShape([ringSetting?.product?.diamond_type?.slug || ringDiamond?.diamond?.shape]);
    }
    if (
      // (query.type || query.c_type) &&
      query.type &&
      window.location.search === '?type=diamond-to-ring-builder' &&
      (ringSetting?.product?.diamond_type?.slug || ringDiamond?.diamond?.shape) &&
      (!shape || shape.length === 0)
    ) {
      setShape([ringSetting?.product?.diamond_type?.slug || ringDiamond?.diamond?.shape]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ringSetting?.product?.diamond_type?.slug, ringDiamond?.diamond?.shape, shape, query.sku]);

  // for clearing sku filter when ring setting shape is available
  useEffect(() => {
    if (Object.keys(appliedFilters).length > 1 && query.sku && query.c_type) {
      setSearchText('');
      setCollectionSearchSku('');
    }
  }, [appliedFilters, query.c_type, query.sku, setCollectionSearchSku]);

  useEffect(() => {
    if (query.type || query.c_type) {
      if (Object.keys(appliedFilters).length > 0) {
        setIsFilterLoading(true);
      } else {
        setIsFilterLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  const filterMessages = [
    'Did you know? Lab-grown diamonds are chemically and visually identical to mined diamonds—but far more ethical and affordable.',
    'Fun fact: A 1-carat lab-grown diamond is usually 30-40% less expensive than a mined one.',
    'Clarity counts: Most diamonds have tiny natural inclusions—these give each diamond its own fingerprint.',
    'Cut matters the most. A well-cut diamond reflects more light and sparkles brighter, even if it has lower carat or clarity.',
    'The 4Cs stand for Cut, Color, Clarity, and Carat. Want the best sparkle? Prioritize Cut.',
    "Price Match Promise: Found a better price for the same certified diamond? Share the link — we'll beat it.",
    'No Gimmicks. No fake discounts. Just honest pricing on the best certified lab-grown diamonds.',
    'Every diamond on our site is certified by top gem labs like IGI, GCAL, or GIA*.',
    'We offer lifetime warranty, secure insured shipping, and free resizing.',
    'Our diamonds are conflict-free, earth-friendly, and human-kind.',
  ];

  function getRandomFilterMessage() {
    const index = Math.floor(Math.random() * filterMessages.length);
    return filterMessages[index];
  }

  const prevParamsRef = useRef<string>('');

  useEffect(() => {
    if (window.location.search === '') {
      const newPathname = window.location.pathname;
      const newSearch = '';
      const newUrl = `${newPathname}${newSearch}`;
      const currentUrl = `${window.location.pathname}${router.query}`;
      // Only replace if the new URL is different from the current URL
      if (currentUrl !== newUrl && !query.c_type) {
        clearFilters();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // remove sku from ring builder when appliedFilters changes
  useEffect(() => {
    if (
      Object.keys(appliedFilters).filter((key) => key !== 'shape').length > 0 &&
      router?.query?.type === 'ring-builder'
    ) {

      // for auto filter sku search by url params
      if (
        Object.keys(appliedFilters).length === 6 &&
        Number(appliedFilters?.price?.max) === 100000 &&
        appliedFilters?.carat?.max === 35 &&
        appliedFilters?.lw_ratio?.max === '2.75'
      ) return

      const newQuery = {
        ...router.query,
        type: 'ring-builder',
      };

      if ((newQuery as any).sku) {
        delete (newQuery as any).sku;
      }

      // Check if the new query is different from the current query to avoid unnecessary replace
      const isQueryChanged = JSON.stringify(router.query) !== JSON.stringify(newQuery);

      if (isQueryChanged) {
        router.replace(
          {
            pathname: window.location.pathname,
            query: newQuery,
          },
          undefined,
          { shallow: true, scroll: false }
        );
      }

      setSearchText('');
    }
  }, [appliedFilters, router, router.query]);

  // Remove manually search params when they are present in the URL
  useEffect(() => {
    if (!overNight && window.location.search === '?overnight=true')
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    if (!expressShipping && window.location.search === '?express=true')
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    if (!heartsAndArrows && window.location.search === '?heartsandarrows=true')
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    if (!router.query.c_type && (!shape || shape?.length === 0) && window.location.search.includes('shape=')) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.delete('shape');
      const newSearch = currentParams.toString() ? `?${currentParams.toString()}` : '';
      router.replace(
        {
          pathname: window.location.pathname,
          search: newSearch,
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    if (
      (!certificate || certificate.length === 0) &&
      window.location.search.startsWith('?certificate=')
    )
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    if ((!method || method.length === 0) && window.location.search.startsWith('?method='))
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    if ((!intensity || intensity.length === 0) && window.location.search.startsWith('?intensity='))
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    if ((!colors || colors === -1) && window.location.search.startsWith('?colored='))
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    if (
      (price[0] === range.price.min || price[0] === 0) &&
      price[1] === 100000 &&
      window.location.search.startsWith('?price=')
    ) {
      setPrice([range.price.min, range.price.max] as any);
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    if (
      carat[0] === range.carat.min &&
      carat[1] === range.carat.max &&
      window.location.search.startsWith('?carat=')
    ) {
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    if (cut[0] === 1 && cut[1] === 5 && window.location.search.startsWith('?cut=')) {
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    if (color[0] === 1 && color[1] === 11 && window.location.search.startsWith('?color=')) {
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    if (clarity[0] === 1 && clarity[1] === 12 && window.location.search.startsWith('?clarity=')) {
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    if (
      table[0] === range.table.min &&
      table[1] === range.table.max &&
      window.location.search.startsWith('?table=') &&
      table.length !== 2
    ) {
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    if (
      depth[0] === range.depth.min &&
      depth[1] === range.depth.max &&
      window.location.search.startsWith('?depth=') &&
      depth.length !== 2
    ) {
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
    if (
      lwratio[0] === range.lw_ratio.min &&
      lwratio[1] === range.lw_ratio.max &&
      window.location.search.startsWith('?lwratio=') &&
      lwratio.length !== 2
    ) {
      router.replace(
        {
          pathname: window.location.pathname,
          search: '',
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
  }, [
    expressShipping,
    overNight,
    heartsAndArrows,
    router,
    shape,
    price,
    carat,
    cut,
    color,
    clarity,
    certificate,
    method,
    table,
    depth,
    lwratio,
    colors,
    intensity,
    range.table.min,
    range.table.max,
    range.depth.min,
    range.depth.max,
    range.lw_ratio.min,
    range.lw_ratio.max,
    range.price.min,
    range.price.max,
    range.carat.min,
    range.carat.max,
  ]);

  useEffect(() => {
    const updateQueryParams = debounce(() => {
      const newParams = new URLSearchParams();
      if (searchParams !== undefined) {
        if (shape !== defaultFilter.shape && shape?.length > 0) {
          if (Array.isArray(shape)) {
            newParams.set('shape', shape.join('-'));
          } else {
            newParams.set('shape', String(shape));
          }
        }

        if (price[0] !== range.price.min || price[1] !== range.price.max) {
          const _price = [Number(price[0].toFixed(2)), Number(price[1].toFixed(2))]
          newParams.set('price', String(_price.join('-')));
        }

        if (table[0] !== range.table.min || table[1] !== range.table.max) {
          const _table = [Number(table[0].toFixed(2)), Number(table[1].toFixed(2))]
          newParams.set('table', String(_table.join('-')));
        }

        if (depth[0] !== range.depth.min || depth[1] !== range.depth.max) {
          const _depth = [Number(depth[0].toFixed(2)), Number(depth[1].toFixed(2))]
          newParams.set('depth', String(_depth.join('-')));
        }

        if (
          intensity[0] !== defaultFilter.intensity[0] ||
          intensity[1] !== defaultFilter.intensity[1]
        ) {
          newParams.set('intensity', String(getArrToString(intensityFilters, intensity)));
        }

        if (lwratio[0] !== range.lw_ratio.min || lwratio[1] !== range.lw_ratio.max) {
          const _lwratio = [Number(lwratio[0].toFixed(2)), Number(lwratio[1].toFixed(2))]
          newParams.set('lwratio', String(_lwratio.join('-')));
        }

        if (carat[0] !== range.carat.min || carat[1] !== range.carat.max) {
          const _carat = [Number(carat[0].toFixed(2)), Number(carat[1].toFixed(2))]
          newParams.set('carat', String(_carat.join('-')));
        }

        if (cut[0] !== defaultFilter.cut[0] || cut[1] !== defaultFilter.cut[1]) {
          newParams.set(
            'cut',
            String(
              cutFilters
                .slice(cut[0] - 1, cut[1] - 1)
                .map((filter: any) => filter.url_view)
                .join('-')
            )
          );
        }

        if (color[0] !== defaultFilter.color[0] || color[1] !== defaultFilter.color[1]) {
          newParams.set(
            'color',
            String(
              colorFilters
                .slice(color[0] - 1, color[1] - 1)
                .map((filter: any) => filter.url_view)
                .join('-')
            )
          );
        }

        if (colors !== (defaultFilter.colors as any)) {
          newParams.set('colored', String(getArrToString(REAL_COLOR_OPTIONS, [colors as any])));
        }

        if (clarity[0] !== defaultFilter.clarity[0] || clarity[1] !== defaultFilter.clarity[1]) {
          newParams.set(
            'clarity',
            String(
              clarityFilters
                .slice(clarity[0] - 1, clarity[1] - 1)
                .map((filter: any) => filter.url_view)
                .join('-')
            )
          );
        }

        if (certificate.length > 0) {
          newParams.set('certificate', String(getArrToString(certificateFilters, certificate)));
        }

        if (method.length > 0) {
          newParams.set('method', String(getArrToString(methodFilters, method)));
        }

        if (expressShipping && !query.type) {
          newParams.set('express', String(expressShipping));
        } else {
          newParams.delete('express');
        }

        if (overNight && !query.type) {
          newParams.set('overnight', String(overNight));
        } else {
          newParams.delete('overnight');
        }

        if (heartsAndArrows) {
          newParams.set('heartsandarrows', String(heartsAndArrows));
        } else {
          newParams.delete('heartsandarrows');
        }

        if (
          searchText &&
          searchParams.get('type') === null &&
          !window.location.search.includes(`?sku=${searchText}`)
        ) {
          router.replace(
            {
              pathname: window.location.pathname,
              search: window.location.search.includes('c_type')
                ? `?sku=${encodeURIComponent(searchText)}&c_type=diamond`
                : `?sku=${encodeURIComponent(searchText)}`,
            },
            undefined,
            { shallow: true, scroll: false }
          );
        }

        if (searchText && query.type) {
          // newParams.set('sku', String(searchText));
          newParams.delete('shape');
        }

        if (searchText) {
          if (searchText.toLocaleLowerCase().includes('mm')) {
            newParams.set('mm', String(searchText).replaceAll(' ', ''));
          } else {
            newParams.set('sku', String(searchText));
          }
        }

        if (router.query.skuu && keepSkuuSearch) newParams.set('skuu', String(router.query.skuu));
        if (router.query.type) newParams.set('type', String(router.query.type));
        if (
          router.query.c_type &&
          typeof router.query.c_type === 'string' &&
          router.query.c_type.length > 0
        ) {
          newParams.set('c_type', router.query.c_type);
        }
        if (window.location.search.includes('c_type')) {
          newParams.set('c_type', router.query.c_type as string || 'diamond');
        }
        if (!searchText) setCollectionSearchSku('');
        if (diamondCollectionReset) setDiamondCollectionReset(false);
        if (
          (ringDiamond?.diamond?.shape || ringSetting?.product?.diamond_type?.slug) &&
          searchText
        ) {
          newParams.delete('shape');
        }
        if (query.Slug) newParams.delete('Slug');
        if (!isFilterApplied && !query.type) setSort({ sale: -1, price: 1 });
        if (isFilterApplied && query.type && query.shape && Object.keys(appliedFilters).length === 1) {
          setSort({ sale: -1, price: 1 });
        }
        if ((query.c_type || query.type) && Object.keys(sort).length === 0) {
          setSort({ sale: -1, price: 1 });
        }

        // Check if there is a change in the URL parameters
        const newQueryString = `?${newParams.toString()}`;

        if (
          newQueryString === '?price=100-100000&table=50-80&depth=46-78&lwratio=1-2.75&carat=0-35'
        ) {
          // for range filter default api call remove
          router.replace(
            {
              pathname: window.location.pathname,
              search: '',
            },
            undefined,
            { shallow: true, scroll: false }
          );
        } else if (
          newQueryString !== prevParamsRef.current &&
          newQueryString !== '?' &&
          newQueryString !== `?c_type=diamond` &&
          !newQueryString.includes('Slug=')
        ) {
          prevParamsRef.current = newQueryString;
          router.replace(
            {
              pathname: window.location.pathname,
              search: newQueryString,
            },
            undefined,
            { shallow: true, scroll: false }
          );
        }
      }
    }, 100); // 100ms debounce delay

    if (query.c_type !== 'setting') {
      updateQueryParams();
    }

    return () => {
      updateQueryParams.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, price, carat, searchParams, router, defaultFilter, cut, color, clarity, certificate, method, table, depth, lwratio, searchText, defaultSearch, expressShipping, overNight, clearUpperFilters, colors, intensity, heartsAndArrows, cutFilters, colorFilters, clarityFilters, certificateFilters, methodFilters, REAL_COLOR_OPTIONS, intensityFilters, setCollectionSearchSku, keepSkuuSearch, diamondCollectionReset, setDiamondCollectionReset, ringDiamond?.diamond?.shape, ringSetting?.product?.diamond_type?.slug, query.Slug, query.type, range.price.min, range.price.max, range.table.min, range.table.max, range.depth.min, range.depth.max, range.lw_ratio.min, range.lw_ratio.max, range.carat.min, range.carat.max, query.shape, isFilterApplied, appliedFilters, shapeMatch, query.c_type]);

  const clearSearchFilter = () => {
    setSearchText(defaultSearch);
  };

  return {
    searchText,
    shape,
    price,
    colors,
    carat,
    cut,
    color,
    clarity,
    intensity,
    certificate,
    method,
    table,
    depth,
    lwratio,
    expressShipping,
    overNight,
    heartsAndArrows,
    totalDiamond,
    isFilterLoading,
    tableRowId,
    collectionSearchSku,
    keepSkuuSearch,
    notFetchFilter,
    resetSearchText,
    range,
    shapeMatch,
    //
    setResetSearchText,
    setTable,
    setDepth,
    setLWRatio,
    setColors,
    setMethod,
    setCertificate,
    setClarity,
    setExpressShipping,
    setColor,
    setIntensity,
    setCut,
    setOverNight,
    setCarat,
    setPrice,
    setShape,
    setSearchText,
    setHeartsAndArrows,
    setTotalDiamond,
    setIsFilterLoading,
    setTableRowId,
    setCollectionSearchSku,
    setKeepSkuuSearch,
    setNotFetchFilter,
    setRange,
    //
    appliedFilters,
    isFilterApplied,
    //
    clearFilters,
    clearUpperFilters,
    clearSearchFilter,
    clearFiltersForRingBuilder,
    handleRemoveTableID,
    getRandomFilterMessage,
    //
    sort,
    setSort,
  };
};

const [InventoryProvider, useInventoryContext] = constate(useInventory);

export { InventoryProvider, useInventoryContext };

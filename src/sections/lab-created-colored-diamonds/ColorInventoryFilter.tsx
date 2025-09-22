/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from 'next/image';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo, useState, useEffect } from 'react';

import clsx from 'clsx';

import { useDisclosure } from '@mantine/hooks';
import { Group, Popover, Checkbox } from '@mantine/core';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { useInventoryContext } from '@/stores/inventory.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import { TTooltip } from '@/components/ui/tooltip';
import { TRangeSlider } from '@/components/ui/range-slider';
import {
  transformValue,
  reverseTransformValue,
} from '@/components/common-functions';

import { paths } from '@/routes/paths';
import ResetIcon from '@/assets/image/icon/reset.svg';
import LoadingImage from '@/assets/image/Loading.gif';
import overNightImage from '@/assets/image/overNight.svg';
import ShippingImg from '@/assets/image/logo/Ship_icon.svg';

import ColorDiamond from './ColorDiamond';
import IntensityFilter from './IntensityFilter';
import ColorFilterShape from './ColorFilterShape';
import ColorInventoryFilterModal from './ColorInventoryFilterModal';

// ----------------------------------------------------------------------

export type InventoryFilterProps = {};

const ColorInventoryFilter: FC<InventoryFilterProps> = () => {
  const { pathname, query } = useRouter();

  const router = useRouter();

  const { ringSetting, ringDiamond } = useRingBuilderContext();
  const __shape =
    ringSetting?.product?.diamond_type?.slug || ringSetting?.product?.diamond_type?.[0]?.slug;

  const removeSku = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sku, certificate, ...restQuery } = query; // Destructure out 'sku,certificate' and keep the rest

    // Remove the 'sku' query parameter but not reset the page
    router.push(
      { pathname, query: restQuery },
      { pathname, query: restQuery },
      { shallow: true, scroll: false }
    );
  };

  const {
    searchText,
    shape,
    price,
    carat,
    cut,
    colors,
    clarity,
    intensity,
    certificate,
    method,
    overNight,
    table,
    depth,
    lwratio,
    expressShipping,
    totalDiamond,
    resetSearchText,
    range,
    sort,
    //
    setResetSearchText,
    setTable,
    setDepth,
    setLWRatio,
    setMethod,
    setCertificate,
    setIntensity,
    setExpressShipping,
    setOverNight,
    setColors,
    setClarity,
    setCut,
    setCarat,
    setPrice,
    setShape,
    setSearchText,
    setKeepSkuuSearch,
    setNotFetchFilter,
    setIsFilterLoading,
    setRange,
    //
    isFilterApplied,
    appliedFilters,
    isFilterLoading,
    //
    clearFilters,
    clearUpperFilters,
    clearFiltersForRingBuilder,
    clearSearchFilter,
    handleRemoveTableID,
  } = useInventoryContext();

  const {
    shapeFilters,
    colorDaimondFilters,
    cutFilters,
    intensityFilters,
    clarityFilters,
    certificateFilters,
    methodFilters,
    REAL_COLOR_OPTIONS,
    //
    goToDiamondList,
  } = useInventoryFilter();

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const [certificateDropDown, setCertificateDropDown] = useState(false);
  const [tableDropDown, setTableDropDown] = useState(false);
  const [methodDropDown, setMethodDropDown] = useState(false);
  const [depthDropDown, setDepthDropDown] = useState(false);
  const [lwRetioDropDown, setLWRetioDropDown] = useState(false);

  const isSortFilterApplied = useMemo(() => !(sort?.price === 1 && sort?.sale === -1), [sort]);

  function cleanString(input: string) {
    // Check if input starts with 'LGD-' or 'lgd-'
    if (/^(LGD13-|lgd13-|LGD14-|lgd14-|LGD-|lgd-)/.test(input)) {
      return input.trim();
    }
    // eslint-disable-next-line no-else-return
    else {
      return input.trim().replace(/^[A-Za-z-]+/, '');
    }
  }

  const handleSearchText = () => {
    const trimmedSearch = search.trim();
    setIsFilterLoading(true);
    if (trimmedSearch.length > 0) {
      const data = cleanString(trimmedSearch);
      if (!(__shape || ringDiamond?.diamond?.shape) && query.c_type) {
        clearFilters();
      } else if (query.type) {
        clearUpperFilters(range);
      } else {
        clearFilters();
      }

      setTimeout(() => {
        setSearchText(data.trim());
        if (query.type) {
          router.push(
            {
              pathname: window.location.pathname,
              search: `?sku=${encodeURIComponent(data.trim())}&type=${query.type}`,
            },
            undefined,
            { shallow: true, scroll: false }
          );
        }
      }, 250);

      if (query.type && __shape) {
        setShape((__shape || ringDiamond?.diamond?.shape || '')?.toLowerCase());
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedSearch = search.trim();
    setIsFilterLoading(true);
    if (event.key === 'Enter') {
      event.preventDefault();

      if (trimmedSearch.length > 0) {
        const data = cleanString(trimmedSearch);
        if (!(__shape || ringDiamond?.diamond?.shape) && query.c_type) {
          clearFilters();
        } else if (query.type) {
          clearUpperFilters(range);
        } else {
          clearFilters();
        }

        setTimeout(() => {
          setSearchText(data.trim());
          if (query.type) {
            router.push(
              {
                pathname: window.location.pathname,
                search: `?sku=${encodeURIComponent(data.trim())}&type=${query.type}`,
              },
              undefined,
              { shallow: true, scroll: false }
            );
          }
        }, 250);

        if (query.type && __shape) {
          setShape((__shape || ringDiamond?.diamond?.shape || '')?.toLowerCase());
        }
      }
    }
  };

  // remove sku from input field from no found diamond section
  useEffect(() => {
    if (resetSearchText) {
      setSearch('');
      setSearchText('');
      setResetSearchText(false);
    }
  }, [resetSearchText, setResetSearchText, setSearchText]);

  useEffect(() => {
    if (query.sku || !!(query.type && query.shape)) {
      setSearch(query.sku as string as string);
      setSearchText(query.sku as string as string);
    }

    // if (query?.certificate) {
    //   setCertificate([Number(query?.certificate)]);
    // }

    if (query?.certificate?.toString().toLocaleUpperCase() === 'IGI' && query.view) {
      setCertificate([1]);
    }
    if (query?.certificate?.toString().toLocaleUpperCase() === 'GIA' && query.view) {
      setCertificate([2]);
    }
    if (query?.certificate?.toString().toLocaleUpperCase() === 'GCAL' && query.view) {
      setCertificate([3]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // for set shape
  useEffect(() => {
    if ((query.type || query.c_type) && !query.shape && !shape && !searchText && !search) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-shadow
      const { type, c_type, shape, Slug, ...currentQuery } = router.query;

      const buildQuery = (newShape: string) => ({
        ...currentQuery,
        ...(query.type && !query.c_type ? { type: query.type } : {}),
        ...(query.c_type && !query.type ? { c_type: query.c_type } : {}),
        shape: newShape,
      });

      const updateQuery = (newShape: string) => {
        router.replace(
          {
            pathname: window.location.pathname,
            query: buildQuery(newShape),
          },
          undefined,
          { shallow: true }
        );
        setShape([newShape || '']);
      };

      if (
        (query.shape as string)?.length > 0 &&
        query.shape === ringSetting?.product?.diamond_type?.slug
      ) {
        setShape([(query.shape as string)?.toLowerCase() || '']);
      } else if (ringSetting?.product?.diamond_type?.slug) {
        updateQuery(ringSetting.product.diamond_type.slug);
      } else if (ringDiamond?.diamond?.shape) {
        updateQuery(ringDiamond.diamond.shape);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.shape,
    query.type,
    setShape,
    ringSetting?.product?.diamond_type?.slug,
    router,
    query.c_type,
    ringDiamond?.diamond?.shape,
  ]);

  // for clear search filter
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // for auto filter sku search by url params
    if (
      Object.keys(appliedFilters).length === 5 &&
      Number(appliedFilters?.price?.max) === 100000 &&
      appliedFilters?.carat?.max === 35 &&
      appliedFilters?.lw_ratio?.max === '2.75'
    )
      return;

    if (!query.c_type && !query.type && Object.keys(appliedFilters).length > 0) {
      clearSearchFilter();
      setSearch('');
    }
    if (
      !query.c_type &&
      query.type &&
      !(__shape || ringDiamond?.diamond?.shape) &&
      Object.keys(appliedFilters).length > 0
    ) {
      clearSearchFilter();
      setSearch('');
    }
    if (
      !query.c_type &&
      (__shape || ringDiamond?.diamond?.shape) &&
      query.type &&
      Object.keys(appliedFilters).length > 1
    ) {
      clearSearchFilter();
      setSearch('');
    }
    if (
      query.c_type &&
      query.sku &&
      (__shape || ringDiamond?.diamond?.shape) &&
      Object.keys(appliedFilters).length > 1
    ) {
      setSearch('');
    }
    if (
      query.c_type &&
      query.sku &&
      !(__shape || ringDiamond?.diamond?.shape) &&
      Object.keys(appliedFilters).length > 0
    ) {
      setSearch('');
      setSearchText('');
    }
    if (!query.c_type && !searchText && !query.sku && !resetSearchText) {
      setSearch(search ?? '');
    }

    if (
      (__shape || ringDiamond?.diamond?.shape) &&
      query.type &&
      // (query.c_type || query.type) &&
      (!shape || shape?.length === 0)
    ) {
      setShape([__shape || ringDiamond?.diamond?.shape]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appliedFilters,
    clearSearchFilter,
    query.c_type,
    query.shape,
    query.sku,
    query.type,
    search,
    searchText,
    resetSearchText,
  ]);

  const toggleDropdown = (name: string) => {
    if (name === 'certificate') {
      setCertificateDropDown(!certificateDropDown);
    } else if (name === 'table') {
      setTableDropDown(!tableDropDown);
    } else if (name === 'method') {
      setMethodDropDown(!methodDropDown);
    } else if (name === 'depth') {
      setDepthDropDown(!depthDropDown);
    } else {
      setLWRetioDropDown(!lwRetioDropDown);
    }
  };
  const closeDropdown = (e: any, name: string) => {
    e.stopPropagation();
    if (name === 'certificate') {
      setCertificateDropDown(false);
    } else if (name === 'table') {
      setTableDropDown(false);
    } else if (name === 'method') {
      setMethodDropDown(false);
    } else if (name === 'depth') {
      setDepthDropDown(false);
    } else {
      setLWRetioDropDown(false);
    }
  };

  useEffect(() => {
    if (totalDiamond === 0 && !isFilterLoading) setShowLoader(true);
  }, [totalDiamond, isFilterLoading]);

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [showLoader]);

  useEffect(() => {
    if (!isFilterLoading && totalDiamond >= 0) {
      setShowLoader(false);
      setIsFilterLoading(false);
    }
  }, [isFilterLoading, setIsFilterLoading, showLoader, totalDiamond]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (carat[0] !== Math.min(...carat) || carat[1] !== Math.max(...carat)) {
        setCarat([Math.min(...carat), Math.max(...carat)]);
      }
      if (price[0] !== Math.min(...price) || price[1] !== Math.max(...price)) {
        setPrice([Math.min(...price), Math.max(...price)]);
      }
      if (table[0] < range.table.min || table[0] > range.table.max) {
        setTable([range.table.min, Number(table[1])]);
      }
      if (table[1] < range.table.min || table[1] > range.table.max) {
        setTable([Number(table[0]), range.table.max]);
      }
      if (table[0] !== Math.min(...table) || table[1] !== Math.max(...table)) {
        setTable([Math.min(...table), Math.max(...table)]);
      }
      if (depth[0] < range.depth.min || depth[0] > range.depth.max) {
        setDepth([range.depth.min, Number(depth[1])]);
      }
      if (depth[1] < range.depth.min || depth[1] > range.depth.max) {
        setDepth([Number(depth[0]), range.depth.max]);
      }
      if (depth[0] !== Math.min(...depth) || depth[1] !== Math.max(...depth)) {
        setDepth([Math.min(...depth), Math.max(...depth)]);
      }
      if (lwratio[0] < range.lw_ratio.min || lwratio[0] > range.lw_ratio.max) {
        setLWRatio([range.lw_ratio.min, Number(lwratio[1])]);
      }
      if (lwratio[1] < range.lw_ratio.min || lwratio[1] > range.lw_ratio.max) {
        setLWRatio([Number(lwratio[0]), range.lw_ratio.max]);
      }
      if (lwratio[0] !== Math.min(...lwratio) || lwratio[1] !== Math.max(...lwratio)) {
        setLWRatio([Math.min(...lwratio), Math.max(...lwratio)]);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [
    carat,
    depth,
    range.depth.max,
    range.depth.min,
    lwratio,
    range.lw_ratio.max,
    range.lw_ratio.min,
    price,
    setCarat,
    setDepth,
    setLWRatio,
    setPrice,
    setTable,
    table,
    range.table.max,
    range.table.min,
  ]);

  return (
    <>
      <div className="container-fluid">
        {/* Filter section */}
        <div className="d-none d-lg-block">
          <div className="row align-items-center">
            {/* Color filter */}
            <div className="col-lg-12">
              <div className="d-flex align-items-center mb_70 shape">
                <div className="heading d-flex align-items-center">
                  <p className="mb-0">Color</p>
                  <TTooltip
                    label="Diamond color measures the degree of colorlessness. Stones are graded on a scale."
                    w={300}
                  >
                    <span className="question_icon ms-1">
                      <i className="fa-solid fa-question" />
                    </span>
                  </TTooltip>
                </div>
                <div className="d-flex flex-wrap gap_10 ms_15">
                  {colorDaimondFilters.map((color) => (
                    <ColorDiamond
                      key={color.id}
                      {...color}
                      value={colors as any}
                      setValue={(newValue) => {
                        setKeepSkuuSearch(false);
                        setNotFetchFilter(false);
                        setIsFilterLoading(true);
                        setColors(newValue);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Shape filter */}
            <div className="col-xxl-6 col-lg-6">
              <div className="d-flex align-items-center mb_70 shape">
                <div className="heading d-flex align-items-center">
                  <p className="mb-0">Shape</p>
                  <TTooltip
                    label="A diamond's shape refers to the general silhouette of the stone when viewed face up, not to be confused with the cut."
                    w={300}
                  >
                    <span className="question_icon ms-1">
                      <i className="fa-solid fa-question" />
                    </span>
                  </TTooltip>
                </div>
                <div className="slider-box d-flex align-items-center w-100">
                  <div className="d-flex align-items-center flex-column gap-4 w-100">
                    <div className="d-flex align-items-center justify-content-between flex-wrap flex-xl-nowrap w-100">
                      {shapeFilters.slice(0, 10).map((shapeFilter) => (
                        <ColorFilterShape
                          key={shapeFilter.id}
                          {...shapeFilter}
                          value={shape}
                          setValue={setShape}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price filter */}
            <div className="col-xxl-6 col-lg-6">
              <div className="d-flex align-items-center mb_70">
                <p className="heading mb-0">Price</p>
                <div className="slider-box w-100">
                  <div className="input-box">
                    <input
                      type="number"
                      value={Number(price[0].toFixed(2))} // min price value
                      min={range.price.min}
                      max={price[1] - range.price.min}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const newVal = Number(e.target.value);
                        setPrice([newVal, price[1]]); // Allow free input
                        setNotFetchFilter(false);
                        setKeepSkuuSearch(false);
                      }}
                      onBlur={(e) => {
                        let newVal = Number(e.target.value);
                        if (newVal < range.price.min) {
                          newVal = range.price.min; // Enforce minimum value
                        } else if (newVal >= price[1] - range.price.min) {
                          newVal = price[1] - range.price.min;
                        }
                        setPrice([newVal, price[1]]);
                      }}
                    />
                    <input
                      type="number"
                      value={Number(price[1].toFixed(2))} // max price value
                      min={price[0] + range.price.min}
                      max={range.price.max}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const newVal = Number(e.target.value);
                        setPrice([price[0], newVal]); // Allow free input
                        setNotFetchFilter(false);
                        setKeepSkuuSearch(false);
                      }}
                      onBlur={(e) => {
                        let newVal = Number(e.target.value);
                        if (newVal > range.price.max) {
                          newVal = range.price.max; // Enforce maximum value
                        } else if (newVal <= price[0] + range.price.min) {
                          newVal = price[0] + range.price.min;
                        }
                        setPrice([price[0], newVal]);
                      }}
                    />
                  </div>
                  <TRangeSlider
                    min={0}
                    max={100} // 0 to 100 scale
                    step={1}
                    label={() => null}
                    value={
                      price.map((p) => reverseTransformValue(p, range.price)) as [number, number]
                    }
                    onChange={(val: [number, number]) => {
                      const transformedValues = val.map((v) => transformValue(v, range.price));
                      if (
                        transformedValues[0] < range.price.min ||
                        transformedValues[0] >= transformedValues[1] - range.price.min
                      )
                        return; // Prevent min from being less than 100 and enforce a 100 difference
                      setPrice(transformedValues as any);
                      setNotFetchFilter(false);
                      setKeepSkuuSearch(false);
                    }}
                    marks={[
                      {
                        value: reverseTransformValue(range.price.min, range.price),
                        label: `$${range.price.min}`,
                      },
                      { value: reverseTransformValue(6000, range.price), label: '$6000' },
                      {
                        value: reverseTransformValue(range.price.max, range.price),
                        label: `$${range.price.max}`,
                      },
                    ]}
                    className="price-slider-handles w-100"
                  />
                </div>
              </div>
            </div>

            {/* Carat filter */}
            <div className="col-xxl-6 col-lg-6">
              <div className="d-flex align-items-center mb_70">
                <div className="heading d-flex align-items-center ">
                  <p className="mb-0">Carat</p>
                  <TTooltip
                    label="Carat is a measurement of a diamonds weight. More carats = more money."
                    w={300}
                  >
                    <span className="question_icon ms-1">
                      <i className="fa-solid fa-question" />
                    </span>
                  </TTooltip>
                </div>
                <div className="slider-box w-100">
                  <div className="input-box">
                    <input
                      type="number"
                      value={Number(carat[0].toFixed(2))}
                      onFocus={(e) => e.target.select()}
                      min={range.carat.min}
                      max={range.carat.max}
                      onChange={(e) => {
                        setCarat([
                          Number(
                            Number(e.target.value) > range.carat.max
                              ? range.carat.min
                              : e.target.value
                          ),
                          carat[1],
                        ]);
                        setNotFetchFilter(false);
                        setKeepSkuuSearch(false);
                      }}
                    />
                    <input
                      type="number"
                      value={Number(carat[1].toFixed(2))}
                      onFocus={(e) => e.target.select()}
                      min={range.carat.min}
                      max={range.carat.max}
                      onChange={(e) => {
                        setNotFetchFilter(false);
                        setKeepSkuuSearch(false);
                        setCarat([
                          carat[0],
                          Number(e.target.value) > range.carat.max
                            ? range.carat.max
                            : Number(e.target.value),
                        ]);
                      }}
                    />
                  </div>
                  <TRangeSlider
                    minRange={1}
                    min={range.carat.min}
                    max={range.carat.max}
                    step={0.01}
                    showLabelOnHover={false}
                    value={carat}
                    label={() => null}
                    onChange={(newValue) => {
                      setCarat(newValue);
                      setNotFetchFilter(false);
                      setKeepSkuuSearch(false);
                    }}
                    // marks={generateRangeOptions(range.carat.min, range.carat.max)}
                    className="carat-slider-handles w-100"
                  />
                </div>
              </div>
            </div>

            {/* cut form selection section */}
            <div className="col-xxl-6 col-lg-6">
              <div className="d-flex align-items-start mb_70">
                <div className="heading d-flex align-items-center">
                  <p className=" mb-0 lh-1">Cut</p>
                  <TTooltip
                    label="A diamond's cut refers to how well it returns light; Excellent being ideal standards, Poor being the lowest possible standards."
                    w={300}
                  >
                    <span className="question_icon ms-1">
                      <i className="fa-solid fa-question" />
                    </span>
                  </TTooltip>
                </div>
                <div className="w-100 pe-4 pe-xxl-0 ps-2">
                  <TRangeSlider
                    minRange={1}
                    min={1}
                    showLabelOnHover={false}
                    max={cutFilters.length}
                    step={1}
                    value={cut as any}
                    onChange={(newValue) => {
                      setCut(newValue);
                      setKeepSkuuSearch(false);
                      setNotFetchFilter(false);
                      setIsFilterLoading(true);
                    }}
                    // label={(val) => cutFilters[val - 1].label}
                    label={() => null}
                    marks={cutFilters}
                    className="cut-slider-handles w-100 slider-box"
                  />
                  <div className="inventory-filter-text d-flex align-items-center justify-content-around mt-2">
                    <span>Good</span>
                    <span>Very Good</span>
                    <span>Excellent</span>
                    <span>Ideal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Intensity Filter */}
            <div className="col-xxl-6 col-lg-6">
              <div className="d-flex align-items-center mb_70">
                <div className="heading d-flex align-items-center">
                  <p className=" mb-0">Intensity</p>
                  <TTooltip
                    label="A light form of intensity that can be seen with the naked eye."
                    w={300}
                  >
                    <span className="question_icon ms-1">
                      <i className="fa-solid fa-question" />
                    </span>
                  </TTooltip>
                </div>
                <div className="d-flex flex-nowrap ms_15 gap_10 w-100 me-lg-3 me-xxl-0">
                  {intensityFilters.slice(0, 10).map((_intensity) => (
                    <IntensityFilter
                      key={_intensity.id}
                      {..._intensity}
                      value={intensity}
                      setValue={(newValue) => {
                        setKeepSkuuSearch(false);
                        setNotFetchFilter(false);
                        setIsFilterLoading(true);
                        setIntensity(newValue);
                      }}
                      color={
                        (colors as any) !== -1
                          ? colorDaimondFilters.find((c) => c.defaultValue === (colors as any))
                              ?.label
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Clarity filter */}
            <div className="col-xxl-6 col-lg-6">
              <div className="d-flex align-items-start mb_70">
                <div className="heading d-flex align-items-center">
                  <p className="mb-0 lh-1">Clarity</p>
                  <TTooltip
                    label="Clarity refers to the number, size, and position of inclusions and blemishes. Diamonds are graded on a scale from Flawless (no inclusions) to I3 (obvious inclusions)."
                    w={300}
                  >
                    <span className="question_icon ms-1">
                      <i className="fa-solid fa-question" />
                    </span>
                  </TTooltip>
                </div>
                <div className="w-100 pe-4 pe-xxl-0 ps-2">
                  <TRangeSlider
                    minRange={1}
                    showLabelOnHover={false}
                    min={1}
                    max={clarityFilters.length}
                    step={1}
                    value={clarity as any}
                    onChange={(newValue) => {
                      setClarity(newValue);
                      setKeepSkuuSearch(false);
                      setNotFetchFilter(false);
                      setIsFilterLoading(true);
                    }}
                    marks={clarityFilters}
                    // label={(val) => clarityFilters[val - 1].label}
                    label={() => null}
                    className="clarity-slider-handles w-100 slider-box"
                  />
                  <div className="inventory-filter-text d-flex align-items-center justify-content-around mt-2">
                    <span>I2</span>
                    <span>I1</span>
                    <span>SI3</span>
                    <span>SI2</span>
                    <span>SI1</span>
                    <span>VS2</span>
                    <span>VS1</span>
                    <span>VVS2</span>
                    <span>VVS1</span>
                    <span>IF</span>
                    <span>FL</span>
                  </div>
                </div>
                <div />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mb_50 d-none d-lg-block">
          <div className="row row-gap-3">
            <div className="col-xxl-6 col-xl-6">
              <div className="d-flex align-items-center">
                <p className="text-nowrap fw-600 mb-0 font_size_12">Advanced Options</p>
                <div className="d-flex align-items-center flex-wrap gap-2 ps-3">
                  {/* Certificate filter */}
                  <div className="av_option count_checkbox">
                    <div className="dropdown">
                      <Popover
                        width={200}
                        position="bottom-start"
                        shadow="md"
                        opened={certificateDropDown}
                        onChange={() => toggleDropdown('certificate')}
                      >
                        <Popover.Target>
                          <button
                            className={
                              certificateDropDown || certificate.length > 0
                                ? 'btn advance_active'
                                : 'btn'
                            }
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            onClick={() => toggleDropdown('certificate')}
                            aria-expanded={certificateDropDown}
                          >
                            {certificate.length > 0 && (
                              <i
                                className="fa-solid fa-xmark"
                                style={{ marginRight: '7px', fontSize: '15px' }}
                                onClick={() => setCertificate([])}
                              />
                            )}
                            Certificate
                            {certificate.length > 0 && (
                              <span className="count ms-1">({certificate.length})</span>
                            )}
                            {certificateDropDown ? (
                              <i className="fa-solid fa-caret-up advance-filter-arrow" />
                            ) : (
                              <i className="fa-solid advance-filter-arrow fa-caret-down" />
                            )}
                          </button>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Checkbox.Group
                            label={
                              <div className="d-flex align-items-center heading justify-content-between">
                                <div className="d-flex">
                                  <span>Certificate</span>
                                  <TTooltip label="Filter by Certificate Type" w="auto">
                                    <span className="question_icon ms-1">
                                      <i className="fa-solid fa-question" />
                                    </span>
                                  </TTooltip>
                                </div>
                                {/* {certificate.length > 0 && ( */}
                                <i
                                  className="fa fa-close"
                                  onClick={(e) => closeDropdown(e, 'certificate')}
                                  aria-expanded={certificateDropDown}
                                />
                                {/* )} */}
                              </div>
                            }
                            classNames={{ label: 'w-100' }}
                            value={certificate.map((c: any) => c.toString())}
                            onChange={(val) => {
                              setCertificate(val.map((v) => Number(v)));
                              setKeepSkuuSearch(false);
                              setNotFetchFilter(false);
                              setIsFilterLoading(true);
                            }}
                          >
                            <Group mt="20" className="flex-column align-items-start">
                              {(query.type === 'ring-builder'
                                ? certificateFilters.slice(0, certificateFilters.length - 1)
                                : certificateFilters
                              ).map((c) => (
                                <Checkbox
                                  key={c.value}
                                  value={c.value.toString()}
                                  label={c.label}
                                  color="black"
                                />
                              ))}
                            </Group>
                          </Checkbox.Group>
                        </Popover.Dropdown>
                      </Popover>
                    </div>
                  </div>

                  {/* Method filter */}
                  <div className="av_option count_checkbox">
                    <div className="dropdown">
                      <Popover
                        width={200}
                        position="bottom-start"
                        shadow="md"
                        opened={methodDropDown}
                        onChange={() => toggleDropdown('method')}
                      >
                        <Popover.Target>
                          <button
                            className={
                              methodDropDown || method.length > 0 ? 'btn advance_active' : 'btn'
                            }
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            onClick={() => toggleDropdown('method')}
                            aria-expanded={methodDropDown}
                          >
                            {method.length > 0 && (
                              <i
                                className="fa-solid fa-xmark"
                                style={{ marginRight: '7px', fontSize: '15px' }}
                                onClick={() => setMethod([])}
                              />
                            )}
                            Method
                            {method.length > 0 && (
                              <span className="count ms-1">({method.length})</span>
                            )}
                            {methodDropDown ? (
                              <i className="fa-solid fa-caret-up advance-filter-arrow" />
                            ) : (
                              <i className="fa-solid advance-filter-arrow fa-caret-down" />
                            )}
                          </button>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Checkbox.Group
                            label={
                              <div className="d-flex align-items-center heading justify-content-between">
                                <div className="d-flex">
                                  <span>Method</span>
                                  <TTooltip
                                    label="Filter by Diamond Creation Method: CVD or HPHT."
                                    w="auto"
                                  >
                                    <span className="question_icon ms-1">
                                      <i className="fa-solid fa-question" />
                                    </span>
                                  </TTooltip>
                                </div>
                                {/* {method.length > 0 && ( */}
                                <i
                                  className="fa fa-close"
                                  onClick={(e) => closeDropdown(e, 'method')}
                                  aria-expanded={methodDropDown}
                                />
                                {/* )} */}
                              </div>
                            }
                            classNames={{ label: 'w-100' }}
                            value={method.map((c: any) => c.toString())}
                            onChange={(val) => {
                              setMethod(val.map((v) => Number(v)));
                              setKeepSkuuSearch(false);
                              setNotFetchFilter(false);
                              setIsFilterLoading(true);
                            }}
                          >
                            <Group mt="20" className="flex-column align-items-start">
                              {methodFilters.map((c) => (
                                <Checkbox
                                  key={c.value}
                                  value={c.value.toString()}
                                  label={c.label}
                                  color="black"
                                />
                              ))}
                            </Group>
                          </Checkbox.Group>
                        </Popover.Dropdown>
                      </Popover>
                    </div>
                  </div>

                  {/* Table filter */}
                  <div className="av_option">
                    <div className="dropdown">
                      <Popover
                        width={300}
                        position="bottom-start"
                        shadow="md"
                        opened={tableDropDown}
                        onChange={() => toggleDropdown('table')}
                      >
                        <Popover.Target>
                          <button
                            className={
                              tableDropDown ||
                              table[0] !== range.table.min ||
                              table[1] !== range.table.max
                                ? 'btn advance_active'
                                : 'btn'
                            }
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            onClick={() => toggleDropdown('table')}
                            aria-expanded={tableDropDown}
                          >
                            {(table[0] !== range.table.min || table[1] !== range.table.max) && (
                              <i
                                className="fa-solid fa-xmark"
                                style={{ marginRight: '7px', fontSize: '15px' }}
                                onClick={() => {
                                  setTable([range.table.min, range.table.max] as any);
                                  setNotFetchFilter(false);
                                  setKeepSkuuSearch(false);
                                  setTimeout(() => {
                                    if (
                                      query.table &&
                                      query.skuu &&
                                      Object.keys(query).length === 2
                                    ) {
                                      window.history.replaceState({}, '', window.location.pathname);
                                    }
                                    if (query.table && Object.keys(query).length === 1) {
                                      window.history.replaceState({}, '', window.location.pathname);
                                    }
                                  }, 200);
                                }}
                              />
                            )}
                            Table(%)
                            {(table[0] !== range.table.min || table[1] !== range.table.max) && (
                              <span className="table-number ms-1">
                                {Number(table[0].toFixed(2))} - {Number(table[1].toFixed(2))}
                              </span>
                            )}
                            {tableDropDown ? (
                              <i className="fa-solid fa-caret-up advance-filter-arrow" />
                            ) : (
                              <i className="fa-solid advance-filter-arrow fa-caret-down" />
                            )}
                          </button>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <div className="d-flex align-items-center heading pb-5 justify-content-between">
                            <div className="d-flex">
                              <span>Table</span>
                              <TTooltip
                                label='The "face" or table of a diamond can be around 53-64% of its average diameter. Different cuts and shapes may have varying table sizes.'
                                w="300"
                              >
                                <span className="question_icon ms-1">
                                  <i className="fa-solid fa-question" />
                                </span>
                              </TTooltip>
                            </div>
                            {/* {(table[0] !== range.table.min || table[1] !== range.table.max) && ( */}
                            <i
                              className="fa fa-close"
                              onClick={(e) => closeDropdown(e, 'table')}
                              aria-expanded={methodDropDown}
                            />
                            {/* )} */}
                          </div>
                          <div className="slider-box w-100 mt-3 mb-2">
                            <div className="input-box">
                              <div className="postion-relative">
                                <input
                                  type="number"
                                  value={Number(table[0].toFixed(2))}
                                  onFocus={(e) => e.target.select()}
                                  min={range.table.min}
                                  max={range.table.max}
                                  onChange={(e) => {
                                    setTable([Number(e.target.value), table[1]]);
                                    setNotFetchFilter(false);
                                    setKeepSkuuSearch(false);
                                  }}
                                />
                              </div>
                              <div className="postion-relative">
                                <input
                                  type="number"
                                  value={Number(table[1].toFixed(2))}
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    if (Number(e.target.value) > range.table.max) return;
                                    setTable([table[0], Number(e.target.value)]);
                                    setNotFetchFilter(false);
                                    setKeepSkuuSearch(false);
                                  }}
                                  min={range.table.min}
                                  max={range.table.max}
                                />
                              </div>
                            </div>
                            <TRangeSlider
                              label={() => null}
                              minRange={0}
                              showLabelOnHover={false}
                              min={range.table.min}
                              max={range.table.max}
                              step={0.01}
                              value={table}
                              onChange={(newValue) => {
                                setTable(newValue);
                                setNotFetchFilter(false);
                                setKeepSkuuSearch(false);
                              }}
                              className="table-slider-handles w-100"
                            />
                          </div>
                        </Popover.Dropdown>
                      </Popover>
                    </div>
                  </div>

                  {/* Depth filter */}
                  <div className="av_option">
                    <div className="dropdown">
                      <Popover
                        width={300}
                        position="bottom-start"
                        shadow="md"
                        opened={depthDropDown}
                        onChange={() => toggleDropdown('depth')}
                      >
                        <Popover.Target>
                          <button
                            className={
                              depthDropDown ||
                              depth[0] !== range.depth.min ||
                              depth[1] !== range.depth.max
                                ? 'btn advance_active'
                                : 'btn'
                            }
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            onClick={() => toggleDropdown('depth')}
                            aria-expanded={depthDropDown}
                          >
                            {(depth[0] !== range.depth.min || depth[1] !== range.depth.max) && (
                              <i
                                className="fa-solid fa-xmark"
                                style={{ marginRight: '7px', fontSize: '15px' }}
                                onClick={() => {
                                  setDepth([range.depth.min, range.depth.max] as any);
                                  setNotFetchFilter(false);
                                  setKeepSkuuSearch(false);
                                  setTimeout(() => {
                                    if (
                                      query.depth &&
                                      query.skuu &&
                                      Object.keys(query).length === 2
                                    ) {
                                      window.history.replaceState({}, '', window.location.pathname);
                                    }
                                    if (query.depth && Object.keys(query).length === 1) {
                                      window.history.replaceState({}, '', window.location.pathname);
                                    }
                                  }, 200);
                                }}
                              />
                            )}
                            Depth(%)
                            {(depth[0] !== range.depth.min || depth[1] !== range.depth.max) && (
                              <span className="depth-number ms-1">
                                {Number(depth[0].toFixed(2))} - {Number(depth[1].toFixed(2))}
                              </span>
                            )}
                            {depthDropDown ? (
                              <i className="fa-solid fa-caret-up advance-filter-arrow" />
                            ) : (
                              <i className="fa-solid advance-filter-arrow fa-caret-down" />
                            )}
                          </button>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <div className="d-flex align-items-center heading pb-5 justify-content-between">
                            <div className="d-flex">
                              <span>Depth</span>
                              <TTooltip
                                label="The weight hidden in the bottom, also called the pavilion, typically accounts for around 40-60% of the diamond’s total weight. This portion plays a crucial role in enhancing the stone’s overall brilliance and light performance."
                                w="300"
                              >
                                <span className="question_icon ms-1">
                                  <i className="fa-solid fa-question" />
                                </span>
                              </TTooltip>
                            </div>
                            {/* {(depth[0] !== range.depth.min || depth[1] !== range.depth.max) && ( */}
                            <i
                              onClick={(e) => closeDropdown(e, 'depth')}
                              aria-expanded={depthDropDown}
                              className="fa fa-close"
                            />
                            {/* )} */}
                          </div>
                          <div className="slider-box w-100 mt-3 mb-2">
                            <div className="input-box">
                              <div className="position-relative">
                                <input
                                  type="number"
                                  value={Number(depth[0].toFixed(2))}
                                  onFocus={(e) => e.target.select()}
                                  min={range.depth.min}
                                  max={range.depth.max}
                                  onChange={(e) => {
                                    setDepth([Number(e.target.value), depth[1]]);
                                    setNotFetchFilter(false);
                                    setKeepSkuuSearch(false);
                                  }}
                                />
                              </div>
                              <div className="position-relative">
                                <input
                                  type="number"
                                  value={Number(depth[1].toFixed(2))}
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    if (Number(e.target.value) > range.depth.max) return;
                                    setDepth([depth[0], Number(e.target.value)]);
                                    setNotFetchFilter(false);
                                    setKeepSkuuSearch(false);
                                  }}
                                  min={range.depth.min}
                                  max={range.depth.max}
                                />
                              </div>
                            </div>
                            <TRangeSlider
                              minRange={0}
                              label={() => null}
                              min={range.depth.min}
                              max={range.depth.max}
                              showLabelOnHover={false}
                              step={0.01}
                              value={depth}
                              onChange={(newValue) => {
                                setDepth(newValue);
                                setNotFetchFilter(false);
                                setKeepSkuuSearch(false);
                              }}
                              className="depth-slider-handles w-100"
                            />
                          </div>
                        </Popover.Dropdown>
                      </Popover>
                    </div>
                  </div>

                  {/* L/W Ratio filter */}
                  <div className="av_option">
                    <div className="dropdown">
                      <Popover
                        width={300}
                        position="bottom-start"
                        shadow="md"
                        opened={lwRetioDropDown}
                        onChange={() => toggleDropdown('lwretio')}
                      >
                        <Popover.Target>
                          <button
                            className={
                              lwRetioDropDown ||
                              lwratio[0] !== range.lw_ratio.min ||
                              lwratio[1] !== range.lw_ratio.max
                                ? 'btn advance_active'
                                : 'btn'
                            }
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            onClick={() => toggleDropdown('lwretio')}
                            aria-expanded={lwRetioDropDown}
                          >
                            {(lwratio[0] !== range.lw_ratio.min ||
                              lwratio[1] !== range.lw_ratio.max) && (
                              <i
                                className="fa-solid fa-xmark"
                                style={{ marginRight: '7px', fontSize: '15px' }}
                                onClick={() => {
                                  setLWRatio([range.lw_ratio.min, range.lw_ratio.max] as any);
                                  setNotFetchFilter(false);
                                  setKeepSkuuSearch(false);
                                  setTimeout(() => {
                                    if (
                                      query.lwratio &&
                                      query.skuu &&
                                      Object.keys(query).length === 2
                                    ) {
                                      window.history.replaceState({}, '', window.location.pathname);
                                    }
                                    if (query.lwratio && Object.keys(query).length === 1) {
                                      window.history.replaceState({}, '', window.location.pathname);
                                    }
                                  }, 200);
                                }}
                              />
                            )}
                            L/W Ratio
                            {(lwratio[0] !== range.lw_ratio.min ||
                              lwratio[1] !== range.lw_ratio.max) && (
                              <span className="lwratio-number ms-1">
                                {Number(lwratio[0].toFixed(2))} - {Number(lwratio[1].toFixed(2))}
                              </span>
                            )}
                            {lwRetioDropDown ? (
                              <i className="fa-solid fa-caret-up advance-filter-arrow" />
                            ) : (
                              <i className="fa-solid advance-filter-arrow fa-caret-down" />
                            )}
                          </button>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <div className="d-flex align-items-center heading pb-5 justify-content-between">
                            <div className="d-flex">
                              <span>L/W Ratio</span>
                              <TTooltip
                                label="The weight hidden in the bottom, also called the pavilion, typically accounts for around 40-60% of the diamond’s total weight. This portion plays a crucial role in enhancing the stone’s overall brilliance and light performance."
                                w="300"
                              >
                                <span className="question_icon ms-1">
                                  <i className="fa-solid fa-question" />
                                </span>
                              </TTooltip>
                            </div>
                            {/* {(lwratio[0] !== range.lw_ratio.min ||
                              lwratio[1] !== range.lw_ratio.max) && ( */}
                            <i
                              className="fa fa-close"
                              onClick={(e) => closeDropdown(e, 'lwretio')}
                              aria-expanded={lwRetioDropDown}
                            />
                            {/* )} */}
                          </div>
                          <div className="slider-box w-100 mt-3 mb-2">
                            <div className="input-box">
                              <input
                                type="number"
                                value={Number(lwratio[0].toFixed(2))}
                                onFocus={(e) => e.target.select()}
                                min={range.lw_ratio.min}
                                max={range.lw_ratio.max}
                                onChange={(e) => {
                                  setLWRatio([Number(e.target.value), lwratio[1]]);
                                  setNotFetchFilter(false);
                                  setKeepSkuuSearch(false);
                                }}
                              />
                              <input
                                type="number"
                                value={Number(lwratio[1].toFixed(2))}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  if (Number(e.target.value) > range.lw_ratio.max) return;
                                  setLWRatio([lwratio[0], Number(e.target.value)]);
                                  setNotFetchFilter(false);
                                  setKeepSkuuSearch(false);
                                }}
                                min={range.lw_ratio.min}
                                max={range.lw_ratio.max}
                              />
                            </div>
                            <TRangeSlider
                              minRange={0}
                              label={() => null}
                              min={range.lw_ratio.min}
                              showLabelOnHover={false}
                              max={range.lw_ratio.max}
                              step={0.01}
                              value={lwratio}
                              onChange={(newValue) => {
                                setLWRatio(newValue);
                                setNotFetchFilter(false);
                                setKeepSkuuSearch(false);
                              }}
                              className="lwratio-slider-handles w-100"
                            />
                          </div>
                        </Popover.Dropdown>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diamond type filter */}
            <div className="col-xxl-6 col-xl-6">
              <div className="d-flex align-items-center">
                <p className="ls_filter fw-600 mb-0 font_size_12">Type</p>
                <div className="d-flex align-items-center flex-wrap gap_10 ms-15 filter-type-button">
                  <button
                    type="button"
                    className={clsx(
                      'small_btn',
                      pathname.startsWith(paths.whiteDiamondInventory.root) && 'active'
                    )}
                    onClick={(e) =>
                      goToDiamondList(
                        e,
                        paths.whiteDiamondInventory.root
                        // query?.shape as string,
                        // query?.certificate as string
                      )
                    }
                  >
                    White Diamonds
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      'small_btn',
                      pathname.startsWith(paths.colorDiamondInventory.root) && 'active'
                    )}
                    onClick={(e) =>
                      goToDiamondList(
                        e,
                        paths.colorDiamondInventory.root
                        // query?.shape as string,
                        // query?.certificate as string
                      )
                    }
                  >
                    Fancy Color Diamonds
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search form */}
        <div className="filter_resultsec">
          <form>
            <div className="d-flex align-items-center flex-wrap">
              <div className="d-flex filter-button-group gap-2">
                <div className="view-button-group">
                  <button type="button" className="active">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.6668 4.61543H3.3335V3.33337H16.6668V4.61543Z" fill="#0B131A" />
                      <path d="M16.6668 15.8334H3.3335V14.5513H16.6668V15.8334Z" fill="#0B131A" />
                      <path d="M3.3335 10.2244H16.6668V8.94235H3.3335V10.2244Z" fill="#0B131A" />
                    </svg>
                  </button>
                  <button type="button">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.91321 3.33337C3.59304 3.33337 3.3335 3.59292 3.3335 3.91308V7.97105C3.3335 8.29122 3.59304 8.55076 3.91321 8.55076H7.97117C8.29134 8.55076 8.55088 8.29122 8.55088 7.97105V3.91308C8.55088 3.59292 8.29134 3.33337 7.97117 3.33337H3.91321ZM4.49292 7.39134V4.49279H7.39146V7.39134H4.49292Z"
                        fill="#0B131A"
                      />
                      <path
                        d="M12.0291 3.33337C11.709 3.33337 11.4494 3.59292 11.4494 3.91308V7.97105C11.4494 8.29122 11.709 8.55076 12.0291 8.55076H16.0871C16.4073 8.55076 16.6668 8.29122 16.6668 7.97105V3.91308C16.6668 3.59292 16.4073 3.33337 16.0871 3.33337H12.0291ZM12.6089 7.39134V4.49279H15.5074V7.39134H12.6089Z"
                        fill="#0B131A"
                      />
                      <path
                        d="M11.4494 12.029C11.4494 11.7088 11.709 11.4493 12.0291 11.4493H16.0871C16.4073 11.4493 16.6668 11.7088 16.6668 12.029V16.0869C16.6668 16.4071 16.4073 16.6667 16.0871 16.6667H12.0291C11.709 16.6667 11.4494 16.4071 11.4494 16.0869V12.029ZM12.6089 12.6087V15.5072H15.5074V12.6087H12.6089Z"
                        fill="#0B131A"
                      />
                      <path
                        d="M3.91321 11.4493C3.59304 11.4493 3.3335 11.7088 3.3335 12.029V16.0869C3.3335 16.4071 3.59304 16.6667 3.91321 16.6667H7.97117C8.29134 16.6667 8.55088 16.4071 8.55088 16.0869V12.029C8.55088 11.7088 8.29134 11.4493 7.97117 11.4493H3.91321ZM4.49292 15.5072V12.6087H7.39146V15.5072H4.49292Z"
                        fill="#0B131A"
                      />
                    </svg>
                  </button>
                </div>
                <div className="d-flex align-items-center serch_input_inventory">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by SKU/GIA/IGI/GCAL number"
                    value={search ?? searchText}
                    onChange={(e) => setSearch(e.target.value.toLocaleUpperCase())}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      handleKeyPress(e);
                      if (e.key === 'Enter') {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                  <button type="button" className="search_box" onClick={() => handleSearchText()}>
                    <i className="fa-solid fa-magnifying-glass" />
                  </button>
                </div>
                {/* Button trigger modal */}
                <button
                  type="button"
                  className="common_btn filter_btn black_border_btn mb-0 d-block d-lg-none fw-medium"
                  onClick={openModal}
                >
                  Filters
                </button>
              </div>
              <div className="d-flex align-items-center extra-shipping-box-container gap-3 ms-lg-3">
                <span className="filter-found mt-0 d-lg-none">
                  {showLoader ? (
                    <div className="d-flex">
                      <div className="text-center">
                        <Image
                          src={LoadingImage}
                          alt="loader"
                          className="me-1"
                          width={18}
                          height={18}
                        />
                      </div>{' '}
                      Results
                    </div>
                  ) : (
                    <div className="d-flex">
                      {isFilterLoading ? (
                        <div className="text-center">
                          <Image
                            src={LoadingImage}
                            alt="loader"
                            className="me-1"
                            width={18}
                            height={18}
                          />
                        </div>
                      ) : (
                        totalDiamond
                      )}{' '}
                      Results
                    </div>
                  )}
                </span>
                {!query.type && (
                  <div className="d-flex align-items-center gap-2 gap-sm-3">
                    <div className="d-flex align-items-center extra-shipping-box">
                      {/* <Image src={overNightImage} alt="overnight" width={20} height={20} />
                  <span>Overnight</span>
                  <TTooltip label="Over Night Shipping Means One Night Diamond Shipping" w={300}>
                    <span
                      className="question_icon"
                      data-bs-toggle="modal"
                      data-bs-target="#youtubeModal"
                    >
                      <i className="fa-solid fa-question" />
                    </span>
                  </TTooltip>

                  <Switch
                    checked={overNight}
                    color="rgba(0, 0, 0, 1)"
                    onChange={(event: any) => setOverNight(event.target.checked)}
                    size="xs"
                  /> */}
                      <TTooltip
                        label="Ship overnight if ordered by 1 AM (GMT-4). (Only USA)"
                        position="bottom"
                      >
                        <button
                          className={
                            overNight
                              ? 'shipping_btn_border shipping_btn d-none d-lg-flex'
                              : 'shipping_btn d-none d-lg-flex'
                          }
                          type="button"
                          onClick={() => {
                            setOverNight(!overNight);
                            setExpressShipping(false);
                            setKeepSkuuSearch(false);
                            setNotFetchFilter(false);
                            setIsFilterLoading(true);
                          }}
                        >
                          <Image src={overNightImage} alt="overNight" width={20} height={20} />
                          <span>Overnight</span>
                          {/* <TTooltip
                      label="Find loose diamonds ready to ship overnight if orders are placed before 11 AM. Delivery may vary if setting is required."
                      w={300}
                    >
                      <span
                        className="question_icon"
                        data-bs-toggle="modal"
                        data-bs-target="#youtubeModal"
                      >
                        <i className="fa-solid fa-question" />
                      </span>
                    </TTooltip> */}
                        </button>
                      </TTooltip>
                      <TTooltip
                        label="Ship overnight if ordered by 1 AM (GMT-4). (Only USA)"
                        position="bottom"
                      >
                        <button
                          className={
                            overNight
                              ? 'shipping_btn_border shipping_btn d-lg-none'
                              : 'shipping_btn d-lg-none'
                          }
                          type="button"
                        >
                          <Image
                            src={overNightImage}
                            alt="overNight"
                            width={20}
                            height={20}
                            onClick={() => {
                              setOverNight(!overNight);
                              setExpressShipping(false);
                              setKeepSkuuSearch(false);
                              setNotFetchFilter(false);
                              setIsFilterLoading(true);
                            }}
                          />
                          <span
                            onClick={() => {
                              setOverNight(!overNight);
                              setExpressShipping(false);
                              setKeepSkuuSearch(false);
                              setNotFetchFilter(false);
                              setIsFilterLoading(true);
                            }}
                          >
                            Overnight
                          </span>
                          {/* <Popover
                      zIndex={1200}
                      width={200} position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <Center className='question_icon ms-2'><i className="fa-solid fa-question" /></Center>
                      </Popover.Target>
                      <Popover.Dropdown className='filter-tooltip'>
                        <Text size="xs">Find loose diamonds ready to ship overnight if orders are placed before 11 AM. Delivery may vary if setting is required.</Text>
                      </Popover.Dropdown>
                    </Popover> */}
                        </button>
                      </TTooltip>
                    </div>
                    <div className="d-flex align-items-center extra-shipping-box">
                      {/* <Image src={ShippingImg} alt="express" width={20} height={20} />
                  <span>Express Shipping</span>
                  <TTooltip label="Express Shipping means faster delivery." w={300}>
                    <span
                      className="question_icon"
                      data-bs-toggle="modal"
                      data-bs-target="#youtubeModal"
                    >
                      <i className="fa-solid fa-question" />
                    </span>
                  </TTooltip>

                  <Switch
                    checked={expressShipping}
                    color="rgba(0, 0, 0, 1)"
                    onChange={(event: any) => setExpressShipping(event.target.checked)}
                    size="xs"
                  /> */}
                      <TTooltip label="Ship Within 3 Days." position="bottom">
                        <button
                          className={
                            expressShipping
                              ? 'shipping_btn_border shipping_btn d-none d-lg-flex'
                              : 'shipping_btn d-none d-lg-flex'
                          }
                          type="button"
                          onClick={() => {
                            setExpressShipping(!expressShipping);
                            setOverNight(false);
                            setKeepSkuuSearch(false);
                            setNotFetchFilter(false);
                            setIsFilterLoading(true);
                          }}
                        >
                          <Image src={ShippingImg} alt="express" width={20} height={20} />
                          <span>Express</span>
                          {/* <TTooltip
                      label="Find loose diamonds ready to ship within 3 days. Delivery may vary if setting is required."
                      w={300}
                    >
                      <span
                        className="question_icon"
                        data-bs-toggle="modal"
                        data-bs-target="#youtubeModal"
                      >
                        <i className="fa-solid fa-question" />
                      </span>
                    </TTooltip> */}
                        </button>
                      </TTooltip>
                      <TTooltip label="Ship Within 3 Days." position="bottom">
                        <button
                          className={
                            expressShipping
                              ? 'shipping_btn_border shipping_btn d-lg-none'
                              : 'shipping_btn d-lg-none'
                          }
                          type="button"
                        >
                          <Image
                            src={ShippingImg}
                            alt="express"
                            width={20}
                            height={20}
                            onClick={() => {
                              setExpressShipping(!expressShipping);
                              setOverNight(false);
                              setKeepSkuuSearch(false);
                              setNotFetchFilter(false);
                              setIsFilterLoading(true);
                            }}
                          />
                          <span
                            onClick={() => {
                              setExpressShipping(!expressShipping);
                              setOverNight(false);
                              setKeepSkuuSearch(false);
                              setNotFetchFilter(false);
                              setIsFilterLoading(true);
                            }}
                          >
                            Express
                          </span>
                          {/* <Popover
                      zIndex={1200}
                      width={200} position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <Center className='question_icon ms-2'><i className="fa-solid fa-question" /></Center>
                      </Popover.Target>
                      <Popover.Dropdown className='filter-tooltip'>
                        <Text size="xs">Find loose diamonds ready to ship within 3 days. Delivery may vary if setting is required.</Text>
                      </Popover.Dropdown>
                    </Popover> */}
                        </button>
                      </TTooltip>
                    </div>
                  </div>
                )}
              </div>
              <span className="filter-found d-none d-lg-inline">
                {showLoader ? (
                  <div className="d-flex">
                    <div className="text-center">
                      <Image
                        src={LoadingImage}
                        alt="loader"
                        className="me-1"
                        width={18}
                        height={18}
                      />
                    </div>{' '}
                    lab-grown diamonds result
                  </div>
                ) : (
                  <div className="d-flex">
                    {isFilterLoading ? (
                      <div className="text-center">
                        <Image
                          src={LoadingImage}
                          alt="loader"
                          className="me-1"
                          width={18}
                          height={18}
                        />
                      </div>
                    ) : (
                      totalDiamond
                    )}{' '}
                    lab-grown diamonds result
                  </div>
                )}
              </span>
              {(Object.keys(appliedFilters).length > 0 || query.sku || isSortFilterApplied) &&
              (!query.type as any) ? (
                <button
                  type="button"
                  className="d-lg-block d-none clear_btn"
                  onClick={() => {
                    handleRemoveTableID();
                    setIsFilterLoading(true);
                    setSearch('');
                    setTimeout(() => {
                      removeSku();
                      setSearch('');
                      clearFilters();
                      handleRemoveTableID();
                      router.replace(
                        {
                          pathname: paths.colorDiamondInventory.root,
                          // eslint-disable-next-line no-nested-ternary
                          query: window.location.search.includes('c_type')
                            ? 'c_type=diamond'
                            : query.type
                              ? `type=${query.type}`
                              : '',
                        },
                        undefined,
                        { scroll: false, shallow: true }
                      );
                    }, 200);
                  }}
                >
                  <Image src={ResetIcon} alt="" />
                  Reset Filters
                </button>
              ) : (
                (Object.keys(appliedFilters).length > 0 || query.sku || isSortFilterApplied) && (
                  <button
                    type="button"
                    className="d-lg-block d-none clear_btn"
                    onClick={() => {
                      handleRemoveTableID();
                      setIsFilterLoading(true);
                      setSearch('');
                      setTimeout(() => {
                        removeSku();
                        handleRemoveTableID();
                        setSearch('');
                        if (query.shape) {
                          clearFiltersForRingBuilder();
                        } else {
                          clearFilters();
                        }
                        router.replace(
                          {
                            pathname: window.location.pathname,
                            // eslint-disable-next-line no-nested-ternary
                            query: window.location.search.includes('c_type')
                              ? 'c_type=diamond'
                              : query.type
                                ? `type=${query.type}`
                                : '',
                          },
                          undefined,
                          { scroll: false, shallow: true }
                        );
                      }, 200);
                    }}
                  >
                    <Image src={ResetIcon} alt="" />
                    Reset Filters
                  </button>
                )
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Filter modal for small screen */}
      <ColorInventoryFilterModal
        title="Filters"
        position="top"
        zIndex="1100"
        opened={modalOpened}
        onClose={closeModal}
      />
    </>
  );
};

export default ColorInventoryFilter;

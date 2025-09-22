/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useMemo, useState, useEffect } from 'react';

import clsx from 'clsx';

import {
  Text,
  Group,
  Drawer,
  Center,
  Popover,
  Checkbox,
  Accordion,
  ScrollArea,
  DrawerProps,
} from '@mantine/core';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { useInventoryContext } from '@/stores/inventory.context';

import { TRangeSlider } from '@/components/ui/range-slider';
import {
  transformValue,
  reverseTransformValue,
} from '@/components/common-functions';

import { paths } from '@/routes/paths';
import LoadingImage from '@/assets/image/Loading.gif';

import ColorDiamond from './ColorDiamond';
import IntensityFilter from './IntensityFilter';
import ColorFilterShape from './ColorFilterShape';
import style from './ColorInventoryFilterModal.module.css';

// ----------------------------------------------------------------------

export type InventoryFilterModalProps = DrawerProps & {};

const InventoryFilterModal: FC<InventoryFilterModalProps> = (props) => {
  const { onClose, opened, zIndex, title, position } = props;

  const { pathname, query } = useRouter();
  const router = useRouter();

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
    shape,
    price,
    carat,
    cut,
    colors,
    clarity,
    intensity,
    certificate,
    method,
    table,
    depth,
    lwratio,
    totalDiamond,
    range,
    sort,
    //
    setTable,
    setDepth,
    setLWRatio,
    setMethod,
    setSearchText,
    setCertificate,
    setIntensity,
    setColors,
    setClarity,
    setCut,
    setCarat,
    setPrice,
    setShape,
    setKeepSkuuSearch,
    setNotFetchFilter,
    setIsFilterLoading,
    setRange,
    //
    isFilterApplied,
    isFilterLoading,
    appliedFilters,
    //
    clearFilters,
    clearFiltersForRingBuilder,
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
    //
    goToDiamondList,
  } = useInventoryFilter();

  const isSortFilterApplied = useMemo(() => !(sort?.price === 1 && sort?.sale === -1), [sort]);

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
    lwratio,
    price,
    range.depth.max,
    range.depth.min,
    range.lw_ratio.max,
    range.lw_ratio.min,
    range.table.max,
    range.table.min,
    setCarat,
    setDepth,
    setLWRatio,
    setPrice,
    setTable,
    table,
  ]);

  return (
    <Drawer
      zIndex={zIndex}
      opened={opened}
      onClose={onClose}
      position={position}
      scrollAreaComponent={ScrollArea.Autosize}
      classNames={{ ...style }}
    >
      <div className="filter-text d-flex align-items-baseline justify-content-center gap-1">
        <h4 className="mb-0">Filters</h4>
        <span className="d-flex justify-content-center align-items-center">
          {showLoader ? (
            <>
              (
              <div className="text-center">
                <Image src={LoadingImage} alt="loader" className="me-1" width={18} height={18} />
              </div>{' '}
              Results)
            </>
          ) : (
            <>
              (
              {isFilterLoading ? (
                <div className="text-center">
                  <Image src={LoadingImage} alt="loader" className="me-1" width={18} height={18} />
                </div>
              ) : (
                totalDiamond
              )}{' '}
              Results)
            </>
          )}
        </span>
      </div>
      <Accordion className="filter-accordion" defaultValue="Color">
        <Accordion.Item value="Color">
          <Accordion.Control className="pt-0">
            <div className="heading d-flex align-items-center">
              <span>Color</span>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="d-flex flex-wrap justify-content-center gap_10">
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
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center flex-column w-100">
                <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <span className="filter-popup-text pt-3 text-decoration-underline">
                      {' '}
                      Whats this?
                    </span>
                  </Popover.Target>
                  <Popover.Dropdown className="filter-tooltip filter-tooltip2">
                    <Text size="xs">
                      Diamond color measures the degree of colorlessness. Stones are graded on a
                      scale.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="Shape">
          <Accordion.Control>
            <div className="heading d-flex align-items-center">
              <span>Shape</span>
            </div>
          </Accordion.Control>
          <Accordion.Panel className="shapefilter-content px_0">
            <div className="pb-4 flex-xl-nowrap w-100 shapefilter">
              {shapeFilters.slice(0, 10).map((shapeFilter) => (
                <ColorFilterShape
                  key={shapeFilter.id}
                  {...shapeFilter}
                  value={shape}
                  setValue={setShape}
                />
              ))}
            </div>
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center flex-column w-100">
                <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <span className="filter-popup-text pt-3 text-decoration-underline">
                      {' '}
                      Whats this?
                    </span>
                  </Popover.Target>
                  <Popover.Dropdown className="filter-tooltip filter-tooltip2">
                    <Text size="xs">
                      A{` diamond's`} shape refers to the general silhouette of the stone when
                      viewed face up, not to be confused with the cut.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="Price">
          <Accordion.Control>
            <span>Price</span>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="slider-box w-100 mt-5 mb-35 px-2">
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
                value={price.map((p) => reverseTransformValue(p, range.price)) as [number, number]}
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
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="Carat">
          <Accordion.Control>
            <div className="heading d-flex align-items-center">
              <span>Carat</span>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="slider-box w-100 mt-5 mb-35">
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
                        Number(e.target.value) > range.carat.max ? range.carat.min : e.target.value
                      ),
                      carat[1],
                    ]);
                    setKeepSkuuSearch(false);
                    setNotFetchFilter(false);
                  }}
                />
                <input
                  type="number"
                  value={Number(carat[1].toFixed(2))}
                  onFocus={(e) => e.target.select()}
                  min={range.carat.min}
                  max={range.carat.max}
                  onChange={(e) => {
                    setCarat([
                      carat[0],
                      Number(e.target.value) > range.carat.max
                        ? range.carat.max
                        : Number(e.target.value),
                    ]);
                    setKeepSkuuSearch(false);
                    setNotFetchFilter(false);
                  }}
                />
              </div>
              <TRangeSlider
                minRange={1}
                min={range.carat.min}
                max={range.carat.max}
                showLabelOnHover={false}
                step={0.01}
                value={carat}
                label={() => null}
                onChange={(newValue) => {
                  setCarat(newValue);
                  setKeepSkuuSearch(false);
                  setNotFetchFilter(false);
                }}
                // marks={generateRangeOptions(range.carat.min, range.carat.max)}
                className="carat-slider-handles w-100"
              />
            </div>
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center flex-column w-100">
                <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <span className="filter-popup-text pt-3 text-decoration-underline">
                      {' '}
                      Whats this?
                    </span>
                  </Popover.Target>
                  <Popover.Dropdown className="filter-tooltip filter-tooltip2">
                    <Text size="xs">
                      Carat is a measurement of a diamonds weight. More carats = more money.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="Cut">
          <Accordion.Control>
            <div className="heading d-flex align-items-center">
              <span>Cut</span>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="mt-2">
              <div className="w-100">
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
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center flex-column w-100">
                <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <span className="filter-popup-text pt-3 text-decoration-underline">
                      {' '}
                      Whats this?
                    </span>
                  </Popover.Target>
                  <Popover.Dropdown className="filter-tooltip filter-tooltip2">
                    <Text size="xs">
                      A {`diamond's`} cut refers to how well it returns light; Excellent being ideal
                      standards, Poor being the lowest possible standards.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="Intensity">
          <Accordion.Control>
            <div className="heading d-flex align-items-center">
              <span>Intensity</span>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="d-flex flex-wrap flex-sm-nowrap justify-content-center gap-2 row-gap-4 pb-3">
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
                      ? colorDaimondFilters.find((c) => c.defaultValue === (colors as any))?.label
                      : undefined
                  }
                />
              ))}
            </div>
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center flex-column w-100">
                <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <span className="filter-popup-text pt-3 text-decoration-underline">
                      {' '}
                      Whats this?
                    </span>
                  </Popover.Target>
                  <Popover.Dropdown className="filter-tooltip filter-tooltip2">
                    <Text size="xs">
                      A light form of intensity that can be seen with the naked eye.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="Clarity">
          <Accordion.Control>
            <div className="heading d-flex align-items-center">
              <span>Clarity</span>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="mt-2">
              <div className="w-100">
                <TRangeSlider
                  minRange={1}
                  min={1}
                  showLabelOnHover={false}
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
                  className="clarity-slider-handles w-100 slider-box z-0"
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
            </div>
            <div className="d-flex align-items-center w-100">
              <div className="d-flex align-items-center flex-column w-100">
                <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <span className="filter-popup-text pt-3 text-decoration-underline">
                      {' '}
                      Whats this?
                    </span>
                  </Popover.Target>
                  <Popover.Dropdown className="filter-tooltip filter-tooltip2">
                    <Text size="xs">
                      Clarity refers to the number, size, and position of inclusions and blemishes.
                      Diamonds are graded on a scale from Flawless (no inclusions) to I3 (obvious
                      inclusions).
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="Type">
          <Accordion.Control>
            <span>Type</span>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="inventory-type-button mb-3">
              <button
                type="button"
                className={clsx(
                  'small_btn',
                  pathname.startsWith(paths.whiteDiamondInventory.root) && 'active'
                )}
                onClick={(e) =>
                  goToDiamondList(
                    e,
                    paths.whiteDiamondInventory.root,
                    query?.shape as string,
                    query?.certificate as string
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
                    paths.colorDiamondInventory.root,
                    query?.shape as string,
                    query?.certificate as string
                  )
                }
              >
                Fancy Color Diamonds
              </button>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <div className="d-flex align-items-start flex-wrap gap-2 my-2 my-sm-3">
          {/* Certificate filter */}
          <div className="av_option count_checkbox av_option_100">
            <div className="mb-2">
              <Checkbox.Group
                label={
                  <div className="d-flex align-items-center heading justify-content-between">
                    <div className="d-flex">
                      <span>Cerificate</span>
                      <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                        <Popover.Target>
                          <Center className="filter-popup-text question_icon ms-1">
                            {' '}
                            <i className="fa-solid fa-question" />
                          </Center>
                        </Popover.Target>
                        <Popover.Dropdown className="filter-tooltip filter-tooltip1">
                          <Text size="xs">Filter by Certificate Type</Text>
                        </Popover.Dropdown>
                      </Popover>
                    </div>
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
                <Group className="certificate-filter-checkbox align-items-start mt-2 gap-12">
                  {certificateFilters.map((c) => (
                    <Checkbox
                      key={c.value}
                      value={c.value.toString()}
                      label={c.label}
                      color="black"
                    />
                  ))}
                </Group>
              </Checkbox.Group>
            </div>
          </div>

          {/* Method filter */}
          <div className="av_option count_checkbox av_option_100">
            <div className="mb-2">
              <Checkbox.Group
                label={
                  <div className="d-flex align-items-center heading justify-content-between">
                    <div className="d-flex">
                      <span>Method</span>
                      <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                        <Popover.Target>
                          <Center className="filter-popup-text question_icon ms-1">
                            {' '}
                            <i className="fa-solid fa-question" />
                          </Center>
                        </Popover.Target>
                        <Popover.Dropdown className="filter-tooltip filter-tooltip1">
                          <Text size="xs">
                            Filter by Diamond Creation <br /> Method : CVD or HPHT.
                          </Text>
                        </Popover.Dropdown>
                      </Popover>
                    </div>
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
                <Group className="certificate-filter-checkbox align-items-start mt-2 gap-12">
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
            </div>
          </div>

          <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 w-100">
            {/* Table filter */}
            <div className="av_option av_option_100">
              <div className="dropdown">
                <div className="d-flex align-items-center heading padding-bottom-36 justify-content-between">
                  <div className="d-flex">
                    <span>Table</span>
                    <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <Center className="filter-popup-text question_icon ms-1">
                          {' '}
                          <i className="fa-solid fa-question" />
                        </Center>
                      </Popover.Target>
                      <Popover.Dropdown className="filter-tooltip">
                        <Text size="xs">
                          The &quot;face&quot; or table of a diamond can be around 53-64% of its
                          average diameter. Different cuts and shapes may have varying table sizes.
                        </Text>
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                </div>
                <div className="slider-box z-0 w-100 my-3">
                  <div className="input-box">
                    <input
                      type="number"
                      value={Number(table[0].toFixed(2))}
                      onFocus={(e) => e.target.select()}
                      min={range.table.min}
                      max={range.table.max}
                      onChange={(e) => {
                        setTable([Number(e.target.value), table[1]]);
                        setKeepSkuuSearch(false);
                        setNotFetchFilter(false);
                      }}
                    />
                    <input
                      type="number"
                      value={Number(table[1].toFixed(2))}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        if (Number(e.target.value) > range.table.max) return;
                        setTable([table[0], Number(e.target.value)]);
                        setKeepSkuuSearch(false);
                        setNotFetchFilter(false);
                      }}
                      min={range.table.min}
                      max={range.table.max}
                    />
                  </div>
                  <TRangeSlider
                    minRange={0}
                    label={() => null}
                    min={range.table.min}
                    max={range.table.max}
                    step={0.01}
                    value={table}
                    onChange={(newValue) => {
                      setTable(newValue);
                      setKeepSkuuSearch(false);
                      setNotFetchFilter(false);
                    }}
                    className="table-slider-handles w-100"
                  />
                </div>
              </div>
            </div>

            {/* Depth filter */}
            <div className="av_option av_option_100">
              <div className="dropdown">
                <div className="d-flex align-items-center heading padding-bottom-36 justify-content-between">
                  <div className="d-flex">
                    <span>Depth</span>
                    <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <Center className="filter-popup-text question_icon ms-1">
                          {' '}
                          <i className="fa-solid fa-question" />
                        </Center>
                      </Popover.Target>
                      <Popover.Dropdown className="filter-tooltip">
                        <Text size="xs">
                          The weight hidden in the bottom, also called the pavilion, typically
                          accounts for around 40-60% of the diamond`s total weight. This portion
                          plays a crucial role in enhancing the stone’s overall brilliance and light
                          performance.
                        </Text>
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                </div>
                <div className="slider-box z-0 w-100 my-3">
                  <div className="input-box">
                    <input
                      type="number"
                      value={Number(depth[0].toFixed(2))}
                      min={range.depth.min}
                      max={range.depth.max}
                      onChange={(e) => {
                        setDepth([Number(e.target.value), depth[1]]);
                        setKeepSkuuSearch(false);
                        setNotFetchFilter(false);
                      }}
                    />
                    <input
                      type="number"
                      value={Number(depth[1].toFixed(2))}
                      onChange={(e) => {
                        if (Number(e.target.value) > range.depth.max) return;
                        setDepth([depth[0], Number(e.target.value)]);
                        setKeepSkuuSearch(false);
                        setNotFetchFilter(false);
                      }}
                      min={range.depth.min}
                      max={range.depth.max}
                    />
                  </div>
                  <TRangeSlider
                    minRange={0}
                    label={() => null}
                    min={range.depth.min}
                    max={range.depth.max}
                    step={0.01}
                    value={depth}
                    onChange={(newValue) => {
                      setDepth(newValue);
                      setKeepSkuuSearch(false);
                      setNotFetchFilter(false);
                    }}
                    className="depth-slider-handles w-100"
                  />
                </div>
              </div>
            </div>

            {/* L/W Ratio filter */}
            <div className="av_option av_option_100">
              <div className="dropdown">
                <div className="d-flex align-items-center heading padding-bottom-36 justify-content-between">
                  <div className="d-flex">
                    <span>L/W Ratio</span>
                    <Popover zIndex={1200} width={200} position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <Center className="filter-popup-text question_icon ms-1">
                          {' '}
                          <i className="fa-solid fa-question" />
                        </Center>
                      </Popover.Target>
                      <Popover.Dropdown className="filter-tooltip filter-tooltip2">
                        <Text size="xs">
                          Length divided by width. Higher ratio = slender diamond, lower ratio =
                          broader diamond. Each shape has unique recommendations.
                        </Text>
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                </div>
                <div className="slider-box z-0 w-100 my-3">
                  <div className="input-box">
                    <input
                      type="number"
                      value={Number(lwratio[0].toFixed(2))}
                      onFocus={(e) => e.target.select()}
                      min={range.lw_ratio.min}
                      max={range.lw_ratio.max}
                      onChange={(e) => {
                        setLWRatio([Number(e.target.value), lwratio[1]]);
                        setKeepSkuuSearch(false);
                        setNotFetchFilter(false);
                      }}
                    />
                    <input
                      type="number"
                      value={Number(lwratio[1].toFixed(2))}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        if (Number(e.target.value) > range.lw_ratio.max) return;
                        setLWRatio([lwratio[0], Number(e.target.value)]);
                        setKeepSkuuSearch(false);
                        setNotFetchFilter(false);
                      }}
                      min={range.lw_ratio.min}
                      max={range.lw_ratio.max}
                    />
                  </div>
                  <TRangeSlider
                    minRange={0}
                    label={() => null}
                    min={range.lw_ratio.min}
                    max={range.lw_ratio.max}
                    step={0.01}
                    value={lwratio}
                    onChange={(newValue) => {
                      setLWRatio(newValue);
                      setKeepSkuuSearch(false);
                      setNotFetchFilter(false);
                    }}
                    className="lwratio-slider-handles w-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Accordion>
      <div className="inventory-filter-footer">
        <div className="button-group">
          <button className="common_btn" onClick={() => onClose()} type="button">
            View Result
          </button>
          {(Object.keys(appliedFilters).length > 0 || query.sku || isSortFilterApplied) &&
          (!query.type as any) ? (
            <button
              type="button"
              className="common_btn small_white_btn text-capitalize"
              onClick={() => {
                handleRemoveTableID();
                setIsFilterLoading(true);
                setSearchText('');
                setTimeout(() => {
                  removeSku();
                  setSearchText('');
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
              Reset Filters
            </button>
          ) : (
            (Object.keys(appliedFilters).length > 0 || query.sku || isSortFilterApplied) && (
              <button
                type="button"
                className="common_btn small_white_btn text-capitalize"
                onClick={() => {
                  handleRemoveTableID();
                  setIsFilterLoading(true);
                  setSearchText('');
                  setTimeout(() => {
                    removeSku();
                    setSearchText('');
                    clearFiltersForRingBuilder();
                    handleRemoveTableID();
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
                Reset Filters
              </button>
            )
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default InventoryFilterModal;

/* eslint-disable no-nested-ternary */
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { FC, useMemo, useState, useEffect } from 'react';

import clsx from 'clsx';

import { useInventoryFilter } from '@/hooks/useInventoryFilter';

import { useInventoryContext } from '@/stores/inventory.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import { paths } from '@/routes/paths';
import RingOneImg from '@/assets/image/icon/ring_1.svg';
import RingTwoImg from '@/assets/image/icon/ring_2.svg';
import RingThreeImg from '@/assets/image/icon/ring_3.svg';

// ----------------------------------------------------------------------

export type IRingBuilderBarProps = {
  currentStep?: 'choose-setting' | 'choose-diamond' | 'choose-size';
  currentShape?: string;
};

const RingBuilderBarForDiamondToRing: FC<IRingBuilderBarProps> = (props) => {
  const { currentStep, currentShape } = props;
  const { setShape, shapeMatch } = useInventoryContext();

  const pathname = usePathname();
  const { query } = useRouter();

  const isRingPreviewActive = pathname.startsWith('/ring-preview');

  const [chooseSettingActive, setchooseSettingActive] = useState<boolean>(false);
  const [chooseDiamondActive, setchooseDiamondActive] = useState<boolean>(false);

  useEffect(() => {
    // for default set active on choose setting
    if (
      chooseSettingActive === true &&
      chooseDiamondActive === true &&
      isRingPreviewActive === false
    ) {
      setchooseSettingActive(false);
    }
  }, [chooseDiamondActive, chooseSettingActive, isRingPreviewActive]);

  const { cutFilters, colorFilters, clarityFilters, colorDaimondFilters } = useInventoryFilter();
  const {
    ringSetting,
    ringDiamond,
    ringSize,
    resetRingBuilder,
    resetRingDiamondForDiamondToRing,
    resetRingSettingForDiamondToRing,
  } = useRingBuilderContext();

  const _selected_shape =
    ringSetting?.product?.diamond_type?.slug ||
    ringSetting?.product?.diamond_type?.[0]?.slug ||
    ringDiamond?.diamond?.shape;

  const isShowChooseRing = useMemo(() => {
    // for collection diamond details page
    // if (pathname.includes('/diamond/') && currentShape) {
    // if (query.c_type && _selected_shape !== currentShape) return false;
    // }
    // for collection inventory page
    if (!query.c_type) return true;
    if (query.c_type && _selected_shape === (query.shape || shapeMatch)) return true;
    if (query.c_type && !shapeMatch) return true;

    if (pathname.includes('/collections/') && _selected_shape) return true;

    return false;
  }, [_selected_shape, pathname, query.c_type, query.shape, shapeMatch]);

  const ringSettingUrl = useMemo(
    () =>
      ringSetting?.product?._id
        ? paths.product.details(
          `engagement-rings/${ringSetting.product?.display_slug}?type=diamond-to-ring-builder&view=true`
        )
        : '',
    [ringSetting]
  );

  const ringBuilderUrl = useMemo(
    () =>
      ringDiamond?.diamond?.shape
        ? `${paths.whiteDiamondInventory.root}?type=diamond-to-ring-builder&shape=${ringDiamond?.diamond?.shape}`
        : `${paths.whiteDiamondInventory.root}?type=diamond-to-ring-builder`,
    [ringDiamond?.diamond?.shape]
  );

  const ringDiamondUrl = useMemo(() => {
    if (!ringDiamond?.diamond) return '';

    const url =
      ringDiamond?.diamond_type === 'white'
        ? paths.whiteDiamondInventory.root
        : paths.colorDiamondInventory.root;

    // return `${url}?type=ring-builder&shape=${ringSetting?.product?.diamond_type?.[0]?.slug}`;
    return `${url}?type=diamond-to-ring-builder&shape=${ringDiamond.diamond.shape}`;
  }, [ringDiamond]);

  const ringSizeUrl = useMemo(
    () =>
      ringSetting?.product?._id
        ? `${paths.ringPreview.details(ringSetting.product._id)}?type=diamond-to-ring-builder`
        : '',
    [ringSetting]
  );

  const ringPrice = useMemo(() => {
    if (ringSetting?.product) {
      // const saleStartDate = ringSetting.product.sale_schedule.start_date
      //   ? new Date(ringSetting.product.sale_schedule.start_date)
      //   : null;
      // const saleEndDate = ringSetting.product.sale_schedule.end_date
      //   ? new Date(ringSetting.product.sale_schedule.end_date)
      //   : null;

      // if (
      //   saleStartDate &&
      //   saleEndDate &&
      //   saleStartDate <= new Date() &&
      //   saleEndDate >= new Date()
      // ) {
      //   return ringSetting.product.sale_price;
      // }

      // return ringSetting.product.regular_price;
      return ringSetting.variant ? ringSetting.variant.sale_price : ringSetting.product.sale_price;
    }

    return '';
  }, [ringSetting]);

  const diamondPrice = useMemo(() => {
    if (ringDiamond?.diamond) {
      return ringDiamond.diamond.price;

      // change when diamond sale status true

      // return ringDiamond.diamond.sale
      // ? ringDiamond.diamond.sale_price
      // : ringDiamond.diamond.regular_price;
    }

    return '';
  }, [ringDiamond?.diamond]);

  const diamondTitle = useMemo(() => {
    const shape = ringDiamond?.diamond?.shape;
    const carat = ringDiamond?.diamond?.carat;
    const color =
      ringDiamond?.diamond_type === 'white'
        ? colorFilters.find((_c) => _c.value === Number(ringDiamond?.diamond?.color))?.label_view
        : colorDaimondFilters.find((_c) => _c.defaultValue === Number(ringDiamond?.diamond?.color))
          ?.color;
    const clarity = clarityFilters.find(
      (_c) => _c.value === Number(ringDiamond?.diamond?.clarity)
    )?.label_view;
    const cut = cutFilters.find((_c) => _c.value === Number(ringDiamond?.diamond?.cut))?.label_view;
    return `${shape?.replaceAll('_', ' ')} Shape ${cut} Cut ${carat} Carat ${color} Color ${clarity} Clarity Lab Grown Diamond`;
  }, [cutFilters, ringDiamond, colorFilters, clarityFilters, colorDaimondFilters]);

  const diamond_color = colorDaimondFilters.find(
    (_c) => _c.defaultValue === Number(ringDiamond?.diamond?.color)
  )?.color;

  /**
   * Function to clear the ring diamond
   */
  const clearRingDiamond = (sku: string) => {
    resetRingDiamondForDiamondToRing(sku);
    setchooseDiamondActive(true);
  };

  return (
    <div className="container-fluid px-0 px-lg-3">
      <div className="ringbuilder_brdcrmb">
        <div className="active d-none d-lg-block">
          <span className="breadcrumb__inner ">
            <span className="breadcrumb__title breadcrumb__title_first">Build Your Ring</span>
          </span>
        </div>
        {/* Step: 1 Choose a Diamond */}
        <span
          className={clsx(
            (chooseDiamondActive === true
              ? ''
              : currentStep === 'choose-setting' ||
              currentStep === 'choose-diamond' ||
              currentStep === 'choose-size' ||
              ringDiamond?.diamond) && 'active'
          )}
        >
          <span className="breadcrumb__inner">
            <span className="breadcrumb__number">1</span>
            {ringDiamond?.diamond && isShowChooseRing ? (
              <div className="breadcrumb__details">
                <h6 className="text-capitalize">{diamondTitle}</h6>
                <div>
                  <span>${diamondPrice}</span>
                  <div className="d-flex">
                    <button
                      type="button"
                      onClick={() => clearRingDiamond(ringDiamond?.diamond?.sku as string)}
                    >
                      Clear
                    </button>
                    <Link
                      href={`${paths.diamondDetail.details(ringDiamond.diamond_type as 'white' | 'color', ringDiamond.diamond._id as string)}?type=diamond-to-ring-builder`}
                    >
                      View
                    </Link>
                    {/* <Link href={`${ringDiamondUrl}&sku=${ringDiamond.diamond.sku}`}>View</Link>  */}
                  </div>
                </div>
              </div>
            ) : (
              <Link href={ringBuilderUrl} className="text-decoration-none line-height-1">
                <span className="breadcrumb__title">Choose a Diamond</span>
              </Link>
            )}
            <div className="ring_box position-relative">
              {ringDiamond?.diamond_type === 'white' && isShowChooseRing ? (
                <Image
                  src={`/assets/images/whiteDiamond/${ringDiamond?.diamond?.shape}.png`}
                  alt="diamond"
                  width={30}
                  height={30}
                />
              ) : ringDiamond?.diamond_type === 'color' && isShowChooseRing ? (
                <Image
                  src={`/assets/images/colorDiamond/${ringDiamond?.diamond?.shape}/${diamond_color}.png`}
                  alt="colorDiamond"
                  width={40}
                  height={40}
                />
              ) : (
                <Image src={RingTwoImg.src} width={48} height={48} alt="ring_2" />
              )}
              {ringDiamond && isShowChooseRing && <i className="fa-solid fa-circle-check" />}
            </div>
          </span>
        </span>

        {/* Step: 2 Choose a Setting */}
        <span
          className={clsx(
            (chooseSettingActive === true || !isShowChooseRing
              ? ''
              : currentStep === 'choose-diamond' ||
              currentStep === 'choose-size' ||
              ringSetting?.product) && 'active'
          )}
        >
          <span className="breadcrumb__inner">
            <span className="breadcrumb__number ms-0">2</span>
            {ringSetting?.product && isShowChooseRing ? (
              <div className="breadcrumb__details">
                <h6>{ringSetting.product.name}</h6>
                <div>
                  <span>${ringPrice}</span>
                  <div className="d-flex">
                    <button
                      type="button"
                      onClick={() => [
                        resetRingSettingForDiamondToRing(),
                        setchooseSettingActive(true),
                      ]}
                    >
                      Clear
                    </button>
                    <Link href={ringSettingUrl}>View</Link>
                  </div>
                </div>
              </div>
            ) : (
              // <Link href={ringBuilderUrl} className="text-decoration-none line-height-1">
              <span className="breadcrumb__title">Choose a Setting</span>
              // </Link>
            )}
            <div className="ring_box position-relative">
              <Image
                src={
                  !isShowChooseRing
                    ? RingOneImg.src
                    : ringSetting?.variant
                      ? ringSetting?.variant?.image
                      : ringSetting?.product?.images?.[0] ?? RingOneImg.src
                }
                width={48}
                height={48}
                alt="ring_1"
              />
              {ringSetting && isShowChooseRing && <i className="fa-solid fa-circle-check" />}
            </div>
          </span>
        </span>

        {/* Step: 3 Complete Ring */}
        <span className={clsx(currentStep === 'choose-size' && 'active')}>
          <span className="breadcrumb__inner">
            <span className="breadcrumb__number">3</span>
            {ringDiamond && ringSetting && isShowChooseRing ? (
              <div className="breadcrumb__details">
                <h6>Complete Ring</h6>
                <div>
                  <span>${ringPrice + diamondPrice}</span>
                  <div className="d-flex">
                    <button
                      type="button"
                      onClick={() => {
                        resetRingBuilder();
                        setShape([]);
                      }}
                    >
                      <Link
                        className="m-0 p-0"
                        href={`${paths.whiteDiamondInventory.root}?type=diamond-to-ring-builder`}
                      >
                        Clear
                      </Link>
                    </button>
                    <Link href={ringSizeUrl}>View</Link>
                  </div>
                </div>
              </div>
            ) : (
              <span className="breadcrumb__title">Complete Ring</span>
            )}
            <div className="ring_box position-relative">
              <Image src={RingThreeImg.src} width={48} height={48} alt="ring_3" />
              {ringSize && ringDiamond && ringSetting && isShowChooseRing && (
                <i className="fa-solid fa-circle-check" />
              )}
            </div>
          </span>
        </span>
      </div>
    </div>
  );
};

export default RingBuilderBarForDiamondToRing;

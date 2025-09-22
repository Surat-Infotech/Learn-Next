/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { Modal } from '@mantine/core';

import { cartApi } from '@/api/cart';
import { IWhiteDiamond } from '@/api/inventory/types';
import { IColorDiamond } from '@/api/lab-created-colored-diamonds/types';

import { ICartItem, useCartContext } from '@/stores/cart.context';
import { useRingBuilderContext } from '@/stores/ring-builder.context';

import { paths } from '@/routes/paths';
import xIconSVG from '@/assets/image/x-symbol.svg';
import certificateImg from '@/assets/image/certificate.png';

// --------------------------------------------------------------------

type Props = {
  isOpen: boolean;
  setShowQualityCheckModal: (value: boolean) => void;
  currentDiamondData: IWhiteDiamond | IColorDiamond | null;
  isCheckRingQuery?: boolean;
};

export default function AddQualityCheckerDiamondToCartModal({
  isOpen,
  setShowQualityCheckModal,
  isCheckRingQuery,
  currentDiamondData,
}: Props) {
  const router = useRouter();
  const { data: auth, status } = useSession();
  const isRingDiamond =
    isCheckRingQuery || isCheckRingQuery === undefined
      ? ['ring-builder', 'diamond-to-ring-builder'].includes(router.query?.type as string) ||
        ['diamond'].includes(router.query?.c_type as string)
      : false;
  const { setRingDiamond, ringDiamond, ringSetting, setRingSetting } = useRingBuilderContext();
  const [loaderCart, setLoaderCart] = useState(false);
  const { setCartItems } = useCartContext();

  // Optional cleanup logic if needed
  useEffect(() => {
    if (!isOpen) setShowQualityCheckModal(false);
  }, [isOpen, setShowQualityCheckModal]);

  const _selected_shape =
    ringSetting?.product?.diamond_type?.slug ||
    ringSetting?.product?.diamond_type?.[0]?.slug ||
    ringDiamond?.diamond?.shape;

  const isShowChooseRing = useMemo(() => {
    if (!router.query.c_type) return true;
    if (router.query.c_type && _selected_shape === currentDiamondData?.shape) return true;
    return false;
  }, [_selected_shape, currentDiamondData?.shape, router.query.c_type]);

  const handleConfirm = async () => {
    try {
      setLoaderCart(true);
      if (
        currentDiamondData &&
        !currentDiamondData?.certificate &&
        [4, 5].includes(currentDiamondData?.certificate_type)
      ) {
        if (isRingDiamond) {
          setRingDiamond({
            diamond: currentDiamondData,
            diamond_type: (currentDiamondData as IColorDiamond)?.intensity ? 'color' : 'white',
          });

          if (router.query.c_type === 'diamond' && !isShowChooseRing) {
            setRingSetting(null);
            router.push(
              `${paths.buildRing.root}?type=diamond-to-ring-builder&shape=${currentDiamondData?.shape}`
            );
            return;
          }

          if (router.query.c_type === 'setting' && !isShowChooseRing) {
            setRingSetting(null);
            router.push(
              `${paths.buildRing.root}?type=ring-builder&shape=${currentDiamondData?.shape}`
            );
            return;
          }

          if (
            (router.query.type === 'diamond-to-ring-builder' ||
              router.query.c_type === 'diamond') &&
            ringSetting?.product
          ) {
            router.push(
              `${paths.ringPreview.details(ringSetting?.product?._id)}?type=diamond-to-ring-builder`
            );
            return;
          }

          if (
            (router.query.type === 'diamond-to-ring-builder' ||
              router.query.c_type === 'diamond') &&
            !ringSetting?.product
          ) {
            router.push(
              `${paths.buildRing.root}?type=diamond-to-ring-builder&shape=${currentDiamondData?.shape}`
            );
            return;
          }

          if (
            ringSetting?.product &&
            (router.query.type === 'ring-builder' || router.query.c_type === 'setting')
          ) {
            router.push(paths.ringPreview.details(ringSetting?.product?._id));
            return;
          }

          if (
            !ringSetting?.product &&
            (router.query.type === 'ring-builder' || router.query.c_type === 'setting')
          ) {
            router.push(
              `${paths.buildRing.root}?type=ring-builder&shape=${currentDiamondData?.shape}`
            );
          }

          if (ringSetting?.product) {
            router.push(
              `${paths.ringPreview.details(ringSetting?.product?._id)}?type=ring-builder`
            );
            return;
          }

          if (!ringSetting?.product && ringDiamond?.diamond) {
            router.push(paths.buildRing.root);
          }
        } else {
          if (!auth && status === 'unauthenticated') {
            setCartItems((prev) => [
              ...prev,
              {
                diamond_schema: currentDiamondData,
                type: 'diamond',
                diamond_type: (currentDiamondData as IColorDiamond)?.intensity ? 'color' : 'white',
                quantity: 1,
              } as ICartItem[] | any,
            ]);
            router.push(paths.cart.root);
            return;
          }

          const payload = {
            diamond_id: (currentDiamondData as IWhiteDiamond | IColorDiamond)._id,
          };
          await cartApi.add(payload);
          router.push(paths.cart.root);
        }
      }
    } catch (error) {
      console.error(error);
      setLoaderCart(false);
    } finally {
      setTimeout(() => {
        setLoaderCart(false);
      }, 1000);
    }
  };

  const renderButtonContent = () => {
    if (loaderCart) {
      return (
        <div className="spinner-border text-light inventory_loader w-100" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      );
    }
    return isRingDiamond ? 'Confirm and select the diamond' : 'Confirm and add to cart';
  };

  return (
    <Modal
      opened={isOpen}
      size="sm"
      onClose={() => setShowQualityCheckModal(false)}
      title={<h3 style={{ fontWeight: '700' }}>Quality Control Check</h3>}
      centered
      closeButtonProps={{
        icon: <Image src={xIconSVG.src} alt="X" height={16} width={16} />,
      }}
      classNames={{
        content: 'custom-modal-content',
      }}
    >
      <p style={{ fontSize: '14px' }}>
        Please note and confirm the following important information about this item before adding it
        to your cart:
      </p>

      <div className="d-flex gap-2 justify-start">
        <Image src={certificateImg.src} alt="Certificate" height={40} width={40} />
        <div>
          <strong style={{ fontSize: '14px', color: 'black', opacity: '0.8' }} className="d-block">
            This diamond does not come with a certificate.
          </strong>
          <p style={{ fontSize: '14px' }}>
            It is listed as a non-certified stone and is sold without any certification. Please
            confirm if you wish to proceed with this purchase.
          </p>
        </div>
      </div>

      <div className="d-flex flex-sm-row flex-column-reverse mt-3 gap-2 justify-content-between">
        <button
          onClick={() => setShowQualityCheckModal(false)}
          className="lscartbtn ls_add_to_cart2"
        >
          {`Don't add`}
        </button>
        <button
          type="button"
          style={{ minWidth: '200px' }}
          onClick={handleConfirm}
          className="lscartbtn ls_add_to_cart d-flex align-items-center justify-content-center"
        >
          {renderButtonContent()}
        </button>
      </div>
    </Modal>
  );
}

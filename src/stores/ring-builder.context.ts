import { useRouter } from 'next/router';

import constate from 'constate';
import { useLocalStorage } from 'usehooks-ts';

import { IProduct, IVariation } from '@/api/product';
import { IWhiteDiamond } from '@/api/inventory/types';
import { IColorDiamond } from '@/api/lab-created-colored-diamonds/types';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

export type IRingSetting = {
  product: IProduct | any | null | undefined;
  variant?: IVariation | null | undefined;
};

export type IRingDiamond = {
  diamond: IWhiteDiamond | IColorDiamond | null | undefined;
  diamond_type: 'white' | 'color' | null | undefined;
};
export type IDiamondSku = {
  type: 'diamond' | 'ring';
  sku: string;
};

export type IRingSize = {
  size: string;
};

const useRingBuilder = () => {
  const { push } = useRouter();
  const [ringSetting, setRingSetting] = useLocalStorage<IRingSetting | null>(
    'ring-builder-setting',
    null
  );
  const [ringDiamond, setRingDiamond] = useLocalStorage<IRingDiamond | null>(
    'ring-builder-diamond',
    null
  );
  const [ringSize, setRingSize] = useLocalStorage<IRingSize | null>('ring-builder-size', null);
  const [diamondSku, setDiamondSku] = useLocalStorage<IDiamondSku[]>('diamond-sku', []);

  const resetRingSetting = () => {
    setRingSetting(null);
    const path = ringDiamond
      ? `${paths.buildRing.root}?shape=${ringDiamond?.diamond?.shape}`
      : paths.buildRing.root;
    push(path);
  };

  const resetRingSettingForDiamondToRing = () => {
    setRingSetting(null);
    const path = ringDiamond
      ? `${paths.buildRing.root}?type=diamond-to-ring-builder&shape=${ringDiamond?.diamond?.shape}`
      : `${paths.whiteDiamondInventory.root}?type=diamond-to-ring-builder`;
    push(path);
  };

  const resetRingDiamond = (sku: string) => {
    setRingDiamond(null);
    const updateDiamondSku = diamondSku?.filter((item) => item.sku !== sku);
    setDiamondSku(updateDiamondSku);
    const path = ringSetting
      ? `${paths.whiteDiamondInventory.root}?type=ring-builder&shape=${ringSetting.product.diamond_type?.[0]?.slug || ringSetting.product.diamond_type?.slug}`
      : paths.buildRing.root;
    push(path);
  };

  const resetRingDiamondForDiamondToRing = (sku: string) => {
    setRingDiamond(null);
    const updateDiamondSku = diamondSku?.filter((item) => item.sku !== sku);
    setDiamondSku(updateDiamondSku);
    const path = ringSetting
      ? `${paths.whiteDiamondInventory.root}?type=diamond-to-ring-builder&shape=${ringSetting.product.diamond_type?.[0]?.slug || ringSetting.product.diamond_type?.slug}`
      : `${paths.whiteDiamondInventory.root}?type=diamond-to-ring-builder`;
    push(path);
  };

  const resetRingSize = () => {
    setRingSize(null);
  };

  const resetRingBuilder = () => {
    setRingSetting(null);
    setRingDiamond(null);
    setRingSize(null);
  };

  return {
    diamondSku,
    ringSetting,
    setRingSetting,
    resetRingSetting,
    resetRingSettingForDiamondToRing,
    //
    ringDiamond,
    setRingDiamond,
    resetRingDiamond,
    resetRingDiamondForDiamondToRing,
    //
    ringSize,
    setRingSize,
    setDiamondSku,
    resetRingSize,
    //
    resetRingBuilder,
  };
};

const [RingBuilderProvider, useRingBuilderContext] = constate(useRingBuilder);

export { RingBuilderProvider, useRingBuilderContext };

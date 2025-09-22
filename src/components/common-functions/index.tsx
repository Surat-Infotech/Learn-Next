export interface IAttArr {
  key: string;
  value: string;
}

export const findAttributesLabelValueObj = (attArr: IAttArr[], type: string) => {
  if (!attArr?.length) return {};

  const result: Record<string, string> = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const att of attArr) {
    const value = att.value.toLowerCase();

    if (value.includes('14k') || value.includes('18k') || value.includes('platinum')) {
      result.metal = att.value;
    } else if (value.includes('ctw') || value.includes('ct')) {
      result.carat_weight = att.value;
    } else if (['def', 'ghi'].includes(value)) {
      result.available_colors = att.value;
    } else if (['vvs', 'vs', 'si', 'vvs-vs', 'vs-si'].includes(value)) {
      result.purity = att.value;
    } else if (value.includes('back')) {
      result.back_setting = att.value;
    } else if (value.includes('carat') || value.includes('mm')) {
      result.size = att.value;
    } else if (Number(value) > 0) {
      if (type === 'wedding_ring') {
        result.ring_size = att.value;
      } else {
        result.bracelet_length = att.value;
      }
    } else {
      result[att.key] = att.value;
    }
  }

  return result;
};

// Reverse transformation from actual price to slider value
export function reverseTransformValue(
  price: number,
  priceRange: { min: number; max: number }
): number {
  const { min, max } = priceRange;
  if (price <= 6000) {
    return (price - min) * (50 / (6000 - min)); // min to 6000 range
  }
  return 50 + (price - 6000) * (50 / (max - 6000)); // 6000 to max range
}

// Function to transform the slider value to the actual price
export function transformValue(val: number, priceRange: { min: number; max: number }): number {
  const { min, max } = priceRange;

  if (val <= 50) {
    const result = min + val * ((6000 - min) / 50);
    return Math.round(result);
  }

  const result = 6000 + (val - 50) * ((max - 6000) / 50);
  return Math.round(result);
}

export const generateRangeOptions = (min: number, max: number) => {
  const options = [];

  const mid = parseFloat(((min + max) / 2).toFixed(2)); // calculate mid-point, round to 2 decimals

  options.push({ value: parseFloat(min.toFixed(2)), label: min.toFixed(2) }); // Min mark
  options.push({ value: mid, label: mid.toString() }); // Mid mark
  options.push({ value: parseFloat(max.toFixed(2)), label: max.toFixed(2) }); // Max mark

  return options;
};

export const getURLForProduct = (category_slug: any[], product_slug: string, category: any[]) => {
  const categoriesArr = category_slug?.map((c) => c.slug) || [];

  if (categoriesArr?.includes('melee-diamond')) {
    return 'product/lab-created-melee-diamond';
  }
  if (categoriesArr?.includes('round-shape-diamonds')) {
    return 'product/round-shape-calibrated-diamonds';
  }
  if (categoriesArr?.includes('princess-cut-diamonds')) {
    return 'product/princess-shape-cvd-type-lla-diamonds';
  }
  if (categoriesArr?.includes('pear-shape-diamonds')) {
    return 'product/pear-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('oval-cut-diamonds')) {
    return 'product/oval-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('oval-cut-diamonds')) {
    return 'product/oval-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('marquise-shape-diamonds')) {
    return 'product/marquise-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('heart-shape-diamonds')) {
    return 'product/heart-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('emerald-cut-diamonds')) {
    return 'product/emerald-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('fancy-pink-diamonds')) {
    return 'product/pink-color-diamond';
  }
  if (categoriesArr?.includes('intense-pink-diamonds')) {
    return 'product/intense-pink-color-diamond';
  }
  if (categoriesArr?.includes('fancy-yellow-diamonds')) {
    return 'product/yellow-color-diamond';
  }
  if (categoriesArr?.includes('light-green-diamonds')) {
    return 'product/green-color-diamond';
  }
  if (categoriesArr?.includes('fancy-purple-diamonds')) {
    return 'product/purple-color-diamond';
  }
  if (categoriesArr?.includes('fancy-blue-diamonds')) {
    return 'product/blue-color-diamond';
  }
  if (categoriesArr?.includes('cushion-cut-diamonds')) {
    return 'product/cushion-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('baguette-cut-diamonds')) {
    return 'product/baguette-shape-lab-grown-hpht-diamond';
  }
  if (categoriesArr?.includes('old-mine-cut-diamonds')) {
    return 'product/old-mine-cut-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('old-european-cut-diamonds')) {
    return 'product/old-european-cut-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('shield-shape–lab-grown-hpht-diamonds')) {
    return 'product/shield-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('hexagon-shape–lab-grown-hpht-diamonds')) {
    return 'product/hexagon-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('trapezoid-shape–lab-grown-hpht-diamonds')) {
    return 'product/trapezoid-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('tapper-baguette-shape–lab-grown-hpht-diamonds')) {
    return 'product/tapper-baguette-shape-lab-grown-hpht-diamonds';
  }
  if (categoriesArr?.includes('triangle-shape-diamonds')) {
    return 'product/triangle-shape-lab-grown-hpht-diamonds';
  }

  const findParentSlug: any = category?.find(
    (item) => categoriesArr.includes(item.slug) && item.slug
  );
  const findSubCategorySlug: any = categoriesArr.filter((item) => item !== findParentSlug?.slug);
  const viewSlug =
    findParentSlug?.slug !== undefined
      ? `${findParentSlug.slug}/${findSubCategorySlug?.[1] || findSubCategorySlug?.[0] || ''}/${product_slug}`
      : `${findSubCategorySlug?.[1] || findSubCategorySlug?.[0] || ''}/${product_slug}`;
  if (
    viewSlug.includes('rings') &&
    !viewSlug.includes('earrings') &&
    !viewSlug.includes('engagement-rings')
  ) {
    return `wedding-rings/${viewSlug.split('/')?.[1]}/${viewSlug.split('/').pop()}`;
  }
  return viewSlug;
};

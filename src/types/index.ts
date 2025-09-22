export type Range = {
  min: number;
  max: number;
};

export type Ranges = {
  carat: Range;
  depth: Range;
  lw_ratio: Range;
  price: Range;
  table: Range;
};

export type IRangeProperties = {
  range: Ranges
};

export type IFilterRangeProperties = {
  carat: Range;
  depth: Range;
  lw_ratio: Range;
  price: Range;
  table: Range;
};

export type IAppliedFilter = {
  shape?: string[];
  colors?: number; // for lab created color diamond
  price?: number[] | Range | any;
  carat?: number[] | Range | any;
  cut?: number[];
  color?: number[];
  clarity?: number[];
  intensity?: number[];
  certificate?: number[];
  method?: number[];
  table?: number[] | Range | any;
  depth?: number[] | Range | any;
  lwratio?: number[] | Range | any;
  lw_ratio?: number[] | Range | any;
  express_shipping?: boolean;
  is_overnight?: boolean;
  hearts_and_arrows?: boolean;
};

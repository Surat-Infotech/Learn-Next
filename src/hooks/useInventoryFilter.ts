import { useRouter } from 'next/router';
import { useMemo, useCallback } from 'react';

import { slice, omitBy } from 'lodash';

import { useRingBuilderContext } from '@/stores/ring-builder.context';

import { FilterShapeProps } from '@/sections/inventory/FilterShape';
import { ColorDiamondFilterProps } from '@/sections/lab-created-colored-diamonds/ColorDiamond';
import { IIntensityFilterProps } from '@/sections/lab-created-colored-diamonds/IntensityFilter';

import { IFilterRangeProperties } from '@/types';
import OvalImg from '@/assets/image/diamond/oval.svg';
import EmeraldImg from '@/assets/image/diamond/emerald.svg';
import AsscherImg from '@/assets/image/diamond/asscher.svg';
import RadiantImg from '@/assets/image/diamond/radiant.svg';
import KiteShapeImg from '@/assets/image/diamond/kite_shape.svg';
import OldMineDiamondImg from '@/assets/image/diamond/old-mine.svg';
import RoseCutShapeImg from '@/assets/image/diamond/rose_cut_shape.svg';
import RedColorDiamondImg from '@/assets/image/diamond/red_diamond.png';
import BaguetteShapeImg from '@/assets/image/diamond/baguette_shape.svg';
import HexagoneShapeImg from '@/assets/image/diamond/hexagone_shape.svg';
import TrapzoidShapeImg from '@/assets/image/diamond/trapzoid_shape.svg';
import HalfMoonShapeImg from '@/assets/image/diamond/half_moon_shape.svg';
import PinkColorDiamondImg from '@/assets/image/diamond/pink_diamond.png';
import BlueColorDiamondImg from '@/assets/image/diamond/blue_diamond.png';
import GrayColorDaimondImg from '@/assets/image/diamond/gray_diamond.png';
import GreenColorDiamondImg from '@/assets/image/diamond/green_diamond.png';
import BrownColorDiamnodImg from '@/assets/image/diamond/brown_diamond.png';
import BlackColorDaimondImg from '@/assets/image/diamond/black_diamond.png';
import TriangularShapeImg from '@/assets/image/diamond/triangular_shape.svg';
import YellowColorDiamondImg from '@/assets/image/diamond/yellow_diamond.png';
import PurpleColorDiamondImg from '@/assets/image/diamond/purple_diamond.png';
import OrangeColorDiamondImg from '@/assets/image/diamond/orange_diamond.png';
import OldEuropianShapeImg from '@/assets/image/diamond/old_europian_shape.svg';
import PearShapeLabCreatedDiamondImg from '@/assets/image/diamond/pearShape.svg';
import BaguetteTrapezoidShapeImg from '@/assets/image/diamond/baguette_trapezoid_shape.svg';
import RoundShapeLabGrownDiamondImg from '@/assets/image/diamond/round_shape_lab_grown_diamond.svg';
import RadientShapeLabCreatedDiamondImg from '@/assets/image/diamond/radient_shape_lab_created_diamond.svg';
import BuyMarquiseShapeAgapeDiamondsImg from '@/assets/image/diamond/buy_marquise_shape_agape_diamonds.svg';
import BuyHeartShapeLabCreatedDiamondImg from '@/assets/image/diamond/buy_heart_shape_lab_created_diamond.svg';
import BuyPrincessCutLabCreatedDiamondImg from '@/assets/image/diamond/buy_princess_cut_lab_created_diamond.svg';

// ----------------------------------------------------------------------

const shapeFilters: Omit<FilterShapeProps, 'value' | 'setValue'>[] = [
  {
    htmlFor: '1',
    id: '1',
    label: 'Round',
    name: '1',
    defaultValue: 'round',
    img: {
      src: RoundShapeLabGrownDiamondImg.src,
      alt: 'round_shape_lab_grown_diamond',
    },
  },
  {
    htmlFor: '2',
    id: '2',
    label: 'Princess',
    name: '2',
    defaultValue: 'princess',
    img: {
      src: BuyPrincessCutLabCreatedDiamondImg.src,
      alt: 'buy_princess_cut_lab_created_diamond',
    },
  },
  {
    htmlFor: '3',
    id: '3',
    label: 'Cushion',
    name: '3',
    defaultValue: 'cushion',
    img: {
      src: RadientShapeLabCreatedDiamondImg.src,
      alt: 'radient_shape_lab_created_diamond',
    },
  },
  {
    htmlFor: '4',
    id: '4',
    label: 'Oval',
    name: '4',
    defaultValue: 'oval',
    img: {
      src: OvalImg.src,
      alt: 'oval',
    },
  },
  {
    htmlFor: '5',
    id: '5',
    label: 'Emerald',
    name: '5',
    defaultValue: 'emerald',
    img: {
      src: EmeraldImg.src,
      alt: 'Emerald',
    },
  },
  {
    htmlFor: '6',
    id: '6',
    label: 'Pear',
    name: '6',
    defaultValue: 'pear',
    img: {
      src: PearShapeLabCreatedDiamondImg.src,
      alt: 'pear',
    },
  },
  {
    htmlFor: '7',
    id: '7',
    label: 'Asscher',
    name: '7',
    defaultValue: 'asscher',
    img: {
      src: AsscherImg.src,
      alt: 'asscher',
    },
  },
  {
    htmlFor: '8',
    id: '8',
    label: 'Radiant',
    name: '8',
    defaultValue: 'radiant',
    img: {
      src: RadiantImg.src,
      alt: 'Radiant',
    },
  },
  {
    htmlFor: '9',
    id: '9',
    label: 'Marquise',
    name: '9',
    defaultValue: 'marquise',
    img: {
      src: BuyMarquiseShapeAgapeDiamondsImg.src,
      alt: 'buy_marquise_shape_agape_diamonds',
    },
  },
  {
    htmlFor: '10',
    id: '10',
    label: 'Heart',
    name: '10',
    defaultValue: 'heart',
    img: {
      src: BuyHeartShapeLabCreatedDiamondImg.src,
      alt: 'buy_heart_shape_lab_created_diamond',
    },
  },
  {
    htmlFor: '11',
    id: '11',
    label: 'Rose Cut',
    name: '11',
    defaultValue: 'rose_cut',
    img: {
      src: RoseCutShapeImg.src,
      alt: 'rose_cut_shape',
    },
  },
  {
    htmlFor: '12',
    id: '12',
    label: 'Old European',
    name: '12',
    defaultValue: 'old_european',
    img: {
      src: OldEuropianShapeImg.src,
      alt: 'old_europian_shape',
    },
  },
  {
    htmlFor: '13',
    id: '13',
    label: 'Half Moon',
    name: '13',
    defaultValue: 'half_moon',
    img: {
      src: HalfMoonShapeImg.src,
      alt: 'half_moon_shape',
    },
  },
  {
    htmlFor: '14',
    id: '14',
    label: 'Baguette Trapezoid',
    name: '14',
    defaultValue: 'baguette_trapezoid',
    img: {
      src: BaguetteTrapezoidShapeImg.src,
      alt: 'baguette_trapezoid_shape',
    },
  },
  {
    htmlFor: '15',
    id: '15',
    label: 'Baguette',
    name: '15',
    defaultValue: 'baguette',
    img: {
      src: BaguetteShapeImg.src,
      alt: 'baguette_shape',
    },
  },
  {
    htmlFor: '16',
    id: '16',
    label: 'Hexagon',
    name: '16',
    defaultValue: 'hexagon',
    img: {
      src: HexagoneShapeImg.src,
      alt: 'hexagone_shape',
    },
  },
  {
    htmlFor: '17',
    id: '17',
    label: 'Kite',
    name: '17',
    defaultValue: 'kite',
    img: {
      src: KiteShapeImg.src,
      alt: 'kite_shape',
    },
  },
  {
    htmlFor: '18',
    id: '18',
    label: 'Old Mine',
    name: '18',
    defaultValue: 'old_mine',
    img: {
      src: OldMineDiamondImg.src,
      alt: 'old_mine',
    },
  },
  {
    htmlFor: '19',
    id: '19',
    label: 'Trapezoid',
    name: '19',
    defaultValue: 'trapezoid',
    img: {
      src: TrapzoidShapeImg.src,
      alt: 'trapzoid_shape',
    },
  },
  {
    htmlFor: '20',
    id: '20',
    label: 'Triangular',
    name: '20',
    defaultValue: 'triangular',
    img: {
      src: TriangularShapeImg.src,
      alt: 'triangular_shape',
    },
  },
];

const colorDaimondFilters: Omit<ColorDiamondFilterProps, 'value' | 'setValue'>[] = [
  {
    htmlFor: '1',
    id: '1',
    label: 'Yellow',
    color: 'yellow',
    name: '1',
    defaultValue: 1,
    img: {
      src: YellowColorDiamondImg.src,
      alt: 'yellow_color_diamond',
    },
  },
  {
    htmlFor: '2',
    id: '2',
    label: 'Pink',
    color: 'pink',
    name: '2',
    defaultValue: 2,
    img: {
      src: PinkColorDiamondImg.src,
      alt: 'pink_color_diamond',
    },
  },
  {
    htmlFor: '3',
    id: '3',
    label: 'Purple',
    color: 'purple',
    name: '3',
    defaultValue: 3,
    img: {
      src: PurpleColorDiamondImg.src,
      alt: 'purple_color_diamond',
    },
  },
  {
    htmlFor: '4',
    id: '4',
    label: 'Red',
    color: 'red',
    name: '4',
    defaultValue: 4,
    img: {
      src: RedColorDiamondImg.src,
      alt: 'red_color_diamond',
    },
  },
  {
    htmlFor: '5',
    id: '5',
    label: 'Blue',
    color: 'blue',
    name: '5',
    defaultValue: 5,
    img: {
      src: BlueColorDiamondImg.src,
      alt: 'blue_color_diamond',
    },
  },
  {
    htmlFor: '6',
    id: '6',
    label: 'Green',
    color: 'green',
    name: '6',
    defaultValue: 6,
    img: {
      src: GreenColorDiamondImg.src,
      alt: 'green_color_diamond',
    },
  },
  {
    htmlFor: '7',
    id: '7',
    label: 'Orange',
    color: 'orange',
    name: '7',
    defaultValue: 7,
    img: {
      src: OrangeColorDiamondImg.src,
      alt: 'orange_color_diamond',
    },
  },
  {
    htmlFor: '8',
    id: '8',
    label: 'Brown',
    color: 'brown',
    name: '8',
    defaultValue: 8,
    img: {
      src: BrownColorDiamnodImg.src,
      alt: 'brown_color_diamond',
    },
  },
  {
    htmlFor: '9',
    id: '9',
    label: 'Black',
    color: 'black',
    name: '9',
    defaultValue: 9,
    img: {
      src: BlackColorDaimondImg.src,
      alt: 'black_color_diamond',
    },
  },
  {
    htmlFor: '10',
    id: '10',
    label: 'Gray',
    color: 'gray',
    name: '10',
    defaultValue: 10,
    img: {
      src: GrayColorDaimondImg.src,
      alt: 'gray_color_diamond',
    },
  },
];

const intensityFilters: Omit<IIntensityFilterProps, 'value' | 'setValue'>[] = [
  {
    id: '1',
    label: 'Fancy Light',
    url_view: 'fancyLight',
    description: 'A Light Form Of Intensity That Can Be Seen With The Naked Eye. Fancy Light Diamonds Allow For Maximum Light Performance, While Also Showing Significant Color.',
    defaultValue: 1,
  },
  {
    id: '2',
    label: 'Fancy',
    url_view: 'fancy',
    description: 'The “Fancy” Intensity Indicates The Diamond Has Significant Color. The Shade Of The Color Is Neither Light Nor Too Intense.',
    defaultValue: 2,
  },
  {
    id: '3',
    label: 'Fancy Intense',
    url_view: 'fancyIntense',
    description: 'Fancy Intense Indicates Very Significant Color. The Color Intensity Can Be Clearer Seen, As The Color Saturation Is Much More Intense Than The “Fancy” Intensity Grade.',
    defaultValue: 3,
  },
  {
    id: '4',
    label: 'Fancy Vivid',
    url_view: 'fancyVivid',
    description: 'As The Name Indicated Fancy Vivid Color Diamonds Have Very Strong Color Saturation. The Fancy Vivid Is Often The Most Expensive Intensity Grade.',
    defaultValue: 4,
  },
  {
    id: '5',
    label: 'Fancy Deep',
    url_view: 'fancyDeep',
    description: 'On Of The Darkest Color Tones Available. Fancy Deep Diamonds Have Almost Full Color Saturation.',
    defaultValue: 5,
  },
  {
    id: '6',
    label: 'Fancy Dark',
    url_view: 'fancyDark',
    description: 'The Most Intense Color Tone Available. Fancy Dark Diamond Have Full Color Saturation With Minimal Room For Additional Light Properties.',
    defaultValue: 6,
  },
];

const priceFilters = {
  min: 100,
  max: 100000,
};

const caratFilters = {
  min: 0,
  max: 35,
};

const cutFilters = [
  {
    value: 1,
    // label: 'Good',
    label_view: 'Good',
    url_view: 'good',
    convertedURL: 'good',
    description: 'Quality Cut With Good Proportions To Return Most Light That Enters.',
    // description: '',
  },
  {
    value: 2,
    // label: 'Very Good',
    label_view: 'Very Good',
    url_view: 'very-good',
    convertedURL: 'veryGood',
    description: 'High-Quality Cut With Good Proportions That Return Almost All Light That Enters.',
    // description: '',
  },
  {
    value: 3,
    // label: 'Excellent',
    label_view: 'Excellent',
    url_view: 'excellent',
    convertedURL: 'excellent',
    description: 'High-Quality Cut With Near-Perfect Proportions That Return Nearly All Light That Enters.',
    // description: '',
  },
  {
    value: 4,
    // label: 'Ideal',
    label_view: 'Ideal',
    url_view: 'ideal',
    convertedURL: 'ideal',
    description: 'Perfectly-Proportioned To Return All Light That Enters For Maximum Fire. Only 5% Of Mined Diamonds Meet This Standard.',
    // description: '',
  },
  {
    value: 5,
    // label: 'Ideal',
    description: 'Perfectly-Proportioned To Return All Light That Enters For Maximum Fire. Only 5% Of Mined Diamonds Meet This Standard.',
    // description: '',
  },
];

const colorFilters = [
  {
    value: 1,
    // label: 'M',
    label_view: 'M',
    url_view: 'M',
    description: "Have A Definite Yellow Tint That's Visible To The Naked Eye. Like K And L Diamonds, M Color Diamonds Offer Fantastic Value For Money.",
    // description: '',
  },
  {
    value: 2,
    // label: 'L',
    label_view: 'L',
    url_view: 'L',
    description: 'Color Is Most Noticeable When Viewed From The Side, Have A Slightly Yellow Tone.',
    // description: '',
  },
  {
    value: 3,
    // label: 'K',
    label_view: 'K',
    url_view: 'K',
    description: 'Color Noticeable With The Naked Eye. There Are Several Color Grades That Are Lower Than K.',
    // description: '',
  },
  {
    value: 4,
    // label: 'J',
    label_view: 'J',
    url_view: 'J',
    description: 'Color Noticeable When Seen Side-By-Side With Diamonds Of Better Grades. Good Value.',
    // description: '',
  },
  {
    value: 5,
    // label: 'I',
    label_view: 'I',
    url_view: 'I',
    description: 'Slight Color Noticeable When Seen Side-By-Side With Diamonds Of Better Grades. Great Value.',
    // description: '',
  },
  {
    value: 6,
    // label: 'H',
    label_view: 'H',
    url_view: 'H',
    description: 'Nearly Colorless. Slight Color May Be Noticeable When Seen Side-By-Side With Diamonds Of Better Grades. Excellent Value.',
    // description: '',
  },
  {
    value: 7,
    // label: 'G',
    label_view: 'G',
    url_view: 'G',
    description: 'Nearly Colorless. Gemologists Will Be Able To Detect Some Color, But Appears Colorless To Non-Experts. Excellent Value.',
    // description: '',
  },
  {
    value: 8,
    // label: 'F',
    label_view: 'F',
    url_view: 'F',
    description: 'Almost Colorless, With Slight Color Visible To Expert Gemologists. Still Considered A Very High Quality Grade.',
    // description: '',
  },
  {
    value: 9,
    // label: 'E',
    label_view: 'E',
    url_view: 'E',
    description: 'Almost Completely Colorless. So Close To Perfectly Colorless, Only Expert Gemologists May Be Able To Detect Any Color.',
    // description: '',
  },
  {
    value: 10,
    // label: 'D',
    label_view: 'D',
    url_view: 'D',
    description: 'Completely Colorless, Displaying The Most Desirable Icy White Brilliance. Very Rare In Nature And The Most Expensive Color.',
    // description: '',
  },
  {
    value: 11,
    // label: 'D',
    label_view: '',
    url_view: '',
    // description: 'Completely Colorless, Displaying The Most Desirable Icy White Brilliance. Very Rare In Nature And The Most Expensive Color.',
    description: '',
  },
];

const REAL_COLOR_OPTIONS = [
  { value: 1, label_view: 'Yellow', color: 'yellow', url_view: 'Yellow' },
  { value: 2, label_view: 'Pink', color: 'pink', url_view: 'Pink' },
  { value: 3, label_view: 'Purple', color: 'purple', url_view: 'Purple' },
  { value: 4, label_view: 'Red', color: 'red', url_view: 'Red' },
  { value: 5, label_view: 'Blue', color: 'blue', url_view: 'Blue' },
  { value: 6, label_view: 'Green', color: 'green', url_view: 'Green' },
  { value: 7, label_view: 'Orange', color: 'orange', url_view: 'Orange' },
  { value: 8, label_view: 'Brown', color: 'brown', url_view: 'Brown' },
  { value: 9, label_view: 'Black', color: 'black', url_view: 'Black' },
  { value: 10, label_view: 'Gray', color: 'gray', url_view: 'Gray' },
];

const clarityFilters = [
  {
    value: 1,
    // label: 'I2',
    label_view: 'I2',
    url_view: 'I2',
    description: 'Obvious Inclusions Which Can Be Easily Seen Using A 10x Loupe (And Even With The Naked Eyes).',
  },
  {
    value: 2,
    // label: 'I1',
    label_view: 'I1',
    url_view: 'I1',
    description: 'Included. Inclusions Are Very Easy To See Under 10x Magnification And May Be Seen With The Naked Eye.',
  },
  {
    value: 3,
    // label: 'SI3',
    label_view: 'SI3',
    url_view: 'SI3',
    description: 'Obvious Inclusions Which Can Be Easily Seen Using A 10x Loupe (And Even With The Naked Eyes).',
  },
  {
    value: 4,
    // label: 'SI2',
    label_view: 'SI2',
    url_view: 'SI2',
    description: 'Slightly Included With More Inclusions Than SI1. Easily Seen By An Expert Under 10x Magnification But Difficult To See With The Naked Eye.',
  },
  {
    value: 5,
    // label: 'SI1',
    label_view: 'SI1',
    url_view: 'SI1',
    description: 'Slightly Included. Easily Seen By An Expert Under 10x Magnification But Difficult To See With The Naked Eye.',
  },
  {
    value: 6,
    // label: 'VS2',
    label_view: 'VS2',
    url_view: 'VS2',
    description: 'Very Slightly Included. Easier For An Expert To See Inclusions Under 10x Magnification, And Generally Not Visible To The Naked Eye; Slightly More Inclusions Than VS1.',
  },
  {
    value: 7,
    // label: 'VS1',
    label_view: 'VS1',
    url_view: 'VS1',
    description: 'Very Slightly Included. Easier For An Expert To See Inclusions Under 10x Magnification, And Generally Not Visible To The Naked Eye.',
  },
  {
    value: 8,
    // label: 'VVS2',
    label_view: 'VVS2',
    url_view: 'VVS2',
    description: 'Very, Very Slightly Included. Extremely Small Inclusions Are Difficult For An Expert To See Under 10x Magnification And Invisible To The Naked Eye; Slightly More Inclusions Than VVS1.',
  },
  {
    value: 9,
    // label: 'VVS1',
    label_view: 'VVS1',
    url_view: 'VVS1',
    description: 'Very, Very Slightly Included. Extremely Small Inclusions Are Difficult For An Expert To See Under 10x Magnification And Invisible To The Naked Eye.',
  },
  {
    value: 10,
    // label: 'IF',
    label_view: 'IF',
    url_view: 'IF',
    description: 'Internally Flawless. The Highest Clarity Grade, With No Flaws Or Inclusions. Very Rare And Expensive.',
  },
  {
    value: 11,
    // label: 'FL',
    label_view: 'FL',
    url_view: 'FL',
    description: 'Flawless Diamonds. The highest grade of diamond clarity, with no visible inclusions or blemishes. Very rare and expensive.',
  },
  {
    value: 12,
    // label: 'FL',
    description: 'Flawless Diamonds. The highest grade of diamond clarity, with no visible inclusions or blemishes. Very rare and expensive.',
  },
];
const certificateFilters = [
  { value: 1, label: 'IGI', url_view: 'IGI' },
  { value: 2, label: 'GIA', url_view: 'GIA' },
  { value: 3, label: 'GCAL', url_view: 'GCAL' },
  { value: 4, label: 'NON CERTIFIED', url_view: 'NON_CERTIFIED' },
  { value: 5, label: 'MATCHING PAIR', url_view: 'MATCHING_PAIR' },
];

const methodFilters = [
  { value: 1, label: 'HPHT', url_view: 'HPHT' },
  { value: 2, label: 'CVD', url_view: 'CVD' },
];

const tableFilters = {
  min: 50,
  max: 80,
};

const depthFilters = {
  min: 46,
  max: 78,
};

const lwratioFilters = {
  min: 1,
  max: 2.75,
};

export type IDefaultFilter = {
  shape: string[];
  colors: number; // for lab created color diamond
  price: number[];
  carat: number[];
  cut: number[];
  color: number[];
  clarity: number[];
  intensity: number[];
  certificate: number[];
  method: number[];
  table: number[];
  depth: number[];
  lwratio: number[];
  express_shipping: boolean;
  is_overnight: boolean;
  hearts_and_arrows: boolean;
};

// type IFilterRangeProperties = {
//   price: {
//     min: number;
//     max: number;
//   };
//   carat: {
//     min: number;
//     max: number;
//   };
// };
export const useInventoryFilter = () => {
  const defaultSearch = '';

  const { query, push } = useRouter();
  const { ringSetting, ringDiamond } = useRingBuilderContext();

  const defaultFilter = useMemo(
    () => ({
      shape: query.shape ? [query.shape as string] : [],
      colors: -1,
      price: [priceFilters.min, priceFilters.max],
      carat: [caratFilters.min, caratFilters.max],
      cut: [cutFilters[0].value, cutFilters[cutFilters.length - 1].value],
      color: [colorFilters[0].value, colorFilters[colorFilters.length - 1].value],
      clarity: [clarityFilters[0].value, clarityFilters[clarityFilters.length - 1].value],
      intensity: [] as number[],
      certificate: [] as number[],
      method: [] as number[],
      express_shpping: false as boolean,
      table: [tableFilters.min, tableFilters.max],
      depth: [depthFilters.min, depthFilters.max],
      lwratio: [lwratioFilters.min, lwratioFilters.max],
      express_shipping: false,
      is_overnight: false,
      hearts_and_arrows: false,
    }),

    [query.shape]
  );

  const getRequestFilters = useCallback(
    (filter: IDefaultFilter, range: IFilterRangeProperties) => {
      const {
        shape,
        price,
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
        colors,
        express_shipping,
        is_overnight,
        hearts_and_arrows,
      } = filter;

      // Remove default filters if not changed
      const filters = {
        shape: shape?.length === 0 ? undefined : shape,
        colors: colors === -1 ? undefined : [colors],
        price:
          range.price.min === price[0] && range.price.max === price[1]
            ? undefined
            : {
              min: price[0],
              max: price[1],
            },
        carat:
          range.carat.min === carat[0] && range.carat.max === carat[1]
            ? undefined
            : {
              min: carat[0],
              max: carat[1],
            },
        cut:
          defaultFilter.cut[0] === cut[0] && defaultFilter.cut[1] === cut[1]
            ? undefined
            : slice(cutFilters, cut[0] - 1, cut[1]).map((i) => i.value),
        color:
          defaultFilter.color[0] === color[0] && defaultFilter.color[1] === color[1]
            ? undefined
            : slice(colorFilters, color[0] - 1, color[1]).map((i) => i.value),
        clarity:
          defaultFilter.clarity[0] === clarity[0] && defaultFilter.clarity[1] === clarity[1]
            ? undefined
            : slice(clarityFilters, clarity[0] - 1, clarity[1]).map((i) => i.value),
        intensity: intensity.length === 0 ? undefined : intensity,
        certificate_type: certificate.length === 0 ? undefined : certificate,
        d_type: method.length === 0 ? undefined : method,
        table:
          range.table.min === table[0] && range.table.max === table[1]
            ? undefined
            : { min: table[0].toString(), max: table[1].toString() },
        depth:
          range.depth.min === depth[0] && range.depth.max === depth[1]
            ? undefined
            : { min: depth[0].toString(), max: depth[1].toString() },
        lw_ratio:
          lwratio[0] === range.lw_ratio.min && lwratio[1] === range.lw_ratio.max
            ? undefined
            : { min: lwratio[0].toString(), max: lwratio[1].toString() },
        express_shipping:
          defaultFilter.express_shipping === express_shipping ? undefined : express_shipping,
        is_overnight: defaultFilter.is_overnight === is_overnight ? undefined : is_overnight,
        hearts_and_arrows:
          defaultFilter.hearts_and_arrows === hearts_and_arrows ? undefined : hearts_and_arrows,
      };

      return omitBy(
        filters,
        (value) => value === undefined || (Array.isArray(value) && value.length === 0)
      );
    },
    [defaultFilter]
  );

  const goToDiamondList = (e: any, url: string, shape?: string, certificate?: string) => {
    const __shape = ringSetting?.product?.diamond_type?.slug || ringSetting?.product?.diamond_type?.[0]?.slug || ringDiamond?.diamond?.shape || shape;
    if (query.type && __shape) {
      push(`${url}?type=${query.type}&shape=${__shape}`);
    } else if (shape) {
      push(`${url}?shape=${query.shape}`);
    } else if (certificate) {
      push(`${url}?certificate=${query.certificate}`);
    } else if (e.ctrlKey || e.metaKey) {
      // Prevent the default behavior of the Link component
      e.preventDefault();
      // Open the link in a new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (query.type && !__shape) {
      push(`${url}?type=${query.type}`);
    } else {
      push(url);
    }
  };
  return {
    defaultSearch,
    defaultFilter,
    //
    shapeFilters,
    colorDaimondFilters,
    priceFilters,
    caratFilters,
    cutFilters,
    intensityFilters,
    colorFilters,
    clarityFilters,
    certificateFilters,
    methodFilters,
    tableFilters,
    depthFilters,
    lwratioFilters,
    REAL_COLOR_OPTIONS,
    //
    getRequestFilters,
    //
    goToDiamondList,
  };
};

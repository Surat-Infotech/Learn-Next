import { useMemo } from 'react';

import { useLocalStorage } from 'usehooks-ts';
import { useQuery } from '@tanstack/react-query';

import { productCategoriesQuery } from '@/api/product-category';

import { IRingDiamond, useRingBuilderContext } from '@/stores/ring-builder.context';

import { paths } from '@/routes/paths';
import pearImg from '@/assets/image/vectors/pear.svg';
import ovalImg from '@/assets/image/vectors/oval.svg';
import bezelImg from '@/assets/image/vectors/bezel.svg';
import roundImg from '@/assets/image/vectors/round.svg';
import heartImg from '@/assets/image/vectors/heart.svg';
import uniqueImg from '@/assets/image/vectors/unique.svg';
import daintyImg from '@/assets/image/vectors/dainty.svg';
import clusterImg from '@/assets/image/vectors/cluster.svg';
import emeraldImg from '@/assets/image/vectors/emerald.svg';
import radiantImg from '@/assets/image/vectors/radiant.svg';
import asscherImg from '@/assets/image/vectors/asscher.svg';
import cushionImg from '@/assets/image/vectors/cushion.svg';
import marquiseImg from '@/assets/image/vectors/marquise.svg';
import princessImg from '@/assets/image/vectors/princess.svg';
import solitaireImg from '@/assets/image/vectors/solitaire.svg';
import haloRingsImg from '@/assets/image/vectors/halo-rings.svg';
import threeStoneImg from '@/assets/image/vectors/three-stone.svg';
import hiddenHaloImg from '@/assets/image/vectors/hidden-halo.svg';
import chainImg from '@/assets/image/fine-jewelry/NecklaceIcon.svg';
import diamondBandImg from '@/assets/image/vectors/diamond-band.svg';
import vintageRingsImg from '@/assets/image/vectors/vintage-rings.svg';
import studEarringImg from '@/assets/image/fine-jewelry/Stud-Earrings.svg';
import haloEarringImg from '@/assets/image/fine-jewelry/Halo Earrings.svg';
import diamondRingImg from '@/assets/image/fine-jewelry/Diamond Rings.svg';
import etenityRingImg from '@/assets/image/fine-jewelry/Eternity Rings.svg';
import haloPendantsImg from '@/assets/image/fine-jewelry/Halo Pendants.svg';
import clusterEarringsImg from '@/assets/image/vectors/cluster-earrings.svg';
import stackableRingImg from '@/assets/image/fine-jewelry/Stackable Rings.svg';
import diamondPendantsImg from '@/assets/image/fine-jewelry/Diamond Pendant.svg';
import tennisBraceletsImg from '@/assets/image/fine-jewelry/Tennis Bracelets.svg';
import annivarsaryRingImg from '@/assets/image/fine-jewelry/Anniversary Rings.svg';
import solitairePendantsImg from '@/assets/image/fine-jewelry/Solitaire Pendants.svg';
import hoopsAndDropsEarringImg from '@/assets/image/fine-jewelry/Hoops & Drops Earrings.svg';
import readyToShipImg from '@/assets/image/ready-to-ship.svg';

export const useNavigation = () => {
  let { data: _category } = useQuery(productCategoriesQuery.all());
  // const { data: _collection } = useQuery(collectionQuery.getList());
  // const [settingCollection, setSettingCollection] = useState<any[]>([]);
  // const [diamondCollection, setDiamondCollection] = useState<any[]>([]);
  // const [shapeSettingCollection, setShapeSettingCollection] = useState<any[]>([]);
  // const [styleSettingCollection, setStyleSettingCollection] = useState<any[]>([]);
  // const [metalSettingCollection, setMetalSettingCollection] = useState<any[]>([]);
  // const [shapeDiamondCollection, setShapeDiamondCollection] = useState<any[]>([]);
  // const [CaratDiamondCollection, setCaratDiamondCollection] = useState<any[]>([]);

  // useEffect(() => {
  //   if (_collection && Array.isArray(_collection)) {
  //     const filteredCollection = _collection.filter((e: { type: string }) => e.type === "setting");
  //     setSettingCollection(filteredCollection?.[0]?.menu_types);
  //   }
  // }, [_collection]);

  // useEffect(() => {
  //   if (_collection && Array.isArray(_collection)) {
  //     const filteredCollection = _collection.filter((e: { type: string }) => e.type === "diamond");
  //     setDiamondCollection(filteredCollection?.[0]?.menu_types);
  //   }
  // }, [_collection]);

  // useEffect(() => {
  //   if (settingCollection && Array.isArray(settingCollection)) {
  //     const shapeFilteredCollection = settingCollection.filter((e: { menu_type: string }) => e.menu_type === "shape");
  //     setShapeSettingCollection(shapeFilteredCollection?.[0]?.items);

  //     const styleFilteredCollection = settingCollection.filter((e: { menu_type: string }) => e.menu_type === "style");
  //     setStyleSettingCollection(styleFilteredCollection?.[0]?.items);

  //     const metalFilteredCollection = settingCollection.filter((e: { menu_type: string }) => e.menu_type === "metal");
  //     setMetalSettingCollection(metalFilteredCollection?.[0]?.items);
  //   }
  // }, [settingCollection]);

  // useEffect(() => {
  //   if (diamondCollection && Array.isArray(diamondCollection)) {
  //     const shapeFilteredCollection = diamondCollection.filter((e: { menu_type: string }) => e.menu_type === "shape");
  //     setShapeDiamondCollection(shapeFilteredCollection?.[0]?.items);

  //     const caratFilteredCollection = diamondCollection.filter((e: { menu_type: string }) => e.menu_type === "carat");
  //     setCaratDiamondCollection(caratFilteredCollection?.[0]?.items);
  //   }
  // }, [diamondCollection]);

  const { ringSetting, } = useRingBuilderContext();

  const [ringDiamond] = useLocalStorage<IRingDiamond | null>('ring-builder-diamond', null);

  // Remove some categories from the navigation
  _category = _category?.filter((c) => {
    const categories = ['earrings', 'wedding-rings', 'pendants', 'bracelets', 'necklaces', 'chains'];

    return categories.includes(c.slug) || (c.parent_id && categories.includes(c.parent_id?.slug));
  });

  // TODO: Replace with actual links
  const labDiamondsMenu = {
    label: 'Lab Diamonds',
    link: '/',
    subMenu: [
      {
        label: 'Solitaire Diamonds',
        link: paths.whiteDiamondInventory.root,
      },
      // {
      //   label: 'Melee Diamonds',
      //   link: paths.meleeDiamonds.root,
      // },
      {
        label: 'Calibrated Diamonds',
        link: paths.calibratedDiamonds.root,
      },
      {
        label: 'Fancy Shapes Diamonds',
        link: paths.fancyShapesDiamonds.root,
      },
      {
        label: 'Fancy Color Diamonds',
        link: paths.colorDiamondInventory.root,
      },
      {
        label: 'Color Melee Diamonds',
        link: paths.colorMeleeDiamonds.root,
      },
    ],
  };

  const inventoryMenu = {
    label: 'Inventory',
    link: paths.whiteDiamondInventory.root,
  };

  const readyToShipMenu = {
    label: 'Ready To Ship',
    link: paths.readyToShip.root,
  };

  // TODO: Replace with actual links
  // TODO: Replace with actual images
  const engagementRingsMenu = useMemo(
    () => ({
      label: 'Engagement rings',
      link: '/lab-grown-engagement-rings',
      yourDiamondRing: {
        label: 'Create Your Diamond Ring',
        subMenu: [
          {
            label: 'Start With A Setting',
            link: ringDiamond?.diamond?.shape
              ? `${paths.buildRing.root}?shape=${ringDiamond?.diamond?.shape}`
              : paths.buildRing.root,
          }, // TODO: need to change the link
          // { label: 'Start With A Diamond', link: `/inventory?type=diamond-to-ring-builder${(ringDiamond?.diamond?.shape || ringSetting?.product.diamond_type.slug) ? `&shape=${ringDiamond?.diamond?.shape || ringSetting?.product.diamond_type.slug}` : ''}` },
          { label: 'Bespoke Jewelry', link: '/lab-created-diamond-ring' }, // TODO: need to change the link
          { label: 'Ready To Ship Engagement Rings', link: '/ready-to-ship/ready-engagement-ring' }, // TODO: need to change the link
          // { label: 'Custom Engagement Ring', link: '/custom-engagement-ring' }, // TODO: need to change the link
        ],
      },
      shopByStyle: {
        label: 'Shop By Style',
        subMenu: [
          // TODO: Replace with actual links
          { label: 'Solitaire', link: `${paths.collections.details('solitaire-style-engagement-rings')}?c_type=setting`, src: solitaireImg },
          { label: 'Diamond Band', link: `${paths.collections.details('diamond-band-style-engagement-rings')}?c_type=setting`, src: diamondBandImg },
          { label: 'Three Stone', link: `${paths.collections.details('three-stone-style-engagement-rings')}?c_type=setting`, src: threeStoneImg },
          { label: 'Cluster', link: `${paths.collections.details('cluster-style-engagement-rings')}?c_type=setting`, src: clusterImg },
          { label: 'Unique', link: `${paths.collections.details('unique-style-engagement-rings')}?c_type=setting`, src: uniqueImg },
          { label: 'Halo', link: `${paths.collections.details('halo-style-engagement-rings')}?c_type=setting`, src: haloRingsImg },
          { label: 'Hidden Halo', link: `${paths.collections.details('hidden-halo-style-engagement-rings')}?c_type=setting`, src: hiddenHaloImg },
          { label: 'Bezel', link: `${paths.collections.details('bezel-style-engagement-rings')}?c_type=setting`, src: bezelImg },
          { label: 'Dainty', link: `${paths.collections.details('dainty-style-engagement-rings')}?c_type=setting`, src: daintyImg },
          {
            label: 'Vintage Inspired',
            link: `${paths.collections.details('vintage-inspired-style-engagement-rings')}?c_type=setting`,
            src: vintageRingsImg,
          },
        ],
        // subMenu: styleSettingCollection?.map((e: any) => ({ label: e.name, link: `${paths.collections.details(e.slug)}?c_type=setting`, hideFilterCollections: ['style'], src: solitaireImg })) || [],
      },
      shopByShape: {
        label: 'Shop By Shape',
        subMenu: [
          // TODO: Replace with actual links
          { label: 'Round', link: `${paths.collections.details('round-shape-engagement-rings')}?c_type=setting`, src: roundImg },
          { label: 'Cushion', link: `${paths.collections.details('cushion-shape-engagement-rings')}?c_type=setting`, src: cushionImg },
          { label: 'Emerald', link: `${paths.collections.details('emerald-shape-engagement-rings')}?c_type=setting`, src: emeraldImg },
          { label: 'Marquise', link: `${paths.collections.details('marquise-shape-engagement-rings')}?c_type=setting`, src: marquiseImg },
          { label: 'Oval', link: `${paths.collections.details('oval-shape-engagement-rings')}?c_type=setting`, src: ovalImg },
          { label: 'Radiant', link: `${paths.collections.details('radiant-shape-engagement-rings')}?c_type=setting`, src: radiantImg },
          { label: 'Princess', link: `${paths.collections.details('princess-shape-engagement-rings')}?c_type=setting`, src: princessImg },
          { label: 'Asscher', link: `${paths.collections.details('asscher-shape-engagement-rings')}?c_type=setting`, src: asscherImg },
          { label: 'Pear', link: `${paths.collections.details('pear-shape-engagement-rings')}?c_type=setting`, src: pearImg },
          { label: 'Heart', link: `${paths.collections.details('heart-shape-engagement-rings')}?c_type=setting`, src: heartImg },
        ],
        // subMenu: shapeSettingCollection?.map((e: any) => ({ label: e.name, link: `${paths.collections.details(e.slug)}?c_type=setting`, hideFilterCollections: ['shape'], src: roundImg })) || [],
      },
      shopByMetal: {
        label: 'Shop By Metal',
        subMenu: [
          // TODO: Replace with actual links
          { label: 'White Gold Engagement Rings', link: `${paths.collections.details('white-gold-engagement-rings')}?c_type=setting` },
          { label: 'Yellow Gold Engagement Rings', link: `${paths.collections.details('yellow-gold-engagement-rings')}?c_type=setting` },
          { label: 'Rose Gold Engagement Rings', link: `${paths.collections.details('rose-gold-engagement-rings')}?c_type=setting` },
          { label: 'Platinum Engagement Rings', link: `${paths.collections.details('platinum-engagement-rings')}?c_type=setting` },
        ],
        // subMenu: metalSettingCollection?.map((e: any) => ({ label: e.name, link: `${paths.collections.details(e.slug)}?c_type=setting`, hideFilterCollections: ['metal'], src: solitaireImg })) || [],
      },
    }),
    [ringDiamond?.diamond?.shape]
  );

  const diamondCollectionsMenu = useMemo(
    () => ({
      label: 'Diamonds',
      link: paths.labGrownDiamonds.root,
      yourDiamondRing: {
        label: 'Create Your Diamond Ring',
        subMenu: [
          { label: 'Start With A Diamond', link: `/inventory?type=diamond-to-ring-builder${(ringDiamond?.diamond?.shape || ringSetting?.product.diamond_type.slug) ? `&shape=${ringDiamond?.diamond?.shape || ringSetting?.product.diamond_type.slug}` : ''}` },
          { label: 'Bespoke Jewelry', link: '/lab-created-diamond-ring' }, // TODO: need to change the link
        ],
      },
      shopByCarat: {
        label: 'Shop By Carat',
        subMenu: [
          // TODO: Replace with actual links
          { label: '1 Carat Lab Grown Diamonds', link: `${paths.collections.details('1-carat-lab-grown-diamonds')}?c_type=diamond` },
          { label: '2 Carat Lab Grown Diamonds', link: `${paths.collections.details('2-carat-lab-grown-diamonds')}?c_type=diamond` },
          { label: '3 Carat Lab Grown Diamonds', link: `${paths.collections.details('3-carat-lab-grown-diamonds')}?c_type=diamond` },
          { label: '4 Carat Lab Grown Diamonds', link: `${paths.collections.details('4-carat-lab-grown-diamonds')}?c_type=diamond` },
          { label: '5 Carat Lab Grown Diamonds', link: `${paths.collections.details('5-carat-lab-grown-diamonds')}?c_type=diamond` },
        ],
        // subMenu: CaratDiamondCollection?.map((e: any) => ({ label: e.name, link: `${paths.collections.details(e.slug)}?c_type=diamond`, hideFilterCollections: ['carat'], src: solitaireImg })) || [],
      },
      shopByShape: {
        label: 'Shop By Shape',
        subMenu: [
          // TODO: Replace with actual links
          { label: 'Round', link: `${paths.collections.details('round-shape-lab-grown-diamonds')}?c_type=diamond`, src: roundImg },
          { label: 'Cushion', link: `${paths.collections.details('cushion-shape-lab-grown-diamonds')}?c_type=diamond`, src: cushionImg },
          { label: 'Emerald', link: `${paths.collections.details('emerald-shape-lab-grown-diamonds')}?c_type=diamond`, src: emeraldImg },
          { label: 'Marquise', link: `${paths.collections.details('marquise-shape-lab-grown-diamonds')}?c_type=diamond`, src: marquiseImg },
          { label: 'Oval', link: `${paths.collections.details('oval-shape-lab-grown-diamonds')}?c_type=diamond`, src: ovalImg },
          { label: 'Radiant', link: `${paths.collections.details('radiant-shape-lab-grown-diamonds')}?c_type=diamond`, src: radiantImg },
          { label: 'Princess', link: `${paths.collections.details('princess-shape-lab-grown-diamonds')}?c_type=diamond`, src: princessImg },
          { label: 'Asscher', link: `${paths.collections.details('asscher-shape-lab-grown-diamonds')}?c_type=diamond`, src: asscherImg },
          { label: 'Pear', link: `${paths.collections.details('pear-shape-lab-grown-diamonds')}?c_type=diamond`, src: pearImg },
          { label: 'Heart', link: `${paths.collections.details('heart-shape-lab-grown-diamonds')}?c_type=diamond`, src: heartImg },
        ],
        // subMenu: shapeDiamondCollection?.map((e: any) => ({ label: e.name, link: `${paths.collections.details(e.slug)}?c_type=diamond`, hideFilterCollections: ['shape'], src: roundImg })) || [],
      },
    }),
    [ringDiamond?.diamond?.shape, ringSetting?.product.diamond_type.slug]
  );

  const fineJewelryMenu = {
    label: 'Fine Jewelry',
    link: '/fine-jewelry',
    menuItems: [
      {
        // earrings
        label: 'Earrings',
        link: `/earrings`,
        subMenu: [
          {
            label: 'Stud Earrings',
            link: `/earrings/diamond-stud-earrings`,
            src: studEarringImg,
          },
          {
            label: 'Hoops and Drops Earrings',
            link: `/earrings/hoops-and-drops`,
            src: hoopsAndDropsEarringImg,
          },
          {
            label: 'Halo Earrings',
            link: `/earrings/halo-earrings`,
            src: haloEarringImg,
          },
          {
            label: 'Cluster Earrings',
            link: `/earrings/cluster-earrings`,
            src: clusterEarringsImg,
          },
          {
            label: 'Ready To Ship Earrings',
            link: `/ready-to-ship/ready-earrings`,
            src: readyToShipImg,
          },
        ],
      },
      {
        // wedding_rings
        label: 'Wedding Rings',
        link: `/wedding-rings`,
        subMenu: [
          {
            label: 'Diamond Rings',
            link: `/wedding-rings/diamond-rings/`,
            src: diamondRingImg,
          },
          {
            label: 'Anniversary Rings',
            link: `/wedding-rings/anniversary-rings/`,
            src: annivarsaryRingImg,
          },
          {
            label: 'Eternity Rings',
            link: `/wedding-rings/eternity-rings/`,
            src: etenityRingImg,
          },
          {
            label: 'Stackable Rings',
            link: `/wedding-rings/stackable-rings/`,
            src: stackableRingImg,
          },
          {
            label: 'Ready To Ship Wedding Rings',
            link: `/ready-to-ship/ready-wedding-ring`,
            src: readyToShipImg,
          },
        ],
      },
      {
        //  pendants
        label: 'Pendants',
        link: `/pendants`,
        subMenu: [
          {
            label: 'Solitaire Pendants',
            link: `/pendants/solitaire-pendants/`,
            src: solitairePendantsImg,
          },
          {
            label: 'Halo Pendants',
            link: `/pendants/halo-pendants/`,
            src: haloPendantsImg,
          },
          {
            label: 'Diamond Pendants',
            link: `/pendants/diamond-pendants/`,
            src: diamondPendantsImg,
          },
          {
            label: 'Ready To Ship Pendants',
            link: `/ready-to-ship/ready-pendants`,
            src: readyToShipImg,
          },
          { label: 'Chains', link: `/chains/`, src: chainImg },
          {
            label: 'Ready To Ship Chains',
            link: `/ready-to-ship/ready-chains`,
            src: readyToShipImg,
          },
        ],
      },
      {
        // bracelets
        label: 'Bracelets',
        link: `/bracelets`,
        subMenu: [
          {
            label: 'Tennis Bracelets',
            link: `/bracelets/diamond-tennis-bracelets`,
            src: tennisBraceletsImg,
          },
          {
            label: 'Solitaire Bracelets',
            link: `/bracelets/diamond-tennis-bracelets`,
            src: tennisBraceletsImg,
          },
          {
            label: 'Ready To Ship Bracelets',
            link: `/ready-to-ship/ready-bracelets`,
            src: readyToShipImg,
          },
        ],
      },
      {
        // Necklaces
        label: 'Necklaces',
        link: `/necklaces`,
        subMenu: [
          {
            label: 'Diamond Necklaces',
            link: `/necklaces/diamond-necklaces/`,
            src: chainImg,
          },
          {
            label: 'Tennis Necklaces',
            link: `/necklaces/diamond-necklaces/`,
            src: chainImg,
          },
          {
            label: 'Ready To Ship Necklaces',
            link: `/ready-to-ship/ready-necklaces`,
            src: readyToShipImg,
          },
        ],
      },
    ],
  };

  // TODO: Replace with actual links
  const educationMenu = {
    label: 'Education',
    link: '/',
    diamondMenu: {
      label: 'Diamond 4C’s',
      subMenu: [
        { label: 'Cut', link: '/' },
        { label: 'Clarity', link: '/' },
        { label: 'Color', link: '/' },
        { label: 'Carat', link: '/' },
      ],
    },
    diamondGuideMenu: {
      label: 'Diamond Guide',
      subMenu: [
        { label: 'Diamond Certification', link: '/' },
        { label: 'Diamond Clarity', link: '/' },
        { label: 'Diamond Size Chart', link: '/' },
        { label: 'Diamond Price Calculator', link: '/' },
      ],
    },
    helpfulGuidesMenu: {
      label: 'Helpful Guides',
      subMenu: [
        { label: 'Tips For Cleaning Lab Grown Diamonds', link: '/' },
        { label: 'Facts & Misconceptions', link: '/' },
        { label: 'Blood Free Diamonds', link: '/' },
      ],
    },
    ringCollectionMenu: {
      label: 'Ring Collections By Carat',
      subMenu: [
        { label: '1 Carat', link: '/' },
        { label: '1.25 Carat', link: '/' },
        { label: '1.75 Carat', link: '/' },
        { label: '2.5 Carat', link: '/' },
        { label: '4 Carat', link: '/' },
        { label: '5 Carat', link: '/' },
      ],
    },
  };

  return {
    labDiamondsMenu,
    inventoryMenu,
    readyToShipMenu,
    engagementRingsMenu,
    diamondCollectionsMenu,
    fineJewelryMenu,
    educationMenu,
  };
};

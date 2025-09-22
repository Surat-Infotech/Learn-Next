import React from 'react';
import Image from 'next/image';

import TrustPilotReviewSection from '@/sections/home/TrustPilotReviewSection';

import OvalImg from '@/assets/image/diamond/oval.svg';
import EmeraldImg from '@/assets/image/diamond/emerald.svg';
import AsscherImg from '@/assets/image/diamond/asscher.svg';
import RadiantImg from '@/assets/image/diamond/radiant.svg';
import LogoImg from '@/assets/image/logo/loosegrowndiamond_logo.svg';
import PearShapeLabCreatedDiamondImg from '@/assets/image/diamond/pearShape.svg';
import RoundShapeLabGrownDiamondImg from '@/assets/image/diamond/round_shape_lab_grown_diamond.svg';
import RadientShapeLabCreatedDiamondImg from '@/assets/image/diamond/radient_shape_lab_created_diamond.svg';
import BuyMarquiseShapeAgapeDiamondsImg from '@/assets/image/diamond/buy_marquise_shape_agape_diamonds.svg';
import BuyHeartShapeLabCreatedDiamondImg from '@/assets/image/diamond/buy_heart_shape_lab_created_diamond.svg';
import BuyPrincessCutLabCreatedDiamondImg from '@/assets/image/diamond/buy_princess_cut_lab_created_diamond.svg';

// eslint-disable-next-line import/no-cycle
import ShopByShape from './ShopByShape';

export const diamondShape = [
  {
    id: '1',
    label: 'Round',
    defaultValue: 'round',
    img: {
      src: RoundShapeLabGrownDiamondImg.src,
      alt: 'round_shape_lab_grown_diamond',
    },
  },
  {
    id: '2',
    label: 'Princess',
    defaultValue: 'princess',
    img: {
      src: BuyPrincessCutLabCreatedDiamondImg.src,
      alt: 'buy_princess_cut_lab_created_diamond',
    },
  },
  {
    id: '3',
    label: 'Radiant',
    defaultValue: 'radiant',
    img: {
      src: RadiantImg.src,
      alt: 'Radiant',
    },
  },
  {
    id: '4',
    label: 'Asscher',
    defaultValue: 'asscher',
    img: {
      src: AsscherImg.src,
      alt: 'asscher',
    },
  },
  {
    id: '5',
    label: 'Cushion',
    defaultValue: 'cushion',
    img: {
      src: RadientShapeLabCreatedDiamondImg.src,
      alt: 'radient_shape_lab_created_diamond',
    },
  },
  {
    id: '6',
    label: 'Emerald',
    defaultValue: 'emerald',
    img: {
      src: EmeraldImg.src,
      alt: 'Emerald',
    },
  },
  {
    id: '7',
    label: 'Pear',
    defaultValue: 'pear',
    img: {
      src: PearShapeLabCreatedDiamondImg.src,
      alt: 'pear',
    },
  },

  {
    id: '8',
    label: 'Marquise',
    defaultValue: 'marquise',
    img: {
      src: BuyMarquiseShapeAgapeDiamondsImg.src,
      alt: 'buy_marquise_shape_agape_diamonds',
    },
  },

  {
    id: '9',
    label: 'Heart',
    defaultValue: 'heart',
    img: {
      src: BuyHeartShapeLabCreatedDiamondImg.src,
      alt: 'buy_heart_shape_lab_created_diamond',
    },
  },
  {
    id: '10',
    label: 'Oval',
    defaultValue: 'oval',
    img: {
      src: OvalImg.src,
      alt: 'oval',
    },
  },
];

const DiamondStaticDetails = () => (
  <div>
    <div className="pt-0" style={{ background: '#f9f9f9' }}>
      <div className="container-fluid" style={{ paddingBottom: '30px' }}>
        <div className="row row-gap-3 pt_60 res-padding">
          <div className="melee-title-black">
            <h1 className="d-flex justify-content-center text-center">
              Buy Directly From Us. No Middleman
            </h1>
            <p
              className="d-flex justify-content-center fw-400 text-gray text-center mb-2 mb-md-3"
              style={{ lineHeight: '20px' }}
            >
              Our prices are lower than the regular sellers because we directly give you diamonds
              from our factory. No Middleman.
            </p>
          </div>
        </div>
        <div className="row row-gap-3 py-3 py-md-5 res-padding px-12 px-md-0">
          <div className="col-lg-4 col-12 melee-box">
            <div className="d-flex justify-content-center pt-3">
              <Image className="img-fluid" src={LogoImg} alt="logo" width={25} height={25} />
            </div>
            <p
              className="d-flex justify-content-center pt-2"
              style={{
                color: 'rgb(51, 51, 51)',
                fontSize: '20px',
                lineHeight: '26px',
                fontWeight: '600',
              }}
            >
              Loose Grown Diamond
            </p>
            <span
              className="d-flex justify-content-center pb-3"
              style={{ marginTop: '-12px', color: 'gray', fontSize: '13px', lineHeight: '26px' }}
            >
              (We as a Manufacturer)
            </span>
          </div>
          <div className="col-lg-4 col-12 d-flex justify-content-center align-items-center py-3 py-md-5">
            <div>
              <span style={{ fontSize: '13px', color: 'rgb(51, 51, 51)', fontWeight: '500' }}>
                Directly Selling To
              </span>
              <br />
              <Image
                className="img-fluid selling-line"
                src="https://www.loosegrowndiamond.com/wp-content/uploads/2019/09/Arrow-1.svg"
                alt="logo"
                width={127}
                height={8}
              />
            </div>
          </div>
          <div className="col-lg-4 col-12 melee-box">
            <div className="d-flex justify-content-center pt-3">
              <Image
                className="img-fluid"
                src="https://www.loosegrowndiamond.com/wp-content/uploads/2019/09/icon.svg"
                alt="logo"
                width={25}
                height={25}
              />
            </div>
            <p
              className="d-flex justify-content-center pt-2"
              style={{
                color: 'rgb(51, 51, 51)',
                fontSize: '20px',
                lineHeight: '26px',
                fontWeight: '600',
              }}
            >
              You (as Buyer)
            </p>
            <span
              className="d-flex justify-content-center pb-3"
              style={{ marginTop: '-12px', color: 'gray', fontSize: '13px', lineHeight: '26px' }}
            >
              (Jewelry Owners, Diamond Traders)
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="about-hidden pt-0" style={{ background: '#fff' }}>
      <div className="container-fluid">
        <div className="row row-gap-3 px-3 px-lg-5" style={{ paddingTop: '120px' }}>
          <div className="col-6 my-auto">
            <p
              className="d-flex justify-content-center align-items-center"
              style={{ color: 'black', fontWeight: '600' }}
            >
              41+ Years Of Experience In Diamond Industry
            </p>
            <span className="d-flex justify-content-center align-items-center">
              We are India based Manufacturer and has served more than 19,987+ Customers
              Internationally.
            </span>
          </div>
          <div className="col-6 d-flex justify-content-end align-items-center">
            <Image
              src="https://www.loosegrowndiamond.com/wp-content/uploads/2019/10/manufactring.png"
              alt="about-img"
              width={428}
              height={428}
              className="img-fluid about-res-img"
              style={{ borderRadius: '100%' }}
            />
          </div>
        </div>
        <div>
          <div
            className="row row-gap-3 px-3 px-lg-5"
            style={{ paddingBottom: '120px', paddingTop: '90px' }}
          >
            <div className="col-6 d-flex justify-content-start align-items-center">
              <Image
                src="https://www.loosegrowndiamond.com/wp-content/uploads/2019/10/quality-diamonds.png"
                alt="about-img"
                width={428}
                height={428}
                className="img-fluid about-res-img"
                style={{ borderRadius: '100%' }}
              />
            </div>
            <div className="col-6 my-auto">
              <p
                className="d-flex justify-content-center align-items-center"
                style={{ color: 'black', fontWeight: '600' }}
              >
                Top Quality In The Market With International Certificates
              </p>
              <span className="d-flex justify-content-center align-items-center">
                We provides diamond with certifications (GIA and IGI). Our main focus is to gain a
                customer’s trust and giving you best buying experience.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="bg_light_gray ">
      <TrustPilotReviewSection />
    </div>
    <ShopByShape />
  </div>
);

export default DiamondStaticDetails;

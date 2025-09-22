/* eslint-disable jsx-a11y/no-static-element-interactions */
import Link from 'next/link';
import Image from 'next/image';
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useState } from 'react';

import { DiamondSizeChartHook } from '@/hooks/useDiamondSizeChart';

import { withSsrProps } from '@/utils/page';

import { paths } from '@/routes/paths';
import KiteShapeImg from '@/assets/image/diamond/kite_shape.svg';
import OvalDiamond from '@/assets/image/diamond/oval_diamond.svg';
import PearDiamond from '@/assets/image/diamond/pear_diamond.svg';
import RoundDiamond from '@/assets/image/diamond/round_diamond.svg';
import HeartDiamond from '@/assets/image/diamond/heart_diamond.svg';
import AsscherDiamond from '@/assets/image/diamond/asscher_diamond.svg';
import CushionDiamond from '@/assets/image/diamond/cushion_diamond.svg';
import RadiantDiamond from '@/assets/image/diamond/radiant_diamond.svg';
import EmeraldDiamond from '@/assets/image/diamond/emerald_diamond.svg';
import PrincessDiamond from '@/assets/image/diamond/princess_diamond.svg';
import MarquiseDiamond from '@/assets/image/diamond/marquise_diamond.svg';
import TriangleDiamond from '@/assets/image/diamond/triangle_diamond.svg';
import BaguetteDiamond from '@/assets/image/diamond/baguette_diamond.svg';
import TaperedBaguetteDiamond from '@/assets/image/diamond/tapered_baguette_diamond.svg';

const DiamondSizeChart: FC = () => {
  const [selectSizeChart, setSelectSizeChart] = useState('round');
  const chartData = DiamondSizeChartHook?.find((value) => selectSizeChart === value.defaultValue);
  const len: any = chartData?.size[0].sizes.length;

  return (
    <div>
      <div className="banner_section">
        <div className=" py_60">
          <div className="container-fluid">
            <div className="text-center">
              <h2 className="text_black_secondary fw-600 mb_10">Diamond Carat Size Chart</h2>
              <p className="text_black_secondary font_size_15 mb-0">
                Select your perfect lab grown diamond from thousands of ethically sourced diamonds.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="diamond_cart_size">
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'round' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('round')}
            >
              <Image src={RoundDiamond} alt="round_diamond" />
              <p className="mb-0">Round</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'princess' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('princess')}
            >
              <Image src={PrincessDiamond} alt="princess_diamond" />
              <p className="mb-0">Princess</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'asscher' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('asscher')}
            >
              <Image src={AsscherDiamond} alt="asscher_diamond" />
              <p className="mb-0">Asscher</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'cushion' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('cushion')}
            >
              <Image src={CushionDiamond} alt="cushion_diamond" />
              <p className="mb-0">Cushion</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'oval' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('oval')}
            >
              <Image src={OvalDiamond} alt="oval_diamond" />
              <p className="mb-0">Oval</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'radiant' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('radiant')}
            >
              <Image src={RadiantDiamond} alt="radiant_diamond" />
              <p className="mb-0">Radiant</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'emerald' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('emerald')}
            >
              <Image src={EmeraldDiamond} alt="emerald_diamond" />
              <p className="mb-0">Emerald</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'pear' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('pear')}
            >
              <Image src={PearDiamond} alt="pear_diamond" />
              <p className="mb-0">Pear</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'heart' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('heart')}
            >
              <Image src={HeartDiamond} alt="heart_diamond" />
              <p className="mb-0">Heart</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'marquise' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('marquise')}
            >
              <Image src={MarquiseDiamond} alt="marquise_diamond" />
              <p className="mb-0">Marquise</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'triangular' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('triangular')}
            >
              <Image
                src={TriangleDiamond}
                alt="triangle_diamond"
                style={{ transform: 'rotate(180deg)' }}
              />
              <p className="mb-0">Triangular</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'kite' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('kite')}
            >
              <Image src={KiteShapeImg} alt="trillion_diamond" />
              <p className="mb-0">Kite</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'baguette' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('baguette')}
            >
              <Image src={BaguetteDiamond} alt="baguette_diamond" />
              <p className="mb-0">Baguette</p>
            </div>
          </div>
          <div className="diamond_chart text-center">
            <div
              className={`${selectSizeChart === 'baguette_trapezoid' && 'diamond_selected'}`}
              onClick={() => setSelectSizeChart('baguette_trapezoid')}
            >
              <Image src={TaperedBaguetteDiamond} alt="tapered_baguette_diamond" />
              <p className="mb-0 maxWidth mx-auto">Tapered Baguette</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py_30">
        <div className="container-fluid">
          <div className="row">
            {[chartData].slice(0, 20)?.map((item: any, index: number) => (
              <>
                <h3 className="text_black_secondary text-center fw-600 mb_30">{item?.label}</h3>
                <div className="col-md-6">
                  <div className="table-responsive asscher_cut_table">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          {item.size.map((ele: any, indx: number) => (
                            <th key={indx}>{ele.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {item.size[0].sizes
                          .slice(0, Math.round(len / 2))
                          .map((_: any, i: number) => (
                            <tr key={i}>
                              {item.size.map((ele: any, idx: number) => (
                                <td key={idx}>{ele.sizes[i]}</td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ))}
            <div className="col-md-6">
              {[chartData]?.map((item: any, index: number) => (
                <div className="table-responsive asscher_cut_table">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        {item.size.map((ele: any, indx: number) => (
                          <th key={indx}>{ele.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {item.size[0].sizes
                        .slice(Math.round(len / 2), len)
                        .map((_: any, i: number) => (
                          <tr key={i}>
                            {item.size.map((ele: any, idx: number) => (
                              <td key={idx}>{ele.sizes[i + Math.round(len / 2)]}</td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <Link
              type="button"
              className="btn common_black_btn mt-4 font_size_16 responsiveSize"
              href={`${paths.whiteDiamondInventory.root}?shape=${selectSizeChart}`}
            >
              Shop {selectSizeChart.replace('_', ' ')} Cut
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withSsrProps({
  isProtected: false,
});

export default DiamondSizeChart;

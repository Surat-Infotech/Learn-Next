import { FC, useState, useEffect } from 'react';

import { RangeSlider, RangeSliderProps } from '@mantine/core';

import classes from './TRangeSlider.module.css';

export type TRangeSliderProps = RangeSliderProps & {};

const TRangeSlider: FC<TRangeSliderProps> = (props) => {
  const { value, color = '#314185', size = 3, classNames, ...other } = props;

  const [_value, _setValue] = useState(value);

  // Sync value with parent component
  useEffect(() => {
    _setValue(value);
  }, [value]);

  return (
    <RangeSlider
      value={_value}
      onChange={(val) => {
        _setValue(val);
      }}
      color={color}
      size={size}
      classNames={{ ...classes, ...classNames }}
      {...other}
    />
  );
};

export default TRangeSlider;

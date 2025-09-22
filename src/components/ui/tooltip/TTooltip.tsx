import { FC } from 'react';

import { Tooltip, TooltipProps } from '@mantine/core';

export type TTooltipProps = TooltipProps & {};

const TTooltip: FC<TTooltipProps> = (props) => {
  const { multiline = true, ...other } = props;

  return <Tooltip className="tooltip" multiline={multiline} {...other} />;
};

export default TTooltip;

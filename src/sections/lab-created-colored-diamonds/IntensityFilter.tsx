import { FC, ChangeEvent } from 'react';

import clsx from 'clsx';


// ----------------------------------------------------------------------

export type IIntensityFilterProps = {
  value: number[];
  setValue: (value: number[]) => void;
  //
  id: string;
  description: string;
  // eslint-disable-next-line react/no-unused-prop-types
  url_view?: string;
  label: string;
  defaultValue: number;
  //
  color?: string;
};

const IntensityFilter: FC<IIntensityFilterProps> = (props) => {
  const { value, setValue, defaultValue, description, label, id, color = '#314185' } = props;

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target;
    if (value.toString().includes(newValue)) {
      setValue(value.filter((item) => item !== Number(newValue)));
    } else {
      setValue([...value, Number(newValue)]);
    }
  };

  return (
    <div className={clsx('intensity_box', `intensity_box${id}`)}>
      <input
        type="checkbox"
        name={label}
        defaultValue={defaultValue}
        id={label}
        className="checkbox d-none"
        checked={value.toString().includes(defaultValue.toString())}
        onChange={handleCheckbox}
      />
      <label htmlFor={label}>
        <svg
          width="64"
          height="70.667"
          version="1.0"
          viewBox="0 0 48 53"
          style={{
            fill: color,
          }}
        >
          <path d="M22.3.452c-.2 0-4.7 2.6-10.1 5.8l-9.8 5.8 3.6 2.2 3.6 2.1 6.5-3.6c6.4-3.6 6.4-3.6 6.4-8 0-2.4-.1-4.4-.2-4.3m3.1 0 .3 4.6c.3 4.3.5 4.6 6.3 7.9l6.1 3.3 3.6-2.2 3.6-2.2-10-5.7Zm-2 12c-.2 0-3 1.6-6.1 3.5l-5.8 3.5v13.9l4.1 2.5c7.9 5 8.1 5.1 14.5 1.3l5.9-3.4.3-7.1.3-7.2-6.4-3.5c-3.5-2-6.6-3.6-6.8-3.5m-22.5 2.9c-.2 0-.4 4.9-.4 11 0 6 .3 11 .6 11 .4 0 2.2-.9 4-2.1 3.3-2 3.4-2.2 3.4-8.9s0-6.8-3.6-8.9c-1.9-1.2-3.7-2.1-4-2.1m45.9.1c-.5 0-2.3 1-4 2.1-3.2 1.9-3.3 2.2-3.3 8.9s.1 7 3.3 8.9c1.7 1.1 3.5 2 4 2 .4 0 .7-5 .7-11 0-6.1-.3-11-.7-10.9m-8.9 21-6.2 3.7c-6.1 3.6-6.2 3.7-6.2 8 0 4.4 0 4.4 2.3 3 1.2-.8 5.7-3.4 9.9-5.8 4.3-2.4 7.7-4.4 7.5-4.5-.1-.1-1.8-1.1-3.7-2.3zm-28.2.1-3.7 2.3-3.7 2.2 5.8 3.3c3.3 1.8 7.8 4.4 10.2 5.7l4.2 2.5v-4.4c0-4.2-.1-4.3-6.4-7.9z" />
        </svg>
        <span style={{ lineHeight: "16px" }} >{label}</span>
      </label>
    </div>
  );
};

export default IntensityFilter;

import { FC, ChangeEvent } from 'react';

// ----------------------------------------------------------------------

export type ColorDiamondFilterProps = {
  value: number;
  setValue: (value: number) => void;
  //
  label: string;
  htmlFor: string;
  color: string;
  name: string;
  defaultValue: number;
  id: string;
  img: {
    src: string;
    alt: string;
  };
};

const ColorDiamond: FC<ColorDiamondFilterProps> = (props) => {
  const { value, setValue, defaultValue, id, img, label, htmlFor, name, color } = props;

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target;
    if (value === Number(newValue)) {
      setValue(-1);
    } else {
      setValue(Number(newValue));
    }
  };

  return (
    <div className="color_diamond">
      <input
        type="checkbox"
        name={name}
        defaultValue={defaultValue}
        id={`color-${id}`}
        className="checkbox"
        checked={value === defaultValue}
        onChange={handleCheckbox}
      />
      <label className="text-center" htmlFor={`color-${htmlFor}`}>
        <img src={img.src} alt={img.alt} />
        <p>{label}</p>
      </label>
    </div>
  );
};

export default ColorDiamond;

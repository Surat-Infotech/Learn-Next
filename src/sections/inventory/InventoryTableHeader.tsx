import { FC, Dispatch, useCallback, SetStateAction } from 'react';

import { clsx } from 'clsx';

type ISortType = { [key: string]: 1 | -1 };

type IInventoryTableHeaderProps = {
  sort: ISortType;
  setSort: Dispatch<SetStateAction<ISortType>>;
};

const InventoryTableHeader: FC<IInventoryTableHeaderProps> = (props) => {
  const { sort, setSort } = props;

  const handleSort = useCallback(
    (filter: string) => {
      setSort((prev) => {
        if (prev?.[filter] === -1) return { [filter]: 1 };
        return { [filter]: -1 };
      });
    },
    [setSort]
  );

  const renderTH = useCallback(
    (label: string, filter: string) => (
      <th onClick={() => handleSort(filter)} className="cursor-pointer">
        <i
          className={clsx(
            'fa-solid me-1 font_size_12',
            !sort?.[filter] && 'fa-sort',
            sort?.[filter] === 1 && 'fa-sort-up',
            sort?.[filter] === -1 && 'fa-sort-down'
          )}
        />
        <span className='d-none d-lg-inline'>{label}</span>
        <span className='d-lg-none'>{label === 'Price (USD)' ? label.split(' ')?.[0] : label} <br /> {label === 'Price (USD)' && label.split(' ')?.[1]}</span>
      </th>
    ),
    [handleSort, sort]
  );

  return (
    <thead>
      <tr>
        {/* Shape */}
        {renderTH('Shape', 'shape')}

        {/* Carat */}
        {renderTH('Carat', 'carat')}

        {/* Cut */}
        {renderTH('Cut', 'cut')}

        {/* Color */}
        {renderTH('Color', 'color')}

        {/* Clarity */}
        {renderTH('Clarity', 'clarity')}

        {/* Price (USD) */}
        {renderTH('Price (USD)', 'price')}

        {/* Actions */}
        {/* <th /> */}
      </tr>
    </thead>
  );
};

export default InventoryTableHeader;

import { useMemo, useState, useEffect } from 'react';

import { debounce, DebouncedFunc } from 'lodash';

export const useDebouncedFn = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => any = (...args: any[]) => any,
>(
  fn: T,
  delay = 600,
  options?: {
    leading?: boolean | undefined;
    maxWait?: number | undefined;
    trailing?: boolean | undefined;
  }
): DebouncedFunc<T> => {
  const debounceFn = useMemo(
    () =>
      debounce(
        fn,
        delay,
        options ?? {
          maxWait: 2000,
        }
      ),
    [fn, delay, options]
  );

  // Cancel the debounce on unmount
  useEffect(() => debounceFn.cancel, [debounceFn]);

  return debounceFn;
};

export const useDebouncedValue = <T>(
  value: T,
  delay = 600,
  options?: {
    leading?: boolean | undefined;
    maxWait?: number | undefined;
    trailing?: boolean | undefined;
  }
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const updateValue = useDebouncedFn(setDebouncedValue, delay, options);

  useEffect(() => {
    updateValue(value);
  }, [value, updateValue]);

  return debouncedValue;
};

import { useRouter } from 'next/router';
import { useMemo, useCallback } from 'react';

import { ParsedUrlQuery } from 'querystring';
import { get, isNaN, isArray, isEmpty, toNumber } from 'lodash';

type SetURLSearchParams = (
  nextInit?: ParsedUrlQuery,
  nextOptions?: {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
  }
) => void;

export const pickFirstValue = <T>(val: T) => {
  if (isArray(val)) {
    return val[0];
  }

  return val;
};

export function parseNumbersInString(val: string | undefined | null, splitter = ','): number[] {
  if (val == null || val === '') {
    return [];
  }

  return val
    .split(splitter)
    .map((v) => {
      const n = toNumber(v);
      if (isNaN(n)) {
        return null;
      }
      return n;
    })
    .filter((v) => v != null) as number[];
}

// https://blog.logrocket.com/use-state-url-persist-state-usesearchparams/
export function useSearchParamsState<T, K extends string = string>(
  searchParamName: K,
  defaultValue: T,
  parser?: {
    serialize: (input: T) => string;
    deserialize: (input: string | null) => T;
  }
): readonly [
  searchParamsState: T,
  setSearchParamsState: (newState: T, additionalParams?: { [key: string]: string }) => void,
] {
  const [searchParams, setSearchParams] = useSearchParams();

  return useMemo(() => {
    const param = pickFirstValue(get(searchParams, searchParamName));

    const acquiredSearchParam = parser?.deserialize ? parser?.deserialize(param) : (param as T);

    const searchParamsState = isEmpty(acquiredSearchParam) ? defaultValue : acquiredSearchParam;
    // const searchParamsState = acquiredSearchParam ?? defaultValue;

    const setSearchParamsState = (newState: T, additionalParams?: { [key: string]: string }) => {
      let stringVal: string;

      if (parser?.serialize) {
        stringVal = parser.serialize(newState);
      } else if (isArray(newState)) {
        stringVal = newState.join(',');
      } else {
        stringVal = newState as string;
      }

      const next = {
        ...searchParams,
        [searchParamName]: stringVal,
        ...additionalParams,
      };

      setSearchParams(next, {
        shallow: true,
      });
    };

    return [searchParamsState, setSearchParamsState];
  }, [searchParams, searchParamName, setSearchParams, parser, defaultValue]);
}

export function useSearchParams(): [ParsedUrlQuery, SetURLSearchParams] {
  const { query, replace } = useRouter();

  const setSearchParams = useCallback<SetURLSearchParams>(
    (nextInit, navigateOpts) => {
      replace(
        {
          query: nextInit,
        },
        undefined,
        navigateOpts
      );
    },
    [replace]
  );

  return [query, setSearchParams];
}

import { useRef, useEffect, useCallback, useLayoutEffect } from 'react';

import constate from 'constate';
import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

export const useBrowserLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {};

export interface IUseAxiosState {
  authHeaderName: string;
  token?: string;
  axiosInstance: AxiosInstance;
  onResponseError?: (
    error: AxiosError
  ) => AxiosError | Promise<AxiosError> | null | Promise<AxiosResponse>;
  onRequestError?: (error: AxiosError) => AxiosError | Promise<AxiosError> | null;
  onRequest?: (request: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  onResponse?: (response: AxiosResponse<unknown>) => AxiosResponse<unknown>;
}

const useAxiosState = (props: IUseAxiosState) => {
  const latestProps = useRef<IUseAxiosState>();

  useEffect(() => {
    latestProps.current = props;
  });

  const handleRequest = useCallback(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const headers: Record<string, string | number> = {
        // 'x-language': latestProps.current.lang,
      };

      if (latestProps.current?.token) {
        headers[latestProps.current?.authHeaderName] = `Bearer ${latestProps.current.token}`;
      }

      if (typeof window === 'undefined') {
        headers['x-app-renderer'] = 'server';
      } else {
        headers['x-app-renderer'] = 'client';
      }

      config.headers = {
        ...config.headers,
        ...headers,
      } as unknown as AxiosRequestHeaders;

      return latestProps.current?.onRequest?.(config) ?? config;
    },
    []
  );

  const handleResponse = useCallback(
    (response: AxiosResponse<unknown>) => latestProps.current?.onResponse?.(response) ?? response,
    []
  );

  const handleRequestError = useCallback(
    (error: AxiosError) =>
      latestProps.current?.onRequestError != null
        ? latestProps.current.onRequestError(error)
        : Promise.resolve(error),
    []
  );

  const handleResponseError = useCallback(
    (error: AxiosError) =>
      latestProps.current?.onResponseError != null
        ? latestProps.current.onResponseError(error)
        : Promise.reject(error),
    []
  );

  useBrowserLayoutEffect(() => {
    const reqInterceptor = props.axiosInstance.interceptors.request.use(
      handleRequest,
      handleRequestError
    );
    const resInterceptor = props.axiosInstance.interceptors.response.use(
      handleResponse,
      handleResponseError
    );

    return () => {
      props.axiosInstance.interceptors.request.eject(reqInterceptor);
      props.axiosInstance.interceptors.request.eject(resInterceptor);
    };
  }, [handleRequest, handleResponseError, handleResponse, handleRequestError, props.axiosInstance]);

  return props.axiosInstance;
};

const [AxiosProvider, useAxios] = constate(useAxiosState);
AxiosProvider.displayName = 'AxiosProvider';

export { useAxios, AxiosProvider };

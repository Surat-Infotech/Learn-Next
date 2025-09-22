import axios from 'axios';
import { env } from '@env';
import type { AxiosInstance } from 'axios';
import { trimEnd, toString, trimStart } from 'lodash';

export * from './types';

declare const window: any;

// eslint-disable-next-line react-hooks/rules-of-hooks
// ----------------------------------------------------------------------
export const globalAxios = axios.create({
  baseURL: `${trimEnd(env.NEXT_PUBLIC_BASE_API_URL || '', '/')}`,
});
// ----------------------------------------------------------------------

// Make it available while not on production for developers
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
typeof window !== 'undefined' && (window._globalAxios = globalAxios);

export abstract class Api {
  abstract readonly baseUrl: string;

  protected readonly http: AxiosInstance;

  constructor(axiosInstance?: AxiosInstance) {
    this.http = axiosInstance ?? globalAxios;
  }

  protected route(subpath: string | number) {
    const path = trimEnd(trimStart(toString(subpath), '/'), '/');
    return path ? `${trimEnd(this.baseUrl, '/')}/${path}` : `${trimEnd(this.baseUrl, '/')}`;
  }

  protected _get<T>(id: number | string) {
    return this.http.get<T>(this.route(id));
  }

  protected _all<T>() {
    return this.http.get<T>(this.route(''));
  }

  protected _create<T>(data: any) {
    return this.http.post<T>(this.route(''), data);
  }

  protected _post<T>(path: string, data: any) {
    return this.http.post<T>(this.route(path), data);
  }

  protected _update<T>(id: number | string, data: any) {
    return this.http.put<T>(this.route(id), data);
  }

  protected _delete<T>(id: number | string, data: any) {
    return this.http.delete<T>(this.route(id), data);
  }

  protected _patch<T>(id: number | string, data: any) {
    return this.http.patch<T>(this.route(id), data);
  }
}

export const setAxiosAuthToken = (token?: string) => {
  if (token) {
    globalAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete globalAxios.defaults.headers.common.Authorization;
  }
};

export const getAxiosAuthToken = () => globalAxios.defaults.headers.common.Authorization;

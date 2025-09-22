import { FC, useCallback, PropsWithChildren } from 'react';

import { AxiosError } from 'axios';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import { AxiosProvider } from '@/stores/axios.context';

import { globalAxios } from '.';

const AxiosWrapper: FC<PropsWithChildren & { session?: Session }> = ({ children, session }) => {
  const { data: state } = useSession();

  const onError = useCallback((error: AxiosError) => {
    if (
      error.config &&
      error.response?.status === 401 &&
      error.config.url?.indexOf('login') === -1
    ) {
      // TODO: implement refresh-token

      // logout({});
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }, []);

  return (
    <AxiosProvider
      authHeaderName="Authorization"
      token={state?.user?.accessToken || session?.user?.accessToken}
      axiosInstance={globalAxios}
      onResponseError={onError}
    >
      {children}
    </AxiosProvider>
  );
};

export default AxiosWrapper;

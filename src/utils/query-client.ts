import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = (isServer = false) => {
  const q = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: isServer ? false : undefined,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return q;
};

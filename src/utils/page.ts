import { AxiosError } from 'axios';
import { isNil, omitBy } from 'lodash';
import { ParsedUrlQuery } from 'querystring';
import { Session, getServerSession } from 'next-auth';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { PreviewData, GetServerSidePropsResult, GetServerSidePropsContext } from 'next';

import { paths } from '@/routes/paths';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

import { createQueryClient } from './query-client';

export class HttpException extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly errors?: Record<string, unknown>
  ) {
    super(message);
  }

  static NotFound(message = 'Page not found!', errors?: Record<string, unknown>): HttpException {
    return new HttpException(404, message, errors);
  }
}

/**
 * Function to handle page exceptions
 * Redirect to 401 or 404 if error status is 401 or 404 respectively Or redirect to 500 if any other error
 */
export const pageExceptionHandler = (
  error: unknown,
  locale?: string
): GetServerSidePropsResult<any> => {
  const getErrorDestination = (errorCode: string | number): string =>
    `/${locale ? `${locale}/` : ''}${errorCode}`;

  if (!(error instanceof AxiosError) && !(error instanceof HttpException)) {
    return {
      redirect: {
        destination: getErrorDestination(500),
        permanent: false,
      },
    };
  }

  const statusCode = error instanceof HttpException ? error.status : error?.response?.status;

  // Redirect to 404 if error status is 404
  if (statusCode === 404) {
    return { notFound: true };
  }
  // Redirect to 401 if error status is 401
  if (statusCode === 401) {
    return {
      redirect: {
        destination: getErrorDestination(statusCode),
        permanent: false,
      },
    };
  }
  // Redirect to 500 if any other error

  return {
    redirect: {
      destination: getErrorDestination(500),
      permanent: false,
    },
  };
};

export const withSsrProps = <
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(input: {
  isProtected?: boolean;
  onlyGuest?: boolean;
  props?: (args: {
    q: QueryClient;
    locale: string;
    ctx: GetServerSidePropsContext<Q, D>;
    isNextJsDataCall: boolean;
    session: Session | null;
    accessToken: string | null;
  }) => Promise<P>;
  prefetch?: (args: {
    q: QueryClient;
    locale: string;
    ctx: GetServerSidePropsContext<Q, D>;
    props: Partial<P>;
    isNextJsDataCall: boolean;
    session: Session | null;
    accessToken: string | null;
  }) => Promise<void>;
  onError?: (error: AxiosError | Error) => GetServerSidePropsResult<P>;
}): ((ctx: GetServerSidePropsContext<Q, D>) => Promise<GetServerSidePropsResult<P>>) => {
  const { props, prefetch, onError, isProtected, onlyGuest } = input;

  return async (ctx) => {
    const q = createQueryClient(true);

    const locale = ctx.locale ?? 'en';

    // Check if headers has x-nextjs-data header set to 1
    // If set then return the dehydrated state
    const isNextJsDataCall = ctx.req?.headers?.['x-nextjs-data'] === '1';

    let additionalProps: Partial<P> = {};
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const accessToken = session?.user?.accessToken ?? null;

    if (isProtected && !session) {
      return {
        redirect: {
          destination: paths.register.root,
          permanent: false,
        },
      };
    }

    if (onlyGuest && !!session) {
      return {
        redirect: {
          destination: paths.order.root,
          permanent: false,
        },
      };
    }

    try {
      if (props) {
        additionalProps = await props({
          q,
          locale,
          ctx,
          isNextJsDataCall,
          session,
          accessToken,
        });
      }

      if (prefetch) {
        await prefetch({
          q,
          locale,
          ctx,
          props: additionalProps,
          isNextJsDataCall,
          session,
          accessToken,
        });
      }
    } catch (error) {
      const result = onError?.(error as Error);
      return result ?? pageExceptionHandler(error, locale === 'en' ? '' : locale);
    }

    const dehydratedState = dehydrate(q);

    return {
      props: {
        dehydratedState,
        ...additionalProps,
        session: session
          ? {
            ...session,
            user: omitBy(session.user, isNil),
          }
          : null,
      },
    } as unknown as GetServerSidePropsResult<P>;
  };
};

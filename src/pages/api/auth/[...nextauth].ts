import { atob } from 'buffer';
import { toNumber } from 'lodash';
import { JWT } from 'next-auth/jwt';
import { signOut } from 'next-auth/react';
import NextAuth, { User, AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { authApi } from '@/api/auth';

import { paths } from '@/routes/paths';
import { setAxiosAuthToken } from '@/api';

const base64UrlToBase64 = (base64Url: string) => base64Url.replace(/-/g, '+').replace(/_/g, '/');

const getJWTTokenExpiration = (token: string): number => {
  try {
    const [, payload] = token.split('.');

    const decodedPayload = atob(base64UrlToBase64(payload));
    const { exp } = JSON.parse(decodedPayload);

    return toNumber(exp);
  } catch (err) {
    if (err.response.data.status === 401) signOut({ callbackUrl: paths.order.root }); localStorage.clear();
    console.error('Error decoding JWT token:', err);
    throw new Error('Invalid JWT token');
  }
};

// const refreshAccessToken = async (token: JWT): Promise<JWT> => {
//   try {
//     const { data: tokenRes } = await authApi.refreshAccessToken(token.refreshToken);

//     const expireAt = getJWTTokenExpiration(tokenRes.access);

//     return {
//       ...token,
//       accessToken: tokenRes.access,
//       expireAt,
//     } as JWT;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',

      credentials: {}, // Empty because we will be using custom credentials

      async authorize(credentials) {
        const { email, password, accessToken: _accessToken, userData } = credentials as any;
        let accessToken = _accessToken;

        try {
          if (!accessToken) {
            const { data: loginRes } = await authApi.login({
              email,
              password,
            });

            accessToken = loginRes?.data?.accessToken;
          }
          if (!userData) {
            const { data: userRes } = await authApi.getCurrentUser({ accessToken });
            return {
              ...userRes,
              id: userRes.data._id,
              name: userRes.data.name,
              email: userRes.data.email,
              user_name: userRes.data?.user_name,
              //
              accessToken,
              // refreshToken: loginRes.data.refreshToken,
            } as unknown as User;
          }
          return {
            ...JSON.parse(userData),
            id: JSON.parse(userData)._id,
            name: JSON.parse(userData).name,
            email: JSON.parse(userData).email,
            user_name: JSON.parse(userData)?.user_name,
            //
            accessToken,
          } as unknown as User;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
    }),
  ],
  pages: {
    signIn: paths.register.root,
  },
  session: {
    strategy: 'jwt',
    // Set the maximum session duration to 24 hours
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      const _accessToken = token.accessToken ?? user.accessToken;
      // const _refreshToken = token.refreshToken ?? user.refreshToken;

      // Add user ID, access token and refresh token to the token right after signin
      const expireAt = _accessToken ? getJWTTokenExpiration(_accessToken) : 0;

      if (user) {
        return {
          ...token,
          id: user.id,
          accessToken: _accessToken,
          // refreshToken: _refreshToken,
          expireAt,
        } as JWT;
      }

      // Return previous token if the access token has not expired yet
      // Check if the access token has expired before 4 minutes
      if (Date.now() < (expireAt - 1 * 60) * 1000) {
        return token;
      }

      // return refreshAccessToken(token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (Date.now() >= token.expireAt * 1000) {
          return {} as any; // Sign out the user if the token is expired
        }

        session.user = {
          ...session.user,
          id: token.id,
          accessToken: token.accessToken,
          expireAt: token.expireAt,
        };

        // Set the global Axios token
        setAxiosAuthToken(token.accessToken);
      } else {
        // Clear the global Axios token if there's no token
        setAxiosAuthToken();
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);

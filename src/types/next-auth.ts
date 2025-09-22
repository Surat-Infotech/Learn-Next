import { DefaultSession } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    expireAt: number;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: number | string;
      accessToken: string;
      refreshToken: string;
      expireAt: number;
    } & DefaultSession['user'];
  }

  interface User {
    id: number | string;
    accessToken: string;
    refreshToken: string;
    expireAt: number;
  }
}

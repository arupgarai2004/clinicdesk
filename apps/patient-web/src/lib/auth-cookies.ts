import { AuthLoginResponse, AuthUser } from '@org/models';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
};

export function setAuthCookies(
  response: NextResponse,
  tokenDetail: AuthLoginResponse,
) {
  response.cookies.set('access_token', tokenDetail.accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60,
  });
  response.cookies.set('refresh_token', tokenDetail.refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set(
    'user',
    tokenDetail.user ? JSON.stringify(tokenDetail.user) : '',
    {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    },
  );
  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set('access_token', '', { ...cookieOptions, maxAge: 0 });
  response.cookies.set('refresh_token', '', { ...cookieOptions, maxAge: 0 });
  response.cookies.set('user', '', { ...cookieOptions, maxAge: 0 });
  return response;
}

export async function getAuthCookies() {
  const cookieStore = await cookies();
  const user = cookieStore.get('user')?.value;
  return {
    accessToken: cookieStore.get('access_token')?.value,
    refreshToken: cookieStore.get('refresh_token')?.value,
    user: user ? (JSON.parse(user) as AuthUser) : null,
  };
}

import { NextResponse } from 'next/server';
import { API_ORIGIN } from '../../../../lib/api-origin';
import { setAuthCookies } from '../../../../lib/auth-cookies';

export async function POST(request: Request) {
  const body = await request.json();

  const nestResponse = await fetch(`${API_ORIGIN}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await nestResponse.json().catch(() => ({}));
  if (!nestResponse.ok) {
    return NextResponse.json(data, { status: nestResponse.status });
  }

  const response = NextResponse.json({ user: data.user });
  if(typeof data.accessToken === 'string' && typeof data.refreshToken === 'string') { 
    return setAuthCookies(response, data, { rememberMe: body.rememberMe });
  } else {
    return NextResponse.json({ message: 'Invalid token data' }, { status: 500 });
  }
}

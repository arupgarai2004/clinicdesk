import { AuthLoginResponse, AuthUser, CreateUserDto, LoginDto } from '@org/models';

export const registerUser = async (userData: CreateUserDto): Promise<AuthUser> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error((await readErrorMessage(response)) ?? 'Failed to register user');
  }

  return response.json();
};

export const loginUser = async (credentials: LoginDto): Promise<AuthLoginResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error((await readErrorMessage(response)) ?? 'Failed to login user');
  }

  return response.json();
};

async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const body = await response.json();
    if (typeof body?.message === 'string') {
      return body.message;
    }
    if (Array.isArray(body?.message)) {
      return body.message.join(', ');
    }
  } catch {
    return null;
  }
  return null;
}

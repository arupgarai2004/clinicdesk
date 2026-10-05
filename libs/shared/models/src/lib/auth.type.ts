export type UserRole = 'SUPER_ADMIN' | 'CLINIC' | 'PATIENT';

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  clinicId?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clinicId: string | null;
  isActive: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthLoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
  clinicId: string | null;
  type: 'access';
};

export type RefreshTokenPayload = {
  sub: string;
  type: 'refresh';
};

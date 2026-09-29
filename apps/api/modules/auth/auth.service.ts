import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import {
  AuthLoginResponse,
  AuthUser,
  CreateUserDto,
  LoginDto,
  UserRole,
  AccessTokenPayload,
  RefreshTokenPayload,
} from '@org/models';
import { PrismaService } from '../../prisma/prisma.service';

const ACCESS_TOKEN_EXPIRES_SEC = 15 * 60;
const REFRESH_TOKEN_EXPIRES_SEC = 7 * 24 * 60 * 60;


@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.accessSecret =
      this.config.get<string>('JWT_ACCESS_SECRET') ??
      this.config.get<string>('JWT_SECRET') ??
      '';
    this.refreshSecret =
      this.config.get<string>('JWT_REFRESH_SECRET') ??
      this.accessSecret;

    if (!this.accessSecret) {
      throw new Error(
        'JWT_ACCESS_SECRET or JWT_SECRET must be set in apps/api/.env',
      );
    }
  }

  /**
   * Finds a user record by ID for internal use within the auth flow.
   */
  findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Creates a new user account after validating role rules and checking for duplicate emails.
   */
  async create(dto: CreateUserDto): Promise<AuthUser> {
    const email = dto.email.trim().toLowerCase();
    const role: UserRole = dto.role ?? 'PATIENT';
    const clinicId = role === 'CLINIC' ? dto.clinicId : undefined;

    this.assertRoleClinicRules(role, clinicId);

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    if (role === 'CLINIC') {
      const clinic = await this.prisma.clinic.findUnique({
        where: { id: clinicId },
      });
      if (!clinic) {
        throw new BadRequestException(`Clinic ${clinicId} not found`);
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name.trim(),
        passwordHash,
        role,
        clinicId: clinicId ?? null,
      },
    });

    return this.toPublicUser(user);
  }

  /**
   * Registers a new patient account using the default patient role.
   */
  async register(dto: CreateUserDto): Promise<AuthUser> {
    return this.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      role: 'PATIENT',
    });
  }

  /**
   * Returns a public-safe representation of a user by ID, throwing if no user exists.
   */
  async getPublicUserById(id: string): Promise<AuthUser> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return this.toPublicUser(user);
  }

  /**
   * Authenticates a user and returns both access and refresh tokens for a valid session.
   */
  async login(dto: LoginDto): Promise<AuthLoginResponse> {
    const user = await this.validateUser(dto.email, dto.password);
    return this.issueAuthSession(user);
  }

  /**
   * Verifies a refresh token, validates it against the stored token record, and issues a fresh session.
   */
  async refresh(refreshToken: string): Promise<AuthLoginResponse> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { id: payload.jti },
      include: { user: true },
    });

    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt.getTime() <= Date.now() ||
      stored.userId !== payload.sub ||
      !this.tokenHashMatches(refreshToken, stored.tokenHash)
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!stored.user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueAuthSession(stored.user);
  }

  /**
   * Revokes a refresh token if it is valid, treating already-expired tokens as a successful logout.
   */
  async logout(refreshToken: string): Promise<{ success: true }> {
    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { id: payload.jti, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Token is already unusable; treat logout as successful.
    }
    return { success: true };
  }

  /**
   * Validates the user's email and password, normalizing the email and checking account status.
   */
  private async validateUser(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const passwordHash =
      user?.passwordHash ??
      '$2b$10$C4oMAYppjzgXjJMfPef5NeKj38P7QIq6quty.MyvIxMBCDhakpMS.';
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!user || !user.isActive || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  /**
   * Issues a JWT access token and stores a hashed refresh token for the authenticated user session.
   */
  private async issueAuthSession(user: User): Promise<AuthLoginResponse> {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
        type: 'access',
      } satisfies AccessTokenPayload,
      {
        secret: this.accessSecret,
        expiresIn: ACCESS_TOKEN_EXPIRES_SEC,
      },
    );

    const refreshTokenId = randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        type: 'refresh',
      } satisfies RefreshTokenPayload,
      {
        secret: this.refreshSecret,
        expiresIn: REFRESH_TOKEN_EXPIRES_SEC,
        jwtid: refreshTokenId,
      },
    );

    await this.prisma.refreshToken.create({
      data: {
        id: refreshTokenId,
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_SEC * 1000),
      },
    });

    return {
      user: this.toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Validates a refresh token payload and ensures it carries the expected refresh token metadata.
   */
  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenPayload & { jti: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<
        RefreshTokenPayload & { jti?: string }
      >(refreshToken, { secret: this.refreshSecret });

      if (payload.type !== 'refresh' || !payload.jti || !payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return { ...payload, jti: payload.jti };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Hashes a token with SHA-256 so it can be stored and compared securely.
   */
  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Compares a raw token against a stored hash using a timing-safe comparison.
   */
  private tokenHashMatches(token: string, expectedHash: string) {
    const actual = Buffer.from(this.hashToken(token));
    const expected = Buffer.from(expectedHash);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }

  /**
   * Ensures clinic-specific validation rules are enforced for clinic and non-clinic users.
   */
  private assertRoleClinicRules(role: UserRole, clinicId?: string) {
    if (role === 'CLINIC' && !clinicId) {
      throw new BadRequestException('Clinic users must belong to a clinic');
    }
    if (role !== 'CLINIC' && clinicId) {
      throw new BadRequestException('Only clinic users can have a clinicId');
    }
  }

  /**
   * Maps a Prisma user model to the public auth response shape used by the API.
   */
  private toPublicUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clinicId: user.clinicId,
      isActive: user.isActive,
    };
  }
}

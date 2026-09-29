import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto, RefreshTokenDto } from '@org/models';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  registration(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('createUser')
  createUser(@Body() dto: CreateUserDto) {
    return this.authService.create(dto);
  }

  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.authService.getPublicUserById(id);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }
}

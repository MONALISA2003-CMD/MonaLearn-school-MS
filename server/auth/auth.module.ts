import { Body, Controller, Post, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard, RolesGuard, Public } from './auth.guards';
import { FirestoreService } from '../firestore.service';

class LoginDto {
  email: string;
  password: string;
}

class BootstrapDto {
  schoolName: string;
  domain: string;
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public() // the one route that must work without a token already
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Public() // also must work with zero users in the database — see
  // AuthService.bootstrapAdmin for why this is still safe
  @Post('bootstrap')
  bootstrap(@Body() dto: BootstrapDto) {
    return this.auth.bootstrapAdmin(dto.schoolName, dto.domain, dto.email, dto.password);
  }
}

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    FirestoreService,
    // Registered globally here so every controller in every other module
    // requires auth by default — the fix for "no auth guards anywhere"
    // from the audit. @Public() is the explicit opt-out for login itself.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RtJwtStrategy } from './strategies/rt-jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({ 
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')
      }),
      inject: [ConfigService],
    }),
],
  controllers: [AuthController],
  providers: [AuthService, RtJwtStrategy],
})

export class AuthModule {}

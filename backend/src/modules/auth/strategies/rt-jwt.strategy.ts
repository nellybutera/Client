import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../config/prisma.service';
import { Tokens } from '../types/tokens.type'

// Define the payload expected from the refresh token
type RtPayload = { id: number; email: string; role: 'CUSTOMER' | 'ADMIN' };

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      // looking for the token in the 'refresh_token' body field
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: config.get<string>('JWT_SECRET'), // Use the same JWT_SECRET
      passReqToCallback: true, // Pass the request to the validate method
    });
  }

  // validate function is the core of RT security
  async validate(req: Request, payload: RtPayload) {
    const refreshToken = req.body.refresh_token;

    //getting the user from the database
    const user = await this.prisma.user.findUnique({ where: { id: payload.id } });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Session revoked or user not found');
    }

    // comparing the plain RT from the request with the HASHED RT from the DB
    const rtMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!rtMatches) {
      // session hijacking attempt hhh
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // attaching the original refresh token to the payload for use in the controller
    return { 
      id: user.id, 
      role: user.role, 
      refreshToken, // include the token also for controller to use
    }; 
  }
}
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../config/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

type Tokens = { access_token: string; refresh_token: string; role: string };

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // token section

  async getTokens(userId: number, role: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      // Access Token (Short-lived)
      this.jwtService.signAsync(
        { id: userId, role: role },
        { 
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '3h', // Short expiry for security
        },
      ),
      // Refresh Token (Long-lived)
      this.jwtService.signAsync(
        { id: userId, role: role },
        { 
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '7d', //  Long expiry for session tracking
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
      role: role,
    };
  }

  // store the HASH of the Refresh Token
  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }

  // Clear the RT hash (Logout/Revoke Session)
  async clearRtHash(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async register(dto: RegisterDto) {

    const role = 'CUSTOMER'; // Force role to CUSTOMER
    const hashed = await bcrypt.hash(dto.password, 10);
    try{
        const user = await this.prisma.user.create({
            data: { ...dto, password: hashed, role: role },
        });

        // return tokens after registration
        const tokens = await this.getTokens(user.id, role);
        await this.updateRtHash(user.id, tokens.refresh_token);

        // for returning tokens and user info
        return { message: 'User registered', user };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ConflictException('User with email already exists');
            }
        }
        throw error;
    }
    
  }

  async login(dto: LoginDto) {
    try {
      // db operation
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials'); 
      }

      const tokens = await this.getTokens(user.id, user.role);
      await this.updateRtHash(user.id, tokens.refresh_token);
      
      return tokens; // return both AT and RT
      
    } catch (error) {
      // If it's a known, expected error, re-throw it (e.g., 401 Unauthorized)
      if (error instanceof UnauthorizedException) {
        throw error; 
      }
      
      // If it's an unexpected error (like 'secret must be provided' or 'P1001'), log it
      console.error("Critical Login Dependency Error:", error);
      
      // Throw a generic error to be caught by the controller's InternalServerErrorException
      throw new Error('Dependency failure during login.'); 
    }
  }

}

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../config/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    try{
        const user = await this.prisma.user.create({
            data: { ...dto, password: hashed },
        });
        return { message: 'User registered', user };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ConflictException('User with emaail already exists');
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
      
      // jwt operation
      const token = await this.jwtService.signAsync({ id: user.id, role: user.role });
      return { access_token: token, role: user.role };
      
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

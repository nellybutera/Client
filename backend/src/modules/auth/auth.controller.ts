import { Controller, Post, Body, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      // Assuming AuthService.register throws specific errors
      return await this.authService.register(dto);
    } catch (error) {
      // Handling expected errors first
      if (error.message === 'User already exists') { 
        throw new ConflictException('A user with this email already exists.');
      }
      
      // Handle any unexpected errors
      throw new InternalServerErrorException('Registration failed due to an unexpected server error.');
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authService.login(dto);
    } catch (error) {
      //Handle expected errors first
      if (error.message === 'Invalid credentials') {
        throw new UnauthorizedException('Invalid email or password.');
      }
      
      // Handle any unexpected errors
      throw new InternalServerErrorException('Login failed due to an unexpected server error.');
    }
  }
}

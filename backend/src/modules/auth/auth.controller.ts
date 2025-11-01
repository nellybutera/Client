import { Controller, Post, Body, ConflictException, UnauthorizedException, InternalServerErrorException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RtJwtAuthGuard } from './guards/rt-jwt-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      if (error instanceof ConflictException) { 
      throw new ConflictException('A user with this email already exists.');
      }
      throw new InternalServerErrorException('Registration failed due to an unexpected server error.');
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authService.login(dto);
    } catch (error) {
      //Handle expected errors first
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid email or password.');
      }
      
      // Handle any unexpected errors
      throw new InternalServerErrorException('Login failed due to an unexpected server error.');
    }
  }

  @UseGuards(RtJwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req){
    // RTJwtAuthGuard ensures only valid RTs reach this point (non-expired ones)
    const { id, role, refreshToken } = req.user; // includes the refresh token from the strategy

    //generating brand new set of tokens
    const tokens = await this.authService.getTokens(id, role);

    // hashing and storing new RT, while invalidating old one
    await this.authService.updateRtHash(id, tokens.refresh_token);

    return tokens;
  }

  @UseGuards(JwtAuthGuard) // protects against unauthenticated access
  @Post('logout')
  async logout(@Req() req) {
    // JWTAuthGuard ensures  the user is logged in through valid access token
    const id = req.user.id;
    // clearing stored refresh token has to revoke session for this user
    await this.authService.clearRtHash(id);

    return { message: 'Successfully logged out and session revoked.' };
  }
}

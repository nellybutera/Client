import { Controller, Post, Body, ConflictException, UnauthorizedException, InternalServerErrorException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RtJwtAuthGuard } from './guards/rt-jwt-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user and return tokens' }) 
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 409, description: 'Conflict (User already exists).' })
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
  @ApiOperation({ summary: 'Log in and return new access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized (Invalid credentials).' })
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
  @ApiBearerAuth('refreshToken') // requires the token with the 'refreshToken' security name defined in main.ts
  @ApiOperation({ summary: 'Use Refresh Token to get a new Access Token pair' })
  @ApiResponse({ status: 200, description: 'New tokens successfully issued.' })
  @ApiResponse({ status: 401, description: 'Unauthorized (Invalid/expired RT).' })
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
  @ApiBearerAuth('accessToken') // Requires the token with the 'accessToken' security name defined in main.ts
  @ApiOperation({ summary: 'Logout and revoke the session by clearing the Refresh Token hash' })
  @ApiResponse({ status: 200, description: 'Successfully logged out, session ended.' })
  @ApiResponse({ status: 401, description: 'Unauthorized (Invalid AT).' })
  async logout(@Req() req) {
    // JWTAuthGuard ensures  the user is logged in through valid access token
    const id = req.user.id;
    // clearing stored refresh token has to revoke session for this user
    await this.authService.clearRtHash(id);

    return { message: 'Successfully logged out and session revoked.' };
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { RtJwtAuthGuard } from './guards/rt-jwt-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { mock } from 'node:test';

// mock data
const MOCK_TOKENS = {
  access_token: 'new_mock_access_token',
  refresh_token: 'new_mock_refresh_token',
  role: 'CUSTOMER',
};
const MOCK_USER_PAYLOAD = {
  id: 1,
  email: 'test@customer.com',
  role: 'CUSTOMER',
};
const MOCK_REFRESH_TOKEN_FROM_REQUEST = 'valid_old_refresh_token';

// mock services and guards

// expected return types for the mock methods
type Tokens = typeof MOCK_TOKENS;
type RegisterResult = { message: string; user: any; access_token: string; refresh_token: string; role: string; };

const mockAuthService: Partial<AuthService> = {
  register: jest.fn<Promise<RegisterResult>, [RegisterDto]>(() => 
    Promise.resolve({ message: 'User registered', user: MOCK_USER_PAYLOAD, ...MOCK_TOKENS })
  ),
  login: jest.fn<Promise<Tokens>, [LoginDto]>(() => 
    Promise.resolve(MOCK_TOKENS)
  ),
  getTokens: jest.fn<Promise<Tokens>, [number, string]>(() => 
    Promise.resolve(MOCK_TOKENS)
  ),
  updateRtHash: jest.fn<Promise<void>, [number, string]>(() => 
    Promise.resolve()
  ),
  clearRtHash: jest.fn<Promise<void>, [number]>(() => 
    Promise.resolve()
  ),
};

const mockRtGuardCanActivate = jest.fn((context) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: MOCK_USER_PAYLOAD.id, role: MOCK_USER_PAYLOAD.role, refreshToken: MOCK_REFRESH_TOKEN_FROM_REQUEST };
    return true;
});

const mockJwtGuardCanActivate = jest.fn((context) => {
    const req = context.switchToHttp().getRequest();
    req.user = MOCK_USER_PAYLOAD;
    return true;
});

// mock RtJwtAuthGuard, simulates successful refresh token validation
const mockRtGuard = { canActivate: mockRtGuardCanActivate};

// mock JwtAuthGuard, simulating successful access token validation
const mockJwtGuard = { canActivate: mockJwtGuardCanActivate};


describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
    // overriding the real guards with mocks for isolated testing
    .overrideGuard(RtJwtAuthGuard).useValue(mockRtGuard) 
    .overrideGuard(JwtAuthGuard).useValue(mockJwtGuard)
    .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // register and login tests

  describe('register', () => {
    const registerDto: RegisterDto = { email: 'new@customer.com', password: 'password', name: 'New Customer' };
    
    it('should call authService.register and return tokens/user', async () => {
        const result = await controller.register(registerDto);
        expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
        expect(result).toHaveProperty('access_token', MOCK_TOKENS.access_token);
        expect(result.user).toEqual(MOCK_USER_PAYLOAD);
    });

    it('should throw ConflictException on known conflict error', async () => {
        (mockAuthService.register as jest.Mock).mockRejectedValueOnce(new ConflictException('A user with this email already exists.'));
        await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
        (mockAuthService.register as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
        await expect(controller.register(registerDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = { email: 'test@customer.com', password: 'password' };
    
    it('should call authService.login and return AT/RT', async () => {
        const result = await controller.login(loginDto);
        expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
        expect(result).toEqual(MOCK_TOKENS);
    });

    it('should throw UnauthorizedException on invalid credentials error', async () => {
        (mockAuthService.login as jest.Mock).mockRejectedValueOnce(new UnauthorizedException('Invalid email or password.'));
        await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });


  // -refresh and logout methosds
  describe('refresh', () => {
    it('should use the RT to generate new tokens and update the RT hash', async () => {
      // Mock the request object populated by the RtJwtAuthGuard
      const mockRequest = { 
        user: { 
          id: MOCK_USER_PAYLOAD.id, 
          role: MOCK_USER_PAYLOAD.role, 
          refreshToken: MOCK_REFRESH_TOKEN_FROM_REQUEST 
        } 
      };
      const result = await controller.refresh(mockRequest as any);
      // verifying new token generation call
      expect(mockAuthService.getTokens).toHaveBeenCalledWith(
        MOCK_USER_PAYLOAD.id, 
        MOCK_USER_PAYLOAD.role
      );
      
      // verifying that the NEW token hash was stored
      expect(mockAuthService.updateRtHash).toHaveBeenCalledWith(
        MOCK_USER_PAYLOAD.id, 
        MOCK_TOKENS.refresh_token 
      );
      
      // verifying the response is the new token pair
      expect(result).toEqual(MOCK_TOKENS);
    });

  });

  describe('logout', () => {
    it('should use the AT to clear the RT hash (revoke session)', async () => {
      // mocking the request object populated by the JwtAuthGuard
      const mockRequest = { user: { id: MOCK_USER_PAYLOAD.id } };
      const result = await controller.logout(mockRequest as any);
      // verifying that the RT hash was cleared and called with correct user ID
      expect(mockAuthService.clearRtHash).toHaveBeenCalledWith(MOCK_USER_PAYLOAD.id);
      
      // verifying the correct success message is returned
      expect(result).toEqual({ message: 'Successfully logged out and session revoked.' });
    });
  });
});
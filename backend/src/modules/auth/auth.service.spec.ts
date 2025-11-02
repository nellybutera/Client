import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../config/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// mock constraints
const MOCK_ACCESS_TOKEN = 'mock_at';
const MOCK_REFRESH_TOKEN = 'mock_rt';
const MOCK_HASHED_RT = 'hashed_mock_rt';
const MOCK_PASSWORD = 'password';
const MOCK_HASHED_PASSWORD = 'hashed_password';

// mock service implementations

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwtService = {
  // mock signAsync to return AT first (3h expiry) then RT (7d expiry)
  signAsync: jest.fn().mockImplementation(async (payload, options) => {
    if (options?.expiresIn === '3h') return MOCK_ACCESS_TOKEN;
    if (options?.expiresIn === '7d') return MOCK_REFRESH_TOKEN;
    return 'default_token';
  }),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') return 'test-secret';
    return null;
  }),
};

// mock bcrypt functions at the file level
jest.mock('bcrypt', () => ({
  hash: jest.fn(async (data: string) => {
    if (data === MOCK_REFRESH_TOKEN) return MOCK_HASHED_RT;
    if (data === MOCK_PASSWORD) return MOCK_HASHED_PASSWORD;
    return `hashed_${data}`;
  }),
  compare: jest.fn(async (data, hash) => hash === `hashed_${data}`),
}));


// mock data
const mockUser = {
  id: 1,
  email: 'test@customer.com',
  password: MOCK_HASHED_PASSWORD,
  role: 'CUSTOMER',
  firstName: 'Test Customer',
  middleName: 'T.',
  lastName: 'User',
  dateOfBirth: new Date('1990-01-01'),
  phoneNumber: '1234567890',
  refreshTokenHash: null,
  createdAt: new Date(),
  balance: 0,
  creditScore: 700
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockClear();
    (bcrypt.compare as jest.Mock).mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // token helpers
  describe('getTokens', () => {
    it('should return both AT and RT with correct expiries', async () => {
      const tokens = await service.getTokens(mockUser.id, mockUser.role);

      expect(tokens).toEqual({
        access_token: MOCK_ACCESS_TOKEN,
        refresh_token: MOCK_REFRESH_TOKEN,
        role: mockUser.role,
      });

      // Verify signAsync calls for AT (3h) and RT (7d)
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { id: mockUser.id, role: mockUser.role },
        expect.objectContaining({ expiresIn: '3h' })
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { id: mockUser.id, role: mockUser.role },
        expect.objectContaining({ expiresIn: '7d' })
      );
    });
  });

  describe('updateRtHash', () => {
    it('should hash the RT and update the user record', async () => {
      await service.updateRtHash(mockUser.id, MOCK_REFRESH_TOKEN);

      expect(bcrypt.hash).toHaveBeenCalledWith(MOCK_REFRESH_TOKEN, 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { refreshTokenHash: MOCK_HASHED_RT },
      });
    });
  });

  describe('clearRtHash', () => {
    it('should set refreshTokenHash to null to revoke session', async () => {
      await service.clearRtHash(mockUser.id);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { refreshTokenHash: null },
      });
    });
  });

  // register tests
  describe('register', () => {
    const registerDto: RegisterDto = { 
      firstName: 'Jane', 
      middleName: 'A.',
      lastName: 'Doe' ,
      email: 'new@customer.com', 
      password: 'password', 
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890'
    };
    const registeredUser = { 
      ...mockUser, 
      email: registerDto.email, 
      firstName: registerDto.firstName
    , middleName: registerDto.middleName
    , lastName: registerDto.lastName
    , dateOfBirth: new Date(registerDto.dateOfBirth)
    , phoneNumber: registerDto.phoneNumber
    };

    beforeEach(() => {
        // setting up mocks for successful token generation and hash storage during register
        mockPrismaService.user.create.mockResolvedValue(registeredUser);
        jest.spyOn(service, 'getTokens').mockResolvedValue({ 
            access_token: MOCK_ACCESS_TOKEN, 
            refresh_token: MOCK_REFRESH_TOKEN, 
            role: 'CUSTOMER' 
        });
        jest.spyOn(service, 'updateRtHash');
    });

    it('should successfully register, set role to CUSTOMER, and return tokens', async () => {
      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      
      expect(mockPrismaService.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
            password: MOCK_HASHED_PASSWORD, 
            role: 'CUSTOMER' // ensuring role is correctly forced
        }),
      }));
      
      expect(service.getTokens).toHaveBeenCalledWith(registeredUser.id, 'CUSTOMER');
      expect(service.updateRtHash).toHaveBeenCalledWith(registeredUser.id, MOCK_REFRESH_TOKEN);

      expect(result).toHaveProperty('access_token', MOCK_ACCESS_TOKEN);
      expect(result.user).toEqual(expect.objectContaining({ role: 'CUSTOMER' }));
    });

    it('should throw ConflictException for existing email (P2002)', async () => {
      const mockP2002Error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: '6.18.0' }
      );
      mockPrismaService.user.create.mockRejectedValue(mockP2002Error);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow('User with email already exists');
    });
  });


  // login tests
  describe('login', () => {
    const loginDto: LoginDto = { email: mockUser.email, password: MOCK_PASSWORD };
    
    beforeEach(() => {
        // Setup successful user finding and password comparison
        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        
        // Setup token generation and hash storage mocks
        jest.spyOn(service, 'getTokens');
        jest.spyOn(service, 'updateRtHash');
    });

    it('should successfully log in, return AT/RT, and store RT hash', async () => {
      const result = await service.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, MOCK_HASHED_PASSWORD);
        
      // Verify token generation and RT hash storage
      expect(service.getTokens).toHaveBeenCalledWith(mockUser.id, mockUser.role);
      expect(service.updateRtHash).toHaveBeenCalledWith(mockUser.id, MOCK_REFRESH_TOKEN);
      
      expect(result).toEqual({
        access_token: MOCK_ACCESS_TOKEN,
        refresh_token: MOCK_REFRESH_TOKEN,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(service.getTokens).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); 

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(service.getTokens).not.toHaveBeenCalled();
    });
  });

});
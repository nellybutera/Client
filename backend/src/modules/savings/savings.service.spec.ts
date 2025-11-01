import { Test, TestingModule } from '@nestjs/testing';
import { SavingsService } from './savings.service';
import { PrismaService } from '../../config/prisma.service'; // <-- Import PrismaService

const MOCK_USER = { 
  id: 1, 
  name: 'Test User',
  email: 'test@user.com', 
  balance: 100, 
  role: 'CUSTOMER',
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn().mockResolvedValue(MOCK_USER),
    update: jest.fn(async (params) => {
      // Simple mock logic for update
      if (params.where.id === MOCK_USER.id) {
        return { ...MOCK_USER, balance: MOCK_USER.balance + 100 }; // Mock increment
      }
      return null;
    }),
  },
};

describe('SavingsService', () => {
  let service: SavingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SavingsService, 
        { provide: PrismaService, useValue: mockPrismaService },],
    }).compile();

    service = module.get<SavingsService>(SavingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service'; // <-- Import the Service

const mockSavingsService = {
  // mocking all methods used by the controller, e.g.,
  findAll: jest.fn(),
  create: jest.fn(),
};

describe('SavingsController', () => {
  let controller: SavingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavingsController],
      providers: [
        // providing the mock SavingsService
        { provide: SavingsService, useValue: mockSavingsService }, 
      ],
    }).compile();

    controller = module.get<SavingsController>(SavingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

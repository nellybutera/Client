import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service'; // <-- Import the Service

const mockUsersService = {
  // Mock any methods that the controller calls, e.g., findOne, findAllUsers
  findOne: jest.fn().mockResolvedValue({ id: 1, email: 'test@user.com', name: 'Test User' }),
  findAllUsers: jest.fn().mockResolvedValue([]),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        // providing the mock UsersService
        { provide: UsersService, useValue: mockUsersService }, 
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

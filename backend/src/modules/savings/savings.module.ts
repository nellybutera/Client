import { Module } from '@nestjs/common';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';

@Module({

  // registering SavingsController
  controllers: [SavingsController],

  // registering SavingsService as a provider
  providers: [SavingsService],
})
export class SavingsModule {}

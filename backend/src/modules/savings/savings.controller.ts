import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { SavingsService } from './savings.service';

@Controller('savings')
export class SavingsController {
  constructor(private service: SavingsService) {}

  @Post('deposit')
  deposit(@Body() body: { userId: number; amount: number }) {
    
    const userId = Number(body.userId);
    const amount = Number(body.amount);

    return this.service.deposit(userId, amount);
  }

  @Post('withdraw')
  withdraw(@Body() body: { userId: number; amount: number }) {
    const userId = Number(body.userId);
    const amount = Number(body.amount);

    return this.service.withdraw(userId, amount);
  }

  @Get('balance/:id')
  balance(@Param('id') id: number) {
    return this.service.balance(Number(id));
  }
}

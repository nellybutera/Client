import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { SavingsService } from './savings.service';

@Controller('savings')
export class SavingsController {
  constructor(private service: SavingsService) {}

  @Post('deposit')
  deposit(@Body() body: { userId: number; amount: number }) {
    return this.service.deposit(body.userId, body.amount);
  }

  @Post('withdraw')
  withdraw(@Body() body: { userId: number; amount: number }) {
    return this.service.withdraw(body.userId, body.amount);
  }

  @Get('balance/:id')
  balance(@Param('id') id: number) {
    return this.service.balance(Number(id));
  }
}

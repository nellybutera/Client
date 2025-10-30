import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service'
import { Prisma } from '@prisma/client';

@Injectable()
export class SavingsService {
  constructor(private prisma: PrismaService) {}

  async deposit(userId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount be greater than zero');
    }

    try{
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      });

      return user;
    }catch(error){
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
        // throw error if user was not found
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      // log the critical error for example it could be like a database connection issue.
      console.error("Deposit service critical error:", error);

      //re-throw any other unexpected errors
      throw error;
    }
  }

  async withdraw(userId: number, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.balance < amount) throw new BadRequestException('Insufficient balance');
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
    });
  }

  async balance(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return { balance: user?.balance ?? 0 };
  }
}

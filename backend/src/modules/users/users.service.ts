import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service'; 

@Injectable()
export class UsersService {
  // injecting PrismaService via the constructor
  constructor(private prisma: PrismaService) {}

  // function that now uses Prisma
  async findAllUsers() {
    return this.prisma.user.findMany(); 
  }
}
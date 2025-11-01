import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service'; 
import { User } from '@prisma/client'; // Assuming you import the Prisma User type

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // method for finding one user (for client profile)
  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      //for security purposes, i exclude sensitive fields like password and RT hash
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        balance: true,
        createdAt: true
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }
}
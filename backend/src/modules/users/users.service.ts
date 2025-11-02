import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service'; 
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  
  constructor(private prisma: PrismaService) {}

}
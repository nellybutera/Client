import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; 
import { PrismaModule } from '../../config/prisma.module'; 

@Module({
  // Ensure the module that exports the JwtAuthGuard (usually AuthModule) is imported
  imports: [PrismaModule], // include PrismaService through a module if you use one
  controllers: [UsersController], // Register Controller
  providers: [UsersService],
  //Export the service if other modules (like Auth) use it
  exports: [UsersService], 
})


export class UsersModule {}
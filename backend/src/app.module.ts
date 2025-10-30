import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SavingsService } from './modules/savings/savings.service';
import { SavingsModule } from './modules/savings/savings.module';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';  
import { PrismaService } from './config/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, 
    SavingsModule, 
    UsersModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, SavingsService, PrismaService],
})
export class AppModule {}

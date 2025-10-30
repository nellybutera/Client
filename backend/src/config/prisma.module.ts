import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Optional, but makes it easier to use everywhere
@Module({
  providers: [PrismaService],
  // crucial step: export the service so other modules can use it
  exports: [PrismaService], 
})
export class PrismaModule {}
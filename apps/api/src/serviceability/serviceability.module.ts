import { Module } from '@nestjs/common';
import { ServiceabilityController } from './serviceability.controller';
import { ServiceabilityService } from './serviceability.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ServiceabilityController],
  providers: [ServiceabilityService, PrismaService],
  exports: [ServiceabilityService],
})
export class ServiceabilityModule {}

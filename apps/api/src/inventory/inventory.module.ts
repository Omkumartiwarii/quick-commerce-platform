import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [InventoryService, PrismaService, RedisService],
  exports: [InventoryService],
})
export class InventoryModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { ServiceabilityModule } from './serviceability/serviceability.module';
import { CatalogModule } from './catalog/catalog.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    AuthModule,
    ServiceabilityModule,
    CatalogModule,
    InventoryModule,
    OrdersModule,
  ],
})
export class AppModule {}

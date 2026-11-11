import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('InventoryService (Concurrency & Anti-Overselling Guardrails)', () => {
  let service: InventoryService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryService, PrismaService, RedisService],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    redisService = module.get<RedisService>(RedisService);
    await redisService.onModuleInit();
  });

  it('should successfully reserve available inventory', async () => {
    const storeId = 'store-noida-sec62';
    const variantId = 'AMUL-MILK-500ML';

    // Set initial inventory to 10 units
    service.setInitialStock(storeId, variantId, 10);

    const result = await service.reserveStock(
      storeId,
      [{ variantId, quantity: 4 }],
      'session-test-01',
      600,
    );

    expect(result.reservationId).toBe('res-session-test-01');
    const remaining = service.getStock(storeId, variantId);
    expect(remaining.available).toBe(6);
    expect(remaining.reserved).toBe(4);
  });

  it('should prevent overselling when requested quantity exceeds available stock', async () => {
    const storeId = 'store-noida-sec62';
    const variantId = 'RARE-MANGO-BOX';

    // Set stock to only 2 units
    service.setInitialStock(storeId, variantId, 2);

    // Requesting 3 units must fail with ConflictException (409)
    await expect(
      service.reserveStock(storeId, [{ variantId, quantity: 3 }], 'session-test-02'),
    ).rejects.toThrow(ConflictException);

    // Stock must remain intact
    const current = service.getStock(storeId, variantId);
    expect(current.available).toBe(2);
    expect(current.reserved).toBe(0);
  });

  it('should release reserved inventory back to available pool on cancellation', async () => {
    const storeId = 'store-noida-sec62';
    const variantId = 'COKE-CAN-300ML';

    service.setInitialStock(storeId, variantId, 5);

    // Reserve 3 units
    await service.reserveStock(storeId, [{ variantId, quantity: 3 }], 'session-test-03');
    expect(service.getStock(storeId, variantId).available).toBe(2);

    // Release reservation
    await service.releaseReservation(storeId, [{ variantId, quantity: 3 }]);

    // Available must be restored to 5
    const restored = service.getStock(storeId, variantId);
    expect(restored.available).toBe(5);
    expect(restored.reserved).toBe(0);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ServiceabilityService } from './serviceability.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ServiceabilityService (PostGIS Geofence & Dynamic ETA)', () => {
  let service: ServiceabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceabilityService, PrismaService],
    }).compile();

    service = module.get<ServiceabilityService>(ServiceabilityService);
  });

  it('should find active dark store for coordinates in Noida Sector 62', async () => {
    // Exact Sector 62 coordinates
    const lat = 28.6280;
    const lng = 77.3649;

    const result = await service.checkServiceability(lat, lng);

    expect(result.isServiceable).toBe(true);
    expect(result.storeCode).toBe('MFC-NOIDA-04');
    expect(result.estimatedDeliveryMinutes).toBeGreaterThanOrEqual(8);
    expect(result.estimatedDeliveryMinutes).toBeLessThanOrEqual(15);
  });

  it('should find active dark store for coordinates in Noida Sector 18 (Atta Market)', async () => {
    const lat = 28.5708;
    const lng = 77.3271;

    const result = await service.checkServiceability(lat, lng);

    expect(result.isServiceable).toBe(true);
    expect(result.storeCode).toBe('MFC-NOIDA-01');
  });

  it('should reject coordinates outside Noida operating zones', async () => {
    // Mumbai Marine Drive coordinates
    const lat = 18.9440;
    const lng = 72.8238;

    const result = await service.checkServiceability(lat, lng);

    expect(result.isServiceable).toBe(false);
    expect(result.reason).toContain('outside active Noida dark store delivery zones');
  });
});

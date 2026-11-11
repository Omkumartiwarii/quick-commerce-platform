import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('AuthService (Authentication & Security)', () => {
  let service: AuthService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        RedisService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn().mockReturnValue({ sub: 'user-1', roles: ['CUSTOMER'] }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    redisService = module.get<RedisService>(RedisService);
    await redisService.onModuleInit();
  });

  it('should generate a 6-digit OTP for a valid Indian mobile number', async () => {
    const phone = '+919876543210';
    const result = await service.requestOtp(phone);

    expect(result.message).toContain('OTP sent successfully');
    expect(result.devOtp).toBeDefined();
    expect(result.devOtp).toHaveLength(6);
    expect(/^\d{6}$/.test(result.devOtp!)).toBe(true);
  });

  it('should enforce strict rate limiting after 3 consecutive OTP requests', async () => {
    const phone = '+919999888877';

    // 1st request -> success
    await service.requestOtp(phone);
    // 2nd request -> success
    await service.requestOtp(phone);
    // 3rd request -> success
    await service.requestOtp(phone);

    // 4th request -> must throw 429 Too Many Requests!
    await expect(service.requestOtp(phone)).rejects.toThrow(HttpException);
  });

  it('should successfully verify a correct OTP and return tokens', async () => {
    const phone = '+919123456780';
    const req = await service.requestOtp(phone);
    const validOtp = req.devOtp!;

    const authResult = await service.verifyOtp(phone, validOtp);
    expect(authResult.accessToken).toBe('mock-jwt-token');
    expect(authResult.refreshToken).toBe('mock-jwt-token');
    expect(authResult.user.phone).toBe(phone);
    expect(authResult.user.roles).toContain('CUSTOMER');
  });

  it('should reject an incorrect OTP with UnauthorizedException', async () => {
    const phone = '+919111222333';
    await service.requestOtp(phone);

    await expect(service.verifyOtp(phone, '000000')).rejects.toThrow(UnauthorizedException);
  });
});

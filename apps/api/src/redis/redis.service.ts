import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private readonly memoryStore = new Map<string, { value: string; expiresAt?: number }>();

  async onModuleInit() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = Number(process.env.REDIS_PORT) || 6379;

    try {
      this.client = new Redis({
        host,
        port,
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        retryStrategy: () => null, // Don't hang if local redis is not running
        lazyConnect: true,
      });

      await this.client.connect();
      this.logger.log(`Connected to Redis at ${host}:${port}`);
    } catch {
      this.logger.warn(`Redis not reachable at ${host}:${port}. Using high-performance in-memory cache fallback.`);
      this.client = null;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.client) {
      try {
        return await this.client.get(key);
      } catch {
        // Fallback to memory
      }
    }

    const item = this.memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (this.client) {
      try {
        if (ttlSeconds) {
          return await this.client.set(key, value, 'EX', ttlSeconds);
        }
        return await this.client.set(key, value);
      } catch {
        // Fallback to memory
      }
    }

    this.memoryStore.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    if (this.client) {
      try {
        return await this.client.del(key);
      } catch {
        // Fallback to memory
      }
    }

    const existed = this.memoryStore.delete(key);
    return existed ? 1 : 0;
  }

  async acquireLock(lockKey: string, ttlSeconds = 30): Promise<boolean> {
    const fullKey = `lock:${lockKey}`;
    if (this.client) {
      try {
        const result = await this.client.set(fullKey, 'locked', 'EX', ttlSeconds, 'NX');
        return result === 'OK';
      } catch {
        // Fallback to memory
      }
    }

    const existing = this.memoryStore.get(fullKey);
    if (existing && (!existing.expiresAt || existing.expiresAt > Date.now())) {
      return false;
    }
    this.memoryStore.set(fullKey, {
      value: 'locked',
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return true;
  }

  async releaseLock(lockKey: string): Promise<void> {
    await this.del(`lock:${lockKey}`);
  }
}

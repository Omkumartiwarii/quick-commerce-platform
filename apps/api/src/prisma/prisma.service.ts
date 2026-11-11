import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const defaultUrl =
      process.env.DATABASE_URL ||
      'postgresql://mock_user:mock_pass@localhost:5432/quick_commerce_db?schema=public';

    super({
      datasources: {
        db: {
          url: defaultUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    // If no real database URL configured or DB is explicitly skipped, run purely in mock mode
    if (
      !process.env.DATABASE_URL ||
      process.env.SKIP_DB === 'true' ||
      process.env.DATABASE_URL.includes('mock_user')
    ) {
      this.logger.log('ℹ️ Running in Standalone In-Memory mode (Database skipped as requested).');
      return;
    }

    try {
      await this.$connect();
      this.logger.log('✅ Connected to PostgreSQL database');
    } catch (err) {
      this.logger.warn(
        `ℹ️ PostgreSQL connection skipped/unavailable. Continuing in In-Memory Standalone mode.`,
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {
      // Ignore disconnect errors in standalone mock mode
    }
  }
}

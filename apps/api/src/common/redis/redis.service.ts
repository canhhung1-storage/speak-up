import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST', 'redis');
    const port = parseInt(this.configService.get<string>('REDIS_PORT', '6379'), 10);
    const password = this.configService.get<string>('REDIS_PASSWORD', 'redis_secret_pass');

    this.client = new Redis({
      host,
      port,
      password: password || undefined,
      lazyConnect: true,
      retryStrategy: (times) => {
        const delay = Math.min(times * 200, 2000);
        this.logger.warn(`Redis connection retry attempt ${times} in ${delay}ms`);
        return delay;
      },
    });

    this.client.on('connect', () => {
      this.logger.log(`⚡ Connected to Redis at ${host}:${port}`);
    });

    this.client.on('error', (err) => {
      this.logger.error(`❌ Redis error: ${err.message}`);
    });

    // Initiate connection asynchronously
    this.client.connect().catch((err) => {
      this.logger.warn(`Initial Redis connection failed (will retry): ${err.message}`);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (err: any) {
      this.logger.error(`Error getting key ${key}: ${err.message}`);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null> {
    try {
      if (ttlSeconds && ttlSeconds > 0) {
        return await this.client.set(key, value, 'EX', ttlSeconds);
      }
      return await this.client.set(key, value);
    } catch (err: any) {
      this.logger.error(`Error setting key ${key}: ${err.message}`);
      return null;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (err: any) {
      this.logger.error(`Error deleting key ${key}: ${err.message}`);
      return 0;
    }
  }

  /**
   * Safely delete all keys matching a pattern using SCAN stream (non-blocking)
   */
  async delPattern(pattern: string): Promise<number> {
    try {
      const stream = this.client.scanStream({
        match: pattern,
        count: 100,
      });

      let totalDeleted = 0;
      for await (const resultKeys of stream) {
        if (resultKeys.length > 0) {
          const deleted = await this.client.del(...resultKeys);
          totalDeleted += deleted;
        }
      }
      return totalDeleted;
    } catch (err: any) {
      this.logger.error(`Error deleting pattern ${pattern}: ${err.message}`);
      return 0;
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from Redis...');
    try {
      await this.client.quit();
    } catch {
      this.client.disconnect();
    }
  }
}

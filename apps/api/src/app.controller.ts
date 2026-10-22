import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
  @Get()
  getHealth() {
    return {
      service: 'SpeakUp Backend API (NestJS)',
      status: 'ONLINE',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      message: 'NestJS and TypeORM framework initialized successfully.',
    };
  }
}

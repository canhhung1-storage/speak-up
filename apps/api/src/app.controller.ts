import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Kiểm tra trạng thái máy chủ Backend API' })
  @ApiResponse({
    status: 200,
    description: 'Máy chủ NestJS hoạt động bình thường',
    schema: {
      example: {
        service: 'SpeakUp Backend API (NestJS)',
        status: 'ONLINE',
        environment: 'development',
        timestamp: '2026-10-25T14:44:23.014Z',
        message: 'NestJS and TypeORM framework initialized successfully.',
      },
    },
  })
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

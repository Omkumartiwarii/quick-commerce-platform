import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'System Health Check' })
  health() {
    return {
      status: 'ok',
      service: 'jaldiwala-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'API Root' })
  root() {
    return {
      name: 'JaldiWala Quick Commerce Core API',
      status: 'online',
      version: '1.0.0',
      docs: '/docs',
      health: '/v1/health',
    };
  }
}

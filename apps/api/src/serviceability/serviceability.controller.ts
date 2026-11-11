import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServiceabilityService } from './serviceability.service';
import { GeoCoordinateSchema } from '@qc/shared-validation';

@ApiTags('Geography & Serviceability')
@Controller('geo')
export class ServiceabilityController {
  constructor(private readonly serviceabilityService: ServiceabilityService) {}

  @Post('serviceability/check')
  @ApiOperation({ summary: 'Check dark store serviceability and calculate dynamic ETA' })
  @ApiResponse({ status: 200, description: 'Serviceability response with matching dark store' })
  async checkServiceability(@Body() body: unknown) {
    const coords = GeoCoordinateSchema.parse(body);
    return this.serviceabilityService.checkServiceability(coords.latitude, coords.longitude);
  }

  @Get('hubs')
  @ApiOperation({ summary: 'List all active Noida MFC Dark Stores' })
  async listHubs() {
    return this.serviceabilityService.listOperatingHubs();
  }
}

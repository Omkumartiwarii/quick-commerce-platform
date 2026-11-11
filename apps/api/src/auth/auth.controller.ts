import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpSchema, VerifyOtpSchema, StaffLoginSchema, RefreshTokenSchema } from '@qc/shared-validation';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/otp/send')
  @ApiOperation({ summary: 'Request 6-digit OTP for an Indian (+91) phone number' })
  @ApiResponse({ status: 200, description: 'OTP dispatched via SMS' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async sendOtp(@Body() body: unknown) {
    const validated = SendOtpSchema.parse(body);
    return this.authService.requestOtp(validated.phone, validated.purpose);
  }

  @Post('customer/otp/verify')
  @ApiOperation({ summary: 'Verify OTP and receive JWT access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() body: unknown) {
    const validated = VerifyOtpSchema.parse(body);
    return this.authService.verifyOtp(validated.phone, validated.otp);
  }

  @Post('staff/login')
  @ApiOperation({ summary: 'Staff & Super Admin login with password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async staffLogin(@Body() body: unknown) {
    const validated = StaffLoginSchema.parse(body);
    return this.authService.staffLogin(validated.email, validated.password);
  }

  @Post('token/refresh')
  @ApiOperation({ summary: 'Rotate expired access token using valid refresh token' })
  async refreshToken(@Body() body: unknown) {
    const validated = RefreshTokenSchema.parse(body);
    return this.authService.refreshToken(validated.refreshToken);
  }
}

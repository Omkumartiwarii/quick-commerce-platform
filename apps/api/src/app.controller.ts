import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('System')
@Controller()
export class AppController {
  private cachedHtml: string | null = null;

  private getHtml(): string {
    if (this.cachedHtml) return this.cachedHtml;

    const candidates = [
      path.join(__dirname, '..', 'public', 'index.html'),
      path.join(process.cwd(), 'public', 'index.html'),
      path.join(process.cwd(), 'apps', 'api', 'public', 'index.html'),
      path.join(process.cwd(), 'showcase.html'),
      path.join(__dirname, '..', '..', '..', 'showcase.html'),
    ];

    for (const p of candidates) {
      if (fs.existsSync(p)) {
        try {
          this.cachedHtml = fs.readFileSync(p, 'utf8');
          return this.cachedHtml;
        } catch {
          // Continue to next candidate
        }
      }
    }

    return '<!DOCTYPE html><html><head><title>JaldiWala</title></head><body><h1>⚡ JaldiWala Core API is Online!</h1><p><a href="/docs">View Swagger OpenAPI Docs</a></p></body></html>';
  }

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
  @ApiOperation({ summary: 'Showcase Storefront Landing Page or API Metadata' })
  root(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accept = (req.headers.accept || '').toLowerCase();

    // If client explicitly requested JSON (e.g. cURL -H "Accept: application/json")
    if (accept === 'application/json') {
      res.setHeader('Content-Type', 'application/json');
      return {
        name: 'JaldiWala Quick Commerce Platform',
        tagline: '10-Minute Grocery Delivery in Noida & Delhi NCR',
        status: 'online',
        version: '1.0.0',
        docs: '/docs',
        health: '/health',
        apiPrefix: '/v1',
      };
    }

    // Default: Serve the complete Showcase Landing Page
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return this.getHtml();
  }
}

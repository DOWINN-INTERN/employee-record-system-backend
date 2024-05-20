import { Controller, Get } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';

@Controller('api')
export class CloudflareController {
  constructor(private cloudflareService: CloudflareService) {}

  @Get('image/url')
  async uploadURL() {
    return await this.cloudflareService.uploadURL();
  }
}

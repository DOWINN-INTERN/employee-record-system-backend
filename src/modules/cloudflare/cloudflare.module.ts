import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudflareController } from './cloudflare.controller';
import { CloudflareService } from './cloudflare.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({ timeout: 5000, maxRedirects: 5 }),
    }),
    ConfigModule,
  ],
  providers: [CloudflareService],
  controllers: [CloudflareController],
})
export class CloudflareModule {}

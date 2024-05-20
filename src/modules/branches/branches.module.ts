import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringHelper } from 'src/common/helper/string.helper';
import { ImageUpload } from 'src/common/upload/image.upload';
import { AuthModule } from '../auth/auth.module';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { BranchImage } from './entity/branches-image.entity';
import { Branches } from './entity/branches.entity';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({ timeout: 5000, maxRedirects: 5 }),
    }),
    TypeOrmModule.forFeature([Branches, BranchImage]),
    AuthModule,
  ],
  controllers: [BranchesController],
  providers: [BranchesService, ImageUpload, StringHelper, CloudflareService],
})
export class BranchesModule {}

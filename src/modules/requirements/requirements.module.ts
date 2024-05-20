import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringHelper } from 'src/common/helper/string.helper';
import { AuthModule } from '../auth/auth.module';
import { RequirementType } from './entity/requirement-type.entity';
import { Requirements } from './entity/requirements.entity';
import { RequirementsController } from './requirements.controller';
import { RequirementsService } from './requirements.service';

@Module({
  imports: [TypeOrmModule.forFeature([Requirements, RequirementType]), AuthModule],
  providers: [RequirementsService, StringHelper],
  controllers: [RequirementsController],
})
export class RequirementsModule {}

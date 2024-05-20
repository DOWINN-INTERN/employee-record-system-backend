import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringHelper } from 'src/common/helper/string.helper';
import { AuthModule } from '../auth/auth.module';
import { Branches } from '../branches/entity/branches.entity';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Departments } from './entity/departments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branches, Departments]), AuthModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, StringHelper],
})
export class DepartmentsModule {}

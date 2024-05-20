import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringHelper } from 'src/common/helper/string.helper';
import { AuthModule } from '../auth/auth.module';
import { Departments } from '../departments/entity/departments.entity';
import { Positions } from './entity/positions.entity';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Positions, Departments]), AuthModule],
  providers: [PositionsService, StringHelper],
  controllers: [PositionsController],
})
export class PositionsModule {}

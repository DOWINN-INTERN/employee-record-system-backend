import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleanTokenService } from './common/tasks/clean-token.service';
import { typeormConfig } from './config/database/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserToken } from './modules/auth/entity/user-token.entity';
import { BranchesModule } from './modules/branches/branches.module';
import { CloudflareModule } from './modules/cloudflare/cloudflare.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { RequirementsModule } from './modules/requirements/requirements.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserToken]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => typeormConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    BranchesModule,
    DepartmentsModule,
    PositionsModule,
    RequirementsModule,
    CloudflareModule,
  ],
  providers: [CleanTokenService],
})
export class AppModule {}

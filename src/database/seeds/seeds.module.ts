import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'src/config/database/typeorm.config';
import { UserAccess } from 'src/modules/auth/entity/user-access.entity';
import { UserAuth } from 'src/modules/auth/entity/user-auth.entity';
import { UserInfo } from 'src/modules/auth/entity/user-info.entity';
import { UserStatus } from 'src/modules/auth/entity/user-status.entity';
import { UserToken } from 'src/modules/auth/entity/user-token.entity';
import { RequirementType } from 'src/modules/requirements/entity/requirement-type.entity';
import { Requirements } from 'src/modules/requirements/entity/requirements.entity';
import { SeedsService } from './seeds.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserAccess, UserStatus, UserAuth, UserInfo, UserToken, RequirementType, Requirements]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => typeormConfig(configService),
      inject: [ConfigService],
    }),
  ],
  providers: [SeedsService],
})
export class SeedsModule {}

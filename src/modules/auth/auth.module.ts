import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringHelper } from 'src/common/helper/string.helper';
import { ExternalIpService } from 'src/common/service/external-ip.service';
import { RequestDetailsService } from 'src/common/service/request-details.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAccess } from './entity/user-access.entity';
import { UserAuth } from './entity/user-auth.entity';
import { UserInfo } from './entity/user-info.entity';
import { UserStatus } from './entity/user-status.entity';
import { UserToken } from './entity/user-token.entity';
import { jwtAccessStrategy } from './jwt/jwt-access.strategy';
import { jwtRefreshStrategy } from './jwt/jwt-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccess, UserStatus, UserAuth, UserInfo, UserToken]),
    HttpModule.registerAsync({
      useFactory: () => ({ timeout: 5000, maxRedirects: 5 }),
    }),
    PassportModule.registerAsync({
      useFactory: async () => ({ defaultStrategy: 'access-jwt' }),
    }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, jwtAccessStrategy, jwtRefreshStrategy, ExternalIpService, RequestDetailsService, StringHelper],
  exports: [jwtAccessStrategy, jwtRefreshStrategy, PassportModule],
})
export class AuthModule {}

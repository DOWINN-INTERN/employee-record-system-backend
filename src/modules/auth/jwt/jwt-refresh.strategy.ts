import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { DateTime, Interval } from 'luxon';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UserAuth } from '../entity/user-auth.entity';
import { UserToken } from '../entity/user-token.entity';
import { InJwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class jwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @InjectRepository(UserAuth) private userAuth: Repository<UserAuth>,
    @InjectRepository(UserToken) private userToken: Repository<UserToken>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: InJwtPayload): Promise<{ auth: UserAuth; sub: string }> {
    const { uun, uid, sub } = payload;
    const auth = await this.userAuth.findOne({ where: { id: uid, username: uun } });

    if (!auth) {
      throw new UnauthorizedException();
    }

    const token = await this.userToken.findOne({ relations: { userAuth: true }, where: { sub: sub, userAuth: { id: uid, username: uun } } });
    const refreshToken = request.get('authorization').split(' ')[1];

    if (!(token && (await bcrypt.compare(refreshToken, token.refreshToken)))) {
      throw new UnauthorizedException();
    }

    const exp = Interval.fromDateTimes(DateTime.now(), token.expiresAt);

    if (!(exp.length() > 0)) {
      throw new UnauthorizedException();
    }

    return { auth, sub };
  }
}

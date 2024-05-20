import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UserAuth } from '../entity/user-auth.entity';
import { InJwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class jwtAccessStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor(
    @InjectRepository(UserAuth) private userAuth: Repository<UserAuth>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('ACCESS_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: InJwtPayload): Promise<{ auth: UserAuth; sub: string }> {
    const { uun, uid, sub } = payload;
    const auth = await this.userAuth.findOne({ where: { id: uid, username: uun } });

    if (!auth) {
      throw new UnauthorizedException();
    }

    return { auth, sub };
  }
}

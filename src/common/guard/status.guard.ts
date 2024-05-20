import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs-compat';
import { UserStatus } from '../../modules/auth/entity/user-status.entity';

@Injectable()
export class UserStatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredStatus: any = this.reflector.get<UserStatus>('userStatus', context.getHandler());

    if (!requiredStatus) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user.auth;

    if (!user || !user.userStatus) {
      throw new ForbiddenException();
    }

    if (user.userStatus.name !== requiredStatus) {
      throw new ForbiddenException();
    } else {
      return true;
    }
  }
}

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs-compat';
import { UserAccess } from '../../modules/auth/entity/user-access.entity';

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredAccess: any = this.reflector.get<UserAccess>('userAccess', context.getHandler());

    if (!requiredAccess) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user.auth;

    if (!user || !user.userAccess) {
      throw new ForbiddenException();
    }

    if (user.userAccess.name !== requiredAccess) {
      throw new ForbiddenException();
    } else {
      return true;
    }
  }
}

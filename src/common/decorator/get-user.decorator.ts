import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((_data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const auth = req.user.auth ?? '';

  return auth;
});

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetSub = createParamDecorator((_data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const sub = req.user.sub ?? '';

  return sub;
});

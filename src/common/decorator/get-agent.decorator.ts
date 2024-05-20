import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as UAParser from 'ua-parser-js';

export const GetAgent = createParamDecorator((_data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const agent = req.headers['user-agent'];
  const parser = new UAParser(agent);

  return parser.getResult();
});

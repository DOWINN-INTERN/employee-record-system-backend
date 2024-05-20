import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const key = '⚪ SERVER-RESPONSE ⚪';
      const details = { path: request.url, time: new Date().toLocaleString() };
      const message = Object.assign({}, details, exception.getResponse());
      const customJson = { [key]: message };

      response.status(exception.getStatus()).json(customJson);
    }
  }
}

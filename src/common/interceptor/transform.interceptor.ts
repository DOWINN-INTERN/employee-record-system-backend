import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const handle = next.handle();

    return handle.pipe(
      map((data) => {
        return this.transformData(data);
      }),
    );
  }

  private transformData(data: any): any {
    return instanceToPlain(data);
  }
}

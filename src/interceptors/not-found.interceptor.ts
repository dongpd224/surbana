import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const checkNotFound = this.reflector.getAllAndOverride<boolean>(
      'checkNotFound',
      [context.getHandler(), context.getClass()],
    );

    if (!checkNotFound) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          throw new NotFoundException('Entity not found');
        }
        return data;
      }),
    );
  }
}

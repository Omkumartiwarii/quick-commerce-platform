import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    durationMs?: number;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const http = context.switchToHttp();
    const res = http.getResponse();

    return next.handle().pipe(
      map((data) => {
        // If data is already an HTML document or raw buffer, don't wrap in JSON
        if (
          typeof data === 'string' &&
          (data.trim().startsWith('<!DOCTYPE html>') ||
            data.trim().startsWith('<html') ||
            res.getHeader('content-type')?.toString().includes('text/html'))
        ) {
          return data;
        }

        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            durationMs: Date.now() - startTime,
          },
        };
      }),
    );
  }
}

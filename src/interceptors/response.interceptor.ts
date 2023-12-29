import { ResponseSuccess } from '../types/response-data.type';
import { SuccessLogsService } from '../logs/services/success-logs.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  constructor(private readonly logsService: SuccessLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler<T>) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data?: T): ResponseSuccess<T> => {
        if (data) {
          this.logsService.info(
            `"${request.method} ${request.url}" ${statusCode}`,
          );
        }

        return {
          type: 'success',
          statusCode,
          data,
        };
      }),
    );
  }
}

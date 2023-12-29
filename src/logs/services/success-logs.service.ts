import { Injectable } from '@nestjs/common';
import { BaseLogsService } from './base-logs.service';
import { createLogger, format } from 'winston';
import { join } from 'path';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { format as formatDate } from 'date-fns';

@Injectable()
export class SuccessLogsService extends BaseLogsService {
  constructor() {
    super();
    const logDir = join(process.cwd(), 'logs', 'success');
    const logFileName = 'success-%DATE%.log';
    const { combine, timestamp, printf } = format;
    this.logger = createLogger({
      transports: [
        new DailyRotateFile({
          filename: logFileName,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          dirname: logDir,
        }),
      ],
      format: combine(
        timestamp(),
        printf((info) => {
          return `[${formatDate(info.timestamp, 'yyyy-MM-dd HH:mm:ss')}] ${
            info.message
          }`;
        }),
      ),
    });
  }

  info(message: string, ...meta: any[]) {
    this.logger.info(message, meta);
  }
}

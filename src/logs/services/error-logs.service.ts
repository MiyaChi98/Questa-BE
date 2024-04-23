import { Injectable } from "@nestjs/common";
import { BaseLogsService } from "./base-logs.service";
import { createLogger, format } from "winston";
import { join } from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import { format as formatDate } from "date-fns";

@Injectable()
export class ErrorLogsService extends BaseLogsService {
  constructor() {
    super();
    const logDir = join(process.cwd(), "logs", "error");
    const logFileName = "error-%DATE%.log";
    const { combine, timestamp, printf, errors } = format;
    this.logger = createLogger({
      transports: [
        new DailyRotateFile({
          filename: logFileName,
          datePattern: "YYYY-MM-DD",
          maxSize: "20m",
          maxFiles: "30d",
          dirname: logDir,
        }),
      ],
      format: combine(
        errors({ stack: true }),
        timestamp(),
        printf((info) => {
          return `[${formatDate(info.timestamp, "yyyy-MM-dd HH:mm:ss")}] ${
            info.message
          }`;
        }),
      ),
    });
  }

  error(message: string, ...meta: any[]) {
    this.logger.error(message, meta);
  }
}

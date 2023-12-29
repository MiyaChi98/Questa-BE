import { ResponseError } from "../types/response-data.type";
import { ErrorLogsService } from "../logs/services/error-logs.service";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logsService: ErrorLogsService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorDetail =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal Server Error";

    const errorPayload: ResponseError = {
      type: "error",
      statusCode,
      detail: errorDetail,
      method: request.method,
      path: request.url,
    };

    let errorMessage: string;

    if (!(exception instanceof HttpException)) {
      errorMessage = new Error(exception.toString()).stack;
    } else if (typeof errorDetail === "string") {
      errorMessage = errorDetail;
    } else if (
      "message" in errorDetail &&
      typeof errorDetail.message === "string"
    ) {
      errorMessage = errorDetail?.message;
    }

    const errorToLog = `"${request.method} ${request.url}" ${statusCode} ${errorMessage}`;
    this.logsService.error(errorToLog);

    response.status(statusCode).json(errorPayload);
  }
}

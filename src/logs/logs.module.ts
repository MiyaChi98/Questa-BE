import { Global, Module } from "@nestjs/common";
import { BaseLogsService } from "./services/base-logs.service";
import { SuccessLogsService } from "./services/success-logs.service";
import { ErrorLogsService } from "./services/error-logs.service";

@Module({
  providers: [BaseLogsService, SuccessLogsService, ErrorLogsService],
  exports: [SuccessLogsService, ErrorLogsService],
})
@Global()
export class LogsModule {}

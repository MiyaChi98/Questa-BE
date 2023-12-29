import { Injectable } from "@nestjs/common";
import { Logger } from "winston";

@Injectable()
export class BaseLogsService {
  protected logger: Logger;
}

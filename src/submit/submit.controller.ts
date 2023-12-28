import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
} from "@nestjs/common";
import { SubmitService } from "./submit.service";
import { SubmitDto } from "../dto/submit.dto";
// import { UpdateSubmitDto } from './dto/submit.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "src/constant/roleEnum";
import { HasRoles } from "src/decorators/has_role.decorator";
import { RolesGuard } from "src/guard/role.guard";
import { ATGuard } from "src/guard/accessToken.guards";
import { SubmitXXX } from "./constant/SubmitXXX";
import { Request } from "express";
import { IdValidationPipe } from "src/pipes/IDvalidation.pipe";
@ApiTags("Submit")
@HasRoles(Role.STUDENT, Role.ADMIN, Role.TEACHER)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("submit")
export class SubmitController {
  constructor(private readonly submitService: SubmitService) {}

  @Post()
  @ApiCreatedResponse(SubmitXXX.successSubmit)
  @UsePipes(new ValidationPipe())
  create(@Body() createSubmitDto: SubmitDto, @Req() req: Request) {
    return this.submitService.create(createSubmitDto, req["user"].sub);
  }
  @Get(":id")
  getSubmit(
    @Param("id", new IdValidationPipe()) id: string,
    @Req() req: Request,
  ) {
    return this.submitService.getOne(id, req["user"]?.sub, req["user"]?.zone);
  }
}

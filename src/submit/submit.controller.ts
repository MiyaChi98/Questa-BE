import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
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
@ApiTags("Submit")
@HasRoles(Role.STUDENT, Role.ADMIN)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("submit")
export class SubmitController {
  constructor(private readonly submitService: SubmitService) {}

  @Post()
  @ApiCreatedResponse(SubmitXXX.successSubmit)
  create(@Body() createSubmitDto: SubmitDto, @Req() req: Request) {
    return this.submitService.create(createSubmitDto, req["user"].sub);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { SubmitService } from "./submit.service";
import { SubmitDto } from "../dto/submit.dto";
// import { UpdateSubmitDto } from './dto/submit.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "src/constant/roleEnum";
import { HasRoles } from "src/decorators/has_role.decorator";
import { RolesGuard } from "src/guard/role.guard";
import { ATGuard } from "src/guard/accessToken.guards";
@ApiTags("Submit")
// @HasRoles(Role.TEACHER)
// @UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("submit")
export class SubmitController {
  constructor(private readonly submitService: SubmitService) {}

  @Post()
  create(@Body() createSubmitDto: SubmitDto) {
    return this.submitService.create(createSubmitDto);
  }

  @Get()
  findAllSubmitbyExam() {
    return this.submitService.findAll();
  }

  @Get(":id")
  findOnebyStudentId(@Param("id") id: string) {
    return this.submitService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.submitService.remove(+id);
  }
}

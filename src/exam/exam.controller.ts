import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
  Delete,
} from "@nestjs/common";
import { ExamService } from "./exam.service";
import { CreateExamDTO } from "src/dto/createExam.dto";
import { UpdateExamDTO } from "src/dto/updateExam.dto";
import { Request } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "src/constant/roleEnum";
import { HasRoles } from "src/decorators/has_role.decorator";
import { RolesGuard } from "src/guard/role.guard";
import { ATGuard } from "src/guard/accessToken.guards";
@ApiTags("Exam")
@HasRoles(Role.TEACHER, Role.ADMIN)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("exam")
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  create(@Body() createExamDto: CreateExamDTO) {
    return this.examService.create(createExamDto);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.examService.findOne(id);
  }
  @Get("/all/:id")
  findAllinCourse(@Param("id") id: number) {
    return this.examService.findAllExamInCourse(+id);
  }
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateExamDTO
  ) {
    return await this.examService.update(+id, updateCourseDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.examService.delete(+id);
  }
}

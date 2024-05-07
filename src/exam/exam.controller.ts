import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  ValidationPipe,
  UsePipes,
  Req,
  Query,
} from "@nestjs/common";
import { ExamService } from "./exam.service";
import { CreateExamDTO } from "src/dto/createExam.dto";
import { UpdateExamDTO } from "src/dto/updateExam.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "src/constant/roleEnum";
import { HasRoles } from "src/decorators/has_role.decorator";
import { RolesGuard } from "src/guard/role.guard";
import { ATGuard } from "src/guard/accessToken.guards";
import { ExamXXX } from "./constant/ExamXXX";
import { IdValidationPipe } from "src/pipes/IDvalidation.pipe";
import { Request } from "express";
import { PaginationDto } from "src/dto/pagination.dto";
@ApiTags("Exam")
@HasRoles(Role.TEACHER, Role.ADMIN)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("exam")
export class ExamController {
  constructor(private readonly examService: ExamService) {}
  @Post()
  @ApiOperation({
    summary: "Use to create exam",
  })
  @ApiCreatedResponse(ExamXXX.successCreatedExam)
  @UsePipes(new ValidationPipe())
  create(@Body() createExamDto: CreateExamDTO, @Req() req: Request) {
    return this.examService.create(createExamDto, req["user"].sub);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Use to find one exam",
  })
  @ApiOkResponse(ExamXXX.successFindbyId)
  findOne(@Param("id", new IdValidationPipe()) id: string) {
    return this.examService.findOne(id);
  }

  @Get("/teacher/all")
  @ApiOperation({
    summary: "Use to find all exam by Teacher",
  })
  findAllbyTeacherID(@Req() req: Request, @Query() pagination: PaginationDto) {
    const page = parseInt(pagination.page as any) || 1;
    const limit = parseInt(pagination.limit as any) || 5;
    return this.examService.findAllExambyTeacherID(
      req["user"].sub,
      page,
      limit,
    );
  }

  @Get("/course/:id")
  @ApiOperation({
    summary: "Use to find all exam",
  })
  @ApiOkResponse(ExamXXX.successFindAllExamInCourse)
  findAllinCourse(@Param("id", new IdValidationPipe()) id: string) {
    return this.examService.findAllExamInCourse(id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Use to update exam",
  })
  @ApiOkResponse(ExamXXX.successUpdate)
  @UsePipes(new ValidationPipe())
  async update(
    @Param("id", new IdValidationPipe()) id: string,
    @Body() updateCourseDto: UpdateExamDTO,
  ) {
    return await this.examService.update(id, updateCourseDto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Use to delete exam",
  })
  @ApiOkResponse(ExamXXX.successDelete)
  async remove(@Param("id", new IdValidationPipe()) id: string) {
    return await this.examService.delete(id);
  }
}

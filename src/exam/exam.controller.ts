import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { ExamService } from "./exam.service";
import { CreateExamDTO } from "src/dto/createExam.dto";
import { UpdateExamDTO } from "src/dto/updateExam.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "src/constant/roleEnum";
import { HasRoles } from "src/decorators/has_role.decorator";
import { RolesGuard } from "src/guard/role.guard";
import { ATGuard } from "src/guard/accessToken.guards";
import { ExamXXX } from "./constant/ExamXXX";
@ApiTags("Exam")
@HasRoles(Role.TEACHER, Role.ADMIN)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("exam")
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @ApiCreatedResponse(ExamXXX.successCreatedExam)
  create(@Body() createExamDto: CreateExamDTO) {
    return this.examService.create(createExamDto);
  }

  @Get(":id")
  @ApiOkResponse(ExamXXX.successFindbyId)
  findOne(@Param("id") id: string) {
    return this.examService.findOne(id);
  }
  @Get("/all/:id")
  @ApiOkResponse(ExamXXX.successFindAllExamInCourse)
  findAllinCourse(@Param("id") id: number) {
    return this.examService.findAllExamInCourse(+id);
  }
  @Patch(":id")
  @ApiOkResponse(ExamXXX.successUpdate)
  async update(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateExamDTO,
  ) {
    return await this.examService.update(+id, updateCourseDto);
  }

  @Delete(":id")
  @ApiOkResponse(ExamXXX.successDelete)
  async remove(@Param("id") id: string) {
    return await this.examService.delete(+id);
  }
}

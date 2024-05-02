import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
  Req,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "../dto/createCourse.dto";
import { UpdateCourseDto } from "../dto/updateCourse.dto";
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
import { CourseXXX } from "./constant/CourseXXX";
import { IdValidationPipe } from "src/pipes/IDvalidation.pipe";
import { PaginationDto } from "src/dto/pagination.dto";
import { Request } from "express";
import { addStudentDTO } from "src/dto/addStudent.dto";

@ApiTags("Course")
@HasRoles(Role.TEACHER)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiCreatedResponse(CourseXXX.successCreatedCourse)
  @ApiOperation({
    summary: "Use to create course",
  })
  @UsePipes(new ValidationPipe())
  async create(@Req() req: Request, @Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto, req["user"].sub);
  }

  @Post("addStudent")
  @ApiOperation({
    summary: "Use to add student to course",
  })
  async addStudent(@Body() addStudent: addStudentDTO) {
    return await this.courseService.addStudent(addStudent);
  }

  @Get()
  @ApiOperation({
    summary: "Use to find all course",
  })
  @ApiOkResponse(CourseXXX.successFindAllCourse)
  async findAll(@Query() pagination: PaginationDto) {
    const page = parseInt(pagination.page as any) || 1;
    const limit = parseInt(pagination.limit as any) || 5;
    return await this.courseService.findAll(page, limit);
  }

  @HasRoles(Role.TEACHER, Role.ADMIN)
  @Get("allcourse")
  @ApiOperation({
    summary: "Use to find all course that belong to a teacher",
  })
  async findAllCoursewithTeacherID(@Req() req: Request) {
    return await this.courseService.findCourses(req["user"].sub);
  }

  @HasRoles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  @Get(":id")
  @ApiOperation({
    summary: "Use to find one course with teacher info",
  })
  @ApiOkResponse(CourseXXX.successFindbyId)
  async findOne(
    @Param("id", new IdValidationPipe()) id: string,
    @Req() req: Request,
  ) {
    return await this.courseService.findOne(id, req["user"].sub);
  }

  @HasRoles(Role.TEACHER, Role.ADMIN)
  @Get(":id/allStudent")
  @ApiOperation({
    summary: "Use to find all student info that in the course",
  })
  async findAllStudent(
    @Param("id", new IdValidationPipe()) id: string,
    // @Req() req: Request,
  ) {
    return await this.courseService.findAllStudent(id);
  }

  @HasRoles(Role.TEACHER, Role.ADMIN)
  @Patch(":id")
  @ApiOperation({
    summary: "Use to update course",
  })
  @ApiOkResponse(CourseXXX.successUpdate)
  @UsePipes(new ValidationPipe())
  async update(
    @Param("id", new IdValidationPipe()) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: Request,
  ) {
    return await this.courseService.update(
      id,
      updateCourseDto,
      req["user"].sub,
    );
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Use to delete course",
  })
  @ApiOkResponse(CourseXXX.successDelete)
  async remove(@Param("id", new IdValidationPipe()) id: string) {
    return await this.courseService.delete(id);
  }
}

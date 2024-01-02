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
@ApiTags("Course")
@HasRoles(Role.TEACHER, Role.ADMIN)
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
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }
  // @Post(":id")
  // async addStudent(@Param("id", new IdValidationPipe()) id: string) {
  //   return await this.courseService.addStudent()
  // }
  @Get()
  @ApiOperation({
    summary: "Use to find all course",
  })
  @ApiOkResponse(CourseXXX.successFindAllCourse)
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Use to find one course with teacher info",
  })
  @ApiOkResponse(CourseXXX.successFindbyId)
  async findOne(@Param("id", new IdValidationPipe()) id: string) {
    return await this.courseService.findOne(id);
  }

  @Get("allstudent/:id")
  async findAllStudent(@Param("id", new IdValidationPipe()) id: string) {
    return await this.courseService.findAllStudent(id);
  }
  @Patch(":id")
  @ApiOperation({
    summary: "Use to update course",
  })
  @ApiOkResponse(CourseXXX.successUpdate)
  @UsePipes(new ValidationPipe())
  async update(
    @Param("id", new IdValidationPipe()) id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    return await this.courseService.update(id, updateCourseDto);
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

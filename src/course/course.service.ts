import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCourseDto } from "../dto/createCourse.dto";
import { UpdateCourseDto } from "../dto/updateCourse.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Course } from "src/schema/course.schema";
import { UserService } from "src/user/user.service";

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private CourseModel: Model<Course>,
    private readonly userService: UserService,
  ) {}
  // Create course
  async create(createCourseDto: CreateCourseDto) {
    const courseTeacher = await this.userService.findOnebyID(
      createCourseDto.teacherId,
    );
    if (!courseTeacher)
      throw new BadRequestException("There is no teacher like that!");
    const createdUser = await this.CourseModel.create(createCourseDto);
    return createdUser;
  }
  async findOnebyID(courseId: string) {
    return this.CourseModel.findOne({ _id: courseId });
  }

  // Find All Course with Teacher info
  async findAll() {
    const allCourse = await this.CourseModel.find();
    const result = [];
    for (const course of allCourse) {
      const courseTeacher = await this.userService.findOnebyID(
        course.teacherId,
      );
      result.push({
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        teacher: courseTeacher,
      });
    }
    return result;
  }
  // Find one Course with Teacher info
  async findOne(id: string) {
    const course = await this.CourseModel.findOne({ _id: id });
    const courseTeacher = await this.userService.findOnebyID(course.teacherId);
    if (!courseTeacher)
      throw new BadRequestException("There is no teacher like that!");
    const result = {
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      teacher: courseTeacher,
    };
    return result;
  }
  // Find Course with name
  findName(name: string) {
    return this.CourseModel.findOne({ courseName: name });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const updateCourse = await this.CourseModel.findOne({ _id: id });
    if (!updateCourse)
      throw new BadRequestException("There is no course like that!");
    await updateCourse.updateOne({
      ...updateCourseDto,
    });
    return await this.findOne(id);
  }
  async delete(id: string) {
    await this.CourseModel.deleteOne({ _id: id }).then().catch();
  }
}

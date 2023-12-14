import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCourseDto } from "../dto/createCourse.dto";
import { UpdateCourseDto } from "../dto/updateCourse.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Course, CourseDocument } from "src/schema/course.schema";
import { User, UserDocument } from "src/schema/user.schema";
import { UserService } from "src/user/user.service";

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private CourseModel: Model<Course>,
    private readonly userService: UserService
  ) {}
  // Create course 
  async create(createCourseDto: CreateCourseDto): Promise<CourseDocument> {
    const courseTeacher = await this.userService.findOnebyID(createCourseDto.teacherId)
    if(!courseTeacher) throw new BadRequestException('There is no teacher like that!')
    const createdUser = new this.CourseModel(createCourseDto).save();
    return createdUser;
  }
  // Find All Course with Teacher info
  async findAll() {
    const allCourse = await this.CourseModel.find();
    let result = [];
    for (const course of allCourse) {
      const courseTeacher = await this.userService.findOnebyID(
        course.teacherId
      );
      result.push({
        courseId: course.courseId,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        teacher: {
          teacherID: courseTeacher.userId,
          teacherName: courseTeacher.name,
          teacherEmail: courseTeacher.email,
          teacherPhone: courseTeacher.phone,
        },
      });
    }
    return result;
  }
    // Find one Course with Teacher info
  async findOne(id: number){
    const course = await this.CourseModel.findOne({ courseId: id });
    const courseTeacher = await this.userService.findOnebyID(
      course.teacherId
    );
    if(!courseTeacher) throw new BadRequestException('There is no teacher like that!')
    const result = {
      courseId: course.courseId,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      teacher: {
        teacherID: courseTeacher.userId,
        teacherName: courseTeacher.name,
        teacherEmail: courseTeacher.email,
        teacherPhone: courseTeacher.phone,
      },
    };
    return result
  }
  // Find Course with name
  findName(name: string): Promise<CourseDocument> {
    return this.CourseModel.findOne({ courseName: name });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const updateCourse = await this.CourseModel.findOne({ courseId: id })
    if(!updateCourse) throw new BadRequestException('There is no course like that!')
    await updateCourse.updateOne({
      ...updateCourseDto,
    });
    return updateCourse
  }
  async delete(id: number) {
    return this.CourseModel.deleteOne({ courseId: id });
  }
}

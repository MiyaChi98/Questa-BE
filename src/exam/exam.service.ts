import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CourseService } from "src/course/course.service";
import { CreateExamDTO } from "src/dto/createExam.dto";
import { Exam } from "src/schema/exam.schema";
import { UserService } from "src/user/user.service";

@Injectable()
export class ExamService {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    @InjectModel(Exam.name) private ExamModel: Model<Exam>,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async examIdentify(userID: number, courseId: number) {
    const teacher = await this.userService.findOnebyID(userID);
    const course = await this.courseService.findOnebyID(courseId);
    if (!teacher || !course || course.teacherId != teacher.userId)
      throw new BadRequestException("Indentify failed");
    const info = {
      teacher: {
        teacherID: teacher.userId,
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        teacherPhone: teacher.phone,
      },
      course: {
        courseName: course.courseName,
        courseDescription: course.courseDescription,
      },
    };
    return info;
  }
  async create(createExamDto: CreateExamDTO) {
    await this.examIdentify(createExamDto.teacherId, createExamDto.courseId);
    const createdExam = new this.ExamModel(createExamDto).save();
    return createdExam;
  }

  async findAllExamInCourse(userID: number, courseId: number) {
    const info = await this.examIdentify(userID, courseId);
    const allExam = await this.ExamModel.find({ courseId: courseId });
    const result = [];
    for (const exam of allExam) {
      result.push({
        tilte: exam.tilte,
        total_mark: exam.total_mark,
        total_time: exam.total_time,
        createAt: exam.createAt,
        ...info,
      });
    }
    return result;
  }
  // // Find one Course with Teacher info
  // async findOne(id: number) {
  //   const course = await this.ExamModel.findOne({ courseId: id });
  //   const courseTeacher = await this.userService.findOnebyID(course.teacherId);
  //   if (!courseTeacher)
  //     throw new BadRequestException("There is no teacher like that!");
  //   const result = {
  //     courseId: course.courseId,
  //     courseName: course.courseName,
  //     courseDescription: course.courseDescription,
  //     teacher: {
  //       teacherID: courseTeacher.userId,
  //       teacherName: courseTeacher.name,
  //       teacherEmail: courseTeacher.email,
  //       teacherPhone: courseTeacher.phone,
  //     },
  //   };
  //   return result;
  // }
  // // Find Course with name
  // findName(name: string): Promise<CourseDocument> {
  //   return this.ExamModel.findOne({ courseName: name });
  // }

  // async update(id: number, updateCourseDto: UpdateCourseDto) {
  //   const updateCourse = await this.ExamModel.findOne({ courseId: id });
  //   if (!updateCourse)
  //     throw new BadRequestException("There is no course like that!");
  //   await updateCourse.updateOne({
  //     ...updateCourseDto,
  //   });
  //   return updateCourse;
  // }
  // async delete(id: number) {
  //   return this.ExamModel.deleteOne({ courseId: id });
  // }
}

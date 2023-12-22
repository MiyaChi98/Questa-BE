import { BadRequestException, Injectable } from "@nestjs/common";
import { SubmitDto } from "../dto/submit.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Submit } from "src/schema/submit.schema";
import { Quiz } from "src/schema/quiz.schema";
import { Model } from "mongoose";
import { ExamService } from "src/exam/exam.service";
import { QuizService } from "src/quiz/quiz.service";

@Injectable()
export class SubmitService {
  constructor(
    @InjectModel(Submit.name) private SubmitModel: Model<Submit>,
    private readonly examService: ExamService,
    private readonly quizService: QuizService
  ) {}
  // Create course
  async create(submitDto: SubmitDto) {
    const exam = await this.examService.findOne(submitDto.examId);
    if (!exam) throw new BadRequestException("There is no exam like that!");
    const examQuizzes = await this.quizService.findbyExam(exam.examId);
    const examQuizzesId = [];
    for (const quiz of examQuizzes) {
      examQuizzesId.push(quiz.quizId);
    }
    const submitQuizzesId = [];
    for (const submitQuiz of submitDto.submitAnswer.array) {
      submitQuizzesId.push(submitQuiz.quizId);
    }
    const isSubset = submitQuizzesId.every((val) =>
      examQuizzesId.includes(val)
    );
    if (!isSubset)
      throw new BadRequestException(
        `The quiz you submit doesn't contain in this exam`
      );
    const createdSubmit = await this.SubmitModel.create(submitDto);
    return createdSubmit;
  }
  async findOnebyStudentId(studentId: number) {
    return this.SubmitModel.findOne({ studentId: studentId });
  }

  getMark(submitDto: SubmitDto, examQuiz: any[]) {}

  // Find All Course with Teacher info
  async findAll() {
    // const allCourse = await this.CourseModel.find();
    // const result = [];
    // for (const course of allCourse) {
    //   const courseTeacher = await this.userService.findOnebyID(
    //     course.teacherId,
    //   );
    //   result.push({
    //     courseId: course.courseId,
    //     courseName: course.courseName,
    //     courseDescription: course.courseDescription,
    //     teacher: {
    //       teacherID: courseTeacher.userId,
    //       teacherName: courseTeacher.name,
    //       teacherEmail: courseTeacher.email,
    //       teacherPhone: courseTeacher.phone,
    //     },
    //   });
    // }
    // return result;
  }
  // Find one Course with Teacher info
  async findOne(id: number) {
    // const course = await this.CourseModel.findOne({ courseId: id });
    // const courseTeacher = await this.userService.findOnebyID(course.teacherId);
    // if (!courseTeacher)
    //   throw new BadRequestException("There is no teacher like that!");
    // const result = {
    //   courseId: course.courseId,
    //   courseName: course.courseName,
    //   courseDescription: course.courseDescription,
    //   teacher: {
    //     teacherID: courseTeacher.userId,
    //     teacherName: courseTeacher.name,
    //     teacherEmail: courseTeacher.email,
    //     teacherPhone: courseTeacher.phone,
    //   },
    // };
    // return result;
  }
  // Find Course with name
  findName(name: string) {
    // return this.CourseModel.findOne({ courseName: name });
  }

  // async update(id: number, updateCourseDto: SubmitDto) {
  // const updateCourse = await this.CourseModel.findOne({ courseId: id });
  // if (!updateCourse)
  //   throw new BadRequestException("There is no course like that!");
  // await updateCourse.updateOne({
  //   ...updateCourseDto,
  // });
  // return updateCourse;
  // }
  async remove(id: number) {
    // return this.CourseModel.deleteOne({ courseId: id });
  }
}

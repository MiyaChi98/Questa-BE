import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CourseService } from "src/course/course.service";
import { CreateExamDTO } from "src/dto/createExam.dto";
import { Exam } from "src/schema/exam.schema";
import { UserService } from "src/user/user.service";
import { QuizService } from "src/quiz/quiz.service";
import { UpdateExamDTO } from "src/dto/updateExam.dto";

@Injectable()
export class ExamService {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly quizService: QuizService,
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
        ...info,
      });
    }
    return result;
  }
  // Find one Exam with all exam's quizzes
  async findOne(id: number) {
    const exam = await this.ExamModel.findOne({ examId: id });
    const info = await this.examIdentify(exam.teacherId, exam.courseId);
    const allQuiz = await this.quizService.findbyExam(id);
    const result = {
      ...info,
      tilte: exam.tilte,
      time: exam.total_time,
      quiz: allQuiz,
    };
    return result;
  }

  async update(id: number, updateExamDto: UpdateExamDTO) {
    const updateExam = await this.ExamModel.findOne({ examId: id });
    if (!updateExam)
      throw new BadRequestException("There is no exam like that!");
    await updateExam.updateOne({
      ...updateExamDto,
    });
    return updateExam;
  }
  async delete(id: number) {
    return this.ExamModel.deleteOne({ examId: id });
  }
}

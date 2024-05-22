import { BadRequestException, Injectable } from "@nestjs/common";
import { SubmitDto } from "../dto/submit.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Submit } from "src/schema/submit.schema";
import { Model } from "mongoose";
import { QuizService } from "src/quiz/quiz.service";
import { Role } from "src/constant/roleEnum";
import { Exam } from "src/schema/exam.schema";
import { UserService } from "src/user/user.service";
import { Course } from "src/schema/course.schema";
import { StudentList } from "src/schema/studentlist.schema";

@Injectable()
export class SubmitService {
  constructor(
    @InjectModel(Submit.name) private SubmitModel: Model<Submit>,
    @InjectModel(Exam.name) private ExamModel: Model<Exam>,
    @InjectModel(Course.name) private CourseModel: Model<Course>,
    @InjectModel(StudentList.name)
    private Student_List_Model: Model<StudentList>,
    private readonly userService: UserService,
    private readonly quizService: QuizService,
  ) {}
  async submitIdentify(userID: string, examId: string) {
    const user = await this.userService.findOnebyID(userID);
    const exam = await this.ExamModel.findById(examId);
    if (!exam) {
      throw new BadRequestException(
        "The exam you try to submit does not exist",
      );
    }
    const course = await this.CourseModel.findById(exam.courseId);
    let teacher;
    if (!user) {
      throw new BadRequestException(`This user not exist !`);
    }
    if (!course) {
      throw new BadRequestException(`This course not exist !`);
    }
    if (course.teacherId?.toString() != user._id?.toString()) {
      if (user.zone[0] === Role.STUDENT) {
        const student = await this.Student_List_Model.find(
          {
            studentId: user._id,
            courseId: course._id,
          },
          {
            _id: 0,
          },
        );
        if (student.length != 0) {
          teacher = await this.userService.findOnebyID(course.teacherId);
        } else
          throw new BadRequestException(`You're not student of this course`);
      }
      if (user.zone[0] === Role.TEACHER) {
        throw new BadRequestException(`You're not teacher of this course`);
      }
    } else teacher = user;
    const info = {
      teacher: {
        id: teacher._id,
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        teacherPhone: teacher.phone,
      },
      course: {
        id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
      },
      exam,
    };
    return info;
  }
  // Create quiz
  async create(submitDto: SubmitDto, userId: string) {
    const validate = await this.submitIdentify(userId, submitDto.examId);
    const exam = validate.exam;
    const examQuizzes = await this.quizService.findbyExam(submitDto.examId);
    const examQuizzesId = [];
    for (const quiz of examQuizzes) {
      examQuizzesId.push(quiz.quizId);
    }
    const submitQuizzesId = [];
    for (const submitQuiz of submitDto.submitAnswer.array) {
      submitQuizzesId.push(submitQuiz.quizId);
    }
    const isSubset = submitQuizzesId.every((val) =>
      examQuizzesId.includes(val),
    );
    if (!isSubset)
      throw new BadRequestException(
        `The quiz you submit doesn't contain in this exam`,
      );
    let mark = 0;
    const listAnswer = submitDto?.submitAnswer?.array;
    if (listAnswer?.length > 0)
      for (const submitQuiz of listAnswer) {
        const quizzfindOne = await this.quizService.findOne(submitQuiz.quizId);
        const answer = quizzfindOne?.question?.answer;
        if (answer == submitQuiz.answer) {
          mark++;
        }
      }
    const createdSubmit = await this.SubmitModel.create({
      examId: submitDto.examId,
      studentId: userId,
      submitAnswer: submitDto.submitAnswer,
      violations: submitDto.violations,
      mark: (mark / examQuizzes.length) * exam.total_mark,
    });
    return createdSubmit;
  }
  async getOne(id: string, userId: string, userZone: Role) {
    const submit = await this.SubmitModel.findOne({
       examId: id,
       studentId: userId
       });
    if (userZone.includes("student")) {
      if (submit.studentId != userId) {
        throw new BadRequestException(`You can't see this test`);
      }
    }
    const allQuiz = [];
    for (const submitQuiz of submit.submitAnswer.array) {
      const quizDetail = await this.quizService.findOne(submitQuiz.quizId);
      allQuiz.push({
        ...quizDetail,
        studentAnswer: submitQuiz.answer,
      });
    }
    const result = {
      examId: submit.examId,
      studentId: submit.studentId,
      mark: submit.mark,
      violations: submit.violations,
      studentAnswer: allQuiz,
    };
    return result;
  }
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CourseService } from "src/course/course.service";
import { CreateExamDTO } from "src/dto/createExam.dto";
import { Exam } from "src/schema/exam.schema";
import { UserService } from "src/user/user.service";
import { QuizService } from "src/quiz/quiz.service";
import { UpdateExamDTO } from "src/dto/updateExam.dto";
import { Submit } from "src/schema/submit.schema";
import { Quiz } from "src/schema/quiz.schema";
import { Subject } from "rxjs";
@Injectable()
export class ExamService {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly quizService: QuizService,
    @InjectModel(Exam.name) private ExamModel: Model<Exam>,
    @InjectModel(Submit.name) private SubmitModel: Model<Submit>,
    @InjectModel(Quiz.name) private QuizModel: Model<Quiz>,
  ) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async examIdentify(userID: string, courseId: string) {
    const teacher = await this.userService.findOnebyID(userID);
    const course = await this.courseService.findOnebyID(courseId);
    if (
      !teacher ||
      !course ||
      course.teacherId?.toString() != teacher._id?.toString()
    )
      throw new BadRequestException(
        "Indentify failed! You not this course teacher",
      );
    const info = {
      teacher: {
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
  async create(createExamDto: CreateExamDTO, teacherId: string) {
    await this.examIdentify(teacherId, createExamDto.courseId);
    let session = null;
    return this.ExamModel.createCollection()
      .then(() => this.ExamModel.startSession())
      .then((_session) => {
        session = _session;
        return session.withTransaction(async () => {
          return await this.ExamModel.create({
            ...createExamDto,
            teacherId,
          });
        });
      })
      .then(async (exam) => {
        console.log(exam);
        const arrayOfObjectsDto = [];
        createExamDto.quizArray.map((quiz) => {
          arrayOfObjectsDto.push({
            content: {
              ...quiz,
            },
            examId: exam._id,
          });
        });
        return await this.QuizModel.create(arrayOfObjectsDto);
      })
      .then(() => session.endSession());
  }

  async getAllInfo(examId: string) {
    const avgScore = await this.SubmitModel.aggregate([
      {
        $match: {
          examId: examId // Replace specificExamId with the examId you want to filter by
        }
      },
      {
        $group: {
          _id: "$examId", // Group by examId field
          avgValue: { $avg: "$mark" } // Calculate average of mark field
        }

      }
    ])
    const numberofSubmit = await this.SubmitModel.countDocuments({
      examId: examId
    })
    return {
      avgScore: avgScore,
      numberofSubmit: numberofSubmit
    }
  }

  async findAllExamInCourse(courseId: string) {
    // const info = await this.examIdentify(userID, courseId);
    // const allExam = await this.ExamModel.find({ courseId: courseId });
    // if (allExam.length == 0) {
    //   return "Course doesn't has any exam !";
    // }
    const allDate = await this.ExamModel.aggregate([
      {
        $match: {
          'courseId': courseId
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          documents: { $push: "$$ROOT" }
        }
      },
      {
        $sort: { "_id": -1 } // Sort by date ascending
      }
    ])
    const result = [];
    for (const date of allDate) {
      for (let exam of date.documents) {
        const extraInfo = await this.getAllInfo(exam._id.toString())
        // result.push({
        //   exam: exam,
        //   ...extraInfo
        // });
        exam['avgScore'] = extraInfo.avgScore
        exam['numberofSubmit'] = extraInfo.numberofSubmit
      }
    }
    return allDate;
  }

  //findAllExambyTeacherID
  async findAllExambyTeacherID(teacherId: string, page: number, limit: number) {
    const allExam = await this.ExamModel.find({ teacherId: teacherId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const numberOfExam = await this.ExamModel.countDocuments({
      teacherId: teacherId,
    });
    const numberOfPage = Array.from(
      { length: Math.ceil(numberOfExam / limit) },
      (_, i) => i + 1,
    );
    const result = {
      page: page,
      numberOfPage: numberOfPage,
      numberOfExam: numberOfExam,
      allExam: [],
    };
    for (const exam of allExam) {
      console.log(exam);
      const extraInfo = await this.getAllInfo(exam._id.toString())
      // exam['avgScore'] = extraInfo.avgScore
      // exam['numberofSubmit']= extraInfo.numberofSubmit
      const course = await this.courseService.findOnebyID(exam.courseId);
      result.allExam.push({
        _id: exam._id,
        name: exam.title,
        subject: exam.subject,
        submition: extraInfo.numberofSubmit,
        avgScore: extraInfo.avgScore.length ? extraInfo.avgScore[0]['avgValue'].toFixed(2) : 'Không có dữ liệu',
        course: course.courseName,
        last_update: exam.updatedAt.toLocaleString(),
      });
    }
    return result;
  }
  // Find one Exam with all exam's quizzes
  async findOne(id: string) {
    const exam = await this.ExamModel.findOne({ _id: id });
    const info = await this.examIdentify(exam.teacherId, exam.courseId);
    const allQuiz = await this.quizService.findbyExam(id);
    const examInfo = {
      examId: exam,
      ...info,
      // tilte: exam.title,
      // time: exam.total_time,
      quiz: allQuiz,
    };
    return examInfo;
  }

  async update(id: string, updateExamDto: UpdateExamDTO) {
    const updateExam = await this.ExamModel.findOne({ _id: id });
    if (!updateExam)
      throw new BadRequestException("There is no exam like that!");
    await updateExam.updateOne({
      ...updateExamDto,
    });
    return await this.findOne(id);
  }
  async delete(id: string) {
    const exam = await this.ExamModel.findByIdAndDelete(id);
    const allSubmit = await this.SubmitModel.findOneAndDelete({ examId: id });
    return {
      exam,
      allSubmit,
    };
  }
}

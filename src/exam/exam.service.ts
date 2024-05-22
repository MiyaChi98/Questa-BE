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
import { StudentList } from "src/schema/studentlist.schema";
import { ElasticsearchService } from "src/elasticsearch/elasticsearch.service";

@Injectable()
export class ExamService {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly quizService: QuizService,
    @InjectModel(Exam.name) private ExamModel: Model<Exam>,
    @InjectModel(Submit.name) private SubmitModel: Model<Submit>,
    @InjectModel(Quiz.name) private QuizModel: Model<Quiz>,
    @InjectModel(StudentList.name)
    private Student_List_Model: Model<StudentList>,
    private readonly elasticsearchService: ElasticsearchService

  ) { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async examIdentify(userID: string, courseId: string) {
    const teacher = await this.userService.findOnebyID(userID);
    const course = await this.courseService.findOnebyID(courseId);
    if (
      !teacher ||
      !course ||
      course.teacherId?.toString() != teacher._id?.toString()
    ) return false
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
    const examData = await this.examIdentify(teacherId, createExamDto.courseId);
    let session = null;
    return this.ExamModel.createCollection()
      .then(() => this.ExamModel.startSession())
      .then((_session) => {
        session = _session;
        return session.withTransaction(async () => {
          const exam = await this.ExamModel.create({
            ...createExamDto,
            teacherId,
          });
          const arrayOfObjectsDto = createExamDto.quizArray.map((quiz) => ({
            content: { ...quiz },
            examId: exam._id,
          }));

          console.log(createExamDto.quizArray); // Check if quizArray is populated
          console.log(arrayOfObjectsDto); // Check if arrayOfObjectsDto is populated

          await this.QuizModel.create(arrayOfObjectsDto);

          return exam
        });
      })
      .then((exam) => {
        if (exam && examData) {
          const elasticsearchRes = this.elasticsearchService.pushDataToIndex({
            examId: exam._id,
            title: exam.title,
            courseName: examData.course.courseName,
            teacherId: teacherId
          })
          console.log(elasticsearchRes)
        }
        return session.endSession();
      })
      .catch((error) => {
        // Handle any errors that occur during the transaction
        console.error("Transaction failed:", error);
        if (session) {
          session.endSession();
        }
        throw error; // Re-throw the error to propagate it further
      });

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

  async findAllExamInCourse(userID, courseId: string) {
    const info = await this.examIdentify(userID, courseId);
    if (!info) {
      const conection = await this.Student_List_Model.findOne({
        courseId: courseId,
        studentId: userID
      })
      conection ? null : new BadRequestException('Bạn chưa gia nhập khóa học này')
    }
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
        const studentSubmition = await this.SubmitModel.findOne({
          examId: exam._id,
          studentId: userID
        })
        exam['studentSubmit'] = studentSubmition ? studentSubmition.mark : ''
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
    const info = await this.getAllInfo(id)
    const allQuiz = await this.quizService.findebyExamtoExtactChartData(id);
    const allSubmit = await this.SubmitModel.find({ examId: id })
    console.log(allSubmit)
    const allScore = []
    for (const submit of allSubmit) {
      allScore.push(submit.mark)
    }
    const allSubmitData = []
    // const allAnswer = []
    for (const submit of allSubmit) {
      for (const submitQuiz of submit.submitAnswer.array) {
        const quizDetail = await this.quizService.findOne(submitQuiz.quizId);
        if (quizDetail.question.answer===submitQuiz.answer){
          allQuiz[quizDetail.quizId]['countCorrectTimes']++
        }
      }
      const student = await this.userService.findOnebyID(submit.studentId)
      allSubmitData.push({
        _id: student._id,
        name: student.name,
        email: student.email,
        mark: submit.mark,
        violations: submit.violations,
        // studentAnswer: allQuiz,
      })

    }
    const aboveOrbelowFive = this.calculatePercentage(allScore)
    const chartData = this.countNumberAppearances(allScore)
    const scoreTable = {
      numberofSubmit: info.numberofSubmit,
      avgScore: info.avgScore[0].avgValue.toFixed(2),
      ...aboveOrbelowFive
    }
    const examInfo = {
      exam,
      quiz: allQuiz,
      allSubmitData,
      scoreTable,
      chartData,
    };
    return examInfo;
  }

  async findExamQuiz(id:string){
    const exam = await this.ExamModel.findOne({ _id: id });
    const quiz = await this.quizService.findbyExam(id);
    return {
      exam, quiz
    }
  }

  calculatePercentage = (numbers: number[]): { aboveFive: number, belowOrEqualFive: number } => {
    let aboveFiveCount = 0;
    let belowOrEqualFiveCount = 0;

    // Count the numbers above and below or equal to 5
    numbers.forEach(number => {
      if (number > 5) {
        aboveFiveCount++;
      } else {
        belowOrEqualFiveCount++;
      }
    });

    // Calculate the percentages
    const totalNumbers = numbers.length;
    const aboveFivePercentage = (aboveFiveCount / totalNumbers) * 100;
    const belowOrEqualFivePercentage = (belowOrEqualFiveCount / totalNumbers) * 100;

    return {
      aboveFive: aboveFivePercentage,
      belowOrEqualFive: belowOrEqualFivePercentage
    };
  };
  countNumberAppearances = (numbers: number[]): { [key: number]: number } => {
    const countMap: { [key: number]: number } = {};

    // Initialize the count map with all numbers from 1 to 10
    for (let i = 1; i <= 10; i++) {
      countMap[i] = 0;
    }

    // Update the count map based on the numbers in the array
    numbers.forEach(number => {
      let roundedNumber = Math.round(number);
      if (countMap.hasOwnProperty(roundedNumber)) {
        countMap[roundedNumber]++;
      }
    });

    return countMap;
  };

  // createScoreSpectrumChart = (numberCounts: { [key: number]: number }): string => {
  //   let chart = [];

  //   for (let i = 1; i <= 10; i++) {
  //     chart += `${i}: ${'#'.repeat(numberCounts[i])}\n`;
  //   }

  //   return chart;
  // };

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
    if (exam) {
      const elasticsearchDeleteRes = await this.elasticsearchService.deleteDocumentByCourseID(id)
      console.log(elasticsearchDeleteRes)
    }
    const allSubmit = await this.SubmitModel.findOneAndDelete({ examId: id });
    return {
      exam,
      allSubmit,
    };
  }
}

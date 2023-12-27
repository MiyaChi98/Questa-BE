import { BadRequestException, Injectable } from "@nestjs/common";
import { SubmitDto } from "../dto/submit.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Submit } from "src/schema/submit.schema";
import { Model } from "mongoose";
import { ExamService } from "src/exam/exam.service";
import { QuizService } from "src/quiz/quiz.service";

@Injectable()
export class SubmitService {
  constructor(
    @InjectModel(Submit.name) private SubmitModel: Model<Submit>,
    private readonly examService: ExamService,
    private readonly quizService: QuizService,
  ) {}
  // Create course
  async create(submitDto: SubmitDto, userId: string) {
    const exam = await this.examService.findOne(submitDto.examId);
    if (!exam) throw new BadRequestException("There is no exam like that!");
    const examQuizzes = await this.quizService.findbyExam(
      exam.examId.toString(),
    );
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
    const createdSubmit = await this.SubmitModel.create({
      examId: submitDto.examId,
      studentId: userId,
      submitAnswer: submitDto.submitAnswer,
      mark: 10,
    });
    return createdSubmit;
  }
}

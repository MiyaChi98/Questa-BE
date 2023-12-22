import { Injectable } from "@nestjs/common";
import { CreateQuizDtoArray } from "src/dto/createQuiz.dto";
import { UpdateQuizContentDto } from "src/dto/updateQuiz.dto";
import fs = require("fs");
// import mammoth = require("mammoth");
import { InjectModel } from "@nestjs/mongoose";
import { Quiz } from "src/schema/quiz.schema";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private QuizModel: Model<Quiz>,
    private configService: ConfigService
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createQuizDto: CreateQuizDtoArray) {
    return this.QuizModel.create(createQuizDto.arrayOfObjectsDto);
  }
  // createMany(createQuizDto: CreateQuizDto[]) {
  //   return this.QuizModel.insertMany({
  //     createQuizDto,
  //   });
  // }

  async createUsingUploadFile(
    teacherId: number,
    examId: number,
    file: Express.Multer.File
  ) {
    const datas = await this.uploadFile(file);
    for (const i in datas)
      this.QuizModel.create({
        quizId: `${teacherId}${examId}${i}`,
        teacherId: teacherId,
        examId: examId,
        content: datas[i],
      });
  }

  async uploadFile(file: Express.Multer.File) {
    const data = fs.readFileSync(file.path, "utf8");
    try {
      const json = JSON.parse(data);
      return json;
    } catch (error) {
      // const data = mammoth
      //   .extractRawText({ path: file.path })
      //   .then(function (result) {
      //     const text = result.value; // The raw text
      //     const messages = result.messages;
      //     console.log(messages);
      //     return text;
      //   });
      // return data;
    }
  }

  uploadImage(fieldname: string) {
    return `${this.configService.get<string>("LINK")}${fieldname}`;
  }

  async findbyExam(id: number) {
    const allQuiz = await this.QuizModel.find({ examId: id })
      .select("quizId")
      .select("content")
      .sort("quizId");
    const result = [];
    allQuiz.forEach(function (obj) {
      result.push({
        question: obj.content.question,
        A: obj.content.A,
        B: obj.content.B,
        C: obj.content.C,
        D: obj.content.D,
      });
    });
    return result;
  }

  findOne(id: number) {
    return this.QuizModel.findOne({ quizId: id });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateQuizContent(id: number, updateQuizDto: UpdateQuizContentDto) {
    return await this.QuizModel.updateOne({ quizId: id }, [
      { $addFields: { content: updateQuizDto } },
    ]);
  }

  async remove(id: number) {
    return await this.QuizModel.deleteOne({ quizId: id });
  }
}

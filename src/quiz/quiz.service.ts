import { Injectable } from "@nestjs/common";
import { CreateQuizDto } from "src/dto/createQuiz.dto";
import { UpdateQuizContentDto } from "src/dto/updateQuiz.dto";
import fs = require("fs");
// import mammoth = require("mammoth");
import { InjectModel } from "@nestjs/mongoose";
import { Quiz } from "src/schema/quiz.schema";
import { Model } from "mongoose";

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private QuizModel: Model<Quiz>) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createQuizDto: CreateQuizDto[]) {
    return this.QuizModel.create(createQuizDto);
  }
  // createMany(createQuizDto: CreateQuizDto[]) {
  //   return this.QuizModel.insertMany({
  //     createQuizDto,
  //   });
  // }

  async createUsingUploadFile(
    teacherId: number,
    examId: number,
    file: Express.Multer.File,
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

  findbyExam(id: number) {
    return this.QuizModel.find({ examId: id }).select("content");
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

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}

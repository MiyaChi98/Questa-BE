import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { CreateQuizDto } from "src/dto/createQuiz.dto";
import { UpdateQuizDto } from "src/dto/updateQuiz.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import path, { resolve } from "path";
import fs = require("fs");
import mammoth = require("mammoth");
import { diskStorage } from "multer";
import { isJSON } from "class-validator";
import { from } from "rxjs";

@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
      }),
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.quizService.createMany(this.uploadFile(file));
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.quizService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(+id, updateQuizDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.quizService.remove(+id);
  }
}

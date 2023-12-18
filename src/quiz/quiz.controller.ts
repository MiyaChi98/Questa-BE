import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { CreateQuizDto } from "src/dto/createQuiz.dto";
import { UpdateQuizDto } from "src/dto/updateQuiz.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";

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
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.quizService.uploadFile(file);
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

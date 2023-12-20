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
  Res,
  StreamableFile,
} from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { CreateQuizDto } from "src/dto/createQuiz.dto";
import { UpdateQuizContentDto } from "src/dto/updateQuiz.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from "uuid";
import path = require("path");
// import fs = require("fs");
import { join } from "path";
import { Response } from "express";
import { createReadStream } from "fs";

@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  // Create one or many document
  @Post("")
  create(@Body() createQuizDto: CreateQuizDto[]) {
    return this.quizService.create(createQuizDto);
  }

  @Post("upload/many")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
      }),
    }),
  )
  async uploadQuizContent(@UploadedFile() file: Express.Multer.File) {
    return await this.quizService.createUsingUploadFile(1, 1, file);
  }

  @Post("upload/image")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads/image",
        filename: (req, image, cb) => {
          const filename: string =
            path.parse(image.originalname).name.replace(/\s/g, "") + uuidv4();
          const extension: string = path.parse(image.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async uploadQuizImage(@UploadedFile() image: Express.Multer.File) {
    return `http://localhost:8000/image/${image.filename}`;
  }

  @Get("/:id")
  async findOneQuizContent(@Param("id") id: number) {
    const quiz = await this.quizService.findOne(id);
    return quiz.content;
  }

  @Get(":id/image")
  async displayQuizImg(
    @Param("id") id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const quiz = await this.quizService.findOne(id);
    const stream = createReadStream(join(process.cwd(), quiz.content.img));
    res.set({
      "Content-Disposition": `inline; filename="${quiz.content.img}"`,
      "Content-Type": "image/jpeg ",
    });
    // stream.pipe(res);
    return new StreamableFile(stream);
  }

  @Patch(":id")
  updateQuizContent(
    @Param("id") id: number,
    @Body() updateQuizDto: UpdateQuizContentDto,
  ) {
    return this.quizService.updateQuizContent(+id, updateQuizDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.quizService.remove(+id);
  }
}

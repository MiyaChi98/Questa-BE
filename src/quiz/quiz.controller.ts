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
import { UpdateQuizDto } from "src/dto/updateQuiz.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from "uuid";
import path = require("path");
import fs = require("fs");

import { join } from "path";
import { Response } from "express";

@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post("")
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Post("upload/many")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
      }),
    })
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
    })
  )
  async uploadQuizImage(@UploadedFile() image: Express.Multer.File) {
    return image.path;
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(":id")
  async findOne(
    @Param("id") id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const quiz = await this.quizService.findOne(id);
    const stream = fs.createReadStream(join(process.cwd(), quiz.img));
    // res.set({
    //   "Content-Disposition": `inline; filename="${quiz.img}"`,
    //   "Content-Type": "image/jpeg ",
    // });
    return new StreamableFile(stream);
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

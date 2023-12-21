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
  UseGuards,
} from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { Params } from "src/dto/createQuiz.dto";
import { UpdateQuizContentDto } from "src/dto/updateQuiz.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from "uuid";
import path = require("path");
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { UploadFileDto } from "src/dto/uploadImage.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "src/constant/roleEnum";
import { HasRoles } from "src/decorators/has_role.decorator";
import { RolesGuard } from "src/guard/role.guard";
import { ATGuard } from "src/guard/accessToken.guards";
@ApiTags("Quiz")
@HasRoles(Role.TEACHER)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  // Create one or many document
  @Post("")
  create(@Body() createQuizDto: Params) {
    return this.quizService.create(createQuizDto);
  }
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFileDto })
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
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/image",
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, "") + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async uploadQuizImage(@UploadedFile() file: Express.Multer.File) {
    return this.quizService.uploadImage(file.filename);
  }

  @Get("/:id")
  async findOneQuizContent(@Param("id") id: number) {
    const quiz = await this.quizService.findOne(id);
    return quiz.content;
  }

  @Get(":id/image")
  async displayQuizImg(
    @Param("id") id: number,
    // @Res({ passthrough: true }) res: Response
  ) {
    const quiz = await this.quizService.findOne(id);
    // const stream = createReadStream(join(process.cwd(), quiz.content.img));
    // res.set({
    // "Content-Disposition": `inline; filename="${quiz.content.img}"`,
    // "Content-Type": "image/jpeg ",
    // });
    // stream.pipe(res);
    // return new StreamableFile(stream);
    return quiz.content.img;
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

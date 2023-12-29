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
  Req,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { Request } from "express";
import { QuizService } from "./quiz.service";
import { CreateQuizDtoArray } from "src/dto/createQuiz.dto";
import { UpdateQuizContentDto } from "src/dto/updateQuiz.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from "uuid";
import path = require("path");
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { UploadFileDto } from "src/dto/uploadImage.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "src/constant/roleEnum";
import { HasRoles } from "src/decorators/has_role.decorator";
import { RolesGuard } from "src/guard/role.guard";
import { ATGuard } from "src/guard/accessToken.guards";
import { QuizXXX } from "./constant/QuizXXX";
import { IdValidationPipe } from "src/pipes/IDvalidation.pipe";
@ApiTags("Quiz")
@HasRoles(Role.TEACHER, Role.ADMIN)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  // Create one or many document
  @Post("")
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: "create quiz manualy",
  })
  @ApiCreatedResponse(QuizXXX.successCreatedQuiz)
  create(@Body() createQuizDto: CreateQuizDtoArray) {
    return this.quizService.create(createQuizDto);
  }
  @ApiCreatedResponse(QuizXXX.successUploadFile)
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFileDto })
  @Post("upload/many/:id")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
      }),
    }),
  )
  async uploadQuizContent(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Param("id", new IdValidationPipe()) id: string,
  ) {
    return await this.quizService.createUsingUploadFile(
      req["user"]?.sub,
      id,
      file,
    );
  }

  @Post("upload/image")
  @ApiOkResponse(QuizXXX.successUploadImage)
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
  @ApiOkResponse(QuizXXX.successFindOne)
  @Get("/:id")
  async findOneQuizContent(@Param("id", new IdValidationPipe()) id: string) {
    const quiz = await this.quizService.findOne(id);
    return quiz;
  }

  @ApiCreatedResponse(QuizXXX.successUpdateContent)
  @Patch(":id")
  @UsePipes(new ValidationPipe())
  updateQuizContent(
    @Param("id", new IdValidationPipe()) id: string,
    @Body() updateQuizDto: UpdateQuizContentDto,
  ) {
    return this.quizService.updateQuizContent(id, updateQuizDto);
  }
  @ApiOkResponse(QuizXXX.successDelete)
  @Delete(":id")
  remove(@Param("id", new IdValidationPipe()) id: string) {
    return this.quizService.remove(id);
  }
}

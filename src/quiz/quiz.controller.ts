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
  HttpException,
  HttpStatus,
  Res,
  BadRequestException,
} from "@nestjs/common";
import { Request, Response } from "express";
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
import { extname } from "path";

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
  create(@Body() createQuizDto: CreateQuizDtoArray, @Req() req: Request) {
    return this.quizService.create(createQuizDto, req["user"].sub);
  }


  //upload excel sheet of an Exam
  @ApiCreatedResponse(QuizXXX.successUploadFile)
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFileDto })
  @Post("upload/many/:id")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (_req: any, file: any, callback: any) => {
        if (
          file.mimetype.match(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          )
        ) {
          callback(null, true);
        } else {
          callback(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
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


  //export excel sheet of an Exam
  @HasRoles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  @Get("exam/:id")
  @ApiOperation({
    summary: "Use to export excel data",
  })
  async exportExcel(
    @Param("id", new IdValidationPipe()) id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const data = await this.quizService.exportFile(id, req["user"].sub);

    res.attachment();
    res.contentType(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${data.SheetNames}`,
    );
    res.send(data);
  }

  //upload file img or audio for a quiz
  @Post("upload/file")
  @ApiOkResponse(QuizXXX.successUploadImage)
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(
    FileInterceptor("file"
     ),
  )
  async uploadQuizFile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File
    ) {
    return this.quizService.uploadImg_Audio(file);
  }

  @ApiOkResponse(QuizXXX.successFindOne)
  @Get("/file/:id")
  async getFileUrl(@Param("id") id: string) {
    const file = await this.quizService.getImg_Audio(id);
    return file;
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

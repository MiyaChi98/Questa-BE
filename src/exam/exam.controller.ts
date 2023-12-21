import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ExamService } from "./exam.service";
import { CreateExamDTO } from "src/dto/createExam.dto";
import { ATGuard } from "src/guard/accessToken.guards";
import { Request } from "express";

@Controller("exam")
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  create(@Body() createExamDto: CreateExamDTO) {
    return this.examService.create(createExamDto);
  }

  @Get("/:id")
  findOne(@Param("id") id: number) {
    return this.examService.findOne(id);
  }
  @UseGuards(ATGuard)
  @Get("/all")
  findAllinCourse(@Req() req: Request, @Param("id") id: number) {
    return this.examService.findAllExamInCourse(req["user"]?.sub, id);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.examService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateExamDto: UpdateExamDTO) {
  //   return this.examService.update(+id, updateExamDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.examService.remove(+id);
  // }
}

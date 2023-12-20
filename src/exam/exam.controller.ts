import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { CreateExamDTO } from "src/dto/createExam.dto";

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

  @Get("/all")
  findAll() {
    return this.examService.findAllExamInCourse(5, 1);
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

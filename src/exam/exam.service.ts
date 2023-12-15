import { Injectable } from "@nestjs/common";
// import { CreateExamDTO } from "src/dto/createExam.dto";
// import { UpdateExamDTO } from "src/dto/updateExam.dto";

@Injectable()
export class ExamService {
  // create(createExamDto: CreateExamDTO) {
  //   return "This action adds a new exam";
  // }

  findAll() {
    return `This action returns all exam`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exam`;
  }

  // update(id: number, updateExamDto: UpdateExamDTO) {
  //   return `This action updates a #${id} exam`;
  // }

  remove(id: number) {
    return `This action removes a #${id} exam`;
  }
}

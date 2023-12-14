import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from 'src/dto/createQuiz.dto';
import { UpdateQuizDto } from 'src/dto/updateQuiz.dto';

@Injectable()
export class QuizService {
  create(createQuizDto: CreateQuizDto) {
    return 'This action adds a new quiz';
  }

  findAll() {
    return `This action returns all quiz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quiz`;
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}

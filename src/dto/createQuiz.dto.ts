import { ApiProperty } from "@nestjs/swagger";

export class CreateQuizDto {
  @ApiProperty()
  quizId: number;
  @ApiProperty()
  content: {
    img: string;
    question: string;
    A: string;
    B: string;
    C: string;
    D: string;
    answer: string;
  };
  @ApiProperty()
  createDate: number;
  @ApiProperty()
  teacherId: number;
  @ApiProperty()
  examId: number;
}

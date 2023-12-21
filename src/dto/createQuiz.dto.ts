import { ApiProperty } from "@nestjs/swagger";

export class Content {
  @ApiProperty()
  img: string;
  @ApiProperty()
  question: string;
  @ApiProperty()
  A: string;
  @ApiProperty()
  B: string;
  @ApiProperty()
  C: string;
  @ApiProperty()
  D: string;
  @ApiProperty()
  answer: string;
}

export class CreateQuizDto {
  @ApiProperty()
  quizId: number;
  @ApiProperty()
  content: Content;
  @ApiProperty()
  teacherId: number;
  @ApiProperty()
  examId: number;
}

export class Params {
  @ApiProperty({
    isArray: true,
    type: CreateQuizDto,
  })
  arrayOfObjectsDto: CreateQuizDto[];
}

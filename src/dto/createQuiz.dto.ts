import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class Content {
  @ApiProperty()
  @IsString()
  img: string;
  @ApiProperty()
  @IsString()
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
  @IsNumber()
  quizId: number;
  @ApiProperty()
  content: Content;
  @ApiProperty()
  @IsNumber()
  teacherId: number;
  @ApiProperty()
  @IsNumber()
  examId: number;
}

export class CreateQuizDtoArray {
  @ApiProperty({
    isArray: true,
    type: CreateQuizDto,
  })
  arrayOfObjectsDto: CreateQuizDto[];
}

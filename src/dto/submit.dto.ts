import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";
export class Answer {
  @ApiProperty()
  @IsNumber()
  quizId: number;
  @ApiProperty()
  @IsString()
  answer: string;
  @ApiProperty()
  @IsBoolean()
  match: boolean;
}
export class AnswerArray {
  @ApiProperty({
    isArray: true,
    type: Answer,
  })
  array: Answer[];
}

export class SubmitDto {
  @ApiProperty()
  @IsNumber()
  examId: number;
  @ApiProperty()
  @IsNumber()
  studentId: number;
  @ApiProperty()
  submitAnswer: AnswerArray;
}

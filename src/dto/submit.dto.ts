import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsBoolean, IsNumber, IsString } from "class-validator";
export class Answer {
  @ApiProperty()
  @IsString()
  quizId: string;
  @ApiProperty()
  @IsString()
  answer: string;
  @ApiProperty()
  @IsBoolean()
  match: boolean;
}
export class AnswerArray {
  @ApiProperty({
    type: Answer,
  })
  @IsArray()
@ArrayNotEmpty()
  array: Answer[];
}

export class SubmitDto {
  @ApiProperty()
  @IsString()
  examId: string;
  @ApiProperty()
  submitAnswer: AnswerArray;
}

import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { MultiChoise } from "src/constant/multichoise";
export class Answer {
  @ApiProperty({ example: "20020368@vnu.edu.vn" })
  @IsNotEmpty()
  @IsString()
  quizId: string;
  @ApiProperty({ example: "20020368@vnu.edu.vn" })
  @IsNotEmpty()
  @IsString()
  answer: MultiChoise;
  @ApiProperty({ example: "20020368@vnu.edu.vn" })
  @IsNotEmpty()
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
  @ApiProperty({ example: "20020368@vnu.edu.vn" })
  @IsString()
  @IsNotEmpty()
  examId: string;
  @ApiProperty()
  @IsNotEmpty()
  submitAnswer: AnswerArray;
}

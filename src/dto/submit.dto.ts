import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";
import { MultiChoise } from "src/constant/multichoise";
export class Answer {
  @ApiProperty({ example: "658d358a302279bd49c73b33" })
  @IsNotEmpty()
  @IsString()
  quizId: string;
  @ApiProperty({ example: "D" })
  @IsNotEmpty()
  @IsString()
  answer: MultiChoise;
}
export class AnswerArray {
  @ApiProperty({
    isArray: true,
    type: Answer,
  })
  @IsArray()
  @ArrayNotEmpty()
  array: Answer[];
}

export class SubmitDto {
  @ApiProperty({ example: "658d2f54a8bd29da18f2d62e" })
  @IsString()
  @IsNotEmpty()
  examId: string;
  @ApiProperty()
  @IsNotEmpty()
  submitAnswer: AnswerArray;
}

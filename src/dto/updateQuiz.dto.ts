import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateQuizContentDto {
  @ApiProperty()
  question: string;
  @ApiProperty()
  img: string;
  @ApiProperty()
  A: string;
  @ApiProperty()
  B: string;
  @ApiProperty()
  C: string;
  @ApiProperty()
  D: string;
  @ApiProperty()
  @IsNotEmpty()
  answer: string;
}

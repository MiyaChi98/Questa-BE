import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateQuizContentDto {
  @ApiProperty()
  @IsNotEmpty()
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

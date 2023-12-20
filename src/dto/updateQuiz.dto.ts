import { ApiProperty } from "@nestjs/swagger";

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
  answer: string;
}

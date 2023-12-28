import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class Content {
  @ApiProperty()
  @IsString()
  img: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  content: Content;
  @ApiProperty()
  @IsString()
  teacherId: string;
  @ApiProperty()
  @IsString()
  examId: string;
}

export class CreateQuizDtoArray {
  @ApiProperty({
    isArray: true,
    type: CreateQuizDto,
  })
  arrayOfObjectsDto: CreateQuizDto[];
}

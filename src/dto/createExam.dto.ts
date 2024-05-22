import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Content} from "./createQuiz.dto";
import { Type } from "class-transformer";

export class CreateExamDTO {
  @ApiProperty({ example: "New exam tilte" })
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  start?: Date;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  end?: Date;
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  total_mark: number;
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  total_time?: number;
  @ApiProperty()
  @IsString()
  description?: string;
  @ApiProperty({ example: "658a57d4e51fda21d6f34e15" })
  @IsString()
  @IsNotEmpty()
  courseId: string;
  @ApiProperty({
    isArray: true,
    type: Content,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Content)
  quizArray: Content[];
}

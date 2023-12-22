import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateExamDTO {
  @ApiProperty()
  @IsNumber()
  examId: number;
  @ApiProperty()
  @IsString()
  tilte: string;
  @ApiProperty()
  @IsNumber()
  total_mark: number;
  @ApiProperty()
  @IsNumber()
  total_time: number;
  @ApiProperty()
  @IsNumber()
  courseId: number;
  @ApiProperty()
  @IsNumber()
  teacherId: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateExamDTO {
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
  @IsString()
  courseId: string;
  @ApiProperty()
  @IsString()
  teacherId: string;
}

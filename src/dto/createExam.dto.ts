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
  @IsNumber()
  courseId: string;
  @ApiProperty()
  @IsNumber()
  teacherId: string;
}

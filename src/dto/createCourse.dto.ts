import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
  @ApiProperty()
  @IsNumber()
  courseId: number;
  @ApiProperty()
  @IsString()
  courseName: string;
  @ApiProperty()
  @IsString()
  courseDescription: string;
  @ApiProperty()
  @IsNumber()
  teacherId: number;
}

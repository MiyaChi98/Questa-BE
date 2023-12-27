import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  courseName: string;
  @ApiProperty()
  @IsString()
  courseDescription: string;
  @ApiProperty()
  @IsNumber()
  teacherId: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto {
  @ApiProperty({ example: "New Course" })
  @IsNotEmpty()
  @IsString()
  courseName: string;
  @ApiProperty({ example: "new course description" })
  @IsNotEmpty()
  @IsString()
  courseDescription: string;
  @ApiProperty({ example: "6555d99203662be4325a2838" })
  @IsNotEmpty()
  @IsString()
  teacherId: string;
}

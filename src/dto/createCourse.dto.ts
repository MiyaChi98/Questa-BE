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
  @ApiProperty({ example: "658dd96a47919b0fdcf030b0" })
  @IsNotEmpty()
  @IsString()
  teacherId: string;
}

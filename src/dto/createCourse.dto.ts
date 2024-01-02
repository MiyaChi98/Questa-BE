import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

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
  @ApiProperty({
    isArray: true,
    example: ["6572828145fa7b62317f4dfb"],
  })
  @IsArray()
  studentId: string;
}

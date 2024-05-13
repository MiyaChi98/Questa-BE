import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class addStudentDTO {
  @ApiProperty({ example: "courseID" })
  @IsNotEmpty()
  @IsString()
  courseCode: string;
  @ApiProperty({ example: "studentID" })
  @IsNotEmpty()
  @IsString()
  studentID: string;
}

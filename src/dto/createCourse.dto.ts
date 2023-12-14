import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
  @ApiProperty()
  courseId: number;
  @ApiProperty() 
  courseName: string;
  @ApiProperty() 
  courseDescription: string;
  @ApiProperty() 
  teacherId: number;
}

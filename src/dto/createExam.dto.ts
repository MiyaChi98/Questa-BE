import { ApiProperty } from "@nestjs/swagger";

export class CreateExamDTO {
  @ApiProperty()
  examId: number;
  @ApiProperty()
  tilte: string;
  @ApiProperty()
  total_mark: number;
  @ApiProperty()
  total_time: number;
  @ApiProperty()
  courseId: number;
  @ApiProperty()
  teacherId: number;
}

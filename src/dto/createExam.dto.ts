import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateExamDTO {
  @ApiProperty({ example: "New exam tilte" })
  @IsString()
  @IsNotEmpty()
  tilte: string;
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  total_mark: number;
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  total_time: number;
  @ApiProperty({ example: "658a57d4e51fda21d6f34e15" })
  @IsString()
  @IsNotEmpty()
  courseId: string
}

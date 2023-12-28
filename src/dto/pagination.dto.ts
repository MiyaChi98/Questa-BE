import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PaginationDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  page: number;
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  limit: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsNumber()
  userId: number;
  @ApiProperty()
  @IsNumber()
  name: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  @IsNumber()
  zone: string;
}

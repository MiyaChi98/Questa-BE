import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({ example: "mikel@mor.com.vn" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ example: "Morminiproject98@" })
  @IsString()
  @IsNotEmpty()
  password: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({ example: "mikel@mor.com.vn" })
  @IsEmail()
  email: string;
  @ApiProperty({ example: "Morminiproject98@" })
  @IsString()
  password: string;
}

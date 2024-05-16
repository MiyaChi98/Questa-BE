import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({ example: "chintt.hrt@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ example: "Thaochi98@" })
  @IsString()
  @IsNotEmpty()
  password: string;
}

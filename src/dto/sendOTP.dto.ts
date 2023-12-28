import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class sendOTP {
  @ApiProperty({ example: "20020368@vnu.edu.vn" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  OTP: number;
}

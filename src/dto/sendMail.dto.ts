import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class sendMail {
  @ApiProperty({ example: "20020368@vnu.edu.vn" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

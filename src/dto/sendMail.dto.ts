import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class sendMail {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty()
  @IsMobilePhone()
  phone: string;
  @ApiProperty()
  zone: string;
}

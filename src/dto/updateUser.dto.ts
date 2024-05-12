import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/constant/roleEnum";

export class UpdateUserDto  {
    @ApiProperty({ example: "Mona Genshin" })
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({ example: "mona@gmail.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty({ example: "0999888777" })
    @IsMobilePhone()
    @IsNotEmpty()
    phone: string;
    @ApiProperty()
    school: string;
  }
  

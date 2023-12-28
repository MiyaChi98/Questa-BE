import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UploadFileDto {
  @ApiProperty({ type: "file" })
  @IsNotEmpty()
  file: Express.Multer.File;
}

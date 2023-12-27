import { ApiProperty } from "@nestjs/swagger";

export class UploadFileDto {
  @ApiProperty({ type: "file" })
  file: Express.Multer.File;
}

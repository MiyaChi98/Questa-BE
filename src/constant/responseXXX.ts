import { HttpStatus } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { AuthDto } from "src/dto/auth.dto";
import { SubmitDto } from "src/dto/submit.dto";

export const ResponseXXX = {
  successAuth: {
    // status: HttpStatus.CREATED,
    // description:
    //   "Login API return basic user details and accessToken, refreshToken",
    // content: {
    //   "application/json": {
    schema: {
      type: "object",
      items: {
        type: "object",
        properties: {
          userID: { type: "number", example: "18" },
          name: { type: "string", example: "name" },
          email: { type: "string", example: "email" },
          zone: ["admin", "teacher", "student"],
          phone: { type: "string", example: "IMG_0359.jpeg" },
          accessToken: { type: "string", example: "IMG_0359.jpeg" },
          refreshToken: { type: "string", example: "IMG_0359.jpeg" },
        },
        //       },
        //     },
      },
    },
  },
};

import { HttpStatus } from "@nestjs/common";

export const EmailXXX = {
  successSendMail: {
    status: HttpStatus.CREATED,
    description: "Send OTP to user email",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          example: {
            type: "success",
            statusCode: HttpStatus.CREATED,
            data: {
              OTP: "6 digit",
              email: "the email",
            },
          },
        },
      },
    },
  },
  successSendResetPassword: {
    status: HttpStatus.CREATED,
    description: "Send reset password to user email",
    schema: {
      properties: {
        APIresults: {
          message: {
            type: "string",
            example:
              "Pls check your email and sign in again with that password",
          },
        },
      },
    },
  },
};

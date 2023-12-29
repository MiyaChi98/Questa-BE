import { HttpStatus } from "@nestjs/common";

export const AuthXXX = {
  successAuth: {
    status: HttpStatus.OK,
    description:
      "Login API return basic user details and accessToken, refreshToken",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          properties: {
            userID: { type: "number", example: 21 },
            name: { type: "string", example: "name" },
            email: { type: "string", example: "email" },
            zone: ["admin", "teacher", "student"],
            phone: { type: "string", example: "0999888777" },
            accessToken: { type: "string", example: "accessTokenString" },
            refreshToken: { type: "string", example: "refreshTokenString" },
          },
        },
      },
    },
  },
  successCreateUser: {
    status: HttpStatus.CREATED,
    description: "Register API display the result of action",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example:
                "Create user success, please log in with that info to access our resource",
            },
          },
        },
      },
    },
  },
  successLogout: {
    status: HttpStatus.OK,
    description: "Logout API display the result of action",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Logout success",
            },
          },
        },
      },
    },
  },
  succesRegainAcs:{
    status: HttpStatus.OK,
    description: "Logout API display the result of action",
    schema: {
      properties: {
        APIresults: {
          type: "object",
              example: {        
    userID: "658a5711675fc608b92f6592",
    name: "admin",
    email: "admin@gmail.com",
    phone: "1234567899",
    accessToken: "",
    refreshToken: ""          
          },
        },
      },
    },
  }
};


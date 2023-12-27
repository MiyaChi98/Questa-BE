import { HttpStatus } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";
import { CreateUserDto } from "src/dto/createUser.dto";
import { UpdateUserDto } from "src/dto/updateUser.dto";

export const UserXXX = {
  successCreatedUser: {
    status: HttpStatus.CREATED,
    description: "User API display the new created User",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(CreateUserDto) }],
          properties: {
            message: {
              type: "string",
              example: "User created success !!!",
            },
          },
        },
      },
    },
  },
  successFindAll: {
    status: HttpStatus.OK,
    description: "Find all student",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(CreateUserDto) }],
        },
      },
    },
  },
  successFindbyId: {
    status: HttpStatus.OK,
    description: "Find one student match the id",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(CreateUserDto) }],
        },
      },
    },
  },
  successUpdate: {
    status: HttpStatus.OK,
    description: "Update student success",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(UpdateUserDto) }],
        },
      },
    },
  },
  successDelete: {
    status: HttpStatus.OK,
    description: "Delete the User",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Delete user success",
            },
          },
        },
      },
    },
  },
};

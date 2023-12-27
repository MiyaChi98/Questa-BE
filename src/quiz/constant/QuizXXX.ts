import { HttpStatus } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";
import { CreateQuizDtoArray } from "src/dto/createQuiz.dto";
import { UpdateQuizContentDto } from "src/dto/updateQuiz.dto";

export const QuizXXX = {
  //Quiz
  successCreatedQuiz: {
    status: HttpStatus.CREATED,
    description: "Quiz API display all the new created Quiz",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(CreateQuizDtoArray) }],
          properties: {
            message: {
              type: "string",
              example: "Quiz created success !!!",
            },
          },
        },
      },
    },
  },
  successUploadFile: {
    status: HttpStatus.OK,
    description: "Quiz API upload file and then save them to the database",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          example: [
            {
              quizId: 510,
              content: {
                question:
                  "A flashing red traffic light signifies that a driver should do what?",
                A: "stop",
                B: "speed up",
                C: "proceed with caution",
                D: "honk the horn",
                answer: "A",
                _id: "658ba553562f250ac14221ed",
              },
              teacherId: 5,
              examId: 1,
              _id: "658ba553562f250ac14221ec",
              createdAt: "2023-12-27T04:17:23.687Z",
              updatedAt: "2023-12-27T04:17:23.687Z",
              __v: 0,
            },
            {
              quizId: 511,
              content: {
                question: "A knish is traditionally stuffed with what filling?",
                A: "potato",
                B: "creamed corn",
                C: "lemon custard",
                D: "raspberry jelly",
                answer: "A",
                _id: "658ba553562f250ac14221f0",
              },
              teacherId: 5,
              examId: 1,
              _id: "658ba553562f250ac14221ef",
              createdAt: "2023-12-27T04:17:23.692Z",
              updatedAt: "2023-12-27T04:17:23.692Z",
              __v: 0,
            },
          ],
        },
      },
    },
  },
  successUploadImage: {
    status: HttpStatus.CREATED,
    description: "Upload the img",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example:
                "http://localhost:8000/image/standingcatcd55de26-2896-44d8-93df-244d15590ae9.jpg",
            },
          },
        },
      },
    },
  },
  successFindOne: {
    status: HttpStatus.OK,
    description: "Display one quiz",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          example: {
            _id: "ObjectId",
            content: {
              question:
                "According to folklore, the 'jackalope' is an antlered version of what animal?",
              A: "chicken",
              B: "rabbit",
              C: "moose",
              D: "snake",
              answer: "B",
              _id: "ObjectId",
            },
            teacherId: 1,
            examId: 1,
            createdAt: "2023-12-27T06:28:16.941Z",
            updatedAt: "2023-12-27T06:28:16.941Z",
            __v: 0,
          },
        },
      },
    },
  },
  successUpdateContent: {
    status: HttpStatus.CREATED,
    description: "Quiz API display the new updated quiz",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(UpdateQuizContentDto) }],
          properties: {
            message: {
              type: "string",
              example: "Quiz updated success !!!",
            },
          },
        },
      },
    },
  },
  successDelete: {
    status: HttpStatus.OK,
    description: "Delete the Quiz",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Delete quiz success",
            },
          },
        },
      },
    },
  },
};

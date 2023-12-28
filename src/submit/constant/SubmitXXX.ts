import { HttpStatus } from "@nestjs/common";

export const SubmitXXX = {
  successSubmit: {
    status: HttpStatus.CREATED,
    description: "Submit student answer into the database",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          example: [
            {
              examId: 0,
              studentId: 0,
              submitAnswer: {
                array: [
                  {
                    quizId: 0,
                    answer: "string",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
  successGetSubmit: {
    status: HttpStatus.OK,
    description: "Submit API get all the quiz and their answer ",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          example: [
            {
              examId: "658be05ed0a24b20fbfce04e",
              studentId: "6572828145fa7b62317f4dfb",
              studentAnswer: [
                {
                  quizId: "658be22ed875241ad15e634f",
                  question: "ramdon string ",
                  A: "string",
                  B: "string",
                  C: "string",
                  D: "string",
                  studentAnswer: "A",
                },
              ],
            },
          ],
        },
      },
    },
  },
};

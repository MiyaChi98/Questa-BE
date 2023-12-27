import { HttpStatus } from "@nestjs/common";

export const SubmitXXX = {
  successSubmit: {
    status: HttpStatus.OK,
    description:
      "Exam API display the exam match the id and all the question inside ",
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
};

import { HttpStatus } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";
import { CreateExamDTO } from "src/dto/createExam.dto";
import { UpdateCourseDto } from "src/dto/updateCourse.dto";
import { UpdateExamDTO } from "src/dto/updateExam.dto";

export const ExamXXX = {
  //Course
  successCreatedExam: {
    status: HttpStatus.CREATED,
    description: "Exam API display the new created Exam",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(CreateExamDTO) }],
          properties: {
            message: {
              type: "string",
              example: "Exam created success !!!",
            },
          },
        },
      },
    },
  },
  successFindAllExamInCourse: {
    status: HttpStatus.OK,
    description: "Exam API display all the exam in that course",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          example: [
            {
              tilte: "Course's test 1",
              total_mark: 10,
              total_time: 1,
            },
            {
              tilte: "Course's test 2",
              total_mark: 10,
              total_time: 1,
            },
          ],
        },
      },
    },
  },
  successFindbyId: {
    status: HttpStatus.OK,
    description:
      "Exam API display the exam match the id and all the question inside ",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          example: {
            examId: 1,
            teacher: {
              teacherName: "Brana Shelford",
              teacherEmail: "bshelford4@gnu.org",
              teacherPhone: "8368317599",
            },
            course: {
              courseName: "Intermidate",
              courseDescription: "Course for intemidate ",
            },
            tilte: "Course 5 test",
            time: 1,
            quiz: [
              {
                question:
                  "A flashing red traffic light signifies that a driver should do what?",
                A: "stop",
                B: "speed up",
                C: "proceed with caution",
                D: "honk the horn",
              },
              {
                question: "A knish is traditionally stuffed with what filling?",
                A: "potato",
                B: "creamed corn",
                C: "lemon custard",
                D: "raspberry jelly",
              },
            ],
          },
        },
      },
    },
  },
  successUpdate: {
    status: HttpStatus.CREATED,
    description: "Exam API display the new updated exam",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(UpdateExamDTO) }],
         
        },
      },
    },
  },
  successDelete: {
    status: HttpStatus.OK,
    description: "Delete the Exam",
    schema: {
      properties: {
        APIresults: {
         
            
              example: "Delete exam success",
            
          
        },
      },
    },
  },
};

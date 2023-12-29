import { HttpStatus } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";
import { CreateCourseDto } from "src/dto/createCourse.dto";
import { UpdateCourseDto } from "src/dto/updateCourse.dto";

export const CourseXXX = {
  //Course
  successCreatedCourse: {
    status: HttpStatus.CREATED,
    description: "Course API display the new created course",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(CreateCourseDto) }],
        },
      },
    },
  },
  successFindAllCourse: {
    status: HttpStatus.OK,
    description: "Course API display all the course with that teacher info",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          example: [
            {
              courseId: 1,
              courseName: "Course1",
              courseDescription: "Course description",

              teacher: {
                _id: "6555d99203662be4325a2838",
                email: "teacher@gmail.com",
                name: "Teacher name",
                phone: "8368317599",
              },
            },
            {
              courseId: 2,
              courseName: "Course2",
              courseDescription: "Course description ",

              teacher: {
                _id: "6555d99203662be4325a2838",
                email: "teacher@gmail.com",
                name: "Teacher name",
                phone: "8368317599",
              },
            },
          ],
        },
      },
    },
  },
  successFindbyId: {
    status: HttpStatus.OK,
    description:
      "Course API display the course match the id with that teacher info",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          example: {
            courseId: 1,
            courseName: "Course1",
            courseDescription: "Course description",
            teacher: {
              _id: "6555d99203662be4325a2838",
              email: "teacher@gmail.com",
              name: "Teacher name",
              phone: "8368317599",
            },
          },
        },
      },
    },
  },
  successUpdate: {
    status: HttpStatus.CREATED,
    description: "Course API display the new created course",
    schema: {
      properties: {
        APIresults: {
          type: "object",
          allOf: [{ $ref: getSchemaPath(UpdateCourseDto) }],
          properties: {
            message: {
              type: "string",
              example: "Course updated success !!!",
            },
          },
        },
      },
    },
  },
  successDelete: {
    status: HttpStatus.OK,
    description: "Delete the Course",
    schema: {
      properties: {
        APIresults: {
          example: "Delete course success",
        },
      },
    },
  },
};

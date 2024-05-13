import { Module } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { ExamController } from "./exam.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Exam, ExamSchema } from "src/schema/exam.schema";
import { UserModule } from "src/user/user.module";
import { CourseModule } from "src/course/course.module";
import { QuizModule } from "src/quiz/quiz.module";
import { JwtModule } from "@nestjs/jwt";
import { Submit, SubmitSchema } from "src/schema/submit.schema";
import { Quiz, QuizSchema } from "src/schema/quiz.schema";
import { StudentList, StudentListSchema } from "src/schema/studentlist.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Exam.name,
        schema: ExamSchema,
      },
      {
        name: Submit.name,
        schema: SubmitSchema,
      },
      {
        name: Quiz.name,
        schema: QuizSchema,
      },
      {
        name: StudentList.name,
        schema: StudentListSchema,
      },
    ]),
    CourseModule,
    UserModule,
    QuizModule,
    JwtModule,
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}

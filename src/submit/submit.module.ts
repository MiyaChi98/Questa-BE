import { Module } from "@nestjs/common";
import { SubmitService } from "./submit.service";
import { SubmitController } from "./submit.controller";
import { JwtModule } from "@nestjs/jwt";
import { ExamModule } from "src/exam/exam.module";
import { QuizModule } from "src/quiz/quiz.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Submit, SubmitSchema } from "src/schema/submit.schema";
import { Exam, ExamSchema } from "src/schema/exam.schema";
import { UserModule } from "src/user/user.module";
import { Course, CourseSchema } from "src/schema/course.schema";
import { StudentList, StudentListSchema } from "src/schema/studentlist.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Submit.name,
        schema: SubmitSchema,
      },
      {
        name: Exam.name,
        schema: ExamSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: StudentList.name,
        schema: StudentListSchema,
      },
    ]),
    JwtModule,
    ExamModule,
    UserModule,
    QuizModule,
  ],
  controllers: [SubmitController],
  providers: [SubmitService],
})
export class SubmitModule {}

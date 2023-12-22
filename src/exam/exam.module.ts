import { Module } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { ExamController } from "./exam.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Exam, ExamSchema } from "src/schema/exam.schema";
import { UserModule } from "src/user/user.module";
import { CourseModule } from "src/course/course.module";
import { QuizModule } from "src/quiz/quiz.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Exam.name,
        schema: ExamSchema,
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

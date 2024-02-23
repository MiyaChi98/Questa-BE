import { Module } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Quiz, QuizSchema } from "src/schema/quiz.schema";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { CourseModule } from "src/course/course.module";
import { Exam, ExamSchema } from "src/schema/exam.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Quiz.name,
        schema: QuizSchema,
      },
      {
        name: Exam.name,
        schema: ExamSchema,
      },
    ]),
    JwtModule,
    CourseModule,
    UserModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}

import { Module } from "@nestjs/common";
import { SubmitService } from "./submit.service";
import { SubmitController } from "./submit.controller";
import { JwtModule } from "@nestjs/jwt";
import { ExamModule } from "src/exam/exam.module";
import { QuizModule } from "src/quiz/quiz.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Submit, SubmitSchema } from "src/schema/submit.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Submit.name,
        schema: SubmitSchema,
      },
    ]),
    JwtModule,
    ExamModule,
    QuizModule,
    ],
  controllers: [SubmitController],
  providers: [SubmitService],
})
export class SubmitModule {}

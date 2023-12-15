import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @Prop()
  quizId: number;
  @Prop()
  content: {
    question: string;
    A: string;
    B: string;
    C: string;
    D: string;
    answer: string;
  };
  @Prop()
  createDate: number;
  @Prop()
  teacherId: number;
  @Prop()
  examId: number;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

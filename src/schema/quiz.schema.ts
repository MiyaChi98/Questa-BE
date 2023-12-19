import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Content {
  @Prop()
  question: string;
  @Prop()
  img: string;
  @Prop()
  A: string;
  @Prop()
  B: string;
  @Prop()
  C: string;
  @Prop()
  D: string;
  @Prop()
  answer: string;
}

@Schema()
export class Quiz {
  @Prop()
  quizId: number;
  @Prop()
  img: string;
  @Prop({ type: Content })
  content: Content;
  @Prop()
  createDate: number;
  @Prop()
  teacherId: number;
  @Prop()
  examId: number;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

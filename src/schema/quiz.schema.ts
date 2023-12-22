import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
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

@Schema({ timestamps: true })
export class Quiz {
  @Prop()
  quizId: number;
  @Prop({ type: Content })
  content: Content;
  @Prop()
  teacherId: number;
  @Prop()
  examId: number;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

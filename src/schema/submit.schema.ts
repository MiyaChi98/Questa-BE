import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
enum multiChoise {
  A,
  B,
  C,
  D,
}
@Schema({ timestamps: true })
export class Answer {
  @Prop()
  quizId: string;
  @Prop()
  answer: multiChoise;
}

@Schema({ timestamps: true })
export class AnswerArray {
  @Prop({})
  array: Answer[];
}

@Schema({ timestamps: true })
export class Submit {
  @Prop()
  examId: string;
  @Prop()
  studentId: string;
  @Prop({ type: AnswerArray })
  submitAnswer: AnswerArray;
  @Prop()
  mark: number;
}

export const SubmitSchema = SchemaFactory.createForClass(Submit);

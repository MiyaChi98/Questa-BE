import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Exam {
  @Prop()
  examId: number;
  @Prop()
  tilte: string;
  @Prop()
  total_mark: number;
  @Prop()
  total_time: number;
  @Prop()
  courseId: number;
  @Prop()
  teacherId: number;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

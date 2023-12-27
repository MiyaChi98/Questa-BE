import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Exam {
  @Prop()
  tilte: string;
  @Prop()
  total_mark: number;
  @Prop()
  total_time: number;
  @Prop()
  courseId: string;
  @Prop()
  teacherId: string;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

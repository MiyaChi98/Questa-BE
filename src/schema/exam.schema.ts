import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Exam {
  @Prop()
  title: string;
  @Prop()
  subject: string;
  @Prop()
  total_mark: number;
  @Prop()
  total_time: number;
  @Prop()
  courseId: string;
  @Prop()
  teacherId: string;
  @Prop()
  start: Date;
  @Prop()
  end: Date;
  @Prop()
  description: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ExamDocument = HydratedDocument<Exam>;

@Schema()
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
  createAt: string;
  @Prop()
  courseId: number;
  @Prop()
  teacherId: number;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

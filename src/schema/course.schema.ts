import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop()
  courseId: number;
  @Prop()
  courseName: string;
  @Prop()
  courseDescription: string;
  @Prop()
  teacherId: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Course {
  @Prop()
  courseName: string;
  @Prop()
  courseDescription: string;
  @Prop()
  teacherId: string;
  @Prop()
  studentId: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);

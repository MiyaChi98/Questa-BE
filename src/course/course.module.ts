import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Course, CourseSchema } from "src/schema/course.schema";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { StudentList, StudentListSchema } from "src/schema/studentlist.schema";
import { Exam, ExamSchema } from "src/schema/exam.schema";
import { User, UserSchema } from "src/schema/user.schema";
import { Submit, SubmitSchema } from "src/schema/submit.schema";
import { ElasticsearchModule } from "src/elasticsearch/elasticsearch.module";
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: StudentList.name,
        schema: StudentListSchema,
      },
      {
        name: Exam.name,
        schema: ExamSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Submit.name,
        schema: SubmitSchema,
      },
    ]),
    UserModule,
    JwtModule,
    ElasticsearchModule
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}

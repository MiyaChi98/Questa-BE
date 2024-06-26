import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { EmailModule } from "./email/email.module";
import { CourseModule } from "./course/course.module";
import { ExamModule } from "./exam/exam.module";
import { QuizModule } from "./quiz/quiz.module";
import { ServeStaticModule } from "@nestjs/serve-static/dist/serve-static.module";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { SubmitModule } from "./submit/submit.module";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerModule } from "nestjs-pino";
import { LogsModule } from "./logs/logs.module";
import { ThrottlerGuard, ThrottlerModule, minutes } from "@nestjs/throttler";
import { ScheduleModule } from "@nestjs/schedule";
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: minutes(1),
        limit: 40,
      },
    ]),
    LoggerModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
    }),
    MongooseModule.forRoot("mongodb://127.0.0.1:27017", { dbName: "Custom" }),
    UserModule,
    AuthModule,
    EmailModule,
    CourseModule,
    ExamModule,
    QuizModule,
    SubmitModule,
    LogsModule,
    ElasticsearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

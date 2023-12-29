import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { join } from "path";
import { UserModule } from "src/user/user.module";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        auth: {
          user: "chintt.hrt@gmail.com",
          pass: "msnw itmz elhc cdsh",
        },
      },
      defaults: {
        from: '"From Name" <from@example.com>',
      }
    }),
    UserModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}

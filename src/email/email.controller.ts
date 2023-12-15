import { Controller, Get, Param } from "@nestjs/common";
import { EmailService } from "./email.service";

@Controller("mail")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get("sendOTP/:email")
  async sendEmail(@Param("email") email) {
    return await this.emailService.OTPEmail(email);
  }
  @Get("tp/:email")
  async tp(@Param("email") email) {
    return await this.emailService.TemporaryPassword(email);
  }
}

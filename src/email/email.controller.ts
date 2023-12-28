import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ApiTags } from "@nestjs/swagger";
import { sendMail } from "src/dto/sendMail.dto";
import { sendOTP } from "src/dto/sendOTP.dto";
@ApiTags("Email")
@Controller("mail")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("sendOTP")
  async sendEmail(@Body() userEmail: sendMail) {
    return await this.emailService.OTPEmail(userEmail.email);
  }
  @Post("verifyOTP")
  async verifyOTP(@Body() bodyOtp: sendOTP) {
    if (await this.emailService.VerifyOTP(bodyOtp)) {
      return "Pls check your email and sign in again with that password";
    }
    return "Verify failed";
  }
}

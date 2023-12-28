import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { sendOTP } from "src/dto/sendOTP.dto";
@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async OTPEmail(userEmail: string) {
    const user = await this.userService.findOne(userEmail);
    if (user) {
      const email: string = userEmail;
      const otp: number = this.otpgenarator();
      const subject = `Your otp is ${otp}`;
      await this.mailerService.sendMail({
        to: email,
        from: "chintt.hrt@gmail.com",
        subject: subject,
      });
      await this.cacheManager.del(user.email);
      await this.cacheManager.set(user.email, otp, 60000 * 5);
      return {
        OTP: otp,
        email: user.email,
      };
    } else
      throw new BadRequestException("There no user was signed by this email");
  }

  async VerifyOTP(bodyOtp: sendOTP) {
    if (bodyOtp.OTP === (await this.cacheManager.get(bodyOtp.email))) {
      await this.TemporaryPassword(bodyOtp.email);
      return true;
    }
    return false;
  }

  async TemporaryPassword(email: string) {
    const temporaryPassword = this.generateRandomString(10);
    await this.userService.updatePassword(email, temporaryPassword);
    await this.mailerService.sendMail({
      to: email,
      from: "chintt.hrt@gmail.com",
      subject: temporaryPassword,
      html: "sign in again with this temporary pass , pls change the pass afterward",
    });
    return temporaryPassword;
  }

  otpgenarator(): number {
    let digits = "0123456789";
    let OTP = "";
    for (let i = 1; i < 7; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return +OTP;
  }
  generateRandomString(length: number): string {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

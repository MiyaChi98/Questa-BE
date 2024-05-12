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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async RegisterOTPEmail(userEmail: string) {
      const email: string = userEmail;
      const otp: number = this.otpgenarator();
      const subject = `Your otp is ${otp}`;
      await this.mailerService.sendMail({
        to: email,
        from: "chintt.hrt@gmail.com",
        subject: subject,
      });
      await this.cacheManager.del(email);
      await this.cacheManager.set(email, otp, 60000*2);
      console.log(await this.cacheManager.get(email))
      return {
        OTP: otp,
        email:email,
      };
  }
  async RegisterVerifyOTP(bodyOtp: sendOTP) {
    console.log(bodyOtp)
    console.log(bodyOtp.OTP)
    console.log(await this.cacheManager.get(bodyOtp.email))
    if (parseInt(bodyOtp.OTP) === (await this.cacheManager.get(bodyOtp.email))) {
      return true;
    }
    return false;
  }
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
      await this.cacheManager.set(user.email, otp, 60000*2);
      return {
        OTP: otp,
        email: user.email,
      };
    } else
      throw new BadRequestException("There no user was signed by this email");
  }

  async VerifyOTP(bodyOtp: sendOTP) {
    console.log(bodyOtp.OTP)
    console.log(await this.cacheManager.get(bodyOtp.email))
    console.log(typeof bodyOtp.OTP)
    console.log(typeof (await this.cacheManager.get(bodyOtp.email)))
    if (parseInt(bodyOtp.OTP) == (await this.cacheManager.get(bodyOtp.email))) {
      await this.TemporaryPassword(bodyOtp.email);
      return true;
    }
    return false;
  }

  async TemporaryPassword(email: string) {
    const temporaryPassword = this.generateString();
    await this.userService.updatePassword(email, temporaryPassword);
    await this.mailerService.sendMail({
      to: email,
      from: "chintt.hrt@gmail.com",
      subject: temporaryPassword,
      html: "sign in again with this temporary pass , pls change the pass afterward",
    });
    return temporaryPassword;
  }

  otpgenarator() {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 1; i < 7; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return +OTP;
  }

  generateString = () => {
    const specialChars = '!@#$%^&*()-_=+';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let generatedString = '';
    
    // Add one special character
    generatedString += specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Add one uppercase letter
    generatedString += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    
    // Add one number
    generatedString += numbers[Math.floor(Math.random() * numbers.length)];
    
    // Add remaining characters
    while (generatedString.length < 10) {
        const chars = specialChars + uppercaseChars + numbers;
        generatedString += chars[Math.floor(Math.random() * chars.length)];
    }

    return generatedString;
};

}

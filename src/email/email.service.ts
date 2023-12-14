import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService
  ) {}

  async OTPEmail(userEmail: string) {
    const user = await this.userService.findOne(userEmail);
    if (user) {
      const email: string = userEmail;
      const otp: number = Math.floor(Math.random() * 900000) + 10000;
      const subject = `Your otp is ${otp}`;
      await this.mailerService.sendMail({
        to: email,
        from: "chintt.hrt@gmail.com",
        subject: subject,
      });
      return {
        otp: otp,
       
        userEmail: user.email
      }
    } else
      throw new BadRequestException("There no user was signed by this email");
  }

  async TemporaryPassword(email: string){
    const temporaryPassword = this.generateRandomString(10)
    await this.userService.updatePassword(email,temporaryPassword)
    await this.mailerService.sendMail({
      to: email,
      from: "chintt.hrt@gmail.com",
      subject: temporaryPassword,
      html: 'sign in again with this temporary pass , pls change the pass afterward'
    });
    return temporaryPassword
  }

   generateRandomString(length: number){
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
}

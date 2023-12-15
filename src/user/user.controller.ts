import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("")
  async getone() {
    const allstudent = await this.userService.findAll();
    return allstudent;
  }
}

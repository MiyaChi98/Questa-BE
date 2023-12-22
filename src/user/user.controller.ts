import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { CreateUserDto } from "src/dto/createUser.dto";
import { UpdateUserDto } from "src/dto/updateUser.dto";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "src/constant/roleEnum";
import { HasRoles } from "src/decorators/has_role.decorator";
import { RolesGuard } from "src/guard/role.guard";
import { ATGuard } from "src/guard/accessToken.guards";
@ApiTags("User")
@HasRoles(Role.ADMIN)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("/all")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAllUser(@Req() req: Request) {
    const user = await this.userService.findAll();
    return user;
  }
  //Find by id
  @ApiOperation({
    summary: "Get user",
    description: "Get user by id",
  })
  @Get(":id")
  async getUserbyId(@Param("id") id: number) {
    const user = await this.userService.findOnebyID(id);
    if (!user) {
      throw new NotFoundException("Cant find user by the id: " + id);
    }
    return user;
  }

  @Get("/teacher/all")
  async getAllTeacher() {
    const teacher = await this.userService.findAllTeacher();
    if (!teacher) {
      throw new NotFoundException("There are no teacher");
    }
    return teacher;
  }
  //Crete new one
  @Post()
  @UsePipes(new ValidationPipe())
  async createStudent(@Body() userDetails: CreateUserDto) {
    this.userService.create(userDetails);
  }
  //Update one by ID
  @Patch(":id")
  @UsePipes(new ValidationPipe())
  async updateStudentbyId(
    @Param("id", ParseIntPipe) id: number,
    @Body() userNewDetails: UpdateUserDto
  ) {
    const updateUser = await this.userService.changeStudentDetails(
      id,
      userNewDetails
    );
    return updateUser;
  }
  //Delete one by ID
  @Delete(":id")
  async delStudentbyId(@Param("id") id: number) {
    const student = await this.userService.delete(id);
    return student;
  }
}

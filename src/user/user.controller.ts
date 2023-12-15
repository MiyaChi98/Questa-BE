import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ValidationPipe, UsePipes, ParseIntPipe, Req} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService){}
  @Get('/all')
  async getAllUser(@Req() req: Request){
      const user = await this.userService.findAll()
      return user;
   }
   //Find by id
  @Get(':id')
  async getUserbyId(@Param('id') id: number){
      const user = await this.userService.findOnebyID(id);
      if(!user){
          throw new NotFoundException('Cant find user by the id: '+ id );
      }
      return user;
  }
  //Get all teacher
  @Get('/teacher/all')
  async getAllTeacher(){
    const teacher = await this.userService.findAllTeacher();
    if(!teacher){
        throw new NotFoundException('There are no teacher');
    }
    return teacher;
}
  //Crete new one
  @Post()
  @UsePipes(new ValidationPipe)
  async createStudent(@Body() userDetails: CreateUserDto){
      this.userService.create(userDetails);
  }
  //Update one by ID
  @Patch(':id')
  @UsePipes(new ValidationPipe)
  async updateStudentbyId(
      @Param('id',ParseIntPipe) id: number,
      @Body() userNewDetails: UpdateUserDto){
      const updateUser = await this.userService.changeStudentDetails(id,userNewDetails)
      return updateUser
  }
  //Delete one by ID 
  @Delete(':id')
  async delStudentbyId(@Param('id') id: number){
      const student = await this.userService.delete(id);
      return student;
  }
  
}



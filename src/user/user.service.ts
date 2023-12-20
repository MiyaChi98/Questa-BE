import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schema/user.schema";
import { CreateUserDto } from "src/dto/createUser.dto";
import { UpdateUserDto } from "src/dto/updateUser.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  // find all user
  async findAll() {
    return this.UserModel.find();
  }
  // find one user with that email
  async findOne(userEmail: string) {
    return this.UserModel.findOne({ email: userEmail });
  }
  // find one by id
  async findOnebyID(userID: number) {
    return this.UserModel.findOne({ userId: userID });
  }
  //find all teacher
  async findAllTeacher() {
    return this.UserModel.find({ zone: "teacher" });
  }
  // async findAllStudent(courseId: number){
  //   return this.UserModel.find({})
  // }
  async changeStudentDetails(userID: number, updateuserDTO: UpdateUserDto) {
    return this.UserModel.findOne({ userId: userID }).updateOne({
      ...updateuserDTO,
    });
  }
  // create user
  async create(createUserDto: CreateUserDto) {
    return this.UserModel.create(createUserDto);
  }
  //add refresh token to the document in th DB
  async updateRefreshToken(id: number, refreshToken: string) {
    return this.UserModel.findOne({ userId: id }).updateOne({
      refreshToken: refreshToken,
    });
  }
  // delete the refresh token
  async signOut(id: number) {
    return this.UserModel.findOne({ userId: id }).updateOne({
      refreshToken: "",
    });
  }
  async updatePassword(email: string, temporaryPassword: string) {
    return this.UserModel.findOne({ email: email }).updateOne({
      password: temporaryPassword,
    });
  }
  async delete(id: number) {
    return this.UserModel.deleteOne({ userId: id });
  }
}

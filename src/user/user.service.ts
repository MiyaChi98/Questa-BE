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
  async findOnebyID(userID: string) {
    return this.UserModel.findOne(
      { _id: userID },
      {
        name: 1,
        email: 1,
        phone: 1,
      },
    );
  }
  //find all teacher
  async findAllTeacher() {
    return this.UserModel.find({ zone: "teacher" });
  }
  // async findAllStudent(courseId: number){
  //   return this.UserModel.find({})
  // }
  async changeStudentDetails(userID: string, updateuserDTO: UpdateUserDto) {
    await this.UserModel.findOne({ _id: userID }).updateOne({
      ...updateuserDTO,
    });
    return await this.UserModel.findOne(
      { _id: userID },
      {
        password: 0,
      },
    );
  }
  // create user
  async create(createUserDto: CreateUserDto) {
    return this.UserModel.create(createUserDto);
  }
  //add refresh token to the document in th DB
  async updateRefreshToken(id: string, refreshToken: string) {
    return this.UserModel.findOne({ _id: id }).updateOne({
      refreshToken: refreshToken,
    });
  }
  // delete the refresh token
  async signOut(id: string) {
    return this.UserModel.findOne({ _id: id }).updateOne({
      refreshToken: "",
    });
  }
  async updatePassword(email: string, temporaryPassword: string) {
    return this.UserModel.findOne({ email: email }).updateOne({
      password: temporaryPassword,
    });
  }
  async delete(id: string) {
    return this.UserModel.deleteOne({ _id: id });
  }
}

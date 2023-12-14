import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schema/user.schema";
import { CreateUserDTO } from "src/dto/createUser.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  // find all user
  async findAll(): Promise<UserDocument[]> {
    return this.UserModel.find();
  }
  // find one user with tha email
  async findOne(userEmail: string): Promise<UserDocument> {
    return this.UserModel.findOne({ email: userEmail });
  }
  // find one by id
  async findOnebyID(userID: number): Promise<UserDocument> {
    return this.UserModel.findOne({ userId: userID });
  }
  // create user
  async create(createUserDto: CreateUserDTO): Promise<UserDocument> {
    const createdUser = new this.UserModel(createUserDto);
    return createdUser.save();
  }
  //add refresh token to the document in th DB
  updateRefreshToken(id: number, refreshToken: string) {
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
}

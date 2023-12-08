import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  async findAll(): Promise<UserDocument[]> {
    return this.UserModel.find();
  }
  async findOne(userEmail: string): Promise<UserDocument> {
    return this.UserModel.findOne({ email: userEmail });
  }

  async create(createUserDto: CreateUserDTO): Promise<UserDocument> {
    const createdUser = new this.UserModel(createUserDto);
    return createdUser.save();
  }

  async update(){
    return this.UserModel.updateOne({})
  }
}

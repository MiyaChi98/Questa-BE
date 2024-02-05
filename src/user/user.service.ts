import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schema/user.schema";
import { CreateUserDto } from "src/dto/createUser.dto";
import { UpdateUserDto } from "src/dto/updateUser.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  // find all user
  async findAll(page: number, limit: number) {
    const allUSer = await this.UserModel.find(
      {},
      {
        password: 0,
      },
    )
      .skip((page-1) * limit)
      .limit(limit)
    const numberOfUser = await this.UserModel.countDocuments()
    const numberOfPage = Array.from({length: Math.ceil(numberOfUser/limit)}, (_, i) => i + 1)
    return {
      page: page,
      numberOfPage: numberOfPage,
      numberOfUser: numberOfUser,
      allUSer,
    };
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
        password:0,
        refreshToken: 0,
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
        refreshToken:0
      },
    );
  }
  // create user
  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOne(createUserDto.email);
    if (userExist) {
      return new BadRequestException("User already exist by this email!");
    } else{
       //Validate the input password using a validate method
    this.validatePassword(createUserDto.password);
    //Hash the password
    createUserDto.password = this.hash(createUserDto.password);
    return this.UserModel.create(createUserDto);
    }
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
      password: bcrypt.hashSync(temporaryPassword, 10),
    });
  }
  async delete(id: string) {
    return this.UserModel.findOneAndDelete({_id: id});
  }

  validatePassword(password: string) {
    //Have more than 8 char
    // >=1 upper case
    // have a number
    // have a special char
    const number = /[0-9]/;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const upperCase = /[A-Z]/;
    // eslint-disable-next-line prefer-const
    let err = [];
    if (password.length < 8) {
      err.push("The password should have at least 8 characters");
    } else {
      if (!upperCase.test(password)) {
        err.push("The password should have at least one uppercase letter");
      }

      if (!number.test(password)) {
        err.push("The password should have at least one number");
      }

      if (!specialChars.test(password)) {
        err.push("The password should have at least one special character");
      }
    }
    if (err.length != 0) {
      throw new BadRequestException(err);
    }
  }

  // HASH using bycrypt
  hash(password) {
    const sOr = 10;
    const hash = bcrypt.hashSync(password, sOr);
    return hash;
  }
}

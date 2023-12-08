import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Variable } from 'src/variable';
import { CreateUserDTO } from 'src/dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { AuthDTO } from 'src/dto/auth.dto';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Injectable()
export class AuthService {
    constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDTO: CreateUserDTO) {
    // console.log(createUserDTO)
    const userExist = await this.userService.findOne(createUserDTO.email);
    if (userExist) {
      throw new BadRequestException('User already exist by this email!');
    }
    this.validatePassword(createUserDTO.password)
    const hash = this.hash(createUserDTO.password);
    console.log(hash)
    const newUser = await this.userService.create({
      ...createUserDTO,
      password: hash,
    });
    return newUser
  }

  async signIn(authDTO: AuthDTO){
    const user = await this.userService.findOne(authDTO.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = bcrypt.compareSync(authDTO.password,user.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens= await this.getTokens(user.id,user.name)
    user.refreshToken= tokens.refreshToken;
    return tokens
  }


  signOut(req: Request) {
    
  }
  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: Variable.AT_SECRET,
          expiresIn: '2m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: Variable.RT_SECRET,
          expiresIn: '1d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  validatePassword(password: string) {
    //Have more than 8 char
    // >=1 upper case
    // have a number
    // have a special char
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let err = [];
    password.length >= 8
      ? /[A-Z]/.test(password)
        ? /[0-9]/.test(password)
          ? specialChars.test(password)
            ? ''
            : err.push('The password should have at least one special char')
          : err.push('The password should have at least a number')
        : err.push('The password should have at least one Upper Case letter')
      : err.push('The password should greater than 8 char');
    
      if(err.length!=0){
        throw new BadRequestException(err)
      }
  }

  hash(password) {
    const sOr = 10;
    const hash = bcrypt.hashSync(password, sOr);
    return hash;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dto/createUser.dto";
import { AuthDto } from "src/dto/auth.dto";
import { Request } from "express";
import { ATGuard } from "src/guard/accessToken.guards";
import { RTGuard } from "src/guard/refreshToken.guards";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthXXX } from "./constant/AuthXXX";
import { Register } from "src/dto/register.dto";
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //REGISTER
  //Input: A DTO that resembles User collection in DB
  //Output: A new user
  @Post("register")
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Use to register as student'
  })
  @ApiCreatedResponse(AuthXXX.successCreateUser)
  async register(@Body() createUserDTO: Register) {
    return await this.authService.signUp(createUserDTO);
  }
  //LOGIN
  //Input: AuthDTO contains email and password
  //Output: tokens
  @ApiExtraModels(AuthDto)
  @ApiOkResponse(AuthXXX.successAuth)
  @ApiOperation({
    summary: 'Use to login'
  })
  @UsePipes(new ValidationPipe())
  @Post("login")
  async login(@Body() authDTO: AuthDto) {
    return await this.authService.signIn(authDTO);
  }
  //LOGOUT
  //Guard to check Access Token
  @UseGuards(ATGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Use to logout'
  })
  @ApiOkResponse(AuthXXX.successLogout)
  @Get("logout")
  async logout(@Req() req: Request) {
    return await this.authService.signOut(req["user"]?.sub);
  }
  //Take new access token
  @UseGuards(RTGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Use to get new pair of token key '
  })
  @ApiOkResponse(AuthXXX.succesRegainAcs)
  @Get("acstoken")
  async getnewAccessToken(@Req() req: Request) {
    if (req["user"]) {
      return await this.authService.getnewAccessToken(
        req["user"]?.sub,
        req["user"]?.rt,
      );
    }
  }
}

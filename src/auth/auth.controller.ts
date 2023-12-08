import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/dto/createUser.dto';
import { AuthDTO } from 'src/dto/auth.dto';
import { Request } from 'express';
import { ATGuard } from 'src/guard/accessToken.guards';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('')
    async register(@Body() createUserDTO: CreateUserDTO){
        return await this.authService.signUp(createUserDTO)
    }
    @Post('login')
    async login(@Body() authDTO: AuthDTO){
        return await this.authService.signIn(authDTO)
    }

    @UseGuards(ATGuard)
    @Get('logout')
    async logout(@Req() req: Request ){
        return this.authService.signOut(req)
    }
}

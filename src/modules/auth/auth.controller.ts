import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetAgent } from 'src/common/decorator/get-agent.decorator';
import { GetSub } from 'src/common/decorator/get-sub.decorator';
import { UAResult } from 'ua-parser-js';
import { GetUser } from '../../common/decorator/get-user.decorator';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { SignupRequestDto } from './dto/signup-request.dto';
import { UserAuth } from './entity/user-auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signupRequestDto: SignupRequestDto) {
    return await this.authService.signUp(signupRequestDto);
  }

  @Post('/login')
  async signIn(@Body() loginRequestDto: LoginRequestDto, @GetAgent() userAgent: UAResult, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.signIn(loginRequestDto, userAgent);
    res.set({ Access_Token: accessToken, Refresh_Token: refreshToken });
    res.json({ accessToken, refreshToken });
  }

  @UseGuards(AuthGuard('refresh-jwt'))
  @Post('/refresh')
  async authRefresh(@GetUser() user: UserAuth, @GetSub() oldsub: string, @GetAgent() userAgent: UAResult, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.authRefresh(user, oldsub, userAgent);
    res.set({ Access_Token: accessToken, Refresh_Token: refreshToken });
    res.json({ accessToken, refreshToken });
  }

  @UseGuards(AuthGuard())
  @Post('/logout')
  async signOut(@GetUser() user: UserAuth, @GetSub() oldsub: string) {
    return await this.authService.signOut(user, oldsub);
  }
}

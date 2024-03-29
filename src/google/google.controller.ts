import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { Response } from 'express';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('social-login')
@Controller('google')
export class GoogleController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly googleService: GoogleService) {}
  /**
   * 구글 로그인
   * @param req
   */
  @ApiOperation({
    description: '[구글 로그인 링크](http://localhost:3000/google)',
  })
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @ApiExcludeEndpoint()
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.googleService.googleLogin(req);
    res.cookie('Authorization', `Bearer ${accessToken.access_token}`);
    return accessToken;
  }
}

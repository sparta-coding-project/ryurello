import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * 회원가입
   * @param signUpDto
   * @returns
   */
  @Post('register')
  async register(@Body() signUpDto: SignUpDto) {
    return await this.userService.register(signUpDto);
  }
  /**
   * 로그인
   * @param loginDto
   * @returns
   */
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.userService.login(
      loginDto.email,
      loginDto.password,
    );
    res.cookie('Authorization', `Bearer ${accessToken.access_token}`);
    return accessToken;
  }
  /**
   * 프로필 조회
   * @param id
   * @returns
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return { user };
  }
  /**
   * 유저정보 수정
   * @param id
   * @param updateUserDto
   * @returns
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  /**
   * 유저 삭제
   * @param id
   * @returns
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id') id: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.userId;

    if (+id !== userId) {
      throw new UnauthorizedException('해당 작업을 수행할 권한이 없습니다.');
    }
    const deleteUser = await this.userService.delete(+id);
    res.clearCookie('Authorization');
    return deleteUser;
  }
}

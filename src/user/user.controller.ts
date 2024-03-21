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
  UploadedFile,
  UseInterceptors,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

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
    const data = await this.userService.register(signUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '회원 가입이 완료되었습니다.',
      data,
    };
  }

  @ApiExcludeEndpoint()
  @Get('validation/:id')
  async validateUserByEmail(
    @Param('id') id: number,
    @Query('email') email: string,
  ) {
    const data = this.userService.validateUserByEmail(id, email);
    return {
      statusCode: HttpStatus.OK,
      message: '메일 인증이 완료되었습니다.',
      data,
    };
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
    return {
      statusCode: HttpStatus.OK,
      message: '로그인 되었습니다.',
      accessToken,
    };
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
    return {
      statusCode: HttpStatus.OK,
      user,
    };
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
    const data = this.userService.update(+id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 수정되었습니다.',
      data,
    };
  }
  /**
   * 프로필 이미지 업로드
   * @param id
   * @param file
   * @returns
   */
  @Post('profileImage/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.userService.uploadImage(image, id);
  }
  /**
   * 프로필 이미지 업데이트
   * @param id
   * @param file
   * @returns
   */
  @Patch('profileImage/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    await this.userService.deleteImage(id);
    await this.userService.uploadImage(image, id);
    return {
      statusCode: HttpStatus.OK,
      message: '프로필 이미지가 수정되었습니다.',
    };
  }
  /**
   * 프로필 이미지 삭제
   * @param id
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete('profileImage/:id')
  async deleteImage(@Param('id') id: number) {
    return await this.userService.deleteImage(id);
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
    return {
      statusCode: HttpStatus.OK,
      message: deleteUser.message,
    };
  }
}

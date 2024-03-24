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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserGuard } from 'src/auth/users.guard';

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
   * @param userId
   * @returns
   */
  @Get(':userId')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async findOne(@Param('userId') userId: string) {
    const user = await this.userService.findOne(+userId);
    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }
  /**
   * 유저 정보 수정
   * @param userId
   * @param updateUserDto
   * @returns
   */
  @ApiOperation({ summary: '유저 정보 수정' })
  @Patch(':userId')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.userService.update(+userId, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 수정되었습니다.',
      data,
    };
  }
  /**
   * 프로필 이미지 업로드
   * @param userId
   * @param file
   * @returns
   */
  @Post('profileImage/:userId')
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
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('userId') userId: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.userService.uploadImage(image, userId);
  }
  /**
   * 프로필 이미지 업데이트
   * @param userId
   * @param file
   * @returns
   */
  @Patch('profileImage/:userId')
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
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(
    @Param('userId') userId: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    await this.userService.deleteImage(userId);
    await this.userService.uploadImage(image, userId);
    return {
      statusCode: HttpStatus.OK,
      message: '프로필 이미지가 수정되었습니다.',
    };
  }
  /**
   * 프로필 이미지 삭제
   * @param userId
   * @returns
   */
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Delete('profileImage/:userId')
  async deleteImage(@Param('userId') userId: number) {
    return await this.userService.deleteImage(userId);
  }
  /**
   * 유저 삭제
   * @param userId
   * @returns
   */
  @Delete(':userId')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async remove(
    @Param('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deleteUser = await this.userService.delete(+userId);
    res.clearCookie('Authorization');
    return {
      statusCode: HttpStatus.OK,
      message: deleteUser.message,
    };
  }
}

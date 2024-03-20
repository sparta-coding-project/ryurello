import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  Patch,
  Param,
  HttpStatus,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { MailService } from 'src/mail/mail.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly mailService: MailService,
  ) {}

  /**
   * 보드 생성
   * @param createBoardDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @Req() req: any) {
    const userId = req.user.userId;
    const data = this.boardService.create(createBoardDto, userId);

    return {
      statusCode: HttpStatus.CREATED,
      message: '보드 생성에 성공했습니다.',
      data,
    };
  }

  /**
   * 보드 목록 조회
   * @returns
   */
  @ApiBearerAuth()
  @Get()
  async findAll() {
    const data = await this.boardService.findAll();

    if (!data.length) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: '보드 목록이 존재하지 않습니다.',
        data,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: '보드 목록 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 보드 상세 조회
   * @param id
   * @returns
   */
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.boardService.findOne(id);

    if (!data) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: '보드가 존재하지 않습니다.',
        data,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: '보드 상세 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 보드 초대
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':boardId/invite')
  async sendMailAndInvite(
    @Param('boardId') boardId: number,
    @Body('to') to: string | string[],
  ) {
    const board = await this.boardService.findOne(boardId);
    const inviteToken = '토큰만들어서넣기'
    const subject = 'Ryurello - 보드 초대';
    const url = `http://${process.env.DB_HOST}:${process.env.DB_PORT}/board/${boardId}/invited?token=${inviteToken}`;
    const content = `<p>귀하는 ${board.title}의 멤버로 초대되었습니다.<p>
    <p>아래 링크를 눌러 초대를 수락할 수 있습니다.<p>
    <a href="${url}">수락하기</a>`;

    if (Array.isArray(to)) {
      await Promise.all(
        to.map(async (email) => {
          await this.mailService.sendMail(email, subject, content);
        }),
      );
    } else {
      await this.mailService.sendMail(to, subject, content);
    }

    return {
      statusCode: HttpStatus.OK,
      message: '초대 메일을 발송했습니다.',
    };
  }

  // /**
  //  * 보드 초대 수락
  //  * @returns
  //  */
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Post(':boardId/invited')
  // async acceptInvitation(
  //   @Param('boardId') boardId: number,
  //   @Query('token') token: string,
  // ) {

  //   await this.boardService.addUserToBoard(boardId, email);

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: '보드 멤버로 추가되었습니다.',
  //   };
  // }

  // /**
  //  * 보드 수정
  //  * @param id
  //  * @returns
  //  */
  // @ApiBearerAuth()
  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updateBoardDto: UpdateBoardDto) {
  //   return this.boardService.update(+id, updateBoardDto);
  // }

  // /**
  //  * 보드 삭제
  //  * @param id
  //  * @returns
  //  */
  // @ApiBearerAuth()
  // @Roles(UserRole.Admin)
  // @UseGuards(RolesGuard)
  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.boardService.remove(+id);
  // }
}

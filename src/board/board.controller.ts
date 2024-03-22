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
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MailDto } from './dto/mail.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/entities/types/boardUserRole.type';
import { BoardMemberGuard } from 'src/auth/boardusers.guard';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
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
   * @param boardId
   * @returns
   */
  @ApiBearerAuth()
  @Get(':boardId')
  @UseGuards(BoardMemberGuard)
  async findOne(@Param('boardId') boardId: number) {
    const data = await this.boardService.findOne(boardId);

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
   * @param to
   * @param boardId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(BoardMemberGuard)
  @Post(':boardId/invite')
  async sendMailAndInvite(
    @Param('boardId') boardId: number,
    @Body() mailDto: MailDto,
  ) {
    const to = mailDto.to;
    const board = await this.boardService.findOne(boardId);

    await Promise.all(
      to.map(async (email) => {
        const isUser = await this.boardService.isUser(email);
        if (!isUser) {
          throw new NotFoundException(
            `${email} 님은 Ryurello 유저가 아닙니다.`,
          );
        }
      }),
    );

    await Promise.all(
      to.map(async (email) => {
        const payload = { boardId, email };
        const inviteToken = this.jwtService.sign(payload);
        const subject = 'Ryurello - 보드 초대';
        const url = `http://${process.env.INVITE_URL}/board/${boardId}/invited?token=${inviteToken}`;
        const content = `<p>귀하는 ${board.title}의 멤버로 초대되었습니다.<p>
        <p>아래 링크를 눌러 초대를 수락할 수 있습니다.<p>
        <a href="${url}">수락하기</a>`;

        await this.mailService.sendMail(email, subject, content);
      }),
    );

    return {
      statusCode: HttpStatus.OK,
      message: '초대 메일을 발송했습니다.',
    };
  }

  /**
   * 보드 초대 수락
   * @returns
   */
  @ApiExcludeEndpoint()
  @Get(':boardId/invited')
  async acceptInvitation(
    @Param('boardId') boardId: number,
    @Query('token') token: string,
  ) {
    const payload = await this.jwtService.verify(token);
    const invitedBoardId = payload['boardId'];
    const userEmail = payload['email'];

    if (invitedBoardId !== boardId) {
      throw new BadRequestException('잘못된 초대입니다.');
    }

    await this.boardService.addUserToBoard(boardId, userEmail);

    return {
      statusCode: HttpStatus.OK,
      message: '보드 멤버로 추가되었습니다.',
    };
  }

  /**
   * 보드 수정
   * @param boardId
   * @param updateBoardDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(BoardMemberGuard)
  @Patch(':boardId')
  update(
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    this.boardService.update(+boardId, updateBoardDto);
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 수정되었습니다.',
    };
  }

  /**
   * 보드 삭제
   * @param boardId
   * @returns
   */
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @UseGuards(BoardMemberGuard)
  @Delete(':boardId')
  remove(@Param('boardId') boardId: number) {
    this.boardService.remove(+boardId);
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 삭제되었습니다.',
    };
  }
}

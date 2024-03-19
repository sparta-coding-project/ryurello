import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('보드')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  /**
   * 보드 생성
   * @param createBoardDto
   * @returns
   */
  @ApiBearerAuth()
  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    const data = this.boardService.create(createBoardDto);

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

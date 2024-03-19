import _ from 'lodash';
import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBoardDto } from './dto/create-board.dto';
import { RemoveBoardDto } from './dto/remove-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from 'src/entities/boards.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    return (await this.boardRepository.save(createBoardDto)).boardId;
  }

  async findAll() {
    return await this.boardRepository.find({
      select: ['boardId', 'title', 'background_color'],
    });
  }

  async findOne(boardId: number) {
    return await this.boardRepository.findOne({
      where: { boardId },
      select: ['title', 'background_color', 'description'],
    });
  }

  // async update(boardId: number, updateBoardDto: UpdateBoardDto) {
  //   const { background_color, description } = updateBoardDto;
  //   const board = await this.boardRepository.findOne({
  //     where: { boardId },
  //   });

  //   if (_.isNil(board)) {
  //     throw new NotFoundException('보드를 찾을 수 없습니다.');
  //   }

  //   await this.boardRepository.update(
  //     { boardId },
  //     { background_color, description },
  //   );
  // }

  // async remove(boardId: number, removeBoardDto: RemoveBoardDto) {
  //   const board = await this.boardRepository.findOne({
  //     where: { boardId },
  //   });

  //   if (_.isNil(board)) {
  //     throw new NotFoundException('보드를 찾을 수 없습니다.');
  //   }

  //   return this.boardRepository.softDelete({ boardId });
  // }
}

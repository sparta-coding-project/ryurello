import _ from 'lodash';
import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBoardDto } from './dto/create-board.dto';
import { RemoveBoardDto } from './dto/remove-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from 'src/entities/users.entity';
import { Board } from 'src/entities/boards.entity';
import { BoardUser } from 'src/entities/boardUsers.entity';
import { Role } from 'src/entities/types/boardUserRole.type';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(BoardUser)
    private boardUserRepository: Repository<BoardUser>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createBoardDto: CreateBoardDto, userId: number) {
    const board = await this.boardRepository.save(createBoardDto);

    const user = await this.userRepository.findOne({ where: { userId } });
    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const boardUser = this.boardUserRepository.create({
      board,
      user,
      role: Role.Admin,
    });
    await this.boardUserRepository.save(boardUser);

    return board.boardId;
  }

  async addUserToBoard(boardId: number, email: string) {
    const board = await this.boardRepository.findOne({ where: { boardId } });
    if (!board) {
      throw new NotFoundException('보드를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const boardUser = this.boardUserRepository.create({
      board,
      user,
    });
    await this.boardUserRepository.save(boardUser);

    return;
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

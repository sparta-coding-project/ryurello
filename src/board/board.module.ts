import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/users.entity';
import { Board } from 'src/entities/boards.entity';
import { BoardService } from './board.service';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { BoardController } from './board.controller';
import { BoardUser } from 'src/entities/boardUsers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Board, BoardUser])],
  providers: [BoardService, MailService, JwtService],
  controllers: [BoardController],
})
export class BoardModule {}

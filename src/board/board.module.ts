import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/users.entity';
import { Board } from 'src/entities/boards.entity';
import { BoardService } from './board.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BoardController } from './board.controller';
import { BoardUser } from 'src/entities/boardUsers.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Board, BoardUser]),
  ],
  providers: [BoardService, MailService],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}

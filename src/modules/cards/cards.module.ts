import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/entities/cards.entity';
import { Board } from '../../entities/boards.entity';
import { BoardUser } from '../../entities/boardUsers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Board, BoardUser])],
  controllers: [CardsController],
  providers: [CardsService],
})

export class CardsModule {}

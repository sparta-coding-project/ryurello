import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../../entities/cards.entity';
import { Catalog } from '../../entities/catalogs.entity';
import { CardUser } from '../../entities/cardUsers.entity';
import { BoardUser } from '../../entities/boardUsers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, BoardUser, Catalog, CardUser])],
  controllers: [CardsController],
  providers: [CardsService],
})

export class CardsModule {}

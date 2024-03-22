import { Module } from '@nestjs/common';
import { CardUsersService } from './card-users.service';
import { CardUsersController } from './card-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardUser } from 'src/entities/cardUsers.entity';
import { Card } from '../../entities/cards.entity';
import { Catalog } from '../../entities/catalogs.entity';
import { BoardUser } from '../../entities/boardUsers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardUser])],
  controllers: [CardUsersController],
  providers: [CardUsersService],
  // exports: [CardUsersService]
})

export class CardUsersModule {}

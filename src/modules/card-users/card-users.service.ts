import { HttpException, Injectable } from '@nestjs/common';
import { CreateCardUserDto } from './dto/create-card-user.dto';
import { UpdateCardUserDto } from './dto/update-card-user.dto';
import { Repository } from 'typeorm';
import { CardUser } from 'src/entities/cardUsers.entity';
import { Board } from '../../entities/boards.entity';
import { Card } from '../../entities/cards.entity';

@Injectable()
export class CardUsersService {
  constructor(
    private readonly cuRepository: Repository<CardUser>,    
    ) {}

  async create(createCardUserDto: CreateCardUserDto) {
    
  }

  async findUsersByCardId(cardId: number) {
    const users = await this.cuRepository.findBy({ cardId });
    return users;
  }

  async remove(cuId: number) {
    await this.cuRepository.delete({ cuId });
  }
}

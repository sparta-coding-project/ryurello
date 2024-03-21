import { HttpException, Injectable } from '@nestjs/common';
import { CreateCardUserDto } from './dto/create-card-user.dto';
import { UpdateCardUserDto } from './dto/update-card-user.dto';
import { Repository } from 'typeorm';
import { CardUser } from 'src/entities/cardUsers.entity';

@Injectable()
export class CardUsersService {
  constructor(private readonly cuRepository: Repository<CardUser>) {}

  async create(createCardUserDto: CreateCardUserDto) {
    const { cardId, buId } = createCardUserDto;
    const cardUser = await this.cuRepository.findOneBy({
      cardId, buId
    })

    if (cardUser) {
      throw new HttpException("존재하는 사용자입니다.", 403);
    }

    const newCardUser = await this.cuRepository.save(createCardUserDto)
    return newCardUser;
  }

  async findUsersByCardId(cardId: number) {
    const users = await this.cuRepository.findBy({ cardId });
    return users;
  }

  async remove(cuId: number) {
    await this.cuRepository.delete({ cuId });
  }
}

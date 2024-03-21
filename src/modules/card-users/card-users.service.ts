import { HttpException, Injectable } from '@nestjs/common';
import { CreateCardUserDto } from './dto/create-card-user.dto';
import { Repository } from 'typeorm';
import { CardUser } from 'src/entities/cardUsers.entity';

@Injectable()
export class CardUsersService {
  constructor(
    private readonly cuRepository: Repository<CardUser>,    
    ) {}

  async create(createCardUserDto: CreateCardUserDto) {
    const user = await this.cuRepository.findOneBy(createCardUserDto);
    if (user) {
      throw new HttpException('사용자를 찾을 수 없습니다.', 404);
    }
    return await this.cuRepository.save(createCardUserDto)
  }

  async findUsersByCardId(cardId: number) {
    const users = await this.cuRepository.findBy({ cardId });
    return users;
  }

  async remove(cuId: number) {
    await this.cuRepository.delete({ cuId });
  }
}

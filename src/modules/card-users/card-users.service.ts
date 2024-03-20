import { Injectable } from '@nestjs/common';
import { CreateCardUserDto } from './dto/create-card-user.dto';
import { UpdateCardUserDto } from './dto/update-card-user.dto';

@Injectable()
export class CardUsersService {
  create(createCardUserDto: CreateCardUserDto) {
    return 'This action adds a new cardUser';
  }

  findAll() {
    return `This action returns all cardUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardUser`;
  }

  update(id: number, updateCardUserDto: UpdateCardUserDto) {
    return `This action updates a #${id} cardUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardUser`;
  }
}

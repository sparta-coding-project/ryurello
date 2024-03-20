import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardUsersService } from './card-users.service';
import { CreateCardUserDto } from './dto/create-card-user.dto';
import { UpdateCardUserDto } from './dto/update-card-user.dto';

@Controller('card-users')
export class CardUsersController {
  constructor(private readonly cardUsersService: CardUsersService) {}

  @Post()
  create(@Body() createCardUserDto: CreateCardUserDto) {
    return this.cardUsersService.create(createCardUserDto);
  }

  @Get()
  findAll() {
    return this.cardUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardUserDto: UpdateCardUserDto) {
    return this.cardUsersService.update(+id, updateCardUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardUsersService.remove(+id);
  }
}

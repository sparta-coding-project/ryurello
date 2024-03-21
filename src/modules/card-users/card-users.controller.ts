import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CardUsersService } from './card-users.service';
import { CreateCardUserDto } from './dto/create-card-user.dto';
import { UpdateCardUserDto } from './dto/update-card-user.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Card User')
@Controller('card-users')
export class CardUsersController {
  constructor(private readonly cardUsersService: CardUsersService) {}

  @Post()
  create(@Body() createCardUserDto: CreateCardUserDto) {
    return this.cardUsersService.create(createCardUserDto);
  }

  @Delete(":cuId")
  remove(@Param() cuId: number){
    return this.cardUsersService.remove(+cuId);
  }

  @ApiQuery({ name: 'catalogId', required: true, description: 'number' })
  @Get()
  findUsersByCardId(@Query() query: { cardId: number }) {
    try {
      const { cardId } = query;
      return this.cardUsersService.findUsersByCardId(cardId);
    } catch (error) {
      return error
    }
  }
}

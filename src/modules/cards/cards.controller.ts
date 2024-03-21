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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from 'src/entities/cards.entity';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CardUsersService } from '../card-users/card-users.service';
import { UserInfo } from 'src/utils/decorators/userInfo';
import { User } from 'src/entities/users.entity';

@ApiTags("Cards")
@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly cardUsersService: CardUsersService  
  ) {}

  @ApiQuery({name:"catalogId", required:true, description: "number" })
  @Post()
  async createCard(
      @Query() query: {catalogId: number}, 
      @Body() createCardDto: CreateCardDto, 
      @UserInfo() userInfo:User
    ) {
    try {
      const { catalogId } = query;
      const newCard = await this.cardsService.createCard(catalogId, createCardDto);
      // const newCardUsers = await this.cardUsersService.create({cardId: newCard.cardId, buId: })
    } catch (error) {
      return error;
    }
  }

  @Get()
  async findById(@Query() query: any): Promise<Card | Card[]> {
    try {
      return await this.cardsService.findById(query);
    } catch (error) {
      return error;
    }
  }

  @ApiParam({name:"cardId", required:true, description:"number"})
  @Patch('card/:cardId')
  update(
    @Param('cardId') cardId: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    try {
      return this.cardsService.update(+cardId, updateCardDto);
    } catch (error) {
      return error;
    }
  }

  @ApiQuery({name:"catalogId", required:true, description: "number" })
  @ApiQuery({name:"cardId", required:true, description: "number" })
  @ApiQuery({name:"sequence", required:true, description: "number" })
  @Patch('position')
  changeCardPosition(@Query() query: { catalogId: number, cardId: number, sequence: number }) {
    try {
      const changedSeq = this.cardsService.changeCardPosition(query);
    } catch (error) {
      return error
    }
  }

  @Patch('/catalog')
  changeCatalog() {}

  @ApiParam({name:"cardId", required:true, description:"number"})
  @Delete(':cardId')
  remove(@Param('cardId') cardId: string) {
    return this.cardsService.remove(+cardId);
  }
}

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

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async createCard(@Query() query: any, @Body() createCardDto: CreateCardDto) {
    try {
      const { catalogId } = query;
      return await this.cardsService.createCard(catalogId, createCardDto);
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

  @Patch(':cardId')
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

  @Patch('/sequence')
  changeSeq(@Query() query: { catalogId: number, cardId: number, sequence: number }) {
    try {
      console.log('hi')
      const changedSeq = this.cardsService.changeSeq(query);
    } catch (error) {
      return error
    }
  }

  @Patch('/catalog')
  changeCatalog() {}

  @Delete(':cardId')
  remove(@Param('cardId') cardId: string) {
    return this.cardsService.remove(+cardId);
  }
}

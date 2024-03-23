import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from 'src/entities/cards.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserInfo } from 'src/utils/decorators/userInfo';
import { User } from 'src/entities/users.entity';
import { BoardMemberGuard } from '../../auth/boardusers.guard';

@ApiTags('Cards')
@Controller('cards')
@UseGuards(BoardMemberGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: '카드 생성' })
  @ApiQuery({ name: 'catalogId', required: true, description: 'number' })
  @ApiQuery({ name: 'boardId', required: true, description: 'number' })
  @ApiBody({
    schema: {
      properties: {
        title: { type: 'string', example: '제목 1' },
        description: { type: 'string', example: '설명' },
        bgColor: { type: 'string', example: '#fff' },
        startDate: { type: 'Date', example: new Date('1995-12-17T03:24:00') },
        dueDate: { type: 'Date', example: new Date('1995-12-17T03:24:00') },
      },
    },
  })
  @Post()
  @ApiQuery({ name: 'boardId', required: true, description: 'number' })
  async createCard(
    @Query() query: { catalogId: number; boardId: number },
    @Body() createCardDto: CreateCardDto,
    @UserInfo() userInfo: User,
  ) {
    try {
      const { catalogId } = query;
      const { userId } = userInfo;
      const newCard = await this.cardsService.createCard(
        userId,
        catalogId,
        createCardDto,
      );
      return newCard;
    } catch (error) {
      return error;
    }
  }

  @Get(':cardId')
  @ApiOperation({ summary: '카드 1개 조회' })
  @ApiQuery({ name: 'boardId', required: true, description: 'number' })
  async findById(
    @Param('cardId') cardId: number,
  ): Promise<Card> {
    try {
      return await this.cardsService.findById(+cardId);
    } catch (error) {
      return error;
    }
  }

  @Get('catalog/:catalogId')
  @ApiOperation({ summary: '카드 조회(같은 카탈로그)' })
  @ApiParam({ name: 'catalogId', required: true, description: 'number' })
  @ApiQuery({ name: 'boardId', required: true, description: 'number' })
  async findByCatalogId(
    @Param('catalogId') catalogId: number,
  ): Promise<Card[]> {
    try {
      console.log(catalogId);
      return await this.cardsService.findByCatalogId(+catalogId);
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({ summary: '카드 데이터 변경' })
  @ApiParam({ name: 'cardId', required: true, description: 'number' })
  @ApiQuery({ name: 'boardId', required: true, description: 'number' })
  @ApiBody({
    schema: {
      properties: {
        title: { type: 'string', example: '변경된 제목' },
        description: { type: 'string', example: '변경된 설명' },
        bgColor: { type: 'string', example: '#f00' },
      },
    },
  })
  @Patch('card/:cardId')
  async update(
    @Param('cardId') cardId: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    try {
      return await this.cardsService.update(+cardId, updateCardDto);
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({ summary: '카드 위치 변경' })
  @ApiQuery({ name: 'catalogId', required: true, description: 'number' })
  @ApiQuery({ name: 'cardId', required: true, description: 'number' })
  @ApiQuery({ name: 'sequence', required: true, description: 'number' })
  @ApiQuery({ name: 'boardId', required: true, description: 'number' })
  @Patch('position')
  changeCardPosition(
    @Query() query: { catalogId: number; cardId: number; sequence: number },
  ) {
    try {
      const changedSeq = this.cardsService.changeCardPosition(query);
      return changedSeq;
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({ summary: '카드 제거' })
  @ApiParam({ name: 'cardId', required: true, description: 'number' })
  @ApiQuery({ name: 'boardId', required: true, description: 'number' })
  @Delete(':cardId')
  remove(@Param('cardId') cardId: string) {
    return this.cardsService.remove(+cardId);
  }
}

import { HttpException, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from 'src/entities/cards.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CardsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Card)
    private readonly cardsRepository: Repository<Card>,
  ) {}

  async createCard(catalogId: number, createCardDto: CreateCardDto) {
    const cardsLength = await this.cardsRepository
      .createQueryBuilder('cards')
      .where({ catalogId })
      .getCount();
    const prevCard = await this.cardsRepository.findOneBy({
      title: createCardDto.title,
    });
    if (prevCard)
      throw new HttpException('같은 이름을 가진 카드가 존재합니다.', 403);
    const newCard = this.cardsRepository.create({
      ...createCardDto,
      catalogId: +catalogId,
      sequence: cardsLength + 1,
    });
    const createdCard = await this.cardsRepository.save(newCard);
    return createdCard;
  }

  async findById(query): Promise<Card[] | Card> {
    const { catalogId, cardId } = query;
    if (catalogId) {
      return await this.cardsRepository.find({
        where: { catalogId: +catalogId },
      });
    } else {
      return await this.cardsRepository.findOne({
        where: { cardId: +cardId },
      });
    }
  }

  async update(cardId: number, updateCardDto: UpdateCardDto) {
    const prevCard = await this.cardsRepository.findOneBy({ cardId });
    if (prevCard.sequence === updateCardDto.sequence) {
      return await this.cardsRepository.update(
        {
          cardId,
        },
        updateCardDto,
      );
    } else {
    }
  }

  async changeCardPosition(query: {
    catalogId: number;
    cardId: number;
    sequence: number;
  }) {
    const { catalogId, cardId, sequence } = query;
    const queryRunner = this.dataSource.createQueryRunner();
    const queryBuilder = this.dataSource.createQueryBuilder();
    let cards = await this.cardsRepository.find({
      where: { catalogId },
      order: { sequence: 'asc' },
    });
    // 변경해야 하는 카드
    const card = await this.cardsRepository.findOneBy({ cardId });
    cards = cards.filter((c) => c.cardId !== +cardId);
    cards.splice(sequence - 1, 0, card);

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let idx in cards) {
        const { cardId } = cards[+idx];
        await queryBuilder
          .update(Card)
          .set({
            sequence: +idx + 1,
            catalogId: +catalogId,
          })
          .where('cardId = :cardId', { cardId })
          .execute();
      }
    } catch (error) {
      throw new HttpException('card sequence 변경 transaction error', 403);
    } finally {
      await queryRunner.release();
    }
  }

  remove(cardId: number) {
    return this.cardsRepository.delete({ cardId });
  }
}

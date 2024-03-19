import { HttpException, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from 'src/entities/cards.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CardsService {
  constructor(
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
      catalogId:catalogId,
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

  async changeSeq(query: { catalogId: any; cardId: any; sequence: any }) {
    console.log('Hi');
    const { catalogId, cardId, sequence } = query;
    const cards = this.cardsRepository.find({
      where: { catalogId: +catalogId },
    });
    console.log(cards);
  }

  remove(cardId: number) {
    return this.cardsRepository.delete({ cardId });
  }
}

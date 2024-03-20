import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoardUser } from './boardUsers.entity';
import { Card } from './cards.entity';

@Entity({ name: "card_users"})
export class CardUser {
  @PrimaryGeneratedColumn()
  cuId: number;

  @ManyToOne(() => BoardUser, (boardUser) => boardUser.cardUsers)
  @JoinColumn({ name: 'bu_id', referencedColumnName: 'buId' })
  boardUser: BoardUser;

  @ManyToOne(() => Card, (card) => card.cardUsers)
  @JoinColumn({ name: 'card_id', referencedColumnName: 'cardId' })
  card: Card;
}

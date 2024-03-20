import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from './cards.entity';

@Entity({ name: "tags"})
export class Tag {
  @PrimaryGeneratedColumn()
  tagId: number;

  @ManyToOne(() => Card, (card) => card.tags)
  @JoinColumn({ name: 'card_id', referencedColumnName: 'cardId' })
  card: Card;

  @Column()
  title: string;

  @Column()
  bgColor: string;
}

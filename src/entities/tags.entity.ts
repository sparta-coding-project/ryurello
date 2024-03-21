import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from './cards.entity';
import { IsHexColor } from 'class-validator';

@Entity({ name: "tags"})
export class Tag {
  @PrimaryGeneratedColumn()
  tagId: number;

  @Column()
  cardId: number;

  @Column()
  title: string;

  @IsHexColor()
  @Column({default: "#a1ffa1"})
  bgColor: string;

  @ManyToOne(() => Card, (card) => card.tags)
  @JoinColumn({ name: 'card_id', referencedColumnName: 'cardId' })
  card: Card;


}

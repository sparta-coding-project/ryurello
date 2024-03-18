import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Like } from './types/commentLike.type';
import { Card } from './cards.entity';
import { BoardUser } from './boardUsers.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  content: string;

  @Column({ type: 'int', unique: true, nullable: false })
  sequence: string;

  @Column({ type: 'enum', enum: Like })
  like?: Like;

  @ManyToOne(() => Card, (card) => card.comments)
  @JoinColumn({ name: 'cardId', referencedColumnName: 'cardId' })
  card: Card;

  @ManyToOne(() => BoardUser, (boardUser) => boardUser.comments)
  @JoinColumn({ name: 'buId', referencedColumnName: 'buId' })
  boardUser: BoardUser;
}

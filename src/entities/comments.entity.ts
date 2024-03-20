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

  /**
   * @example "댓글 예시입니다."
   */
  @Column({ type: 'varchar', unique: true, nullable: false })
  content: string;

  /**
   * @example Clap
   */
  @Column({ type: 'enum', enum: Like })
  like?: Like;

  @Column({ type: 'datetime', nullable: false })
  createdAt: Date;

  @ManyToOne(() => Card, (card) => card.comments)
  @JoinColumn({ name: 'card_id', referencedColumnName: 'cardId' })
  card: Card;

  @Column({ type: 'int', nullable: false })
  card_id: number;

  @ManyToOne(() => BoardUser, (boardUser) => boardUser.comments)
  @JoinColumn({ name: 'bu_id', referencedColumnName: 'buId' })
  boardUser: BoardUser;

  @Column({ type: 'int', nullable: false })
  bu_id: number;
}

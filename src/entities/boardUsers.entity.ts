import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './types/boardUserRole.type';
import { User } from './users.entity';
import { Board } from './boards.entity';
import { Comment } from './comments.entity';
import { CardUser } from './cardUsers.entity';

@Entity({
  name: 'boardUsers',
})
export class BoardUser {
  @PrimaryGeneratedColumn()
  buId: number;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @ManyToOne(() => User, (user) => user.boardUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: User;

  @ManyToOne(() => Board, (board) => board.boardUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id', referencedColumnName: 'boardId' })
  board: Board;

  @OneToMany(() => Comment, (comment) => comment.boardUser)
  comments: Comment[];

  @OneToMany(() => CardUser, (cardUser) => cardUser.boardUser)
  cardUsers: CardUser[];
}

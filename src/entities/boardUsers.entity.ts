import {
  Column,
  Entity,
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

  @ManyToOne((type): typeof User => User, (user) => user.boardUsers, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne((type): typeof Board => Board, (board) => board.boardUsers, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @OneToMany(() => Comment, (comment) => comment.boardUser)
  comments: Comment[];

  @OneToMany(() => CardUser, (cardUser) => cardUser.boardUser)
  cardUsers: CardUser[];
}

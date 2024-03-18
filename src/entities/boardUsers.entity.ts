import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './types/boardUserRole.type';
import { User } from './users.entity';
import { Board } from './boards.entity';

@Entity({
    name: 'boardUsers',
})
export class BoardUser {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role;

    @ManyToOne((type): typeof User => User, user => user.boardUsers, {onDelete: 'CASCADE'})
    user: User;

    @ManyToOne((type): typeof Board => Board, board => board.boardUsers, {onDelete: 'CASCADE'})
    board: Board;
}
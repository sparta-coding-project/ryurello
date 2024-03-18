import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from './cards.entity';
import { Board } from './boards.entity';

@Entity({
  name: 'catalogs',
})
export class Catalog {
  @PrimaryGeneratedColumn()
  catalogId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  title: string;

  @Column({ type: 'int', unique: true, nullable: false })
  sequence: string;

  @ManyToOne(() => Board, (board) => board.catalogs, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @OneToMany(() => Card, (card) => card.catalog)
  cards: Card[];
}

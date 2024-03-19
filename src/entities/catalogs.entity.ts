import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Card } from './cards.entity';
import { Board } from './boards.entity';

@Entity({
  name: 'catalogs',
})
export class Catalog {
  @PrimaryGeneratedColumn()
  catalogId: number;

  /**
   *  @example "catalog 예시 - To Do"
   */
  @Column({ type: 'varchar', unique: true, nullable: false })
  title: string;

  /**
   * @example 1
   */
  @Column({ type: 'int', unique: true, nullable: false })
  sequence: number;

  @ManyToOne(() => Board, (board) => board.catalogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id', referencedColumnName: 'boardId' })
  board: Board;

  @OneToMany(() => Card, (card) => card.catalog)
  cards: Card[];
}

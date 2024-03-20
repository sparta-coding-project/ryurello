import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Card } from './cards.entity';
import { Board } from './boards.entity';

@Entity({
  name: 'catalogs',
})
@Unique(['board', 'sequence'])
export class Catalog {
  @PrimaryGeneratedColumn()
  catalogId: number;

  /**
   *  @example "catalog 예시 - To Do"
   */
  @Column({ type: 'varchar', nullable: false })
  title: string;

  /**
   * @example 1
   */
  @Column({ type: 'int', nullable: false })
  sequence: number;

  @ManyToOne(() => Board, (board) => board.catalogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id', referencedColumnName: 'boardId' })
  board: Board;

  @Column({ type: 'int', nullable: false })
  board_id: number;

  @OneToMany(() => Card, (card) => card.catalog)
  cards: Card[];
}

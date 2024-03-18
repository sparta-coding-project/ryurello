import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Catalog } from './catalogs.entity';
import { Tag } from './tags.entity';
import { CardUser } from './cardUsers.entity';

export enum CardStatus {
  UPCOMING = 'upcoming',
  INPROGRESS = 'inprogress',
  DONE = 'done',
}

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  cardId: number;

  @ManyToOne(() => Catalog, (catalog) => catalog.cards)
  @JoinColumn({ name: 'catalogId', referencedColumnName: 'catalogId' })
  catalog: Catalog;

  @Column({ type: 'varchar' })
  title: string;

  @Column()
  description: string;

  @Column()
  bgColor: string;

  @Column()
  sequence: string;

  @Column()
  status: CardStatus;

  @Column()
  startDate: Date;

  @Column()
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tag, (tag) => tag.card)
  @JoinColumn({ name: 'tagId', referencedColumnName: 'tagId' })
  tags: Tag[];


  @OneToMany(()=> CardUser, cardUser => cardUser.card)
  cardUsers: CardUser[]
}

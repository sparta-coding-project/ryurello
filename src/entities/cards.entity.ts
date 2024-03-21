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
import { Comment } from './comments.entity';
import { IsHash, IsHexColor } from 'class-validator';

@Entity({ name: "cards"})
export class Card {
  @PrimaryGeneratedColumn()
  cardId: number;

  @Column()
  catalogId: number

  @ManyToOne(() => Catalog, (catalog) => catalog.cards)
  @JoinColumn({ name: 'catalog_id', referencedColumnName: 'catalogId' })
  catalog: Catalog;

  @Column({ type: 'varchar' })
  title: string;

  @Column()
  description: string;

  @IsHexColor()
  @Column({default: "#fff"})
  bgColor: string;

  @Column()
  sequence: number;

  @Column()
  startDate: Date;

  @Column()
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tag, (tag) => tag.card)
  tags: Tag[];

  @OneToMany(() => CardUser, (cardUser) => cardUser.card)
  cardUsers: CardUser[];

  @OneToMany(() => Comment, (comment) => comment.card)
  comments: Comment[];
}

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
import { CardStatus } from './types/cardStatus.type';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  cardId: number;

  @ManyToOne(() => Catalog, (catalog) => catalog.cards)
  @JoinColumn({ name: 'catalog_id', referencedColumnName: 'catalogId' })
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
  @JoinColumn({ name: 'tag_id', referencedColumnName: 'tagId' })
  tags: Tag[];

  @OneToMany(() => CardUser, (cardUser) => cardUser.card)
  cardUsers: CardUser[];

  @OneToMany(() => Comment, (comment) => comment.card)
  comments: Comment[];
}

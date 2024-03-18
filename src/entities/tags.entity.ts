import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./cards.entity";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  tagId: number

  @ManyToOne(() => Card, card => card.tags)
  @JoinColumn({name: "cardId", referencedColumnName: "cardId"})
  card: Card

  @Column()
  title: string

  @Column()
  bgColor: string
}
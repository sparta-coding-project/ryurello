import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  content: string;

  @Column({ type: 'int', unique: true, nullable: false })
  sequence: string;
}

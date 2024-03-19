import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardUser } from './boardUsers.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @IsNotEmpty({ message: '이메일을 입력해 주세요.' })
  @IsEmail()
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @IsStrongPassword(
    {},
    {
      message:
        '비밀 번호는 영문 소문자, 영문 대문자, 숫자, 특수기호를 포함해 8자 이상이어야 합니다.',
    },
  )
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해 주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  nickName: string;

  @OneToMany(() => BoardUser, (boardUser) => boardUser.user)
  boardUsers: BoardUser[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

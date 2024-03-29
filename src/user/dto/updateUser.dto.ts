import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString, Validate } from 'class-validator';
import { User } from 'src/entities/users.entity';
import { IsStrongPasswordNullable } from '../validate/password.validate';
import { SignUpDto } from './signUp.dto';

export class UpdateUserDto extends PickType(SignUpDto, ['nickName']) {
  /**
   * 비밀번호
   * @example "strinG!23"
   */
  @Validate(IsStrongPasswordNullable)
  @IsOptional()
  password: string | null;
  /**
   * 변경할 비밀번호
   * @example "strinG!23"
   */
  @Validate(IsStrongPasswordNullable)
  @IsOptional()
  updatePassword: string | null;
  /**
   * 변경할 닉네임
   * @example "젠데이야"
   */
  @IsString()
  @IsOptional()
  updateNickName: string | null;
}

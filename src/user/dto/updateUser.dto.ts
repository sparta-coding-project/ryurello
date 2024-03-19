import { PickType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { User } from 'src/entities/users.entity';
import { IsStrongPasswordNullable } from '../validate/password.validate';

export class UpdateUserDto extends PickType(User, ['email', 'password']) {
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

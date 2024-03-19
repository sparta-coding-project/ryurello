import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsStrongPassword } from 'class-validator';
import { User } from 'src/entities/users.entity';

export class SignUpDto extends PickType(User, [
  'email',
  'password',
  'nickName',
]) {
  /**
   * 비밀번호 확인
   * @example "strinG!2"
   */
  @IsStrongPassword(
    {},
    {
      message:
        '비밀번호 확인은 영문 소문자, 영문 대문자, 숫자, 특수기호를 포함해 8자 이상이어야 합니다.',
    },
  )
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  passwordConfirm: string;
}

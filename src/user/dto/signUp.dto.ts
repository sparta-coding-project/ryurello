import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { User } from 'src/entities/users.entity';

export class SignUpDto extends PickType(User, [
  'email',
  'password',
  'nickName',
]) {
  @IsStrongPassword(
    {},
    {
      message:
        '비밀 번호는 영문 소문자, 영문 대문자, 숫자, 특수기호를 포함해 8자 이상이어야 합니다.',
    },
  )
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  passwordConfirm: string;
}

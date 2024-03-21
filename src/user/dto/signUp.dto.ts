import { IsString } from 'class-validator';
import { IsEmail } from 'class-validator';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  /**
   * 이메일
   * @example "sparta@sparta.com"
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;
  /**
   * 패스워드
   * @example "strinG!2"
   */
  @IsNotEmpty()
  @IsStrongPassword(
    {},
    {
      message:
        '비밀번호는 영문 소문자, 영문 대문자, 숫자, 특수기호를 포함해 8자 이상이어야 합니다.',
    },
  )
  password: string;
  /**
   * 닉네임
   * @example "티모시 샬라메"
   */
  @IsNotEmpty()
  @IsString()
  nickName: string;

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

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isStrongPasswordNullable', async: false })
export class IsStrongPasswordNullable implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) {
      return true; // null 값은 유효하다고 판단
    }
    // 이하에는 @IsStrongPassword() 데코레이터에서 사용되는 유효성 검사 로직을 구현
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
    );
    return strongRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return '비밀번호는 영문 소문자, 영문 대문자, 숫자, 특수기호를 포함해 8자 이상이어야 합니다.';
  }
}

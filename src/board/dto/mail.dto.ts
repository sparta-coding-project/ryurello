import { IsArray } from 'class-validator';

export class MailDto {
  @IsArray()
  to: string[]; // to 필드의 데이터 타입을 배열로 지정
}

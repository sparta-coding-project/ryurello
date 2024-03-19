import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CatalogDto {
  @IsString()
  @IsNotEmpty({ message: 'catalog title을 입력해주세요.' })
  title: string;

  @IsNumber()
  @IsNotEmpty({ message: 'catalog가 위치할 순서를 입력해주세요.' })
  sequence: number;
}

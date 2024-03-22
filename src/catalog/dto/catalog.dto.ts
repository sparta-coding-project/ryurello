import { IsNotEmpty, IsString } from 'class-validator';

export class CatalogDto {
  @IsString()
  @IsNotEmpty({ message: 'catalog title을 입력해주세요.' })
  title: string;
}

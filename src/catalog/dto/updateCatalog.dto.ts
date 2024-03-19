import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class UpdateCatalogDto {
  @IsString()
  @IsNotEmpty({ message: '수정할 title을 입력해주세요.' })
  title: string;

  @IsNumber()
  @IsNotEmpty({ message: '원하는 순서를 입력해주세요.' })
  sequence: number;
}

import { IsNotEmpty, IsNumber } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Catalog } from 'src/entities/catalogs.entity';

export class UpdateSequenceDto extends PickType(Catalog, ['sequence']) {
  /**
   * 수정할 카탈로그 순서
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty({ message: '수정할 catalog의 순서를 입력해주세요.' })
  sequence: number;
}

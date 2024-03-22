import { IsNotEmpty, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Catalog } from 'src/entities/catalogs.entity';

export class UpdateCatalogDto extends PickType(Catalog, ['title']) {
  /**
   * 수정할 카탈로그 이름
   * @example "수정한 Catalog 1"
   */
  @IsString()
  @IsNotEmpty({ message: '수정할 catalog title을 입력해주세요.' })
  title: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Catalog } from 'src/entities/catalogs.entity';

export class CatalogDto extends PickType(Catalog, ['title']) {
  /**
   * 카탈로그 이름
   * @example "Catalog 1"
   */
  @IsString()
  @IsNotEmpty({ message: 'catalog title을 입력해주세요.' })
  title: string;
}

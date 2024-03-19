import { IsNumber, IsString } from 'class-validator';

export class UpdateCatalogDto {
  @IsString()
  title: string;

  @IsNumber()
  sequence: number;
}

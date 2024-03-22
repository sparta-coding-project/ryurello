import { Type } from 'class-transformer';
import { IsDate, IsHexColor, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsHexColor()
  bgColor: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;
}

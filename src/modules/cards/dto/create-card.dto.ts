import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  bgColor: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;
}

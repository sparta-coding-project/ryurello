import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Board } from 'src/entities/boards.entity';

export class CreateBoardDto extends PickType(Board, [
  'title',
  'background_color',
  'description',
]) {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly background_color: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}

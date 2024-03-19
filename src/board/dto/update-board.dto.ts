import { PickType } from '@nestjs/swagger';
import { Board } from 'src/entities/boards.entity';

export class UpdateBoardDto extends PickType(Board, [
  'title',
  'background_color',
  'description',
]) {}

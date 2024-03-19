import { PickType } from '@nestjs/swagger';
import { Board } from 'src/entities/boards.entity';

export class RemoveBoardDto extends PickType(Board, [
  'title',
  'background_color',
  'description',
]) {}

import { IsString, IsNotEmpty } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Board } from 'src/entities/boards.entity';

export class CreateBoardDto extends PickType(Board, [
  'title',
  'background_color',
  'description',
]) {
  /**
   * 보드 이름
   * @example "Board1"
   */
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  /**
   * 배경색
   * @example "white"
   */
  @IsNotEmpty()
  @IsString()
  readonly background_color: string;

  /**
   * 설명
   * @example "첫번째 보드"
   */
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}

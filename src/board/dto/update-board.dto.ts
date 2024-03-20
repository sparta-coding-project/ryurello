import { IsString, IsNotEmpty } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Board } from 'src/entities/boards.entity';

export class UpdateBoardDto extends PickType(Board, [
  'title',
  'background_color',
  'description',
]) {
  /**
   * 수정할 보드 이름
   * @example "MyBoard"
   */
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  /**
   * 배경색
   * @example "black"
   */
  @IsNotEmpty()
  @IsString()
  readonly background_color: string;

  /**
   * 설명
   * @example "일정 관리용"
   */
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}

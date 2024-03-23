import { IsEnum } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Comment } from 'src/entities/comments.entity';
import { Like } from 'src/entities/types/commentLike.type';

export class UpdateLikeDto extends PickType(Comment, ['like']) {
  /**
   * 추가할 이모티콘
   * @example "Cry"
   */
  @IsEnum(Like)
  like: Like;
}

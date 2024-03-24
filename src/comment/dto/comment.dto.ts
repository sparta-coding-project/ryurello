import { IsNotEmpty, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Comment } from 'src/entities/comments.entity';

export class CommentDto extends PickType(Comment, ['content']) {
  @IsString()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  content: string;
}

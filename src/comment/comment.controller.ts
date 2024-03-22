import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Like } from 'src/entities/types/commentLike.type';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /* 댓글 작성 */
  @Post('create/:cardId')
  async createComment(
    @Param('cardId') cardId: number,
    @Body() commentDto: CommentDto,
  ) {
    return this.commentService.createComment(cardId, commentDto.content);
  }

  /* 댓글 확인하기 */
  @Get('get/:cardId')
  async getComments(@Param('cardId') cardId: number) {
    const result = this.commentService.getComments(cardId);
    return { result };
  }

  /* 댓글 내용 수정 */
  @Patch('update/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() updateComment: string,
  ) {
    return this.commentService.updateComment(commentId, updateComment);
  }

  /* 댓글 이모티콘 */
  @Patch('like/:commentId')
  async likeComment(@Param('commentId') commentId: number, @Body() like: Like) {
    return this.commentService.likeComment(commentId, like);
  }
}

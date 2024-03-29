import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { UpdateLikeDto } from './dto/updateLike.dto';
import { UpdateContentDto } from './dto/updateContent.dto';
import { ApiTags } from '@nestjs/swagger';
import { Like } from 'src/entities/types/commentLike.type';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 생성
   * @param cardId
   * @param commentDto
   * @param req
   * @returns
   */
  /* 댓글 작성 */
  @UseGuards(AuthGuard('jwt'))
  @Post('create/:cardId')
  async createComment(
    @Param('cardId') cardId: number,
    @Body() commentDto: CommentDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;

    return this.commentService.createComment(
      cardId,
      commentDto.content,
      userId,
    );
  }

  /**
   * 댓글 확인하기
   * @param cardId
   * @returns
   */
  /* 댓글 확인하기 */
  @Get('get/:cardId')
  async getComments(@Param('cardId') cardId: number) {
    const result = this.commentService.getComments(cardId);
    return result;
  }

  /**
   * 댓글 내용 수정
   * @param commentId
   * @param updateContentDto
   * @returns
   */
  /* 댓글 내용 수정 */
  @Patch('update/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.commentService.updateComment(
      commentId,
      updateContentDto.content,
    );
  }

  /**
   * 댓글 이모티콘 등록 및 수정
   * @param commentId
   * @param updateLikeDto
   * @returns
   */
  /* 댓글 이모티콘 */
  @Patch('like/:commentId')
  async likeComment(
    @Param('commentId') commentId: number,
    @Body() updateLikeDto: UpdateLikeDto,
  ) {
    return this.commentService.likeComment(commentId, updateLikeDto.like);
  }
}

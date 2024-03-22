import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comments.entity';
import { Card } from 'src/entities/cards.entity';
import { BoardUser } from 'src/entities/boardUsers.entity';
import { Like } from 'src/entities/types/commentLike.type';
import _ from 'lodash';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(BoardUser)
    private boardRepository: Repository<BoardUser>,
  ) {}

  /* comment 생성 */
  async createComment(cardId: number, content: string, bu_id: number) {
    const card = await this.cardRepository.findOneBy({ cardId });
    const boardUser = await this.boardRepository.findOneBy({ buId: bu_id });

    if (_.isNil(card)) {
      throw new NotFoundException('card를 찾을 수 없습니다.');
    }

    /* to do: 해당 board의 user인지 판별하기 */
    if (_.isNil(boardUser)) {
      throw new NotFoundException('해당 board의 사용자가 아닙니다.');
    }

    await this.commentRepository.save({
      card,
      content,
      createdAt: new Date(),
      boardUser,
    });

    return { message: '댓글이 작성되었습니다.' };
  }

  /* 댓글 확인하기 */
  async getComments(cardId: number) {
    const card = await this.cardRepository.findOneBy({ cardId });

    if (_.isNil(card)) {
      throw new NotFoundException('card를 찾을 수 없습니다.');
    }

    return await this.commentRepository.find({
      where: { card_id: cardId },
      order: { createdAt: 'DESC' },
    });
  }

  /* 댓글 comment 수정 */
  async updateComment(commentId: number, content: string) {
    const comment = await this.commentRepository.findOneBy({ commentId });

    if (_.isNil(comment)) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    if (_.isNil(content)) {
      throw new BadRequestException(
        '수정할 댓글의 내용을 작성하지 않았습니다.',
      );
    }

    await this.commentRepository.update({ commentId }, { content });

    return { message: '댓글의 내용이 수정되었습니다.' };
  }

  /* 댓글 좋아요 */
  async likeComment(commentId: number, like: Like) {
    const comment = await this.commentRepository.findOneBy({ commentId });

    if (_.isNil(comment)) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    if (_.isNil(like)) {
      throw new BadRequestException('이모티콘을 작성하세요.');
    }

    console.log(like);
    console.log(typeof like);

    await this.commentRepository.update({ commentId }, { like });

    return { message: `해당 댓글에 ${like}를 달았습니다.` };
  }
}

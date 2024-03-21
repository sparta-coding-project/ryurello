import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from 'src/entities/comments.entity';
import { Card } from 'src/entities/cards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Card])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}

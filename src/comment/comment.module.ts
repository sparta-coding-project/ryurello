import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from 'src/entities/comments.entity';
import { Card } from 'src/entities/cards.entity';
import { BoardUser } from 'src/entities/boardUsers.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Card, Comment, BoardUser]),
  ],
  // imports: [TypeOrmModule.forFeature([Card, Comment, BoardUser])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}

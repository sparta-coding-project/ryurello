import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardService } from '../board/board.service';
import { Board } from '../entities/boards.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BoardMemberGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    @Inject(BoardService)
    private readonly boardService: BoardService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = context.switchToHttp().getRequest();
    const boardId = +request.params.boardId || +request.query.boardId;
    
    console.log(this.boardService)
    const isMember = await this.boardService.isUserMemberOfBoard(boardId, user.userId)
    return isMember;
  }
}

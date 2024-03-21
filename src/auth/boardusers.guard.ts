import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardService } from 'src/board/board.service';

@Injectable()
export class BoardMemberGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly boardService: BoardService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }
    
    const request = context.switchToHttp().getRequest();
    const { user } = context.switchToHttp().getRequest();
    const boardId = +request.params.boardId;

    const isMember = await this.boardService.isUserMemberOfBoard(
      boardId,
      user.userId,
    );
    return isMember;
  }
}

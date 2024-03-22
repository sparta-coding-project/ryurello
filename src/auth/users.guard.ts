import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserGuard extends AuthGuard('jwt') implements CanActivate {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = context.switchToHttp().getRequest();
    const userId = +request.params.userId;

    if (userId !== user.userId) {
      throw new UnauthorizedException('실행할 권한이 없습니다.');
    }

    return user;
  }
}

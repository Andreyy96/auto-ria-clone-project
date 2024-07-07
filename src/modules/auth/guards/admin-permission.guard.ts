import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { TokenType } from '../enums/token-type.enum';
import { TokenService } from '../services/token.service';

@Injectable()
export class AdminPermissionGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenType.ACCESS,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (payload.role !== UserRoleEnum.ADMIN) {
      throw new ForbiddenException();
    }

    return true;
  }
}

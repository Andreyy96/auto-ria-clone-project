import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { AdminRepository } from '../../repository/services/admin.repository';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { TokenType } from '../enums/token-type.enum';
import { AuthMapper } from '../services/auth.mapper';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private refreshTokenRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
    private adminRepository: AdminRepository,
    private managerRepository: ManagerRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    const isExist =
      await this.refreshTokenRepository.isTokenExist(refreshToken);
    if (!isExist) {
      throw new UnauthorizedException();
    }

    switch (payload.role) {
      case UserRoleEnum.SALESMAN:
        const user = await this.userRepository.findOneBy({
          id: payload.userId,
        });
        if (!user) {
          throw new UnauthorizedException();
        }
        request.user = AuthMapper.toUserDataDTO(user, payload.deviceId);
        break;
      case UserRoleEnum.MANAGER:
        const manager = await this.managerRepository.findOneBy({
          id: payload.userId,
        });
        if (!manager) {
          throw new UnauthorizedException();
        }
        request.user = AuthMapper.toManagerDataDTO(manager, payload.deviceId);
        break;
      case UserRoleEnum.ADMIN:
        const admin = await this.adminRepository.findOneBy({
          id: payload.userId,
        });
        if (!admin) {
          throw new UnauthorizedException();
        }
        request.user = AuthMapper.toAdminDataDTO(admin, payload.deviceId);
    }

    return true;
  }
}

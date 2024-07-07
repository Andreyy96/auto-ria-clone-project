import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { AccessTokenRepository } from '../../repository/services/access-token.repository';
import { AdminRepository } from '../../repository/services/admin.repository';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { SKIP_AUTH } from '../constants/constants';
import { TokenType } from '../enums/token-type.enum';
import { AuthMapper } from '../services/auth.mapper';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private tokenService: TokenService,
    private userRepository: UserRepository,
    private adminRepository: AdminRepository,
    private managerRepository: ManagerRepository,
    private accessTokenRepository: AccessTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipAuth) return true;

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

    const isExist = await this.accessTokenRepository.isTokenExist(accessToken);
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

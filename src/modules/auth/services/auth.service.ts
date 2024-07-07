import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { AdminService } from '../../admin/services/admin.service';
import { ManagerService } from '../../manager/services/manager.service';
import { AccessTokenRepository } from '../../repository/services/access-token.repository';
import { AdminRepository } from '../../repository/services/admin.repository';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserService } from '../../user/services/user.service';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import {
  SignUpForPersonalReqDto,
  SignUpReqDto,
} from '../dto/req/sign-up.req.dto';
import {
  AuthAdminResDto,
  AuthManagerResDto,
  AuthResDto,
} from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { ITokenPair } from '../interfaces/token-pair.interface';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly adminService: AdminService,
    private readonly adminRepository: AdminRepository,
    private readonly managerService: ManagerService,
    private readonly managerRepository: ManagerRepository,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly accessTokenRepository: AccessTokenRepository,
  ) {}

  public async signUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );

    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      role: user.role,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.accessTokenRepository.save(
        this.accessTokenRepository.create({
          user_id: user.id,
          accessToken: pair.accessToken,
          deviceId: dto.deviceId,
        }),
      ),
    ]);

    return AuthMapper.toResponseDTO(user, pair);
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true, role: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      role: user.role,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        user_id: user.id,
      }),
      this.accessTokenRepository.delete({
        deviceId: dto.deviceId,
        user_id: user.id,
      }),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.accessTokenRepository.save(
        this.accessTokenRepository.create({
          user_id: user.id,
          accessToken: pair.accessToken,
          deviceId: dto.deviceId,
        }),
      ),
    ]);
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    return AuthMapper.toResponseDTO(userEntity, pair);
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    const pair = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      role: userData.role,
      deviceId: userData.deviceId,
    });

    switch (userData.role) {
      case UserRoleEnum.SALESMAN:
        await this.keyRefresh(pair, {
          deviceId: userData.deviceId,
          user_id: userData.userId,
        });
        break;
      case UserRoleEnum.ADMIN:
        await this.keyRefresh(pair, {
          deviceId: userData.deviceId,
          admin_id: userData.userId,
        });
        break;
      case UserRoleEnum.MANAGER:
        await Promise.all([
          await this.keyRefresh(pair, {
            deviceId: userData.deviceId,
            manager_id: userData.userId,
          }),
        ]);
    }
    return AuthMapper.toResponseRefreshDTO(pair);
  }

  public async signOut(userData: IUserData): Promise<void> {
    switch (userData.role) {
      case UserRoleEnum.SALESMAN:
        await this.keySignOut({
          deviceId: userData.deviceId,
          user_id: userData.userId,
        });
        break;
      case UserRoleEnum.ADMIN:
        await this.keySignOut({
          deviceId: userData.deviceId,
          admin_id: userData.userId,
        });
        break;
      case UserRoleEnum.MANAGER:
        await this.keySignOut({
          deviceId: userData.deviceId,
          manager_id: userData.userId,
        });
    }
  }

  public async signUpAdmin(
    dto: SignUpForPersonalReqDto,
  ): Promise<AuthAdminResDto> {
    await this.adminService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);

    const admin = await this.adminRepository.save(
      this.adminRepository.create({ ...dto, password }),
    );

    const pair = await this.tokenService.generateAuthTokens({
      userId: admin.id,
      role: admin.role,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          admin_id: admin.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.accessTokenRepository.save(
        this.accessTokenRepository.create({
          admin_id: admin.id,
          accessToken: pair.accessToken,
          deviceId: dto.deviceId,
        }),
      ),
    ]);

    return AuthMapper.toResponseAdminDTO(admin, pair);
  }

  public async signInAdmin(dto: SignInReqDto): Promise<AuthAdminResDto> {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true, role: true },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const pair = await this.tokenService.generateAuthTokens({
      userId: admin.id,
      role: admin.role,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        admin_id: admin.id,
      }),
      this.accessTokenRepository.delete({
        deviceId: dto.deviceId,
        admin_id: admin.id,
      }),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          admin_id: admin.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.accessTokenRepository.save(
        this.accessTokenRepository.create({
          admin_id: admin.id,
          accessToken: pair.accessToken,
          deviceId: dto.deviceId,
        }),
      ),
    ]);
    const adminEntity = await this.adminRepository.findOneBy({ id: admin.id });
    return AuthMapper.toResponseAdminDTO(adminEntity, pair);
  }

  public async signUpManager(
    dto: SignUpForPersonalReqDto,
  ): Promise<AuthManagerResDto> {
    await this.managerService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);

    const manager = await this.managerRepository.save(
      this.managerRepository.create({ ...dto, password }),
    );

    const pair = await this.tokenService.generateAuthTokens({
      userId: manager.id,
      role: manager.role,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          manager_id: manager.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.accessTokenRepository.save(
        this.accessTokenRepository.create({
          manager_id: manager.id,
          accessToken: pair.accessToken,
          deviceId: dto.deviceId,
        }),
      ),
    ]);

    return AuthMapper.toResponseAdminDTO(manager, pair);
  }

  public async signInManager(dto: SignInReqDto): Promise<AuthManagerResDto> {
    const manager = await this.managerRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true, role: true },
    });
    if (!manager) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      manager.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const pair = await this.tokenService.generateAuthTokens({
      userId: manager.id,
      role: manager.role,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        manager_id: manager.id,
      }),
      this.accessTokenRepository.delete({
        deviceId: dto.deviceId,
        manager_id: manager.id,
      }),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          manager_id: manager.id,
          refreshToken: pair.refreshToken,
          deviceId: dto.deviceId,
        }),
      ),
      this.accessTokenRepository.save(
        this.accessTokenRepository.create({
          manager_id: manager.id,
          accessToken: pair.accessToken,
          deviceId: dto.deviceId,
        }),
      ),
    ]);
    const managerEntity = await this.managerRepository.findOneBy({
      id: manager.id,
    });
    return AuthMapper.toResponseManagerDTO(managerEntity, pair);
  }

  private async keyRefresh(pair: ITokenPair, payload: any) {
    await Promise.all([
      this.refreshTokenRepository.delete({ ...payload }),
      this.accessTokenRepository.delete({ ...payload }),
    ]);

    await Promise.all([
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          ...payload,
          refreshToken: pair.refreshToken,
        }),
      ),
      this.accessTokenRepository.save(
        this.accessTokenRepository.create({
          ...payload,
          accessToken: pair.accessToken,
        }),
      ),
    ]);
  }

  private async keySignOut(payload: any) {
    await Promise.all([
      this.refreshTokenRepository.delete({ ...payload }),
      this.accessTokenRepository.delete({ ...payload }),
    ]);
  }
}

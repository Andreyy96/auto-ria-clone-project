import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AdminModule } from '../admin/admin.module';
import { ManagerModule } from '../manager/manager.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AdminPermissionGuard } from './guards/admin-permission.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [JwtModule, UserModule, AdminModule, ManagerModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    JwtRefreshGuard,
    AdminPermissionGuard,
  ],
  exports: [],
})
export class AuthModule {}

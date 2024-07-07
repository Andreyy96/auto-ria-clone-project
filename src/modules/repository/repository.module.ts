import { Global, Module } from '@nestjs/common';

import { AccessTokenRepository } from './services/access-token.repository';
import { AdminRepository } from './services/admin.repository';
import { BrandRepository } from './services/brand.repository';
import { CarRepository } from './services/car.repository';
import { ManagerRepository } from './services/manager.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { SoldCarRepository } from './services/sold-car.repository';
import { UserRepository } from './services/user.repository';
import { ViewRepository } from './services/view.repository';

@Global()
@Module({
  providers: [
    UserRepository,
    RefreshTokenRepository,
    AccessTokenRepository,
    CarRepository,
    AdminRepository,
    ManagerRepository,
    BrandRepository,
    SoldCarRepository,
    ViewRepository,
  ],
  exports: [
    UserRepository,
    RefreshTokenRepository,
    AccessTokenRepository,
    CarRepository,
    AdminRepository,
    ManagerRepository,
    BrandRepository,
    SoldCarRepository,
    ViewRepository,
  ],
})
export class RepositoryModule {}

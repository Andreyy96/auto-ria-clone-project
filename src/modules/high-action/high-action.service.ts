import { ForbiddenException, Injectable } from '@nestjs/common';

import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { BrandRepository } from '../repository/services/brand.repository';
import { UserRepository } from '../repository/services/user.repository';

@Injectable()
export class HighActionService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly brandRepository: BrandRepository,
  ) {}

  public async bannedUser(userData: IUserData, userId: string) {
    this.checkRole(userData.role);

    await this.userRepository.update(userId, { isBaned: true });
  }

  public async unbannedUser(userData: IUserData, userId: string) {
    this.checkRole(userData.role);

    await this.userRepository.update(userId, { isBaned: false });
  }

  public async addBrand(userData: IUserData, brand: string): Promise<void> {
    this.checkRole(userData.role);

    await this.brandRepository.save(
      this.brandRepository.create({
        name: brand,
      }),
    );
  }

  private checkRole(role: string): void {
    if (role !== UserRoleEnum.ADMIN && role !== UserRoleEnum.MANAGER) {
      throw new ForbiddenException();
    }
  }
}

import { ConflictException, Injectable } from '@nestjs/common';

import { IUserData } from '../../auth/interfaces/user-data.interface';
import { ContentType } from '../../file-storage/models/enums/content-type.enum';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { HighActionService } from '../../high-action/high-action.service';
import { LoggerService } from '../../logger/logger.service';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { ManagerResDto } from '../dto/res/manager.res.dto';
import { ManagerMapper } from './manager.mapper';

@Injectable()
export class ManagerService {
  constructor(
    private readonly logger: LoggerService,
    private readonly managerRepository: ManagerRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly highActionService: HighActionService,
  ) {}

  public async getMe(userData: IUserData): Promise<ManagerResDto> {
    const admin = await this.managerRepository.findOneBy({
      id: userData.userId,
    });
    return ManagerMapper.toResponseDTO(admin);
  }
  public async putBrandInList(
    userData: IUserData,
    brand: string,
  ): Promise<void> {
    await this.highActionService.addBrand(userData, brand);
  }

  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const image = await this.fileStorageService.uploadFile(
      avatar,
      ContentType.AVATAR,
      userData.userId,
    );

    await this.managerRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.managerRepository.findOneBy({
      id: userData.userId,
    });

    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.managerRepository.save(
        this.managerRepository.merge(user, { image: null }),
      );
    }
  }

  public async bannedUser(userData: IUserData, userId: string): Promise<void> {
    await this.highActionService.bannedUser(userData, userId);
  }

  public async unbannedUser(
    userData: IUserData,
    userId: string,
  ): Promise<void> {
    await this.highActionService.unbannedUser(userData, userId);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const admin = await this.managerRepository.findOneBy({ email });
    if (admin) {
      throw new ConflictException('Email is already taken');
    }
  }
}

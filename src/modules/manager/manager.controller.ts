import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiFile } from '../../common/decorators/api-file.dercorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { BrandReqDto } from './dto/req/brand.req.dto';
import { ManagerResDto } from './dto/res/manager.res.dto';
import { ManagerService } from './services/manager.service';

@ApiTags('Managers')
@Controller('managers')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('me')
  public async getMe(
    @CurrentUser() userData: IUserData,
  ): Promise<ManagerResDto> {
    return await this.managerService.getMe(userData);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('brand')
  public async putBrandInList(
    @CurrentUser() userData: IUserData,
    @Body() dto: BrandReqDto,
  ): Promise<void> {
    await this.managerService.putBrandInList(userData, dto.brand);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('avatar', false)
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    await this.managerService.uploadAvatar(userData, avatar);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.managerService.deleteAvatar(userData);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch('banned/:userId')
  public async bannedUser(
    @CurrentUser() userData: IUserData,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.managerService.bannedUser(userData, userId);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch('unbanned/:userId')
  public async unbannedUser(
    @CurrentUser() userData: IUserData,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.managerService.unbannedUser(userData, userId);
  }
}

import { Module } from '@nestjs/common';

import { FileStorageModule } from '../file-storage/file-storage.module';
import { HighActionModule } from '../high-action/high-action.module';
import { ManagerController } from './manager.controller';
import { ManagerService } from './services/manager.service';

@Module({
  imports: [FileStorageModule, HighActionModule],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}

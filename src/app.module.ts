import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './common/http/global-exception.filter';
import configuration from './configs/configs';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CarModule } from './modules/car/car.module';
import { CronModule } from './modules/cron/cron.module';
import { EmailModule } from './modules/email/email.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { HighActionModule } from './modules/high-action/high-action.module';
import { LoggerModule } from './modules/logger/logger.module';
import { ManagerModule } from './modules/manager/manager.module';
import { PostgresModule } from './modules/postgres/postgres.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    RepositoryModule,
    LoggerModule,
    PostgresModule,
    AuthModule,
    UserModule,
    AdminModule,
    ManagerModule,
    CarModule,
    FileStorageModule,
    HighActionModule,
    CronModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}

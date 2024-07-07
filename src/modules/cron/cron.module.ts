import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CronService } from './cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}

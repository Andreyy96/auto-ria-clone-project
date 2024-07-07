import { Module } from '@nestjs/common';

import { HighActionService } from './high-action.service';

@Module({
  imports: [],
  controllers: [],
  providers: [HighActionService],
  exports: [HighActionService],
})
export class HighActionModule {}

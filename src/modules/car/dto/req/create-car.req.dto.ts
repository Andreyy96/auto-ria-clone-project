import { PickType } from '@nestjs/swagger';

import { BaseCarReqDto } from './base-car.req.dto';

export class CreateCarReqDto extends PickType(BaseCarReqDto, [
  'brand',
  'model',
  'region',
  'user_ccy',
  'user_price',
]) {}
